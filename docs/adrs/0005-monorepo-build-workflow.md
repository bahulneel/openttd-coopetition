# ADR-0005: Monorepo Build Workflow Strategy

## Status
Accepted

## Context

The OpenTTD Coopetition project has evolved significantly from a simple GameScript mod into a comprehensive development ecosystem with multiple components:

1. **GameScript Mod** (`src/`): Core OpenTTD GameScript files (Squirrel/Nut)
2. **Campaign Content** (`campaigns/`): YAML-based campaign definitions that compile to `.nut` files
3. **Build Tools** (`tools/`): Node.js-based compilation, linting, and verification utilities
4. **Documentation** (`docs/`): ADRs and project documentation
5. **Packaging** (`dist/`): Distribution artifacts for different deployment targets

The current build workflow (`.github/workflows/build.yml`) is designed for a simple mod distribution model and doesn't account for:
- Multiple build targets (mod, content, tools)
- Dependency management between components
- Quality gates for different artifact types
- Parallel build optimization
- Content validation and compilation

## Decision

We will redesign the build workflow as a monorepo with distinct but coordinated build processes for each component:

### Build Matrix Strategy

```yaml
strategy:
  matrix:
    component: [mod, content, tools, docs]
    include:
      - component: mod
        build_type: package
        artifacts: [coopetition-v*.zip]
      - component: content
        build_type: compile
        artifacts: [build/goals/*.nut, build/scenarios/*.nut, build/campaigns/*.nut]
      - component: tools
        build_type: test
        artifacts: [tools/]
      - component: docs
        build_type: validate
        artifacts: [docs/]
```

### Component-Specific Build Processes

#### 1. Mod Component
- **Purpose**: Package the core GameScript for OpenTTD
- **Inputs**: `src/*.nut`, `LICENSE`, `README.md`
- **Process**: 
  - Lint GameScript files using custom ESLint plugin
  - Validate OpenTTD GS API usage
  - Package into versioned zip file
- **Outputs**: `dist/coopetition-v{version}.zip`

#### 2. Content Component
- **Purpose**: Compile YAML campaign definitions to GameScript-compatible `.nut` files
- **Inputs**: `campaigns/**/*.yaml`
- **Process**:
  - Validate YAML syntax and schema
  - Compile goals, scenarios, and campaigns
  - Generate index files for GameScript consumption
- **Outputs**: `build/goals/*.nut`, `build/scenarios/*.nut`, `build/campaigns/*.nut`, `build/index.nut`

#### 3. Tools Component
- **Purpose**: Validate and test development tools
- **Inputs**: `tools/**/*.mjs`, `package.json`
- **Process**:
  - Run ESLint on tool files
  - Execute unit tests (if any)
  - Validate tool dependencies
- **Outputs**: Tool validation reports

#### 4. Docs Component
- **Purpose**: Validate documentation and ADRs
- **Inputs**: `docs/**/*.md`
- **Process**:
  - Validate markdown syntax
  - Check ADR format compliance
  - Verify internal links
- **Outputs**: Documentation validation reports

### Workflow Phases

#### Phase 1: Preparation
- Checkout code
- Setup Node.js environment
- Install dependencies
- Extract version information

#### Phase 2: Quality Gates (Parallel)
- Lint all source files
- Run tests and validations
- Check API usage compliance
- Validate content schemas

#### Phase 3: Build (Parallel)
- Compile campaign content
- Package GameScript mod
- Build documentation artifacts
- Validate tool functionality

#### Phase 4: Integration
- Combine all artifacts
- Run integration tests
- Generate final distribution packages

#### Phase 5: Release
- Create GitHub release
- Upload artifacts
- Update version numbers
- Create PR back to develop

### Artifact Management

#### Primary Artifacts
- `coopetition-v{version}.zip`: Complete mod package
- `coopetition-content-v{version}.zip`: Campaign content only
- `coopetition-tools-v{version}.zip`: Development tools

#### Build Artifacts
- `build/`: Compiled content files
- `dist/`: Distribution packages
- `reports/`: Quality gate reports

### Quality Gates

#### Pre-Build Validation
- ESLint passes for all source files
- YAML syntax validation
- OpenTTD GS API usage verification
- Dependency security scan

#### Post-Build Validation
- Package integrity verification
- Content compilation validation
- Integration test execution
- Documentation link validation

## Consequences

### Positive
- **Scalability**: Easy to add new components or build targets
- **Parallelization**: Faster builds through parallel execution
- **Quality**: Comprehensive validation at each stage
- **Maintainability**: Clear separation of concerns
- **Flexibility**: Independent versioning and release cycles for components

### Negative
- **Complexity**: More complex workflow configuration
- **Resource Usage**: Higher CI/CD resource consumption
- **Debugging**: More complex failure diagnosis
- **Maintenance**: More components to maintain and update

### Risks
- **Build Time**: Potential increase in total build time
- **Dependencies**: Complex dependency management between components
- **Failure Points**: More potential failure points in the pipeline

### Mitigation Strategies
- Use build caching to reduce redundant work
- Implement comprehensive logging and error reporting
- Create clear documentation for each build component
- Use matrix builds to parallelize where possible
- Implement rollback strategies for failed releases

## Implementation Plan

1. **Phase 1**: Create new workflow structure with matrix builds
2. **Phase 2**: Implement component-specific build processes
3. **Phase 3**: Add quality gates and validation
4. **Phase 4**: Optimize for performance and reliability
5. **Phase 5**: Document and train team on new workflow

## References

- [GitHub Actions Matrix Strategy](https://docs.github.com/en/actions/using-jobs/using-a-matrix-strategy-for-jobs)
- [OpenTTD GameScript API Documentation](https://docs.openttd.org/gs-api/)
- [ESLint Plugin Development](https://eslint.org/docs/developer-guide/working-with-plugins)
- [Monorepo Best Practices](https://monorepo.tools/)
