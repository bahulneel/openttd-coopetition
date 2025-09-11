import type { FileSystemAdapter } from '~/types'
import { InMemFileSystemAdapter } from '~/utils/fileSystem/index'

/**
 * Composable that provides the in-memory file system adapter
 * Always returns the InMemFileSystemAdapter regardless of environment
 * Useful for testing or when you specifically need in-memory storage
 */
function useInMemoryFileSystemImpl(): FileSystemAdapter {
  return new InMemFileSystemAdapter()
}

export const useInMemoryFileSystem = createSharedComposable(useInMemoryFileSystemImpl)