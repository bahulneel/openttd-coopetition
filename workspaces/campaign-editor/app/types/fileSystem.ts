// File system type definitions
import type { AnyEntity } from './entity'
import type { Storable, EntityFile } from './storable'

export enum FileSystemFeature {
  ZIP_IMPORT = 'zip_import',
  ZIP_EXPORT = 'zip_export',
  WATCH = 'watch',
  PERSISTENCE = 'persistence',
}

export interface FileSystemAdapter {
  // Generic load/save operations
  load<T extends AnyEntity>(path: string): Promise<Storable<T> | undefined>
  save<T extends AnyEntity>(entityFile: EntityFile<T>): Promise<void>
  delete(path: string): Promise<void>

  // Bulk operations for efficiency
  loadAll<T extends AnyEntity>(pattern: string): Promise<Storable<T>[]>

  // Feature detection
  supports(feature: FileSystemFeature): boolean

  // Optional: Watch for external changes
  watch?(callback: (event: FileSystemEvent) => void): void
}

export interface FileSystemEvent {
  type: 'change' | 'delete' | 'add'
  path: string
  timestamp: number
}

// Feature interfaces
export interface FeatureZipImport {
  importFromZip(file: File): Promise<void>
}

export interface FeatureZipExport {
  downloadExport(filename?: string): Promise<void>
}

// Editor configuration
export interface EditorConfig {
  hasBackend: boolean
  campaignsPath: string
  autoSave: boolean
  autoSaveInterval: number
}
