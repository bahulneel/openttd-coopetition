# Campaign Editor Testing

This directory contains comprehensive tests for the Campaign Editor application, focusing on browser testing for persistence properties and UI features.

## Test Structure

```
test/
├── unit/                    # Unit tests
│   ├── adapters/           # File system adapter tests
│   ├── composables/        # Composable function tests
│   ├── stores/             # Pinia store tests
│   ├── components/         # Vue component tests
│   └── utils/              # Utility function tests
├── e2e/                    # End-to-end tests
├── utils/                  # Test utilities and helpers
├── setup.ts               # Test setup configuration
└── README.md              # This file
```

## Test Categories

### 1. Persistence Adapter Tests

Tests for both browser and filesystem adapters:

- **InMemFileSystemAdapter**: Tests localStorage persistence, CRUD operations, ZIP import/export
- **BrowserFSFileSystemAdapter**: Tests IndexedDB persistence, directory management, file operations

Key test areas:
- Data persistence across browser sessions
- Error handling for storage failures
- ZIP import/export functionality
- Pattern-based entity loading

### 2. In-Memory Store Tests

Tests for the Pinia entity store:

- Entity CRUD operations (create, read, update, delete)
- Manifest management
- Entity copying and retraction
- Type-based entity selection
- Store state management

### 3. UI Feature Tests

Tests for main UI components using in-memory store:

- Dashboard component rendering
- Stats display and updates
- Navigation functionality
- Quick actions
- Data loading and refresh

### 4. End-to-End Tests

Browser automation tests using Playwright:

- Full user workflows
- Cross-browser compatibility
- Persistence verification
- UI interaction testing

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run all tests
npm run test:all
```

## Test Configuration

### Vitest Configuration

- **Environment**: jsdom (for DOM testing)
- **Setup**: `test/setup.ts` (mocks and global configuration)
- **Coverage**: v8 provider with 80% thresholds
- **Aliases**: `~` and `@` point to `app/` directory

### Playwright Configuration

- **Browsers**: Chromium, Firefox, WebKit
- **Base URL**: http://localhost:3000
- **Retries**: 2 in CI, 0 locally
- **Parallel**: Enabled for faster execution

## Mocking Strategy

### File System Adapters

- Mocked localStorage and IndexedDB for persistence tests
- Mocked BrowserFS for filesystem adapter tests
- Mocked file-saver for export functionality

### Nuxt Composables

- Mocked `useRuntimeConfig` for configuration
- Mocked `navigateTo` for navigation testing
- Mocked `createSharedComposable` for composable testing

### External Dependencies

- Mocked JSZip for ZIP operations
- Mocked file-saver for download functionality
- Mocked BrowserFS for filesystem operations

## Test Utilities

### Helper Functions

Located in `test/utils/test-helpers.ts`:

- `createMockCampaign()` - Create test campaign entities
- `createMockGoal()` - Create test goal entities
- `createMockScenario()` - Create test scenario entities
- `createMockManifest()` - Create test manifest entities
- `createMockFileSystemStore()` - Create test file system data

### Test Data

All test data is generated programmatically to ensure:
- Consistent test results
- Easy maintenance
- Type safety
- Realistic entity structures

## Coverage Requirements

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## CI/CD Integration

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Changes to campaign-editor workspace

The CI pipeline includes:
1. Unit tests with coverage
2. End-to-end tests
3. Linting and type checking
4. Coverage reporting to Codecov

## Debugging Tests

### Unit Tests

```bash
# Run specific test file
npm run test test/unit/adapters/InMemFileSystemAdapter.test.ts

# Run tests matching pattern
npm run test -- --grep "persistence"

# Debug mode
npm run test -- --inspect-brk
```

### E2E Tests

```bash
# Run specific test file
npm run test:e2e test/e2e/dashboard.spec.ts

# Run in headed mode for debugging
npm run test:e2e:headed

# Debug mode
npm run test:e2e -- --debug
```

## Best Practices

1. **Test Isolation**: Each test is independent and doesn't affect others
2. **Mock External Dependencies**: Use mocks for localStorage, IndexedDB, etc.
3. **Realistic Test Data**: Use helper functions to create consistent test entities
4. **Async Testing**: Properly handle async operations in tests
5. **Error Scenarios**: Test both success and failure cases
6. **Coverage**: Aim for high coverage while focusing on critical paths
7. **Performance**: Keep tests fast and efficient
8. **Maintainability**: Use descriptive test names and organize tests logically