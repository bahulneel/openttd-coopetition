Scenario_industrial_hub_scenario <- {
    meta = {
        title = "Industrial Hub Development",
        description = "Develop a major industrial hub with shared infrastructure",
        difficulty = "medium",
        estimated_time = "3-4 hours",
        tags = [
            "industrial",
            "hub",
            "shared",
            "development"
        ],
        requirements = [
            "basic_construction",
            "cargo_handling"
        ],
        prerequisites = [
            "tutorial_scenario"
        ]
    }
        // Comprehensive scenario metadata for organization and filtering,
    defaults = {
        shared = {
            track = true,
            stations = true,
            vehicles = false
        },
        result = {
            cash = 50000,
            score = 5,
            reputation = 2
        }
    }
        // Default values applied to all goals in this scenario,
    goals = [
        {
            id = "player_profit_goal",
            type = "player",
            objective = {
                type = "profit",
                amount = 1000000
            }
                // Track company profit - requires £1M total profit,
            constraints = {
                players = {
                    min = 1,
                    max = 8
                }
            }
                // Can be played with 1-8 players,
            shared = {
                track = false,
                stations = false,
                vehicles = false
            }
                // No shared infrastructure - each company builds independently,
            result = {
                cash = 500000,
                score = 25,
                reputation = 10
            }
                // Reward: £500k cash, 25 score points, +10 reputation,
            meta = {
                title = "Millionaire Challenge",
                description = "Accumulate £1,000,000 in company profit",
                difficulty = "medium",
                estimated_time = "2-3 hours"
            }
                // Metadata for UI display and campaign organization
        }
            // This is a player-level goal that tracks individual company performance.
            // Player goals are personal objectives that each company must achieve independently.
            // This example shows profit tracking with cash rewards and score points.
            // ,
        {
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
            // ,
        {
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
            // 
    ]
}
    // This scenario demonstrates all possible scenario configuration options.
    // Scenarios define collections of goals with shared defaults and constraints.
    // ;
