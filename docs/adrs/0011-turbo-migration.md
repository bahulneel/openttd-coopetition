# ADR-0011: Migration from npm workspaces to Turbo

## Status
Accepted

## Context
The project currently uses npm workspaces with `npm run --workspaces` commands to manage the monorepo. While this works, it has limitations in terms of:

- **Performance**: Sequential execution of tasks across workspaces
- **Caching**: No intelligent caching of build artifacts
- **Dependency Management**: Limited dependency-aware task execution
- **Parallelization**: Limited parallel execution capabilities

## Decision
We will migrate from npm workspaces commands to Turbo for monorepo task management.

### Changes Made

1. **Added Turbo as dev dependency** in root `package.json`
2. **Created `turbo.json` configuration** with task definitions
3. **Updated all workspace-related scripts** to use Turbo commands:
   - `lint:workspaces` → `turbo run lint`
   - `lint:workspaces:fix` → `turbo run lint:fix`
   - `build:workspaces` → `turbo run build`
   - `test:workspaces` → `turbo run test`
   - `dev:workspaces` → `turbo run start`
   - `dev:editor` → `turbo run dev --filter=@coopetition/campaign-editor`
   - `build:editor` → `turbo run build --filter=@coopetition/campaign-editor`
   - `build:editor:spa` → `NUXT_SPA_MODE=true turbo run generate --filter=@coopetition/campaign-editor`

4. **Added `packageManager` field** to root `package.json` for Turbo compatibility

### Turbo Configuration

The `turbo.json` defines the following task pipeline:

- **build**: Depends on `^build`, outputs build artifacts
- **dev**: Persistent task, no caching
- **start**: Persistent task, no caching  
- **lint**: Depends on `^build`, no outputs
- **lint:fix**: Depends on `^build`, no outputs
- **test**: Depends on `^build`, no outputs
- **typecheck**: Depends on `^build`, no outputs
- **generate**: Depends on `^build`, outputs generated files
- **preview**: Depends on `build`, persistent task

## Consequences

### Positive
- **Better Performance**: Parallel execution of tasks across workspaces
- **Intelligent Caching**: Turbo caches task outputs and skips unchanged tasks
- **Dependency Awareness**: Tasks run in correct order based on dependencies
- **Better Developer Experience**: Faster builds and more reliable task execution
- **Remote Caching**: Potential for distributed caching in CI/CD environments

### Negative
- **Additional Dependency**: Turbo adds ~2MB to node_modules
- **Learning Curve**: Team needs to understand Turbo concepts and commands
- **Configuration Complexity**: Additional `turbo.json` file to maintain

### Neutral
- **Backward Compatibility**: All existing npm scripts continue to work
- **Workspace Structure**: No changes to existing workspace structure
- **Package Management**: Still using npm for package management

## Implementation Notes

- All existing scripts maintain the same interface
- Turbo automatically detects and runs tasks in all workspaces
- Filtering is available for workspace-specific commands using `--filter` flag
- Caching is enabled by default and can be configured per task
- Task dependencies are automatically resolved based on workspace dependencies

## Migration Verification

The migration was verified by:
1. Installing Turbo and running dry-run commands
2. Testing workspace-wide commands (`lint:workspaces`, `build:workspaces`)
3. Testing filtered commands (`dev:editor`, `build:editor`)
4. Confirming parallel execution and caching behavior

All commands work as expected with improved performance characteristics.
