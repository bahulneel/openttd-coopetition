/*
 * This file is part of the OpenTTD Coopetition Game Script
 * The script manages competitive cooperative gameplay in OpenTTD
 */

import("util.superlib", "SuperLib", 40);
require("version.nut");
require("constants.nut");
require("goal.nut");
require("constraints.nut");
require("loader.nut");
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
    last_reminder_date = null;
    
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
        
        GSLog.Info("Coopetition Game Script started");
        
        // Initialize dashboard for UI
        this.dashboard = Dashboard();
        // Schedule first UI update
        this.ui_next_update_date = GSDate.GetCurrentDate();
        this.next_reminder_date = GSDate.GetCurrentDate() + this.ui_reminder_days;
        GSLog.Info("Initial reminder scheduled for " + this.next_reminder_date + " (in " + this.ui_reminder_days + " days)");
// Initialize StoryBook on start (optional)
        if (this.ui_use_storybook) {
            this.dashboard.UpdateStoryBook(this.shared_goals, this.player_goals, true);
        }
        
        // Load compiled authoring data (if present) and register runtime goals
        this.LoadCompiledAuthoring();

        // Initialize campaign scheduler (legacy or data-driven)
        this.campaign = Campaign();
        
    // Send onboarding news to existing companies (for games that start with default company)
        this.SendOnboardingToExistingCompanies();
        
        // Event polling is handled by GetNextEvent loop; no interval configuration in GS API
        
        // Main game loop
        while (true) {
            // Handle events
            local event = GSEventController.GetNextEvent();
    if (event != null) {
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
                    // Publish to Goals window removed; StoryBook acts as dashboard
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
                // Also refresh signs on-demand
                if (this.ui_use_signs) {
                    this.dashboard.UpdateSignsForSharedGoals(this.shared_goals);
                }
                this.ui_show_goals_prev = current;
            }
            
            // Sleep for a bit to avoid hogging CPU
            GSController.Sleep(1);

a GSNews
            if (this.ui_reminders_enabled) {
                local today2 = GSDate.GetCurrentDate();
                // Safety check: if reminder date is in the past, reset it
                if (this.next_reminder_date != null && this.next_reminder_date < today2) {
                    GSLog.Info("Reminder date was in the past, resetting to " + (today2 + this.ui_reminder_days));
                    this.next_reminder_date = today2 + this.ui_reminder_days;
                }
                if (this.next_reminder_date != null && today2 >= this.next_reminder_date) {
                    GSLog.Info("Sending reminder: today=" + today2 + ", next_reminder=" + this.next_reminder_date);
this.SendReminderNews();
                    // Schedule next reminder for the future to prevent multiple reminders on same day
                    this.next_reminder_date = today2 + this.ui_reminder_days;
                    GSLog.Info("Reminder sent, next reminder scheduled for " + this.next_reminder_date);
                }
            }

    }

    function LoadCompiledAuthoring() {
        // Attempt to require compiled index; if missing, skip silently
        try {
            require("coopetition/build/index.nut");
        } catch (e) {
            GSLog.Info("No compiled authoring index found; running with built-in defaults");
            return;
        }
        if (!("CoopetitionIndex" in ::)) {
            GSLog.Warning("Compiled index did not expose CoopetitionIndex; skipping");
            return;
        }
        local index = ::CoopetitionIndex;

        // Load goals immediately as shared goals if constraints allow and type != player
        if ("goals" in index) {
            foreach (entry in index.goals) {
                try {
                    local path = "coopetition/build/" + entry.file;
                    require(path);
                    local var_name = "Goal_" + entry.id;
                    if (!(var_name in ::)) continue;
                    local goal_def = ::[var_name];
                    if (!ConstraintEvaluator.Evaluate("constraints" in goal_def ? goal_def.constraints : null)) continue;

                    // Map objective to SharedGoal instance (currently supported types)
                    if (goal_def.type == "scenario") {
                        local shared_goal = CoopetitionLoader.MapObjectiveToSharedGoal(goal_def);
                        if (shared_goal != null) {
                            shared_goal.result <- ("result" in goal_def) ? goal_def.result : null;
                            this.shared_goals.append(shared_goal);
                            CoopetitionLoader.TryCreateGSGoal(shared_goal, goal_def);
                            GSLog.Info("Registered shared goal from compiled authoring: " + goal_def.id);
                        }
                    }
                } catch (ex) {
                    GSLog.Warning("Failed to load goal " + entry.id + ": " + ex);
                }
            }
        }
    }
    
    function HandleEvent(event) {
        if (event == null) return;

        switch (event.GetEventType()) {
            case GSEvent.ET_COMPANY_DELIVERED_CARGO:
                this.OnCompanyDeliveredCargo(GSEventCompanyDeliveredCargo.Convert(event));
k;
                
            case GSEvent.ET_COMPANY_PERFORMANCE_RATING:
.OnCompanyPerformanceRating(GSEventCompanyPerformanceRating.Convert(event));
                break;
                
            case GSEvent.ET_COMPANY_NEW:
                this.OnCompanyNew(GSEventCompanyNew.Convert(event));
                break;
                
 GSEvent.ET_COMPANY_BANKRUPT:
                this.OnCompanyBankrupt(GSEventCompanyBankrupt.Convert(event));
                break;

    }
    
    function OnCompanyDeliveredCargo(event) {
        local company_id = event.GetCompanyID();
        local cargo_type = event.GetCargoType();
 = event.GetCargoAmount();
        
        // Update shared goals that involve cargo delivery
        foreach (goal in this.shared_goals) {
e == SharedGoalType.CARGO_DELIVERY && goal.cargo_type == cargo_type) {
                goal.UpdateProgress(company_id, amount);
            }
        }
        
        // Update player goals
        if (company_id in this.player_goals) {
l in this.player_goals[company_id]) {
                if (goal.type == PlayerGoalType.CARGO_DELIVERY && goal.cargo_type == cargo_type) {
.UpdateProgress(amount);
                }
            }
        }
    }
    
    function OnCompanyPerformanceRating(event) {
y_id = event.GetCompanyID();
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

        // Send onboarding news to the new company
        this.SendOnboardingNews(company_id);

        // Publish StoryBook personal page for the new company if enabled
    if (this.ui_use_storybook) {
            this.dashboard.UpdateStoryBook(this.shared_goals, this.player_goals, true);
        }
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
                GSNews.Create(GSNews.NT_GENERAL, 
                    "Shared goal completed: " + goal.description, 
                    GSCompany.COMPANY_INVALID, GSNews.NR_NONE, 0);
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
                    GSNews.Create(GSNews.NT_GENERAL, 
                    "Personal goal completed: " + goal.description, 
                        company_id, GSNews.NR_NONE, 0);
                }
            }
        }
    }

    function GiveSharedGoalReward(goal) {
        local total_cash = ("result" in goal && goal.result != null && ("cash" in goal.result)) ? goal.result.cash : GSController.GetSetting("shared_goal_reward");
        foreach (company_id, contribution in goal.contributions) {
            local company_cash = (goal.target > 0) ? ((contribution * total_cash) / goal.target) : 0;
            if (company_cash != 0) GSCompany.ChangeBankBalance(company_id, company_cash, GSCompany.EXPENSES_OTHER, 0);
            GSLog.Info("Company " + GSCompany.GetName(company_id) + " received cash=" + company_cash + " for shared goal result");
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
data.last_reminder_date <- this.last_reminder_date;
        
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
if ("last_reminder_date" in data) this.last_reminder_date = data.last_reminder_date;
        
GSLog.Info("Coopetition Game Script loaded from save");
    }

tion SendOnboardingToExistingCompanies() {
        // Send global onboarding news to all players
        GSLog.Info("Sending global onboarding message");
        local msg = "Welcome to Coopetition! Check the StoryBook for details.";
        this.PostNewsGlobal(msg);
        
        // Also initialize goals for any existing companies
        local found_companies = 0;
        for (local company_id = GSCompany.COMPANY_FIRST; company_id < GSCompany.COMPANY_LAST; company_id++) {
            try {
                local company_name = GSCompany.GetName(company_id);
                if (company_name != null && company_name != "") {
                    found_companies++;
                    GSLog.Info("Found existing company: " + company_id + " (" + company_name + ")");
                    // Initialize player goals for existing company
                    if (!(company_id in this.player_goals)) {
                        this.player_goals[company_id] <- [];
                        this.campaign.AssignInitialGoals(company_id, this.player_goals[company_id]);
                    }
                }
            } catch (e) {
                // Company doesn't exist, continue
            }
        }
        GSLog.Info("Found " + found_companies + " existing companies for goal initialization");
    }

    function SendOnboardingNews(company_id) {
        local msg = "Welcome to Coopetition! Check the StoryBook for details.";
        GSLog.Info("Sending onboarding news to company " + company_id + ": " + msg);
        this.PostNewsCompany(company_id, msg);
    }

    function SendReminderNews() {
        local shared_count = this.shared_goals.len();
        local goal_text = shared_count == 1 ? "goal" : "goals";
        local msg_all = "Coopetition: " + shared_count + " shared " + goal_text + " active";
        this.PostNewsGlobal(msg_all);
    }

    function PostNewsGlobal(message) {
        // API 14+: use 5-arg signature with NR_NONE, reference 0
        GSNews.Create(GSNews.NT_GENERAL, message, GSCompany.COMPANY_INVALID, GSNews.NR_NONE, 0);
    }

    function PostNewsCompany(company_id, message) {
        // API 14+: per-company news via 5-arg signature
        GSLog.Info("PostNewsCompany: company=" + company_id + ", message='" + message + "'");
        GSNews.Create(GSNews.NT_GENERAL, message, company_id, GSNews.NR_NONE, 0);
    }
}