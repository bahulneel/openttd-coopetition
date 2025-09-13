# Campaign Editor Testing Setup

This document outlines the comprehensive testing setup for the Campaign Editor, focusing on browser testing for persistence properties and UI features using Vitest as the primary test runner.

## Overview

The testing setup includes:
- **Unit Tests**: Testing individual components, adapters, and utilities
- **Browser Tests**: Testing UI interactions and persistence in a real browser environment
- **Persistence Testing**: Testing both localStorage and IndexedDB persistence adapters
- **In-Memory Store Testing**: Testing the Pinia store functionality

## Test Structure

```
test/
├── unit/                    # Unit tests (Node.js environment)
│   ├── adapters/           # File system adapter tests
│   ├── composables/        # Composable function tests
│   ├── stores/             # Pinia store tests
│   ├── components/         # Vue component tests
│   └── utils/              # Utility function tests
├── browser/                # Browser tests (real browser environment)
│   ├── dashboard.browser.test.ts
│   └── persistence.browser.test.ts
├── e2e/                    # Legacy e2e tests (deprecated)
├── utils/                  # Test utilities and helpers
├── setup.ts               # Test setup configuration
└── README.md              # Detailed testing documentation
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

### 4. Browser Tests

Real browser automation tests using Vitest with Playwright:

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

### Browser Tests

```bash
# Run browser tests
npm run test:browser

# Run browser tests with UI
npm run test:browser:ui

# Run browser tests in headed mode
npm run test:browser:headed

# Run all tests
npm run test:all
```

## Test Configuration

### Vitest Configuration

- **Environment**: jsdom for unit tests, browser for browser tests
- **Setup**: `test/setup.ts` (mocks and global configuration)
- **Coverage**: v8 provider with 80% thresholds
- **Aliases**: `~` and `@` point to `app/` directory

### Browser Testing

- **Browsers**: Chromium, Firefox, WebKit (via Playwright)
- **Headless**: Enabled by default for CI
- **Provider**: Playwright for browser automation
- **Base URL**: http://localhost:3000

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
2. Browser tests
3. Linting and type checking
4. Coverage reporting to Codecov

## Debugging Tests

### Unit Tests

```bash
# Run specific test file
npm run test test/unit/adapters/FileSystemAdapters.test.ts

# Run tests matching pattern
npm run test -- --grep "persistence"

# Debug mode
npm run test -- --inspect-brk
```

### Browser Tests

```bash
# Run specific test file
npm run test:browser test/browser/dashboard.browser.test.ts

# Run in headed mode for debugging
npm run test:browser:headed

# Debug mode
npm run test:browser -- --debug
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

## Dependencies

### Core Testing
- `vitest` - Test runner and framework
- `@vitest/browser` - Browser testing support
- `@vue/test-utils` - Vue component testing utilities
- `jsdom` - DOM environment for unit tests

### Browser Testing
- `playwright` - Browser automation
- `happy-dom` - Alternative DOM environment

### Utilities
- `wait-on` - Wait for services to be ready
- `file-saver` - File download functionality (mocked)

## Future Enhancements

1. **Visual Regression Testing**: Add screenshot comparison tests
2. **Performance Testing**: Add performance benchmarks
3. **Accessibility Testing**: Add a11y testing with axe-core
4. **Mobile Testing**: Add mobile browser testing
5. **Integration Testing**: Add full-stack integration tests

## Troubleshooting

### Common Issues

1. **Module Resolution**: Ensure aliases are properly configured in vitest.config.ts
2. **Browser Dependencies**: Run `npx playwright install` if browser tests fail
3. **Mock Issues**: Check that mocks are properly set up in test/setup.ts
4. **Async Testing**: Ensure proper async/await usage in tests

### Getting Help

- Check the [Vitest documentation](https://vitest.dev/)
- Review the [Playwright documentation](https://playwright.dev/)
- Look at existing tests for examples
- Check the test setup in `test/setup.ts`