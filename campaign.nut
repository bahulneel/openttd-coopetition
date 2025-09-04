/*
 * This file is part of the OpenTTD Coopetition Game Script
 * The script manages competitive cooperative gameplay in OpenTTD
 */

require("constants.nut");

/*
 * Campaign class
 * Manages progression and scheduling of goals over time
 */
class Campaign {
    current_week = null;       // Current week in the campaign
    current_year = null;       // Current year in the campaign
    current_month = null;      // Current month in the campaign
    total_weeks = null;        // Total number of weeks in the campaign
    week_start_date = null;    // Game date when current week started
    year_start_date = null;    // Game date when current year started
    month_start_date = null;   // Game date when current month started
    week_goals = null;         // Array of goals for each week
    auto_progression = null;   // Whether to automatically progress to next week
    year_to_date_page_id = null; // StoryBook page ID for current year (Year to Date)
    campaign_completed_logged = null; // Whether we've already logged campaign completion
    
    constructor() {
        this.current_week = 1;
        this.current_year = GSDate.GetYear(GSDate.GetCurrentDate());
        this.current_month = GSDate.GetMonth(GSDate.GetCurrentDate());
        this.total_weeks = 4; // Default 4-week campaign
        this.week_start_date = GSDate.GetCurrentDate();
        this.year_start_date = GSDate.GetCurrentDate();
        this.month_start_date = GSDate.GetCurrentDate();
        this.auto_progression = true;
        this.year_to_date_page_id = null;
        this.campaign_completed_logged = false;
        
        // Initialize week goals
        this.week_goals = [];
        this.InitializeDefaultCampaign();
    }
    
    /*
     * Initialize default campaign structure
     */
    function InitializeDefaultCampaign() {
        // Week 1: Single town / shared station
        this.week_goals.append({
            shared_goals = [
                {
                    type = SharedGoalType.STATION_RATING,
                    params = {
                        // Parameters will be filled at runtime when towns are known
                    },
                    target = 80 // 80% rating
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
            description = "Week 1: Single town / shared station"
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
                {
                    type = SharedGoalType.NETWORK_LENGTH,
                    params = {},
                    target = 100 // 100 tiles of network
                }
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
                        target = 20 // 20 trains collectively
                    },
                    target = 20
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
            if (!this.campaign_completed_logged) {
                GSLog.Info("Campaign complete!");
                this.campaign_completed_logged = true;
            }
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
                    
                case SharedGoalType.NETWORK_LENGTH:
                    goal = SharedGoal.CreateNetworkLengthGoal(goal_config.target);
                    break;
                    
                case SharedGoalType.VEHICLE_COUNT:
                    goal = SharedGoal.CreateVehicleCountGoal(
                        goal_config.params.vehicle_type, goal_config.params.target);
                    break;
            }
            
            if (goal != null) {
                shared_goals.append(goal);
            }
        }
        
        // Create player goals for each company
        local company_list = GSCompanyList();
        foreach (company_id, _ in company_list) {
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
        
        // Update week start date
        this.week_start_date = GSDate.GetCurrentDate();
        
        // Announce new week
        GSNews.Create(GSNews.NT_GENERAL, 
            "Week " + this.current_week + " of the Coopetition Campaign: " + 
            week_config.description, 
            GSCompany.COMPANY_INVALID);
        
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
            week_config.description, 
            company_id);
    }
    
    /*
     * Check if it's time to progress to the next week
     */
    function CheckProgression(shared_goals, player_goals) {
        if (!this.auto_progression) return false;
        
        // Check if we need to handle year/month progression
        this.CheckYearMonthProgression(shared_goals, player_goals);
        
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
            // Update Year to Date page with current week summary
            this.UpdateYearToDatePage(shared_goals, player_goals);
            
            // Increment week counter
            this.current_week++;
            
            // Start new week
            return this.StartNewWeek(shared_goals, player_goals);
        }
        
        return false;
    }
    
    /*
     * Check for year and month progression
     */
    function CheckYearMonthProgression(shared_goals, player_goals) {
        local current_date = GSDate.GetCurrentDate();
        local current_year = GSDate.GetYear(current_date);
        local current_month = GSDate.GetMonth(current_date);
        
        // Check for year change
        if (current_year != this.current_year) {
            this.HandleYearTransition(shared_goals, player_goals);
            this.current_year = current_year;
            this.year_start_date = current_date;
            this.current_month = current_month;
            this.month_start_date = current_date;
            this.InitializeYearToDatePage();
        }
        // Check for month change within same year
        else if (current_month != this.current_month) {
            this.HandleMonthTransition();
            this.current_month = current_month;
            this.month_start_date = current_date;
        }
    }
    
    function HandleYearTransition(shared_goals, player_goals) {
        // Create year summary page for the completed year
        local completed_year = this.current_year;
        local title = "Year " + completed_year + " Summary";
        local year_page_id = GSStoryPage.New(GSCompany.COMPANY_INVALID, title);
        if (GSStoryPage.IsValidStoryPage(year_page_id)) {
            this.CreateYearSummaryPage(year_page_id, completed_year, shared_goals, player_goals);
        }
    }
    
    function HandleMonthTransition() {
        // Add month separator to Year to Date page
        if (this.year_to_date_page_id != null && GSStoryPage.IsValidStoryPage(this.year_to_date_page_id)) {
            local month_names = ["January", "February", "March", "April", "May", "June",
                               "July", "August", "September", "October", "November", "December"];
            local month_name = month_names[this.current_month - 1];
            GSStoryPage.NewElement(this.year_to_date_page_id, GSStoryPage.SPET_TEXT, 0, "");
            GSStoryPage.NewElement(this.year_to_date_page_id, GSStoryPage.SPET_TEXT, 0, "=== " + month_name + " ===");
            GSStoryPage.NewElement(this.year_to_date_page_id, GSStoryPage.SPET_TEXT, 0, "");
        }
    }
    
    function InitializeYearToDatePage() {
        // Remove old Year to Date page if it exists
        if (this.year_to_date_page_id != null) {
            try { GSStoryPage.Remove(this.year_to_date_page_id); } catch (e) {}
            this.year_to_date_page_id = null;
        }
        
        // Create new Year to Date page
        local title = "Year to Date - " + this.current_year;
        this.year_to_date_page_id = GSStoryPage.New(GSCompany.COMPANY_INVALID, title);
        if (!GSStoryPage.IsValidStoryPage(this.year_to_date_page_id)) return;
        
        // Add year header
        GSStoryPage.NewElement(this.year_to_date_page_id, GSStoryPage.SPET_TEXT, 0, "=== YEAR TO DATE - " + this.current_year + " ===");
        GSStoryPage.NewElement(this.year_to_date_page_id, GSStoryPage.SPET_TEXT, 0, "");
        
        // Add current month header
        local month_names = ["January", "February", "March", "April", "May", "June",
                           "July", "August", "September", "October", "November", "December"];
        local month_name = month_names[this.current_month - 1];
        GSStoryPage.NewElement(this.year_to_date_page_id, GSStoryPage.SPET_TEXT, 0, "=== " + month_name + " ===");
        GSStoryPage.NewElement(this.year_to_date_page_id, GSStoryPage.SPET_TEXT, 0, "");
    }
    
    function UpdateYearToDatePage(shared_goals, player_goals) {
        if (this.year_to_date_page_id == null || !GSStoryPage.IsValidStoryPage(this.year_to_date_page_id)) {
            this.InitializeYearToDatePage();
            if (this.year_to_date_page_id == null) return;
        }
        
        // Add week summary to Year to Date page
        GSStoryPage.NewElement(this.year_to_date_page_id, GSStoryPage.SPET_TEXT, 0, "Week " + this.current_week + ":");
        
        // Shared Goals section
        GSStoryPage.NewElement(this.year_to_date_page_id, GSStoryPage.SPET_TEXT, 0, "  Shared Goals:");
        foreach (goal in shared_goals) {
            local status = goal.IsCompleted() ? "COMPLETED" : "IN PROGRESS";
            local progress = goal.target > 0 ? (goal.current_progress * 100) / goal.target : 0;
            if (progress > 100) progress = 100;
            GSStoryPage.NewElement(this.year_to_date_page_id, GSStoryPage.SPET_TEXT, 0, "    " + LIST_ITEM + " " + goal.description + " - " + status + " (" + progress + "%)");
        }

        // Personal Goals section
        GSStoryPage.NewElement(this.year_to_date_page_id, GSStoryPage.SPET_TEXT, 0, "  Personal Goals:");
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
                    GSStoryPage.NewElement(this.year_to_date_page_id, GSStoryPage.SPET_TEXT, 0, "    " + LIST_ITEM + " " + GSCompany.GetName(company_id) + ": " + completed + "/" + total + " (" + pct + "%)");
                }
            }
        }
        GSStoryPage.NewElement(this.year_to_date_page_id, GSStoryPage.SPET_TEXT, 0, ""); // Empty line after each week
    }
    
    function CreateYearSummaryPage(page_id, year, shared_goals, player_goals) {
        // Add year summary header
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "=== YEAR " + year + " SUMMARY ===");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "Final Status at Year End:");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "");
        
        // Shared Goals final status
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "Shared Goals:");
        foreach (goal in shared_goals) {
            local status = goal.IsCompleted() ? "COMPLETED" : "IN PROGRESS";
            local progress = goal.target > 0 ? (goal.current_progress * 100) / goal.target : 0;
            if (progress > 100) progress = 100;
            GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, LIST_ITEM + " " + goal.description + " - " + status + " (" + progress + "%)");
        }

        // Personal Goals final status
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "");
        GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, "Personal Goals:");
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
                    GSStoryPage.NewElement(page_id, GSStoryPage.SPET_TEXT, 0, LIST_ITEM + " " + GSCompany.GetName(company_id) + ": " + completed + "/" + total + " (" + pct + "%)");
                }
            }
        }
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
        local town_list = GSTownList();
        
        // Sort towns by population (largest first)
        local sorted_towns = [];
        foreach (town_id, _ in town_list) {
            sorted_towns.append({
                town_id = town_id,
                population = GSTown.GetPopulation(town_id)
            });
        }
        
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
        data.current_year <- this.current_year;
        data.current_month <- this.current_month;
        data.total_weeks <- this.total_weeks;
        data.week_start_date <- this.week_start_date;
        data.year_start_date <- this.year_start_date;
        data.month_start_date <- this.month_start_date;
        data.auto_progression <- this.auto_progression;
        data.year_to_date_page_id <- this.year_to_date_page_id;
        data.campaign_completed_logged <- this.campaign_completed_logged;
        
        // We don't need to save week_goals as they're initialized in constructor
        
        return data;
    }
    
    /*
     * Load campaign state from table (save game)
     */
    static function LoadFromTable(data) {
        local campaign = Campaign();
        
        campaign.current_week = data.current_week;
        campaign.current_year = data.current_year;
        campaign.current_month = data.current_month;
        campaign.total_weeks = data.total_weeks;
        campaign.week_start_date = data.week_start_date;
        campaign.year_start_date = data.year_start_date;
        campaign.month_start_date = data.month_start_date;
        campaign.auto_progression = data.auto_progression;
        campaign.year_to_date_page_id = data.year_to_date_page_id;
        campaign.campaign_completed_logged = data.campaign_completed_logged;
        
        return campaign;
    }
}