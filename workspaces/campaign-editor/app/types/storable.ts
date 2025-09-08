// Storage metadata and storable type definitions
import type { AnyEntity, Identified } from './entity'

export interface StorageMeta {
  created: number
  modified?: number // Optional - only set when actually modified
  deleted?: number // Tombstone for soft deletes
  version: number
  filename: string // Generated filename for storage
}

export type Storable<T extends Identified> = T & {
  __meta: StorageMeta
}

export interface EntityFile<T extends AnyEntity> {
  path: string
  storable: Storable<T>
}
