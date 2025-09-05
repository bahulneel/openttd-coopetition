Goal_player_profit_goal <- {
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
        stations = false
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
    // ;
