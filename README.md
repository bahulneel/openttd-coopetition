# OpenTTD Coopetition Game Script

A Game Script for OpenTTD that manages competitive cooperative gameplay, tracking both shared and personal goals.

## Overview

The Coopetition mod blends cooperation and competition in multiplayer games by:

- **Shared Goals**: Forces players to collaborate on projects (shared lines, hubs, or deliveries)
- **Personal Goals**: Maintains individual competition (profit, efficiency, style, or cargo delivery)
- **Dynamic Tracking**: Keeps both types of goals visible and measurable
- **Flexible**: Adapts to any map size, number of players, and session duration

## Features

### Shared Goal Management

- Players register for shared objectives (e.g., "Move 1,000 passengers between City A and City B")
- The script tracks progress in real-time across all companies
- Completion triggers rewards or milestones (cash bonus, prestige points, or unlocks)
- Tiered completion (bronze/silver/gold depending on contribution)

### Personal Goal Management

Each player gets custom objectives alongside the shared goal, such as:

- Profit milestones (£1m by 1970)
- Most efficient route (passengers per train/town)
- Design metrics (most platforms at a hub, shortest route to town)

Goals are tracked independently, allowing head-to-head comparison without blocking cooperation.

### Coopetition Hooks

- **Shared infrastructure access**: Mod tracks who is using whose network
- **Traffic & resource balancing**: Encourages collaboration while preserving competition
- **Conflict alerts**: Optional notifications if one player dominates a shared goal

### Progress Feedback

- **In-game dashboard / pop-ups**: Shows progress on shared vs personal goals
- **Color-coded metrics**: Green = good contribution to shared goal; yellow = personal lead; red = falling behind
- **Session summaries**: At the end of a weekly session, it prints contributions and rankings

### Campaign Scheduling

Predefine weekly objectives and script progression:

- Week 1: Single town / shared station
- Week 2: Shared trunk line
- Week 3: Intersecting networks
- Week 4: Full coop corridor

## Installation

1. Download the latest release from the [GitHub repository](https://github.com/bahulneel/openttd-coopetition)
2. Extract the files to your OpenTTD game script directory:
   - Windows: `C:\Users\[Username]\Documents\OpenTTD\game`
   - macOS: `~/Documents/OpenTTD/game`
   - Linux: `~/.openttd/game`
3. Start OpenTTD and create a new game
4. In the Game Script settings, select "Coopetition"
5. Adjust settings as desired
6. Start the game

## Usage

### Starting a Campaign

When the game starts, the script will automatically initialize the first week of the campaign with shared and personal goals for all companies.

### Viewing Goals

- **Shared Goals**: Visible to all players in the Shared Goals window
- **Personal Goals**: Each player can see their own goals in the Personal Goals window

### Completing Goals

- As you play, the script will automatically track progress towards both shared and personal goals
- When a goal is completed, a news message will be displayed and rewards will be distributed

### Weekly Progression

- The campaign will automatically progress to the next week when:
  - All shared goals are completed AND at least one company has completed all personal goals, OR
  - A week has passed in game time (28 days)
- At the end of each week, a summary will be displayed showing progress and contributions

## Configuration

The script provides several configuration options:

- **Debug Log Level**: Controls the verbosity of debug messages
- **Shared Goal Reward**: The cash reward for completing shared goals

## Development

### Requirements

- OpenTTD 1.10.0 or later
- Knowledge of the Squirrel programming language

### Building

No building is required. The script can be run directly by OpenTTD.

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenTTD team for creating an amazing game
- NoGo API documentation for making Game Script development possible