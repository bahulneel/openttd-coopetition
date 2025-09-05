# ADR-0006: NPM Workspaces Structure for JavaScript Tooling

## Status
Accepted

## Context

The OpenTTD Coopetition project has evolved to include multiple JavaScript/Node.js tools:

1. **ESLint Plugin** (`tools/eslint-plugin-openttd-gs/`): Custom ESLint plugin for OpenTTD GameScript validation
2. **Compilation Tools** (`tools/compile-authoring.mjs`): YAML to Squirrel compilation
3. **API Verification** (`tools/verify-gs-api.mjs`): OpenTTD GS API usage validation
4. **Documentation Cache** (`tools/gs-doc-cache.mjs`): API documentation caching

The current structure has all tools in a single `tools/` directory with a single `package.json` at the root. As we plan to add more JavaScript tools, this approach will become unwieldy for:

- **Dependency Management**: Different tools may need different dependencies
- **Version Control**: Tools may have different release cycles
- **Testing**: Individual tools need isolated test environments
- **Development**: Tools need independent development workflows
- **Plugin Distribution**: The ESLint plugin should be distributable independently

## Decision

We will restructure the project to use npm workspaces with the following organization:

```
openttd-coopetition/
├── package.json                    # Root workspace configuration
├── workspaces/                     # JavaScript tooling workspace
│   ├── eslint-plugin-openttd-gs/  # ESLint plugin package
│   ├── compile-authoring/         # YAML compilation tool
│   ├── verify-gs-api/            # API verification tool
│   ├── gs-doc-cache/             # Documentation caching tool
│   └── shared/                    # Shared utilities and types
├── src/                          # GameScript source (unchanged)
├── campaigns/                     # Campaign content (unchanged)
├── docs/                         # Documentation (unchanged)
└── tools/                        # Legacy tools (to be migrated)
```

### Workspace Structure

#### Root Package (`package.json`)
- Defines workspace configuration
- Manages shared dependencies
- Provides root-level scripts for all workspaces
- Handles cross-workspace operations

#### ESLint Plugin (`workspaces/eslint-plugin-openttd-gs/`)
- **Purpose**: Custom ESLint plugin for OpenTTD GameScript
- **Dependencies**: ESLint core, OpenTTD GS API definitions
- **Exports**: Plugin rules and configuration
- **Distribution**: NPM package for external use

#### Compilation Tool (`workspaces/compile-authoring/`)
- **Purpose**: YAML to Squirrel compilation
- **Dependencies**: YAML parser, file system utilities
- **Exports**: CLI tool and programmatic API
- **Usage**: `npx @coopetition/compile-authoring`

#### API Verification (`workspaces/verify-gs-api/`)
- **Purpose**: Validate OpenTTD GS API usage
- **Dependencies**: Cheerio, API documentation cache
- **Exports**: CLI tool and validation functions
- **Usage**: `npx @coopetition/verify-gs-api`

#### Documentation Cache (`workspaces/gs-doc-cache/`)
- **Purpose**: Cache and manage OpenTTD GS API documentation
- **Dependencies**: HTTP client, file system utilities
- **Exports**: Cache management functions
- **Usage**: Shared by other tools

#### Shared Utilities (`workspaces/shared/`)
- **Purpose**: Common utilities and types
- **Dependencies**: Minimal external dependencies
- **Exports**: Shared functions, types, constants
- **Usage**: Internal dependency for other workspaces

### Package Naming Convention

All workspace packages will use the `@coopetition/` scope:
- `@coopetition/eslint-plugin-openttd-gs`
- `@coopetition/compile-authoring`
- `@coopetition/verify-gs-api`
- `@coopetition/gs-doc-cache`
- `@coopetition/shared`

### Dependency Management

#### Root Dependencies
- Development tools (ESLint, TypeScript, etc.)
- Build tools (rollup, webpack, etc.)
- Testing frameworks
- Linting tools

#### Workspace Dependencies
- Tool-specific dependencies
- Runtime dependencies
- Peer dependencies for plugins

#### Shared Dependencies
- Common utilities
- Type definitions
- Configuration files

### Build and Development Workflow

#### Development
```bash
# Install all workspace dependencies
npm install

# Run specific tool
npm run dev --workspace=@coopetition/compile-authoring

# Run all tools in watch mode
npm run dev:all

# Lint all workspaces
npm run lint:all
```

#### Building
```bash
# Build all workspaces
npm run build:all

# Build specific workspace
npm run build --workspace=@coopetition/eslint-plugin-openttd-gs

# Package for distribution
npm run package:all
```

#### Testing
```bash
# Test all workspaces
npm run test:all

# Test specific workspace
npm run test --workspace=@coopetition/verify-gs-api
```

### Migration Strategy

#### Phase 1: Setup Workspace Structure
1. Create `workspaces/` directory
2. Move existing tools to appropriate workspaces
3. Create individual `package.json` files
4. Update root `package.json` with workspace configuration

#### Phase 2: Migrate Tools
1. Move `tools/eslint-plugin-openttd-gs/` to `workspaces/eslint-plugin-openttd-gs/`
2. Move `tools/compile-authoring.mjs` to `workspaces/compile-authoring/`
3. Move `tools/verify-gs-api.mjs` to `workspaces/verify-gs-api/`
4. Move `tools/gs-doc-cache.mjs` to `workspaces/gs-doc-cache/`

#### Phase 3: Create Shared Package
1. Extract common utilities to `workspaces/shared/`
2. Update all workspaces to use shared package
3. Remove duplicate code

#### Phase 4: Update Build System
1. Update GitHub Actions workflow
2. Update package scripts
3. Update documentation

#### Phase 5: Cleanup
1. Remove old `tools/` directory
2. Update import paths
3. Update documentation

## Consequences

### Positive
- **Scalability**: Easy to add new tools as separate packages
- **Dependency Management**: Isolated dependencies per tool
- **Testing**: Independent test environments
- **Distribution**: Tools can be published independently
- **Development**: Parallel development of tools
- **Maintenance**: Clear separation of concerns

### Negative
- **Complexity**: More complex project structure
- **Setup**: More initial configuration required
- **Learning Curve**: Team needs to understand workspaces
- **Migration**: Significant refactoring required

### Risks
- **Dependency Conflicts**: Potential version conflicts between workspaces
- **Build Complexity**: More complex build and CI/CD processes
- **Maintenance Overhead**: More packages to maintain

### Mitigation Strategies
- Use consistent dependency versions across workspaces
- Implement comprehensive testing for all workspaces
- Create clear documentation for workspace management
- Use automated tools for dependency management
- Implement proper CI/CD for workspace validation

## Implementation Plan

1. **Phase 1**: Create workspace structure and migrate ESLint plugin
2. **Phase 2**: Migrate remaining tools to workspaces
3. **Phase 3**: Create shared utilities package
4. **Phase 4**: Update build system and CI/CD
5. **Phase 5**: Cleanup and documentation

## References

- [NPM Workspaces Documentation](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [Monorepo Best Practices](https://monorepo.tools/)
- [ESLint Plugin Development](https://eslint.org/docs/developer-guide/working-with-plugins)
- [NPM Package Scoping](https://docs.npmjs.com/cli/v7/using-npm/scope)
