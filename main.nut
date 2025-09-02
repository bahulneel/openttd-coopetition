/*
 * This file is part of the OpenTTD Coopetition Game Script
 * The script manages competitive cooperative gameplay in OpenTTD
 */

import("util.superlib", "SuperLib", 40);
require("version.nut");
require("goal.nut");
require("player.nut");
require("dashboard.nut");
require("campaign.nut");

class Coopetition extends GSController {
    // Script settings
    settings = null;
    log_level = 1;
    
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
        
        // Initialize campaign scheduler
        this.campaign = Campaign();
        
        // Register event handlers
        GSEventController.SetCompanyDeliveredCargoEventInterval(50);
        GSEventController.SetCompanyPerformanceRatingEventInterval(100);
        
        // Main game loop
        while (true) {
            // Handle events
            local event = GSEventController.GetNextEvent();
            if (GSEventController.IsEventWaitingProcessing()) {
                this.HandleEvent(event);
            }
            
            // Update goals and dashboard
            this.UpdateGoals();
            this.dashboard.Update(this.shared_goals, this.player_goals);
            
            // Check for campaign progression
            this.campaign.CheckProgression(this.shared_goals, this.player_goals);
            
            // Sleep for a bit to avoid hogging CPU
            GSController.Sleep(1);
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
                    GSCompany.COMPANY_INVALID);
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
                        company_id);
                }
            }
        }
    }
    
    function GiveSharedGoalReward(goal) {
        local reward = GSController.GetSetting("shared_goal_reward");
        
        // Distribute reward based on contribution
        foreach (company_id, contribution in goal.contributions) {
            local company_reward = (contribution * reward) / goal.target;
            GSCompany.ChangeBankBalance(company_id, company_reward, GSCompany.EXPENSES_OTHER);
            
            GSLog.Info("Company " + GSCompany.GetName(company_id) + 
                " received " + company_reward + " for shared goal contribution");
        }
    }
    
    function GivePlayerGoalReward(company_id, goal) {
        local reward = goal.reward;
        GSCompany.ChangeBankBalance(company_id, reward, GSCompany.EXPENSES_OTHER);
        
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
        
        GSLog.Info("Coopetition Game Script loaded from save");
    }
}