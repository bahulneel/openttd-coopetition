import { FileSystemFeature } from '~/types'
import { BackendFileSystemAdapter, BrowserFSFileSystemAdapter } from './fileSystem/index'
import type { FileSystemAdapter, FeatureZipImport, FeatureZipExport } from '~/types'

// Type guards for feature detection
export function hasFeatureZipImport<T extends FileSystemAdapter>(fs: T): fs is T & FeatureZipImport {
  return fs.supports(FileSystemFeature.ZIP_IMPORT)
}

export function hasFeatureZipExport<T extends FileSystemAdapter>(fs: T): fs is T & FeatureZipExport {
  return fs.supports(FileSystemFeature.ZIP_EXPORT)
}

// Factory function to create the appropriate adapter
export function createFileSystemAdapter(hasBackend: boolean): FileSystemAdapter {
  // Use hasBackend parameter to detect if we have backend capabilities
  return hasBackend ? new BackendFileSystemAdapter() : new BrowserFSFileSystemAdapter()
}
