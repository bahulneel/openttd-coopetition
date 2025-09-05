Campaign_century_of_rails <- {
    meta = {
        title = "Century of Rails",
        description = "A comprehensive rail development campaign spanning decades",
        difficulty = "medium",
        estimated_time = "8-12 hours",
        tags = [
            "rail",
            "century",
            "comprehensive",
            "progression"
        ],
        requirements = [
            "basic_rail_construction",
            "multi_player_coordination"
        ],
        prerequisites = [
            "tutorial_campaign"
        ]
    }
        // Comprehensive campaign metadata,
    scenarios = [
        {
            include = "industrial_hub_scenario",
            order = 1,
            required = true
        }
            // First scenario - required for progression,
        {
            include = "transport_challenge_scenario",
            order = 2,
            required = false
        }
            // Second scenario - optional advanced challenge
    ]
}
    // This campaign demonstrates all possible campaign configuration options.
    // Campaigns are collections of scenarios that form a cohesive experience.
    // ;
