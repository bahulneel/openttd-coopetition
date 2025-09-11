/**
 * Composable to detect if we're running in a test environment
 * Returns true if running in test mode (Jest, Vitest, etc.)
 * Uses useState to prevent hydration mismatches
 */
export const useIsTestEnvironment = () => {
  return useState('isTestEnvironment', () => {
    // Check for common test environment indicators
    if (import.meta.server) {
      return process.env.NODE_ENV === 'test' ||
        process.env.VITEST === 'true' ||
        process.env.JEST_WORKER_ID !== undefined ||
        process.env.NODE_ENV === 'development' && process.env.TEST === 'true'
    }

    // Client-side detection
    return import.meta.env.MODE === 'test' ||
      import.meta.env.VITEST === 'true' ||
      import.meta.env.DEV && import.meta.env.TEST === 'true'
  })
}