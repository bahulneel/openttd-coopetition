# ADR-0007: Fix Release Branch Workflow for PR Creation

## Status
Accepted

## Context
The GitHub Actions workflow in `.github/workflows/build.yml` was failing to create pull requests because it was creating release branches from the `main` branch instead of the `develop` branch. This caused issues when trying to create PRs from the release branch back to `develop`, as the branches had diverged.

## Decision
We will modify the workflow to:

1. **Create release branches from `develop`**: Before making any changes, the workflow will checkout the `develop` branch and create the release branch from it
2. **Make version increment changes on the release branch**: All changes (version increment, builds, etc.) will happen on the release branch
3. **Create PR from release branch to develop**: The PR will be created from the release branch back to `develop` where it originated
4. **Prevent duplicate version increments**: Detect when the only change is a version bump (likely from merging develop back to main) and skip the version increment in that case

## Consequences

### Positive
- **Cleaner git history**: Release branches are created from the correct base branch (`develop`)
- **Successful PR creation**: PRs can be created without conflicts since the release branch is based on `develop`
- **Better workflow**: The workflow now follows the proper git flow pattern
- **Easier code review**: Changes are isolated in feature branches that can be easily reviewed
- **Prevents duplicate version increments**: Avoids double version bumps when merging develop back to main
- **Efficient CI/CD**: Skips unnecessary builds and releases when only version bumps are involved

### Negative
- **Slightly more complex workflow**: The workflow now has an additional step to checkout `develop` before creating the release branch
- **Requires develop branch to exist**: The workflow assumes a `develop` branch exists in the repository

## Implementation Details

### Changes Made
1. **Modified `increment-version` job**:
   - Added step to checkout `develop` branch first
   - Create release branch from `develop` instead of `main`
   - Added version bump detection logic to prevent duplicate increments
   - Updated step names and descriptions for clarity

2. **Updated `create-pr` job**:
   - Added `ref` parameter to checkout the release branch
   - Replaced `peter-evans/create-pull-request` action with GitHub CLI (`gh pr create`)
   - This creates a PR from the existing release branch to develop without trying to modify the branch

3. **Added conditional execution**:
   - All subsequent jobs (quality-gates, build-components, integration, create-pr) now skip execution when only a version bump is detected
   - This prevents unnecessary builds and releases when merging develop back to main

### Workflow Flow
```
main push → detect changes → 
  if only version.nut changed:
    skip increment → skip all subsequent jobs
  else:
    checkout develop → create release branch → increment version → 
    build & test → create release → create PR (release → develop)
```

## Alternatives Considered

### Alternative 1: Keep current approach with merge conflicts
- **Rejected**: Would require manual intervention to resolve conflicts
- **Reason**: Not suitable for automated workflows

### Alternative 2: Create PR from main to develop
- **Rejected**: Would mix release changes with main branch changes
- **Reason**: Violates separation of concerns and git flow principles

### Alternative 3: Use different PR creation action
- **Rejected**: Current action works fine with correct parameters
- **Reason**: No need to introduce additional dependencies

### Alternative 4: Use GitHub CLI instead of peter-evans/create-pull-request
- **Accepted**: GitHub CLI is more straightforward for creating PRs from existing branches
- **Reason**: The peter-evans action is designed to make changes and create PRs, but we already have the changes on the release branch

## References
- [GitHub Actions Workflow File](.github/workflows/build.yml)
- [Peter Evans Create Pull Request Action](https://github.com/peter-evans/create-pull-request)
