# OpenTTD Coopetition Game Script

A Game Script (server-side mod) for OpenTTD that manages competitive cooperative gameplay, tracking both shared and personal goals.

## Overview

The Coopetition mod blends cooperation and competition in multiplayer games by:

- **Shared Goals**: Forces players to collaborate on projects (shared lines, hubs, or deliveries)
- **Personal Goals**: Maintains individual competition (profit, efficiency, style, or cargo delivery)
- **Dynamic Tracking**: Keeps both types of goals visible and measurable
- **Flexible**: Adapts to any map size, number of players, and session duration

## Project Structure

```
├── src/                    # Main game script files
│   ├── *.nut              # Core game script files
│   └── authoring/         # Authoring content and campaigns
├── tools/                 # Development tools and utilities
├── docs/                  # Documentation and ADRs
├── .github/               # GitHub workflows and templates
└── package.json           # Node.js project configuration
```

The main game script files are located in the `src/` directory, while development tools, documentation, and configuration files remain at the root level for easy access.

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
2. To keep this mod separate from other mods, create a dedicated subdirectory in your OpenTTD game script directory:
   - Windows: `C:\Users\[Username]\Documents\OpenTTD\game\coopetition`
   - macOS: `~/Documents/OpenTTD/game/coopetition`
   - Linux: `~/.openttd/game/coopetition`
3. Extract all the mod files into this new subdirectory
4. Start OpenTTD and create a new game
5. In the Game Script settings, select "Coopetition"
6. Adjust settings as desired
7. Start the game

### Server-Side Mod

Coopetition is a Game Script, which is a server-side mod in OpenTTD. This means:

- Only the server/host needs to have the mod installed
- When hosting a multiplayer game, clients will automatically download the mod when they connect
- All game logic runs on the server, and the UI elements are synchronized to all connected clients
- Game state is saved with the save game, so the mod's progress is preserved when saving and loading

### Mod Isolation

By installing the mod in its own subdirectory (`coopetition`), you ensure that:

- The mod files won't interfere with other game scripts
- You can easily update or remove the mod without affecting other scripts
- The mod will be properly identified in the Game Script selection menu
- Multiple versions can be maintained by using different subdirectories (e.g., `coopetition-v1`, `coopetition-v2`)

### Packaging for Distribution

If you're developing or modifying the mod, you can use the included packaging scripts to create a distributable zip file:

**On macOS/Linux:**
```bash
./package.sh
```

**On Windows:**
```cmd
package.bat
```

This will create a versioned zip file in the `dist` directory that can be shared with others.

### Automated GitHub Releases

This project includes a GitHub workflow that automatically:

1. Builds and packages the mod when code is pushed to the main branch
2. Creates a new GitHub release with the version number from `src/version.nut`
3. Attaches the packaged zip file to the release for easy downloading
4. Increments the version number and creates a pull request back to the develop branch

To use this feature, simply push your changes to the main branch, and the workflow will handle the release process and version management.

**Note:** For the automated PR creation to work, you need to add a `PAT_TOKEN` secret to your GitHub repository with a Personal Access Token that has permissions to create pull requests.

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

### Multiplayer Compatibility

As a server-side mod, Coopetition is designed specifically for multiplayer games:

- All players see the same shared goals and progress
- Each player can only see their own personal goals
- The leaderboard is visible to all players
- Goal progress updates in real-time for all connected players

## Configuration

The script provides several configuration options:

- **Debug Log Level**: Controls the verbosity of debug messages
- **Shared Goal Reward**: The cash reward for completing shared goals

## Development

### Requirements

- OpenTTD 1.10.0 or later
- Knowledge of the Squirrel programming language

### Contributing

Contributions to the Coopetition mod are welcome! Here's how to contribute:

1. Fork the repository
2. Create a feature branch from the develop branch (`git checkout -b feature/amazing-feature develop`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request to the develop branch

When your changes are merged to the develop branch, they'll be included in the next release.

When changes from develop are merged to the main branch, the GitHub workflow will automatically:

1. Build and package the mod
2. Create a new release with the version number from `src/version.nut`
3. Make the packaged zip file available for download
4. Increment the version number in `src/version.nut`
5. Create a pull request back to the develop branch with the incremented version

### Versioning

Version management is largely automated in this project:

1. When changes are pushed to the main branch, the GitHub workflow creates a release with the current version from `src/version.nut`
2. After the release is created, the workflow automatically increments the version number in `src/version.nut` and creates a pull request to the develop branch
3. When the PR is merged, the develop branch will have the incremented version ready for the next release

For manual version updates (if needed):

1. Modify the `COOPETITION_VERSION` value in `src/version.nut`
2. Commit and push the change to the appropriate branch

### Building

No building is required. The script can be run directly by OpenTTD.

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenTTD team for creating an amazing game
- NoGo API documentation for making Game Script development possible