import { createSharedComposable } from '@vueuse/core'
import { createFileSystemAdapter } from '~/utils/fileSystem'
import { useHasBackend } from '~/composables/useHasBackend'

/**
 * Composable that provides the appropriate file system adapter
 * Automatically detects backend capabilities and returns the correct adapter
 * Shared across multiple Vue instances to ensure consistency
 */
const useFileSystemImpl = () => {
  const hasBackend = useHasBackend()
  
  // Create the appropriate adapter based on backend availability
  return createFileSystemAdapter(hasBackend.value)
}

export const useFileSystem = createSharedComposable(useFileSystemImpl)
