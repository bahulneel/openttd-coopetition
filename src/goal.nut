/*
 * This file is part of the OpenTTD Coopetition Game Script
 * The script manages competitive cooperative gameplay in OpenTTD
 */

// Shared goal types
class SharedGoalType {
    static CARGO_DELIVERY = 0;    // Deliver specific cargo between locations
    static TOWN_POPULATION = 1;   // Grow town to target population
    static STATION_RATING = 2;    // Maintain station rating at specific locations
    static NETWORK_LENGTH = 3;    // Build network of specific length
    static VEHICLE_COUNT = 4;     // Operate specific number of vehicles
}

// Tier levels for goal completion
class GoalTier {
    static BRONZE = 0;
    static SILVER = 1;
    static GOLD = 2;
}

/*
 * SharedGoal class
 * Represents a goal that multiple companies can contribute to
 */
class SharedGoal {
    id = null;                // Unique identifier
    type = null;              // Type of goal (from SharedGoalType)
    description = null;       // Human-readable description
    target = null;            // Target value to reach
    current_progress = null;  // Current progress towards target
    contributions = null;     // Table of company contributions {company_id: amount}
    start_date = null;        // Game date when goal was created
    end_date = null;          // Game date when goal should be completed (optional)
    reward_given = null;      // Whether reward has been given
    tier_thresholds = null;   // Thresholds for bronze/silver/gold tiers

    // Additional properties for specific goal types
    cargo_type = null;        // For CARGO_DELIVERY goals
    source_town = null;       // For CARGO_DELIVERY goals
    dest_town = null;         // For CARGO_DELIVERY goals
    town_id = null;           // For TOWN_POPULATION goals
    station_id = null;        // For STATION_RATING goals
    vehicle_type = null;      // For VEHICLE_COUNT goals

    constructor(type, description, target) {
        this.id = GSBase.Rand();
        this.type = type;
        this.description = description;
        this.target = target;
        this.current_progress = 0;
        this.contributions = {};
        this.start_date = GSDate.GetCurrentDate();
        this.end_date = null;
        this.reward_given = false;

        // Default tier thresholds (bronze: 50%, silver: 75%, gold: 100%)
        this.tier_thresholds = {
            [GoalTier.BRONZE] = target / 2,
            [GoalTier.SILVER] = (target * 3) / 4,
            [GoalTier.GOLD] = target
        };
    }

    /*
     * Update progress for a specific company
     */
    function UpdateProgress(company_id, amount) {
        // Initialize contribution if not exists
        if (!(company_id in this.contributions)) {
            this.contributions[company_id] <- 0;
        }

        // Update company contribution
        this.contributions[company_id] += amount;

        // Update total progress
        this.current_progress += amount;

        // Log progress
        GSLog.Info("Company " + GSCompany.GetName(company_id) +
            " contributed " + amount + " to shared goal: " + this.description);

        return this.current_progress;
    }

    /*
     * General update function called regularly
     */
    function Update() {
        // Different update logic based on goal type
        switch (this.type) {
            case SharedGoalType.TOWN_POPULATION:
                if (this.town_id != null) {
                    local current_population = GSTown.GetPopulation(this.town_id);
                    this.current_progress = current_population;
                }
                break;

            case SharedGoalType.STATION_RATING:
                if (this.station_id != null) {
                    // Calculate average rating across all companies
                    local total_rating = 0;
                    local company_count = 0;

                    // Iterate through all companies
                    for (local company_id = 0; company_id < 16; company_id++) {
                        if (GSCompany.ResolveCompanyID(company_id) != GSCompany.COMPANY_INVALID) {
                            if (GSStation.IsValidStation(this.station_id)) {
                                // Use cargo rating as a proxy for station rating
                                local rating = 0;
                                local cargo_list = GSCargoList();
                                foreach (cargo_id, _ in cargo_list) {
                                    if (GSStation.HasCargoRating(this.station_id, cargo_id)) {
                                        rating += GSStation.GetCargoRating(this.station_id, cargo_id);
                                    }
                                }
                                if (rating > 0) {
                                    total_rating += rating;
                                    company_count++;

                                    // Track individual company contributions
                                    if (!(company_id in this.contributions)) {
                                        this.contributions[company_id] <- 0;
                                    }
                                    this.contributions[company_id] = rating;
                                }
                            }
                        }
                    }

                    if (company_count > 0) {
                        this.current_progress = total_rating / company_count;
                    }
                }
                break;

            case SharedGoalType.NETWORK_LENGTH:
                // Calculate total network length across all companies
                local total_length = 0;
                local company_list = GSCompanyList();

                foreach (company_id, _ in company_list) {
                    local rail_length = GSRail.GetTotalRailLength(company_id);
                    local road_length = GSRoad.GetTotalRoadLength(company_id);

                    local company_length = rail_length + road_length;
                    total_length += company_length;

                    // Track individual company contributions
                    if (!(company_id in this.contributions)) {
                        this.contributions[company_id] <- 0;
                    }
                    this.contributions[company_id] = company_length;
                }

                this.current_progress = total_length;
                break;

            case SharedGoalType.VEHICLE_COUNT:
                // Count vehicles of specific type across all companies
                if (this.vehicle_type != null) {
                    local total_vehicles = 0;
                    local company_list = GSCompanyList();

                    foreach (company_id, _ in company_list) {
                        local vehicle_list = GSVehicleList();
                        local company_vehicles = 0;

                        foreach (vehicle_id, _ in vehicle_list) {
                            if (GSVehicle.GetOwner(vehicle_id) == company_id &&
                                GSVehicle.GetVehicleType(vehicle_id) == this.vehicle_type) {
                                company_vehicles++;
                            }
                        }

                        total_vehicles += company_vehicles;

                        // Track individual company contributions
                        if (!(company_id in this.contributions)) {
                            this.contributions[company_id] <- 0;
                        }
                        this.contributions[company_id] = company_vehicles;
                    }

                    this.current_progress = total_vehicles;
                }
                break;
        }
    }

    /*
     * Check if goal is completed
     */
    function IsCompleted() {
        return this.current_progress >= this.target;
    }

    /*
     * Get current tier based on progress
     */
    function GetCurrentTier() {
        if (this.current_progress >= this.tier_thresholds[GoalTier.GOLD]) {
            return GoalTier.GOLD;
        } else if (this.current_progress >= this.tier_thresholds[GoalTier.SILVER]) {
            return GoalTier.SILVER;
        } else if (this.current_progress >= this.tier_thresholds[GoalTier.BRONZE]) {
            return GoalTier.BRONZE;
        } else {
            return null; // No tier reached yet
        }
    }

    /*
     * Get company contribution percentage
     */
    function GetCompanyContribution(company_id) {
        if (this.current_progress == 0) return 0;
        if (!(company_id in this.contributions)) return 0;

        return (this.contributions[company_id] * 100) / this.current_progress;
    }

    /*
     * Get remaining progress needed
     */
    function GetRemainingProgress() {
        return this.target - this.current_progress;
    }

    /*
     * Save goal state to table for savegame
     */
    function SaveToTable() {
        local data = {};

        data.id <- this.id;
        data.type <- this.type;
        data.description <- this.description;
        data.target <- this.target;
        data.current_progress <- this.current_progress;
        data.contributions <- this.contributions;
        data.start_date <- this.start_date;
        data.end_date <- this.end_date;
        data.reward_given <- this.reward_given;
        // Persist unified result object if present
        if ("result" in this && this.result != null) {
            data.result <- this.result;
        } else {
            data.result <- null;
        }
        data.tier_thresholds <- this.tier_thresholds;

        // Save type-specific properties
        data.cargo_type <- this.cargo_type;
        data.source_town <- this.source_town;
        data.dest_town <- this.dest_town;
        data.town_id <- this.town_id;
        data.station_id <- this.station_id;
        data.vehicle_type <- this.vehicle_type;

        return data;
    }

    /*
     * Load goal state from table (savegame)
     */
    static function LoadFromTable(data) {
        local goal = SharedGoal(data.type, data.description, data.target);

        goal.id = data.id;
        goal.current_progress = data.current_progress;
        goal.contributions = data.contributions;
        goal.start_date = data.start_date;
        goal.end_date = data.end_date;
        goal.reward_given = data.reward_given;
        // Restore result object if present
        goal.result <- ("result" in data) ? data.result : null;
        goal.tier_thresholds = data.tier_thresholds;

        // Load type-specific properties
        goal.cargo_type = data.cargo_type;
        goal.source_town = data.source_town;
        goal.dest_town = data.dest_town;
        goal.town_id = data.town_id;
        goal.station_id = data.station_id;
        goal.vehicle_type = data.vehicle_type;

        return goal;
    }

    /*
     * Factory methods for creating specific goal types
     */
    static function CreateCargoDeliveryGoal(cargo_type, source_town, dest_town, target) {
        local cargo_name = GSCargo.GetCargoLabel(cargo_type);
        local source_name = GSTown.GetName(source_town);
        local dest_name = GSTown.GetName(dest_town);

        local description = "Deliver " + target + " units of " + cargo_name +
                           " from " + source_name + " to " + dest_name;

        local goal = SharedGoal(SharedGoalType.CARGO_DELIVERY, description, target);
        goal.cargo_type = cargo_type;
        goal.source_town = source_town;
        goal.dest_town = dest_town;

        return goal;
    }

    static function CreateTownPopulationGoal(town_id, target) {
        local town_name = GSTown.GetName(town_id);
        local description = "Grow " + town_name + " to a population of " + target;

        local goal = SharedGoal(SharedGoalType.TOWN_POPULATION, description, target);
        goal.town_id = town_id;

        return goal;
    }

    static function CreateStationRatingGoal(station_id, target) {
        local description = "Maintain station at a rating of " + target + "%";

        local goal = SharedGoal(SharedGoalType.STATION_RATING, description, target);
        goal.station_id = station_id;

        return goal;
    }

    static function CreateNetworkLengthGoal(target) {
        local description = "Build a combined network of " + target + " tiles";

        local goal = SharedGoal(SharedGoalType.NETWORK_LENGTH, description, target);

        return goal;
    }

    static function CreateVehicleCountGoal(vehicle_type, target) {
        local type_name = "";
        switch (vehicle_type) {
            case GSVehicle.VT_RAIL: type_name = "trains"; break;
            case GSVehicle.VT_ROAD: type_name = "road vehicles"; break;
            case GSVehicle.VT_WATER: type_name = "ships"; break;
            case GSVehicle.VT_AIR: type_name = "aircraft"; break;
        }

        local description = "Operate " + target + " " + type_name + " collectively";

        local goal = SharedGoal(SharedGoalType.VEHICLE_COUNT, description, target);
        goal.vehicle_type = vehicle_type;

        return goal;
    }
}