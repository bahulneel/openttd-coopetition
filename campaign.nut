/*
 * This file is part of the OpenTTD Coopetition Game Script
 * The script manages competitive cooperative gameplay in OpenTTD
 */

/*
 * Campaign class
 * Manages progression and scheduling of goals over time
 */
class Campaign {
    current_week = null;       // Current week in the campaign
    total_weeks = null;        // Total number of weeks in the campaign
    week_start_date = null;    // Game date when current week started
    week_goals = null;         // Array of goals for each week
    auto_progression = null;   // Whether to automatically progress to next week
    
    constructor() {
        this.current_week = 1;
        this.total_weeks = 4; // Default 4-week campaign
        this.week_start_date = GSDate.GetCurrentDate();
        this.auto_progression = true;
        
        // Initialize week goals
        this.week_goals = [];
        this.InitializeDefaultCampaign();
    }
    
    /*
     * Initialize default campaign structure
     */
    function InitializeDefaultCampaign() {
        // Week 1: Intro cargo delivery (replaces station rating for API portability)
        this.week_goals.append({
            shared_goals = [
                {
                    type = SharedGoalType.CARGO_DELIVERY,
                    params = {
                        // Parameters will be filled at runtime when towns/cargo are known
                    },
                    target = 200 // 200 units of cargo
                }
            ],
            player_goals = [
                {
                    type = PlayerGoalType.PROFIT,
                    params = {
                        target = 10000 // £10,000 profit
                    },
                    reward = 20000 // £20,000 reward
                },
                {
                    type = PlayerGoalType.STATION_COUNT,
                    params = {
                        target = 2 // 2 stations
                    },
                    reward = 15000 // £15,000 reward
                }
            ],
            description = "Week 1: Intro cargo delivery"
        });
        
        // Week 2: Shared trunk line
        this.week_goals.append({
            shared_goals = [
                {
                    type = SharedGoalType.CARGO_DELIVERY,
                    params = {
                        // Parameters will be filled at runtime
                    },
                    target = 500 // 500 units of cargo
                },
                // NETWORK_LENGTH goal removed due to portability concerns
            ],
            player_goals = [
                {
                    type = PlayerGoalType.VEHICLE_COUNT,
                    params = {
                        vehicle_type = GSVehicle.VT_RAIL,
                        target = 5 // 5 trains
                    },
                    reward = 25000 // £25,000 reward
                },
                {
                    type = PlayerGoalType.PROFIT,
                    params = {
                        target = 25000 // £25,000 profit
                    },
                    reward = 30000 // £30,000 reward
                }
            ],
            description = "Week 2: Shared trunk line"
        });
        
        // Week 3: Intersecting networks
        this.week_goals.append({
            shared_goals = [
                {
                    type = SharedGoalType.TOWN_POPULATION,
                    params = {
                        // Parameters will be filled at runtime
                    },
                    target = 1000 // 1000 population
                },
                {
                    type = SharedGoalType.CARGO_DELIVERY,
                    params = {
                        // Parameters will be filled at runtime
                    },
                    target = 1000 // 1000 units of cargo
                }
            ],
            player_goals = [
                {
                    type = PlayerGoalType.TOWN_SERVICE,
                    params = {
                        target = 3 // 3 towns
                    },
                    reward = 40000 // £40,000 reward
                },
                {
                    type = PlayerGoalType.ROUTE_EFFICIENCY,
                    params = {
                        target = 80 // 80% efficiency
                    },
                    reward = 35000 // £35,000 reward
                }
            ],
            description = "Week 3: Intersecting networks"
        });
        
        // Week 4: Full coop corridor
        this.week_goals.append({
            shared_goals = [
                {
                    type = SharedGoalType.CARGO_DELIVERY,
                    params = {
                        // Parameters will be filled at runtime
                    },
                    target = 2000 // 2000 units of cargo
                },
                {
                    type = SharedGoalType.VEHICLE_COUNT,
                    params = {
                        vehicle_type = GSVehicle.VT_RAIL,
                        target = 20
                    }
                }
            ],
            player_goals = [
                {
                    type = PlayerGoalType.PERFORMANCE,
                    params = {
                        target = 800 // 800 performance rating
                    },
                    reward = 50000 // £50,000 reward
                },
                {
                    type = PlayerGoalType.PROFIT,
                    params = {
                        target = 50000 // £50,000 profit
                    },
                    reward = 60000 // £60,000 reward
                }
            ],
            description = "Week 4: Full coop corridor"
        });
    }
    
    /*
     * Start a new week in the campaign
     */
    function StartNewWeek(shared_goals, player_goals) {
        if (this.current_week > this.total_weeks) {
            // Campaign is complete
            GSLog.Info("Campaign complete!");
            return false;
        }
        
        // Clear existing goals
        shared_goals.clear();
        foreach (company_id, goals in player_goals) {
            goals.clear();
        }
        
        // Get week configuration
        local week_config = this.week_goals[this.current_week - 1];
        
        // Create shared goals for this week
        foreach (goal_config in week_config.shared_goals) {
            local goal = null;
            
            switch (goal_config.type) {
                case SharedGoalType.CARGO_DELIVERY:
                    // Find suitable towns and cargo type
                    local cargo_type = this.FindSuitableCargo();
                    local towns = this.FindSuitableTowns(2);
                    
                    if (cargo_type != null && towns.len() >= 2) {
                        goal = SharedGoal.CreateCargoDeliveryGoal(
                            cargo_type, towns[0], towns[1], goal_config.target);
                    }
                    break;
                    
                case SharedGoalType.TOWN_POPULATION:
                    // Find suitable town
                    local towns = this.FindSuitableTowns(1);
                    
                    if (towns.len() >= 1) {
                        goal = SharedGoal.CreateTownPopulationGoal(
                            towns[0], goal_config.target);
                    }
                    break;
                    
                case SharedGoalType.STATION_RATING:
                    // This requires existing stations, so we'll create a placeholder
                    // and update it when stations are built
                    goal = SharedGoal(SharedGoalType.STATION_RATING, 
                                     "Maintain high station ratings", goal_config.target);
                    break;
                    
                // NETWORK_LENGTH skipped
                    
                case SharedGoalType.VEHICLE_COUNT:
                    goal = SharedGoal.CreateVehicleCountGoal(
                        goal_config.params.vehicle_type, goal_config.target);
                    break;
            }
            
            if (goal != null) {
                shared_goals.append(goal);
            }
        }
        
        // Create player goals for each company
        // Note: GSCompanyList doesn't exist, so we iterate manually
        for (local company_id = 0; company_id < 16; company_id++) {
            if (GSCompany.ResolveCompanyID(company_id) != GSCompany.COMPANY_INVALID) {
                // Initialize player goals array if not exists
                if (!(company_id in player_goals)) {
                    player_goals[company_id] <- [];
                }
                
                // Create goals for this company
            foreach (goal_config in week_config.player_goals) {
                local goal = null;
                
                switch (goal_config.type) {
                    case PlayerGoalType.CARGO_DELIVERY:
                        local cargo_type = this.FindSuitableCargo();
                        
                        if (cargo_type != null) {
                            goal = PlayerGoal.CreateCargoDeliveryGoal(
                                cargo_type, goal_config.params.target, goal_config.reward);
                        }
                        break;
                        
                    case PlayerGoalType.PROFIT:
                        goal = PlayerGoal.CreateProfitGoal(
                            goal_config.params.target, goal_config.reward);
                        break;
                        
                    case PlayerGoalType.PERFORMANCE:
                        goal = PlayerGoal.CreatePerformanceGoal(
                            goal_config.params.target, goal_config.reward);
                        break;
                        
                    case PlayerGoalType.STATION_COUNT:
                        goal = PlayerGoal.CreateStationCountGoal(
                            goal_config.params.target, goal_config.reward);
                        break;
                        
                    case PlayerGoalType.VEHICLE_COUNT:
                        goal = PlayerGoal.CreateVehicleCountGoal(
                            goal_config.params.vehicle_type, 
                            goal_config.params.target, 
                            goal_config.reward);
                        break;
                        
                    case PlayerGoalType.TOWN_SERVICE:
                        goal = PlayerGoal.CreateTownServiceGoal(
                            goal_config.params.target, goal_config.reward);
                        break;
                        
                    case PlayerGoalType.ROUTE_EFFICIENCY:
                        goal = PlayerGoal.CreateRouteEfficiencyGoal(
                            goal_config.params.target, goal_config.reward);
                        break;
                }
                
                if (goal != null) {
                    player_goals[company_id].append(goal);
                }
            }
            }
        }
        
        // Update week start date
        this.week_start_date = GSDate.GetCurrentDate();
        
        // Announce new week
        GSNews.Create(GSNews.NT_GENERAL, 
            "Week " + this.current_week + " of the Coopetition Campaign: " + 
            week_config.description, GSCompany.COMPANY_INVALID, GSNews.NR_NONE, 0);
        
        return true;
    }
    
    /*
     * Assign initial goals to a new company
     */
    function AssignInitialGoals(company_id, goals_array) {
        // Get current week configuration
        local week_config = this.week_goals[this.current_week - 1];
        
        // Create player goals for this company
        foreach (goal_config in week_config.player_goals) {
            local goal = null;
            
            switch (goal_config.type) {
                case PlayerGoalType.CARGO_DELIVERY:
                    local cargo_type = this.FindSuitableCargo();
                    
                    if (cargo_type != null) {
                        goal = PlayerGoal.CreateCargoDeliveryGoal(
                            cargo_type, goal_config.params.target, goal_config.reward);
                    }
                    break;
                    
                case PlayerGoalType.PROFIT:
                    goal = PlayerGoal.CreateProfitGoal(
                        goal_config.params.target, goal_config.reward);
                    break;
                    
                case PlayerGoalType.PERFORMANCE:
                    goal = PlayerGoal.CreatePerformanceGoal(
                        goal_config.params.target, goal_config.reward);
                    break;
                    
                case PlayerGoalType.STATION_COUNT:
                    goal = PlayerGoal.CreateStationCountGoal(
                        goal_config.params.target, goal_config.reward);
                    break;
                    
                case PlayerGoalType.VEHICLE_COUNT:
                    goal = PlayerGoal.CreateVehicleCountGoal(
                        goal_config.params.vehicle_type, 
                        goal_config.params.target, 
                        goal_config.reward);
                    break;
                    
                case PlayerGoalType.TOWN_SERVICE:
                    goal = PlayerGoal.CreateTownServiceGoal(
                        goal_config.params.target, goal_config.reward);
                    break;
                    
                case PlayerGoalType.ROUTE_EFFICIENCY:
                    goal = PlayerGoal.CreateRouteEfficiencyGoal(
                        goal_config.params.target, goal_config.reward);
                    break;
            }
            
            if (goal != null) {
                goals_array.append(goal);
            }
        }
        
        // Announce goals to the company
        GSNews.Create(GSNews.NT_GENERAL, 
            "Welcome to Week " + this.current_week + " of the Coopetition Campaign: " + 
            week_config.description, company_id, GSNews.NR_NONE, 0);
    }
    
    /*
     * Check if it's time to progress to the next week
     */
    function CheckProgression(shared_goals, player_goals) {
        if (!this.auto_progression) return false;
        
        // Check if all shared goals are completed
        local all_shared_completed = true;
        foreach (goal in shared_goals) {
            if (!goal.IsCompleted()) {
                all_shared_completed = false;
                break;
            }
        }
        
        // Check if at least one company has completed all personal goals
        local any_company_completed = false;
        foreach (company_id, goals in player_goals) {
            local all_completed = true;
            foreach (goal in goals) {
                if (!goal.IsCompleted()) {
                    all_completed = false;
                    break;
                }
            }
            
            if (all_completed) {
                any_company_completed = true;
                break;
            }
        }
        
        // Check if a week has passed in game time (28 days)
        local days_passed = GSDate.GetCurrentDate() - this.week_start_date;
        local week_timeout = days_passed >= 28;
        
        // Progress to next week if conditions are met
        if ((all_shared_completed && any_company_completed) || week_timeout) {
            // Display summary of current week
            this.DisplayWeekSummary(shared_goals, player_goals);
            
            // Increment week counter
            this.current_week++;
            
            // Start new week
            return this.StartNewWeek(shared_goals, player_goals);
        }
        
        return false;
    }
    
    /*
     * Display summary of the current week
     */
    function DisplayWeekSummary(shared_goals, player_goals) {
        // Build a StoryBook page with a textual summary (global)
        local title = "Week " + this.current_week + " Summary";
        local page_id = GSStoryPage.New(GSCompany.COMPANY_INVALID, title);
        if (!GSStoryPage.IsValidStoryPage(page_id)) return;

        local text = "Week " + this.current_week + " Summary\n\n";
        text += "Shared Goals:\n";
        foreach (goal in shared_goals) {
            local status = goal.IsCompleted() ? "COMPLETED" : "IN PROGRESS";
            local progress = goal.target > 0 ? (goal.current_progress * 100) / goal.target : 0;
            if (progress > 100) progress = 100;
            text += "- " + goal.description + " - " + status + " (" + progress + "%)\n";
        }

        text += "\nPersonal Goals:\n";
        for (local company_id = 0; company_id < 16; company_id++) {
            if (GSCompany.ResolveCompanyID(company_id) != GSCompany.COMPANY_INVALID) {
                if (company_id in player_goals) {
                    local completed = 0;
                    local total = 0;
                    foreach (goal in player_goals[company_id]) {
                        total++;
                        if (goal.IsCompleted()) completed++;
                    }
                    local pct = total > 0 ? (completed * 100) / total : 0;
                    text += "- " + GSCompany.GetName(company_id) + ": " + completed + "/" + total + " (" + pct + "%)\n";
                }
            }
        }

        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, text);
    }
    
    /*
     * Find suitable cargo type for goals
     */
    function FindSuitableCargo() {
        // Prefer passengers or mail as they're common
        local cargo_list = GSCargoList();
        
        // Try to find passengers
        foreach (cargo_id, _ in cargo_list) {
            if (GSCargo.GetTownEffect(cargo_id) == GSCargo.TE_PASSENGERS) {
                return cargo_id;
            }
        }
        
        // Try to find mail
        foreach (cargo_id, _ in cargo_list) {
            if (GSCargo.GetTownEffect(cargo_id) == GSCargo.TE_MAIL) {
                return cargo_id;
            }
        }
        
        // Return first cargo if no passengers or mail
        foreach (cargo_id, _ in cargo_list) {
            return cargo_id;
        }
        
        return null;
    }
    
    /*
     * Find suitable towns for goals
     */
    function FindSuitableTowns(count) {
        local result = [];
        
        // Sort towns by population (largest first)
        local sorted_towns = [];
        // Note: GSTownList might not be available, so we'll use a simplified approach
        // For now, we'll return empty array and handle this differently
        // This is a placeholder - in a real implementation, you'd need to find towns differently
        
        sorted_towns.sort(function(a, b) {
            return b.population - a.population;
        });
        
        // Take the first 'count' towns
        local added = 0;
        foreach (town in sorted_towns) {
            if (added >= count) break;
            
            result.append(town.town_id);
            added++;
        }
        
        return result;
    }
    
    /*
     * Save campaign state to table for save game
     */
    function SaveToTable() {
        local data = {};
        
        data.current_week <- this.current_week;
        data.total_weeks <- this.total_weeks;
        data.week_start_date <- this.week_start_date;
        data.auto_progression <- this.auto_progression;
        
        // We don't need to save week_goals as they're initialized in constructor
        
        return data;
    }
    
    /*
     * Load campaign state from table (save game)
     */
    static function LoadFromTable(data) {
        local campaign = Campaign();
        
        campaign.current_week = data.current_week;
        campaign.total_weeks = data.total_weeks;
        campaign.week_start_date = data.week_start_date;
        campaign.auto_progression = data.auto_progression;
        
        return campaign;
    }
}