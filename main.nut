/*
 * This file is part of the OpenTTD Coopetition Game Script
 * The script manages competitive cooperative gameplay in OpenTTD
 */

// Using native OpenTTD Game Script API - no external dependencies
require("version.nut");
require("goal.nut");
require("player.nut");
require("dashboard.nut");
require("campaign.nut");

class Coopetition extends GSController {
    // Script settings
    settings = null;
    log_level = 1;
    ui_enabled = 1;
    ui_update_days = 7;
    ui_next_update_date = null;
    ui_use_storybook = 0;
    ui_show_goals_prev = 0;
    ui_use_goals_window = 1;
    ui_use_signs = 1;
    ui_reminders_enabled = 1;
    ui_reminder_days = 14;
    next_reminder_date = null;
    
    // Game state
    shared_goals = null;
    player_goals = null;
    dashboard = null;
    campaign = null;
    
    constructor() {
        this.shared_goals = [];
        this.player_goals = {};
        this.dashboard = null;
        this.campaign = null;
    }
    
    function Start() {
        // Initialize settings
        this.settings = GSController.GetSetting("log_level");
        this.log_level = GSController.GetSetting("log_level");
        // UI settings (defaults handled by info.nut)
        this.ui_enabled = GSController.GetSetting("ui_show_windows");
        this.ui_update_days = GSController.GetSetting("ui_window_update_days");
        this.ui_use_storybook = GSController.GetSetting("ui_use_storybook");
        this.ui_show_goals_prev = GSController.GetSetting("ui_show_goals_now");
        this.ui_use_goals_window = GSController.GetSetting("ui_use_goals_window");
        this.ui_use_signs = GSController.GetSetting("ui_use_signs");
        this.ui_reminders_enabled = GSController.GetSetting("ui_reminders_enabled");
        this.ui_reminder_days = GSController.GetSetting("ui_reminder_days");
        
        GSLog.Info("Coopetition Game Script started");
        
        // Initialize dashboard for UI
        this.dashboard = Dashboard();
        // Schedule first UI update
        this.ui_next_update_date = GSDate.GetCurrentDate();
        this.next_reminder_date = GSDate.GetCurrentDate() + this.ui_reminder_days;
        // Initialize StoryBook on start (optional)
        if (this.ui_use_storybook) {
            this.dashboard.UpdateStoryBook(this.shared_goals, this.player_goals, true);
        }
        
        // Initialize campaign scheduler
        this.campaign = Campaign();
        
        // Event polling is handled by GetNextEvent loop; no interval configuration in GS API
        
        // Main game loop
        while (true) {
            // Handle events
            local event = GSEventController.GetNextEvent();
            if (GSEventController.IsEventWaiting()) {
                this.HandleEvent(event);
            }
            
            // Update goals and dashboard
            this.UpdateGoals();
            this.dashboard.Update(this.shared_goals, this.player_goals);
            
            // Check for campaign progression
            this.campaign.CheckProgression(this.shared_goals, this.player_goals);

            // Periodic UI windows
            if (this.ui_enabled) {
                local today = GSDate.GetCurrentDate();
                if (this.ui_next_update_date == null || today >= this.ui_next_update_date) {
                    // Render shared goals for all
                    this.dashboard.RenderSharedGoalsWindow(this.shared_goals);
                    // Render personal goals per company
                    this.dashboard.RenderPlayerGoalsWindows(this.player_goals);
                    // Schedule next update
                    this.ui_next_update_date = today + this.ui_update_days;
                    // Update StoryBook as well if enabled (only on cadence)
                    if (this.ui_use_storybook) {
                        this.dashboard.UpdateStoryBook(this.shared_goals, this.player_goals, false);
                    }
                    // Publish to Goals window if enabled
                    if (this.ui_use_goals_window) {
                        this.dashboard.PublishGoalsToGoalsWindow(this.shared_goals, this.player_goals);
                    }
                    // Update map signs if enabled
                    if (this.ui_use_signs) {
                        this.dashboard.UpdateSignsForSharedGoals(this.shared_goals);
                    }
                }
            }

            // On-demand UI trigger via toggling setting
            local current = GSController.GetSetting("ui_show_goals_now");
            if (current != this.ui_show_goals_prev) {
                this.dashboard.RenderSharedGoalsWindow(this.shared_goals);
                this.dashboard.RenderPlayerGoalsWindows(this.player_goals);
                // Also republish Goals/signs on-demand
                if (this.ui_use_goals_window) {
                    this.dashboard.PublishGoalsToGoalsWindow(this.shared_goals, this.player_goals);
                }
                if (this.ui_use_signs) {
                    this.dashboard.UpdateSignsForSharedGoals(this.shared_goals);
                }
                this.ui_show_goals_prev = current;
            }
            
            // Sleep for a bit to avoid hogging CPU
            GSController.Sleep(1);

            // Periodic reminders via GSNews
            if (this.ui_reminders_enabled) {
                local today2 = GSDate.GetCurrentDate();
                if (this.next_reminder_date != null && today2 >= this.next_reminder_date) {
                    this.SendReminderNews();
                    this.next_reminder_date = today2 + this.ui_reminder_days;
                }
            }
        }
    }
    
    function HandleEvent(event) {
        if (event == null) return;
        
        switch (event.GetEventType()) {
            case GSEvent.ET_COMPANY_DELIVERED_CARGO:
                this.OnCompanyDeliveredCargo(GSEventCompanyDeliveredCargo.Convert(event));
                break;
                
            case GSEvent.ET_COMPANY_PERFORMANCE_RATING:
                this.OnCompanyPerformanceRating(GSEventCompanyPerformanceRating.Convert(event));
                break;
                
            case GSEvent.ET_COMPANY_NEW:
                this.OnCompanyNew(GSEventCompanyNew.Convert(event));
                break;
                
            case GSEvent.ET_COMPANY_BANKRUPT:
                this.OnCompanyBankrupt(GSEventCompanyBankrupt.Convert(event));
                break;
        }
    }
    
    function OnCompanyDeliveredCargo(event) {
        local company_id = event.GetCompanyID();
        local cargo_type = event.GetCargoType();
        local amount = event.GetCargoAmount();
        
        // Update shared goals that involve cargo delivery
        foreach (goal in this.shared_goals) {
            if (goal.type == SharedGoalType.CARGO_DELIVERY && goal.cargo_type == cargo_type) {
                goal.UpdateProgress(company_id, amount);
            }
        }
        
        // Update player goals
        if (company_id in this.player_goals) {
            foreach (goal in this.player_goals[company_id]) {
                if (goal.type == PlayerGoalType.CARGO_DELIVERY && goal.cargo_type == cargo_type) {
                    goal.UpdateProgress(amount);
                }
            }
        }
    }
    
    function OnCompanyPerformanceRating(event) {
        local company_id = event.GetCompanyID();
        local performance = event.GetPerformance();
        
        // Update player goals related to performance
        if (company_id in this.player_goals) {
            foreach (goal in this.player_goals[company_id]) {
                if (goal.type == PlayerGoalType.PERFORMANCE) {
                    goal.UpdateProgress(performance);
                }
            }
        }
    }
    
    function OnCompanyNew(event) {
        local company_id = event.GetCompanyID();
        
        // Initialize player goals for new company
        this.player_goals[company_id] <- [];
        
        // Assign initial goals based on campaign
        this.campaign.AssignInitialGoals(company_id, this.player_goals[company_id]);
        
        GSLog.Info("New company joined: " + GSCompany.GetName(company_id));

        // Publish StoryBook personal page for the new company if enabled
        if (this.ui_use_storybook) {
            this.dashboard.UpdateStoryBook(this.shared_goals, this.player_goals, true);
        }

        // Send onboarding News
        this.SendOnboardingNews(company_id);
    }
    
    function OnCompanyBankrupt(event) {
        local company_id = event.GetCompanyID();
        
        // Clean up player goals for bankrupt company
        if (company_id in this.player_goals) {
            delete this.player_goals[company_id];
        }
        
        GSLog.Info("Company bankrupt: " + GSCompany.GetName(company_id));
    }
    
    function UpdateGoals() {
        // Update shared goals
        foreach (goal in this.shared_goals) {
            goal.Update();
            
            // Check for goal completion
            if (goal.IsCompleted() && !goal.reward_given) {
                this.GiveSharedGoalReward(goal);
                goal.reward_given = true;
                
                // Announce completion
                this.PostNewsGlobal("Shared goal completed: " + goal.description);
            }
        }
        
        // Update player goals
        foreach (company_id, goals in this.player_goals) {
            foreach (goal in goals) {
                goal.Update();
                
                // Check for goal completion
                if (goal.IsCompleted() && !goal.reward_given) {
                    this.GivePlayerGoalReward(company_id, goal);
                    goal.reward_given = true;
                    
                    // Announce completion to the specific company
                    this.PostNewsCompany(company_id, "Personal goal completed: " + goal.description);
                }
            }
        }
    }
    
    function GiveSharedGoalReward(goal) {
        local reward = GSController.GetSetting("shared_goal_reward");
        
        // Distribute reward based on contribution
        foreach (company_id, contribution in goal.contributions) {
            local company_reward = (contribution * reward) / goal.target;
            GSCompany.ChangeBankBalance(company_id, company_reward, GSCompany.EXPENSES_OTHER, 0);
            
            GSLog.Info("Company " + GSCompany.GetName(company_id) + 
                " received " + company_reward + " for shared goal contribution");
        }
    }
    
    function GivePlayerGoalReward(company_id, goal) {
        local reward = goal.reward;
        GSCompany.ChangeBankBalance(company_id, reward, GSCompany.EXPENSES_OTHER, 0);
        
        GSLog.Info("Company " + GSCompany.GetName(company_id) + 
            " received " + reward + " for completing personal goal");
    }
    
    function Save() {
        local data = {};
        
        // Save shared goals
        data.shared_goals <- [];
        foreach (goal in this.shared_goals) {
            data.shared_goals.append(goal.SaveToTable());
        }
        
        // Save player goals
        data.player_goals <- {};
        foreach (company_id, goals in this.player_goals) {
            data.player_goals[company_id] <- [];
            foreach (goal in goals) {
                data.player_goals[company_id].append(goal.SaveToTable());
            }
        }
        
        // Save campaign state
        data.campaign <- this.campaign.SaveToTable();

        // Save reminder schedule
        data.next_reminder_date <- this.next_reminder_date;
        
        return data;
    }
    
    function Load(version, data) {
        // Load shared goals
        this.shared_goals = [];
        foreach (goal_data in data.shared_goals) {
            this.shared_goals.append(SharedGoal.LoadFromTable(goal_data));
        }
        
        // Load player goals
        this.player_goals = {};
        foreach (company_id, goals_data in data.player_goals) {
            this.player_goals[company_id] <- [];
            foreach (goal_data in goals_data) {
                this.player_goals[company_id].append(PlayerGoal.LoadFromTable(goal_data));
            }
        }
        
        // Load campaign state
        this.campaign = Campaign.LoadFromTable(data.campaign);
        
        // Recreate dashboard
        this.dashboard = Dashboard();

        // Restore reminder schedule
        if ("next_reminder_date" in data) this.next_reminder_date = data.next_reminder_date;
        
        GSLog.Info("Coopetition Game Script loaded from save");
    }

    function SendOnboardingNews(company_id) {
        local msg = "Welcome to Coopetition!\n"
            + "Open the Goals window to see your objectives.\n"
            + "Check the StoryBook pages for Shared and Personal Goals.\n"
            + "Look for map signs marking shared cargo routes (if present).\n"
            + "Toggle 'Show goals now' in settings to refresh UI.";
        this.PostNewsCompany(company_id, msg);
    }

    function SendReminderNews() {
        local shared_count = this.shared_goals.len();
        local msg_all = "Coopetition reminder: " + shared_count + " shared goals active. Open Goals window or StoryBook to track progress.";
        this.PostNewsGlobal(msg_all);
    }

    function PostNewsGlobal(message) {
        // API 14+: use 5-arg signature with NR_NONE, reference 0
        GSNews.Create(GSNews.NT_GENERAL, message, GSCompany.COMPANY_INVALID, GSNews.NR_NONE, 0);
    }

    function PostNewsCompany(company_id, message) {
        // API 14+: per-company news via 5-arg signature
        GSNews.Create(GSNews.NT_GENERAL, message, company_id, GSNews.NR_NONE, 0);
    }
}