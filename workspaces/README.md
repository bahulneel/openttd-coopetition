# Coopetition Workspaces

This directory contains the JavaScript/Node.js tooling for the OpenTTD Coopetition project, organized as npm workspaces for better dependency management and scalability.

## Workspace Structure

### @coopetition/eslint-plugin-openttd-gs
**Purpose**: Custom ESLint plugin for OpenTTD GameScript validation  
**Location**: `eslint-plugin-openttd-gs/`  
**Dependencies**: ESLint core, OpenTTD GS API definitions  
**Usage**: Used by the main project's ESLint configuration

### @coopetition/compile-authoring
**Purpose**: YAML to Squirrel compilation tool  
**Location**: `compile-authoring/`  
**Dependencies**: YAML parser, file system utilities  
**Usage**: `npm run compile` (from project root)

### @coopetition/verify-gs-api
**Purpose**: Validate OpenTTD GS API usage  
**Location**: `verify-gs-api/`  
**Dependencies**: Cheerio, API documentation cache  
**Usage**: `npx @coopetition/verify-gs-api`

### @coopetition/gs-doc-cache
**Purpose**: Cache and manage OpenTTD GS API documentation  
**Location**: `gs-doc-cache/`  
**Dependencies**: HTTP client, file system utilities  
**Usage**: Shared by other tools

### @coopetition/shared
**Purpose**: Common utilities and types  
**Location**: `shared/`  
**Dependencies**: Minimal external dependencies  
**Usage**: Internal dependency for other workspaces

## Development

### Prerequisites
- Node.js 18 or later
- npm (comes with Node.js)

### Setup
```bash
# Install all workspace dependencies
npm install

# Run specific tool
npm run start --workspace=@coopetition/compile-authoring

# Lint all workspaces
npm run lint

# Test all workspaces
npm run test
```

### Adding New Tools

1. Create a new directory in `workspaces/`
2. Add a `package.json` with the `@coopetition/` scope
3. Update root `package.json` scripts if needed
4. Add tool-specific dependencies

### Workspace Commands

From the project root:

```bash
# Lint all workspaces
npm run lint

# Test all workspaces  
npm run test

# Build all workspaces
npm run build

# Run all workspaces in development mode
npm run dev
```

### Individual Workspace Commands

From within a workspace directory:

```bash
# Install dependencies
npm install

# Run the tool
npm start

# Lint the workspace
npm run lint

# Test the workspace
npm test

# Build the workspace
npm run build
```

## Package Distribution

Each workspace can be published independently to npm using the `@coopetition/` scope:

```bash
# Publish a specific workspace
npm publish --workspace=@coopetition/eslint-plugin-openttd-gs

# Publish all workspaces
npm publish --workspaces
```

## Dependencies

### Root Dependencies
- Development tools (ESLint, TypeScript, etc.)
- Build tools (rollup, webpack, etc.)
- Testing frameworks
- Linting tools

### Workspace Dependencies
- Tool-specific dependencies
- Runtime dependencies
- Peer dependencies for plugins

### Shared Dependencies
- Common utilities
- Type definitions
- Configuration files

## Migration from Legacy Tools

The workspaces replace the old `tools/` directory structure:

- `tools/eslint-plugin-openttd-gs/` → `workspaces/eslint-plugin-openttd-gs/`
- `tools/compile-authoring.mjs` → `workspaces/compile-authoring/`
- `tools/verify-gs-api.mjs` → `workspaces/verify-gs-api/`
- `tools/gs-doc-cache.mjs` → `workspaces/gs-doc-cache/`

The old `tools/` directory can be removed once all references are updated.
