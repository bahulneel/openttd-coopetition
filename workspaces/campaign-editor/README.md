# OpenTTD Coopetition Campaign Editor

A modern web-based authoring tool for creating and editing OpenTTD Coopetition campaigns, goals, and scenarios.

## Features

- 🎯 **Campaign Management**: Create, edit, and organize campaigns with a modern UI
- 📋 **Goal Editor**: Design individual goals with validation and real-time feedback
- 🗺️ **Scenario Builder**: Compose scenarios from multiple goals with dependencies
- 💾 **Dual Mode Operation**: Works with local file system or as a browser-only SPA
- 📦 **Import/Export**: Import from ZIP files and export campaigns for distribution
- 🎨 **Modern UI**: Built with Nuxt 4, Tailwind 4, and shadcn-vue components
- 🔍 **Search & Filter**: Find campaigns quickly with powerful search and filtering
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Quick Start

### Development Mode (with File System Access)

```bash
# From project root
npm run dev:editor

# Or directly in the workspace
cd workspaces/campaign-editor
npm run dev
```

This mode provides:
- Full access to the `campaigns/` folder
- Real-time file synchronization
- Server-side API endpoints
- Hot reload for campaign files

### SPA Mode (Browser Only)

```bash
# Build for SPA mode
npm run build:editor:spa

# Preview the build
npm run preview
```

This mode provides:
- Browser-only operation
- localStorage persistence
- Import/export via ZIP files
- No server required

### Docker Deployment

```bash
# Build Docker image
npm run docker:build

# Run container
npm run docker:run

# Or use docker-compose for development
npm run docker:dev
```

## Deployment Options

### 1. GitHub Pages (Automatic)

The campaign editor is automatically deployed to GitHub Pages when you push to the main branch. The SPA version will be available at:

```
https://[username].github.io/openttd-coopetition/
```

### 2. Local Docker

```bash
# Using docker-compose
cd workspaces/campaign-editor
docker-compose up

# Access at http://localhost:3000
```

### 3. Development Server

```bash
# From project root
npm run dev:editor

# Access at http://localhost:3000
```

## Usage Guide

### Creating a Campaign

1. Navigate to the Campaigns section
2. Click "New Campaign"
3. Fill in the basic information:
   - **ID**: Unique identifier for the campaign
   - **Title**: Display name for the campaign
   - **Description**: Brief description of what the campaign involves
   - **Difficulty**: Easy, Medium, Hard, Expert, or Legendary
   - **Tags**: Keywords to help categorize the campaign

4. Configure scenarios and goals
5. Set constraints (player count, date range, etc.)
6. Define rewards and progression rules
7. Save the campaign

### Working with Goals

Goals are the building blocks of scenarios. Each goal defines:

- **Objective**: What players need to accomplish (profit, cargo delivery, etc.)
- **Constraints**: When and how the goal can be played
- **Rewards**: What players receive for completion
- **Sharing Rules**: Whether infrastructure can be shared

### Building Scenarios

Scenarios combine multiple goals into a cohesive experience:

1. Select goals to include
2. Define the order and dependencies
3. Set scenario-wide constraints
4. Configure conditional rewards
5. Test the flow and balance

### Import/Export

#### Importing Campaigns

1. Click the import button in the header
2. Select a ZIP file containing campaign YAML files
3. The editor will parse and load all campaigns, goals, and scenarios

#### Exporting Campaigns

1. Click the export button to download all data as a ZIP file
2. Individual campaigns can be exported from their detail pages
3. The ZIP file is compatible with the OpenTTD Coopetition GameScript

## File Structure

When working with the file system (development mode), the editor reads and writes to:

```
campaigns/
├── quickstart/
│   ├── manifest.yaml           # Campaign pack metadata
│   ├── campaign1.yaml          # Campaign definitions
│   ├── campaign2.yaml
│   ├── goals/
│   │   ├── goal1.yaml          # Individual goal definitions
│   │   └── goal2.yaml
│   └── scenarios/
│       ├── scenario1.yaml      # Scenario definitions
│       └── scenario2.yaml
```

## Data Validation

The editor includes comprehensive validation:

- **Schema Validation**: Ensures YAML structure is correct
- **Reference Validation**: Checks that goal and scenario references are valid
- **Constraint Validation**: Verifies logical consistency (e.g., min ≤ max)
- **Real-time Feedback**: Shows validation errors as you type

## API Reference

### Development Mode Endpoints

The editor provides REST API endpoints when running in development mode:

- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create/update a campaign
- `DELETE /api/campaigns/[id]` - Delete a campaign
- `GET /api/goals` - List all goals
- `POST /api/goals` - Create/update a goal
- `DELETE /api/goals/[id]` - Delete a goal
- `GET /api/scenarios` - List all scenarios
- `POST /api/scenarios` - Create/update a scenario
- `DELETE /api/scenarios/[id]` - Delete a scenario
- `GET /api/manifest` - Get campaign pack manifest
- `POST /api/manifest` - Update manifest
- `GET /api/export` - Export all data as ZIP

## Configuration

### Environment Variables

- `NUXT_SPA_MODE` - Set to `true` for browser-only mode
- `NUXT_BASE_URL` - Base URL for deployment (e.g., `/openttd-coopetition/`)
- `NODE_ENV` - `development` or `production`

### Runtime Configuration

The app automatically detects its mode and configures itself accordingly:
- **Development**: Full file system access via server API
- **SPA**: Browser-only with localStorage persistence

## Troubleshooting

### Common Issues

**"Failed to load campaigns"**
- In development mode, ensure you're running from the correct directory
- Check that the `campaigns/` folder exists and is readable

**"Storage quota exceeded" (SPA mode)**
- Browser localStorage has limits (usually 5-10MB)
- Use the export function to back up data, then clear browser data

**Docker container won't start**
- Ensure port 3000 is not already in use
- Check Docker logs: `docker logs [container-id]`

### Performance

- The editor is optimized for up to 100 campaigns
- Large campaigns (50+ scenarios) may have slower load times
- Use search and filtering to improve performance with large datasets

## Contributing

See the main project README for contribution guidelines. The campaign editor follows the same patterns as other workspaces in the monorepo.

## License

MIT License - see the main project LICENSE file.