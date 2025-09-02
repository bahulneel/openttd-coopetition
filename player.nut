/*
 * This file is part of the OpenTTD Coopetition Game Script
 * The script manages competitive cooperative gameplay in OpenTTD
 */

// Player goal types
class PlayerGoalType {
    static CARGO_DELIVERY = 0;    // Deliver specific cargo amount
    static PROFIT = 1;            // Reach profit target
    static PERFORMANCE = 2;       // Reach performance rating
    static STATION_COUNT = 3;     // Build specific number of stations
    static VEHICLE_COUNT = 4;     // Operate specific number of vehicles
    static TOWN_SERVICE = 5;      // Serve specific number of towns
    static ROUTE_EFFICIENCY = 6;  // Achieve efficiency target for a route
}

/*
 * PlayerGoal class
 * Represents a personal goal for an individual company
 */
class PlayerGoal {
    id = null;                // Unique identifier
    type = null;              // Type of goal (from PlayerGoalType)
    description = null;       // Human-readable description
    target = null;            // Target value to reach
    current_progress = null;  // Current progress towards target
    start_date = null;        // Game date when goal was created
    end_date = null;          // Game date when goal should be completed (optional)
    reward = null;            // Reward for completing the goal
    reward_given = null;      // Whether reward has been given
    
    // Additional properties for specific goal types
    cargo_type = null;        // For CARGO_DELIVERY goals
    vehicle_type = null;      // For VEHICLE_COUNT goals
    
    constructor(type, description, target, reward) {
        this.id = GSBase.Rand();
        this.type = type;
        this.description = description;
        this.target = target;
        this.current_progress = 0;
        this.start_date = GSDate.GetCurrentDate();
        this.end_date = null;
        this.reward = reward;
        this.reward_given = false;
    }
    
    /*
     * Update progress for this goal
     */
    function UpdateProgress(amount) {
        this.current_progress += amount;
        return this.current_progress;
    }
    
    /*
     * Set absolute progress value
     */
    function SetProgress(value) {
        this.current_progress = value;
        return this.current_progress;
    }
    
    /*
     * General update function called regularly
     */
    function Update() {
        // Different update logic based on goal type
        switch (this.type) {
            case PlayerGoalType.PROFIT:
                // Get company's quarterly profit (API v14+ under GSCompany)
                local company_id = GSCompany.ResolveCompanyID(GSCompany.COMPANY_SELF);
                // v14+: GetQuarterlyIncome(company_id, quarter)
                // Use current quarter (0) for now
                local profit = GSCompany.GetQuarterlyIncome(company_id, 0);
                this.current_progress = profit;
                break;
                
            case PlayerGoalType.PERFORMANCE:
                // Get company's performance rating
                local company_id = GSCompany.ResolveCompanyID(GSCompany.COMPANY_SELF);
                // v14+: performance rating retrieval moved under quarterly stats
                local performance = GSCompany.GetQuarterlyPerformanceRating(company_id, 0);
                this.current_progress = performance;
                break;
                
            case PlayerGoalType.STATION_COUNT:
                // Count company's stations
                local company_id = GSCompany.ResolveCompanyID(GSCompany.COMPANY_SELF);
                // Note: GSStationList might not be available, so we'll use a simplified approach
                // For now, we'll track this manually when stations are created/destroyed
                // This is a placeholder - in a real implementation, you'd need to find stations differently
                this.current_progress = 0; // Placeholder
                break;
                
            case PlayerGoalType.VEHICLE_COUNT:
                // Count company's vehicles of specific type
                if (this.vehicle_type != null) {
                    local company_id = GSCompany.ResolveCompanyID(GSCompany.COMPANY_SELF);
                    // Note: GSVehicleList might not be available, so we'll use a simplified approach
                    // For now, we'll track this manually when vehicles are created/destroyed
                    // This is a placeholder - in a real implementation, you'd need to find vehicles differently
                    this.current_progress = 0; // Placeholder
                }
                break;
                
            case PlayerGoalType.TOWN_SERVICE:
                // Count towns served by company
                local company_id = GSCompany.ResolveCompanyID(GSCompany.COMPANY_SELF);
                // Note: GSTownList and GSStationList might not be available, so we'll use a simplified approach
                // For now, we'll track this manually when stations are created/destroyed
                // This is a placeholder - in a real implementation, you'd need to find towns differently
                this.current_progress = 0; // Placeholder
                break;
                
            case PlayerGoalType.ROUTE_EFFICIENCY:
                // This is more complex and would require tracking specific routes
                // For now, we'll leave this as a manual update
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
     * Get progress percentage
     */
    function GetProgressPercentage() {
        if (this.target == 0) return 0;
        return (this.current_progress * 100) / this.target;
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
        data.start_date <- this.start_date;
        data.end_date <- this.end_date;
        data.reward <- this.reward;
        data.reward_given <- this.reward_given;
        
        // Save type-specific properties
        data.cargo_type <- this.cargo_type;
        data.vehicle_type <- this.vehicle_type;
        
        return data;
    }
    
    /*
     * Load goal state from table (savegame)
     */
    static function LoadFromTable(data) {
        local goal = PlayerGoal(data.type, data.description, data.target, data.reward);
        
        goal.id = data.id;
        goal.current_progress = data.current_progress;
        goal.start_date = data.start_date;
        goal.end_date = data.end_date;
        goal.reward_given = data.reward_given;
        
        // Load type-specific properties
        goal.cargo_type = data.cargo_type;
        goal.vehicle_type = data.vehicle_type;
        
        return goal;
    }
    
    /*
     * Factory methods for creating specific goal types
     */
    static function CreateCargoDeliveryGoal(cargo_type, target, reward) {
        local cargo_name = GSCargo.GetCargoLabel(cargo_type);
        local description = "Deliver " + target + " units of " + cargo_name;
        
        local goal = PlayerGoal(PlayerGoalType.CARGO_DELIVERY, description, target, reward);
        goal.cargo_type = cargo_type;
        
        return goal;
    }
    
    static function CreateProfitGoal(target, reward) {
        local description = "Reach quarterly profit of £" + target;
        
        local goal = PlayerGoal(PlayerGoalType.PROFIT, description, target, reward);
        
        return goal;
    }
    
    static function CreatePerformanceGoal(target, reward) {
        local description = "Achieve performance rating of " + target;
        
        local goal = PlayerGoal(PlayerGoalType.PERFORMANCE, description, target, reward);
        
        return goal;
    }
    
    static function CreateStationCountGoal(target, reward) {
        local description = "Build " + target + " stations";
        
        local goal = PlayerGoal(PlayerGoalType.STATION_COUNT, description, target, reward);
        
        return goal;
    }
    
    static function CreateVehicleCountGoal(vehicle_type, target, reward) {
        local type_name = "";
        switch (vehicle_type) {
            case GSVehicle.VT_RAIL: type_name = "trains"; break;
            case GSVehicle.VT_ROAD: type_name = "road vehicles"; break;
            case GSVehicle.VT_WATER: type_name = "ships"; break;
            case GSVehicle.VT_AIR: type_name = "aircraft"; break;
        }
        
        local description = "Operate " + target + " " + type_name;
        
        local goal = PlayerGoal(PlayerGoalType.VEHICLE_COUNT, description, target, reward);
        goal.vehicle_type = vehicle_type;
        
        return goal;
    }
    
    static function CreateTownServiceGoal(target, reward) {
        local description = "Serve " + target + " towns";
        
        local goal = PlayerGoal(PlayerGoalType.TOWN_SERVICE, description, target, reward);
        
        return goal;
    }
    
    static function CreateRouteEfficiencyGoal(target, reward) {
        local description = "Achieve route efficiency rating of " + target + "%";
        
        local goal = PlayerGoal(PlayerGoalType.ROUTE_EFFICIENCY, description, target, reward);
        
        return goal;
    }
}