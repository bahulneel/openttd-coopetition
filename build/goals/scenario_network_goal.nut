Goal_scenario_network_goal <- {
    id = "scenario_network_goal",
    type = "scenario",
    objective = {
        type = "network_length",
        amount = 500,
        track_type = "rail"
    }
        // Build 500 tiles of rail network,
    constraints = {
        players = {
            min = 3,
            max = 6
        },
        date = {
            min = 1960,
            max = 1980
        },
        map_size = {
            min = 256,
            max = 512
        }
    }
        // 3-6 players, 1960-1980 timeframe, medium to large maps,
    shared = {
        track = true,
        stations = true,
        vehicles = true,
        depots = true
    }
        // Full sharing - players can use all shared infrastructure,
    result = {
        cash = 1000000,
        score = 50,
        reputation = 20,
        unlock = "advanced_signals",
        bonus = {
            type = "percentage",
            amount = 10,
            target = "profit"
        }
    }
        // Major rewards including cash bonus and technology unlock,
    meta = {
        title = "Rail Network Masterpiece",
        description = "Collaborate to build an extensive rail network across the map",
        difficulty = "expert",
        estimated_time = "4-6 hours",
        tags = [
            "network",
            "collaboration",
            "rail",
            "large_scale"
        ],
        requirements = [
            "basic_rail_construction",
            "signal_engineering"
        ]
    }
        // Complex scenario requiring specific technologies and skills
}
    // Scenario goals are shared objectives that all players work together to achieve.
    // This example shows network length tracking with complex constraints.
    // ;
