Goal_company_efficiency_goal <- {
    id = "company_efficiency_goal",
    type = "company",
    objective = {
        type = "cargo_delivered",
        cargo = "PASSENGERS",
        amount = 1000,
        time_limit = 365
    }
        // Deliver 1000 passengers within 365 days,
    constraints = {
        players = {
            min = 2,
            max = 4
        },
        date = {
            min = 1950,
            max = 2000
        }
    }
        // 2-4 players, must be completed between 1950-2000,
    shared = {
        track = true,
        stations = true,
        vehicles = false
    }
        // Players can share tracks and stations, but not vehicles,
    result = {
        cash = 200000,
        score = 15,
        reputation = 5,
        unlock = "high_speed_trains"
    }
        // Reward includes cash, score, reputation, and unlocks new technology,
    meta = {
        title = "Efficient Passenger Service",
        description = "Deliver 1000 passengers efficiently using shared infrastructure",
        difficulty = "hard",
        estimated_time = "3-4 hours",
        tags = [
            "efficiency",
            "passengers",
            "shared"
        ]
    }
        // Comprehensive metadata for filtering and organization
}
    // Company goals track performance metrics across the entire company.
    // This example shows cargo delivery efficiency with time constraints.
    // ;
