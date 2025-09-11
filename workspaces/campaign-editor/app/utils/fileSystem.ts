import { FileSystemFeature } from '~/types'
import { BackendFileSystemAdapter, BrowserFSFileSystemAdapter, InMemFileSystemAdapter } from './fileSystem/index'
import type { FileSystemAdapter, FeatureZipImport, FeatureZipExport } from '~/types'

// Type guards for feature detection
export function hasFeatureZipImport<T extends FileSystemAdapter>(fs: T): fs is T & FeatureZipImport {
  return fs.supports(FileSystemFeature.ZIP_IMPORT)
}

export function hasFeatureZipExport<T extends FileSystemAdapter>(fs: T): fs is T & FeatureZipExport {
  return fs.supports(FileSystemFeature.ZIP_EXPORT)
}

// Factory function to create the appropriate adapter
export function createFileSystemAdapter(
  hasBackend: boolean,
  isTestEnvironment: boolean = false
): FileSystemAdapter {
  // Get runtime config to check if we should force in-memory adapter
  const config = useRuntimeConfig()
  const forceInMemory = config.public.forceInMemoryFileSystem

  // Force in-memory adapter if requested via runtime config
  if (forceInMemory) {
    return new InMemFileSystemAdapter()
  }

  // Use hasBackend parameter to detect if we have backend capabilities
  if (hasBackend) {
    return new BackendFileSystemAdapter()
  }

  // For browser environments, choose between in-memory (tests) and BrowserFS (production)
  return isTestEnvironment ? new InMemFileSystemAdapter() : new BrowserFSFileSystemAdapter()
}
