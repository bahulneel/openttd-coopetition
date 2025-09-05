/*
 * Coopetition campaign loader utilities
 */

require("goal.nut");
require("constraints.nut");


// Start of Selection
class CoopetitionLoader {
    static function _SafeGetCargoId(label) {
        try {
            return GSCargo.GetCargoLabel(label); // Corrected function call
        } catch (e) {
            return undefined; // Use undefined instead of null
        }
    }

    static function MapObjectiveToSharedGoal(goal_def) {
        if (goal_def == null || !("objective" in goal_def)) return null;
        local obj = goal_def.objective;
        local title = ("meta" in goal_def && goal_def.meta != null && ("title" in goal_def.meta)) ? goal_def.meta.title : goal_def.id;

        if (!("type" in obj)) return null;

        switch (obj.type) {
            case "cargo_delivered": {
                local target = ("amount" in obj) ? obj.amount : 0;
                local g = SharedGoal(SharedGoalType.CARGO_DELIVERY, title, target);
                if ("cargo" in obj) g.cargo_type = CoopetitionLoader._SafeGetCargoId(obj.cargo);
                return g;
            }
            case "network_length": {
                local target = ("amount" in obj) ? obj.amount : 0;
                local g = SharedGoal(SharedGoalType.NETWORK_LENGTH, title, target);
                return g;
            }
            case "town_population": {
                local target2 = ("amount" in obj) ? obj.amount : 0;
                local g2 = SharedGoal(SharedGoalType.TOWN_POPULATION, title, target2);
                if ("town_id" in obj) g2.town_id = obj.town_id;
                return g2;
            }
        }
        return null;
    }

    static function TryCreateGSGoal(shared_goal, goal_def) {
        // Optional integration with GSGoal window
        try {
            if (shared_goal == null) return;
            local title = ("meta" in goal_def && goal_def.meta != null && ("title" in goal_def.meta)) ? goal_def.meta.title : goal_def.id;
            local desc = ("meta" in goal_def && goal_def.meta != null && ("description" in goal_def.meta)) ? goal_def.meta.description : title;
            local gsid = GSGoal.New(GSCompany.COMPANY_INVALID, GSGoal.GT_OTHER, title, desc);
            if (gsid != GSGoal.GOAL_INVALID) {
                shared_goal.gsgoal_id <- gsid;
            }
        } catch (e) {
            // Ignore if API not available or incompatible
        }
    }

    static function ApplyResultToCompany(company_id, result) {
        if (result == null) return;
        // cash
        if ("cash" in result && result.cash != 0) {
            GSCompany.ChangeBankBalance(company_id, result.cash, GSCompany.EXPENSES_OTHER, 0);
        }
        // score & reputation: placeholders for future integration
    }
}

