import type { FileSystemAdapter } from '~/types'
import { useIsTestEnvironment } from './useIsTestEnvironment'

/**
 * Composable that provides the appropriate file system adapter
 * Automatically detects backend capabilities and test environment to return the correct adapter
 * Shared across multiple Vue instances to ensure consistency
 */
function useFileSystemImpl(): FileSystemAdapter {
  const hasBackend = useHasBackend()
  const isTestEnvironment = useIsTestEnvironment()

  // Create the appropriate adapter based on backend availability and test environment
  return createFileSystemAdapter(hasBackend.value, isTestEnvironment.value)
}

export const useFileSystem = createSharedComposable(useFileSystemImpl)
