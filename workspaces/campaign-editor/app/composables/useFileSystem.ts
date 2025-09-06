import type { FileSystemAdapter } from '~/types'

/**
 * Composable that provides the appropriate file system adapter
 * Automatically detects backend capabilities and returns the correct adapter
 * Shared across multiple Vue instances to ensure consistency
 */
function useFileSystemImpl(): FileSystemAdapter {
  const hasBackend = useHasBackend()

  // Create the appropriate adapter based on backend availability
  return createFileSystemAdapter(hasBackend.value)
}

export const useFileSystem = createSharedComposable(useFileSystemImpl)
