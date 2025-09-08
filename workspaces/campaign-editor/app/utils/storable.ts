import type { Identified, Named, Storable, StorageMeta } from '~/types'

/**
 * Converts an identified entity to a storable entity
 */
export function toStorable<T extends Identified>(identified: T): Storable<T> {
  if (isStorable(identified)) {
    return identified
  }
  return {
    ...identified,
    __meta: {
      created: Date.now(),
      version: -1,
      filename: generateFilename(identified),
    },
  }
}

/**
 * Checks if an entity is a storable entity
 */
export function isStorable<T extends Identified>(identified: unknown | Storable<T>): identified is Storable<T> {
  return isIdentified(identified) && '__meta' in identified
}

export function storableMeta<T extends Identified>(storable: Storable<T>): StorageMeta {
  return storable.__meta
}

/**
 * Checks if a storable entity has changed
 */
export function hasChanged<T extends Identified>(storable: Storable<T>, oldStorable?: Storable<T>): boolean {
  if (!oldStorable) {
    return true
  }
  const meta = storableMeta(storable)
  const oldMeta = storableMeta(oldStorable)
  if (!meta.modified) {
    return false
  }
  if (!oldMeta.modified) {
    return true
  }
  return meta.modified > oldMeta.modified
}

/**
 * Returns the value part of a storable entity
 */
export function toStorableValue<T extends Identified>(storable: Storable<T>): T {
  const { __meta: _, ...value } = storable
  return value as unknown as T
}

/**
 * Hashes a storable entity
 */
export function hashStorable<T extends Identified>(storable: Storable<T>): string {
  const value = toStorableValue(storable)
  if (isEntity(value)) {
    return hashEntity(value)
  }
  return hash(value)
}

/**
 * Checks if a storable entity conflicts with another storable entity
 */
export function conflictsWith<T extends Identified>(newValue: Storable<T>, oldValue?: Storable<T>): boolean {
  if (!oldValue) {
    return true
  }
  if (entityId(oldValue) !== entityId(newValue)) {
    return true
  }
  const oldMeta = storableMeta(oldValue)
  const newMeta = storableMeta(newValue)
  return oldMeta.version >= newMeta.version && hashStorable(oldValue) !== hashStorable(newValue)
}

/**
 * Checks if a storable entity is deleted
 */
export function isDeleted<T extends Identified>(entity: Storable<T>): boolean {
  return storableMeta(entity).deleted !== undefined
}

/**
 * Returns the version of a storable entity
 */
export function getVersion<T extends Identified>(entity: Storable<T>): number {
  return storableMeta(entity).version
}

/**
 * Increments the version of a storable entity
 */
export function incrementVersion<T extends Identified>(entity: Storable<T>): Storable<T> {
  const meta = storableMeta(entity)
  return {
    ...entity,
    __meta: {
      ...meta,
      version: meta.version + 1,
      modified: Date.now(),
    },
  }
}

export function equal<T extends Identified>(a: T, b: T): boolean {
  return hash(a) === hash(b)
}

/**
 * Generates a filename for an entity based on its name and type
 */
export function generateFilename<T extends Identified>(entity: T): string {
  // If it's a BaseItem, use the name field
  if (objectHas<Named>(entity, 'name')) {
    return sanitizeFilename(entity.name)
  }

  // Fallback to using the ID
  return sanitizeFilename(entityId(entity))
}

/**
 * Sanitizes a string to be safe for use as a filename
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_') // Replace invalid chars with underscore
    .replace(/_+/g, '_') // Collapse multiple underscores
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 50) // Limit length
}

export const ops = {
  created<T extends Identified>(storable: Storable<T>): Storable<T> {
    return {
      ...storable,
      __meta: {
        ...storable.__meta,
        created: Date.now(),
        version: 1,
      },
    }
  },
  modified<T extends Identified>(storable: Storable<T>): Storable<T> {
    const {
      __meta: { version },
    } = storable
    return {
      ...storable,
      __meta: {
        ...storable.__meta,
        modified: Date.now(),
        version: version + 1,
      },
    }
  },
  deleted<T extends Identified>(storable: Storable<T>): Storable<T> {
    return {
      ...storable,
      __meta: {
        ...storable.__meta,
        deleted: Date.now(),
      },
    }
  },
}

export const meta = {
  created<T extends Identified>(storable: unknown | Storable<T>): number | undefined {
    if (!isStorable(storable)) {
      return undefined
    }
    return storableMeta(storable).created
  },
  modified<T extends Identified>(storable: unknown | Storable<T>): number | undefined {
    if (!isStorable(storable)) {
      return undefined
    }
    return storableMeta(storable).modified
  },
  deleted<T extends Identified>(storable: unknown | Storable<T>): number | undefined {
    if (!isStorable(storable)) {
      return undefined
    }
    return storableMeta(storable).deleted
  },
  version<T extends Identified>(storable: unknown | Storable<T>): number | undefined {
    if (!isStorable(storable)) {
      return undefined
    }
    return storableMeta(storable).version
  },
}
