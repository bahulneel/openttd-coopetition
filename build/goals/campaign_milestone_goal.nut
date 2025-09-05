Goal_campaign_milestone_goal <- {
    id = "campaign_milestone_goal",
    type = "campaign",
    objective = {
        type = "cargo_delivered",
        cargo = "all",
        amount = 10000,
        cargo_types = [
            "COAL",
            "IRON_ORE",
            "STEEL",
            "PASSENGERS"
        ]
    }
        // Deliver 10,000 units total across all major cargo types,
    constraints = {
        players = {
            min = 4,
            max = 8
        },
        date = {
            min = 1950,
            max = 2000
        },
        map_size = {
            min = 512
        }
    }
        // Large multiplayer campaign with long timeframe,
    shared = {
        track = true,
        stations = true,
        vehicles = false,
        depots = false
    }
        // Partial sharing - infrastructure only, not vehicles,
    result = {
        cash = 5000000,
        score = 100,
        reputation = 50,
        unlock = "mega_stations",
        bonus = {
            type = "multiplier",
            amount = 1.5,
            target = "score"
        },
        achievement = "cargo_master"
    }
        // Massive rewards including achievement and score multiplier,
    meta = {
        title = "Cargo Empire",
        description = "Build a comprehensive cargo delivery network across all industries",
        difficulty = "legendary",
        estimated_time = "6-8 hours",
        tags = [
            "cargo",
            "empire",
            "multi_industry",
            "long_term"
        ],
        requirements = [
            "advanced_vehicles",
            "complex_networks",
            "multi_industry_planning"
        ],
        prerequisites = [
            "scenario_network_goal"
        ]
    }
        // Ultimate campaign goal requiring completion of previous scenarios
}
    // Campaign goals are overarching objectives that span multiple scenarios.
    // This example shows cargo delivery across multiple cargo types.
    // ;
