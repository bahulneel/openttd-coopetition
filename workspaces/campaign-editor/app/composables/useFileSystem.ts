import type { FileSystemAdapter } from '~/types'
import { useIsTestEnvironment } from './useIsTestEnvironment'

/**
 * Composable that provides the appropriate file system adapter
 * Automatically detects backend capabilities and test environment to return the correct adapter
 * Can be forced to use in-memory adapter via NUXT_FORCE_IN_MEMORY_FS environment variable
 * Shared across multiple Vue instances to ensure consistency
 */
function useFileSystemImpl(): FileSystemAdapter {
  const hasBackend = useHasBackend()
  const isTestEnvironment = useIsTestEnvironment()

  // Get runtime config to check if we should force in-memory adapter
  const config = useRuntimeConfig()
  const forceInMemory = config.public.forceInMemoryFileSystem

  // Create the appropriate adapter based on backend availability, test environment, and runtime config
  return createFileSystemAdapter(hasBackend.value, isTestEnvironment.value, forceInMemory)
}

export const useFileSystem = createSharedComposable(useFileSystemImpl)
