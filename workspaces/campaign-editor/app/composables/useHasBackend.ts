/**
 * Composable to detect if we have backend capabilities
 * Returns true if running on server (has file system access)
 * Uses useState to prevent hydration mismatches
 */
export const useHasBackend = () => {
  return useState('hasBackend', () => import.meta.server)
}
