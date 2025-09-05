/*
 * Coopetition constraint evaluation helpers
 */

class ConstraintEvaluator {
    static function _GetActiveCompanyCount() {
        local count = 0;
        local companies = GSCompanyList();
        foreach (company_id, _ in companies) {
            if (GSCompany.ResolveCompanyID(company_id) != GSCompany.COMPANY_INVALID) count++;
        }
        return count;
    }

    static function _Year() {
        return GSDate.GetYear(GSDate.GetCurrentDate());
    }

    static function Evaluate(constraints) {
        if (constraints == null) return true;

        // players
        if ("players" in constraints && constraints.players != null) {
            local min_players = ("min" in constraints.players) ? constraints.players.min : null;
            local max_players = ("max" in constraints.players) ? constraints.players.max : null;
            local active = ConstraintEvaluator._GetActiveCompanyCount();
            if (min_players != null && active < min_players) return false;
            if (max_players != null && active > max_players) return false;
        }

        // date
        if ("date" in constraints && constraints.date != null) {
            local after_year = ("after" in constraints.date) ? constraints.date.after : null;
            local before_year = ("before" in constraints.date) ? constraints.date.before : null;
            local y = ConstraintEvaluator._Year();
            if (after_year != null && y < after_year) return false;
            if (before_year != null && y > before_year) return false;
        }

        // companies.must_share is advisory at evaluation time
        return true;
    }
}

