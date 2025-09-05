Campaign_advanced_mastery <- {
    meta = {
        title = "Advanced Mastery Campaign",
        description = "Master all aspects of transport management in this complex campaign",
        difficulty = "expert",
        estimated_time = "12-16 hours",
        tags = [
            "mastery",
            "advanced",
            "complex",
            "branching"
        ],
        requirements = [
            "expert_planning",
            "multi_player_mastery",
            "efficiency_optimization",
            "complex_networks"
        ],
        prerequisites = [
            "century_of_rails"
        ]
    }
        // Advanced campaign requiring completion of previous campaigns,
    scenarios = [
        {
            include = "industrial_hub_scenario",
            order = 1,
            required = true,
            branch = "main"
        }
            // Main path scenario,
        {
            include = "transport_challenge_scenario",
            order = 2,
            required = false,
            branch = "advanced",
            condition = {
                type = "performance_threshold",
                threshold = 0.9,
                target = "industrial_hub_scenario"
            }
        }
            // Advanced scenario unlocked by high performance
    ]
}
    // This campaign demonstrates advanced features like branching paths,
    // conditional scenarios, and complex reward systems.
    // ;
