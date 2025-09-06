import type { Identified, Named, Storable } from '~/types'

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

export function isStorable<T extends Identified>(identified: unknown | Storable<T>): identified is Storable<T> {
  return isIdentified(identified) && '__meta' in identified
}

export function hasChanged<T extends Identified>(storable: Storable<T>, oldStorable?: Storable<T>): boolean {
  if (!oldStorable) {
    return true
  }
  if (!storable.__meta.modified) {
    return false
  }
  if (!oldStorable.__meta.modified) {
    return true
  }
  return storable.__meta.modified > oldStorable.__meta.modified
}

export function toStorableValue<T extends Identified>(storable: Storable<T>): T {
  const { __meta, ...value } = storable
  return value as unknown as T
}

export function hashStorable<T extends Identified>(storable: Storable<T>): string {
  const value = toStorableValue(storable)
  if (isEntity(value)) {
    return hashEntity(value)
  }
  return hash(value)
}

export function conflictsWith<T extends Identified>(newValue: Storable<T>, oldValue?: Storable<T>): boolean {
  if (!oldValue) {
    return true
  }
  if (entityId(oldValue) !== entityId(newValue)) {
    return true
  }
  return oldValue.__meta.version >= newValue.__meta.version && hashStorable(oldValue) !== hashStorable(newValue)
}

export function markModified<T extends Identified>(entity: Storable<T>): Storable<T> {
  return {
    ...entity,
    __meta: {
      ...entity.__meta,
      modified: Date.now(),
    },
  }
}

export function markDeleted<T extends Identified>(entity: Storable<T>): Storable<T> {
  return {
    ...entity,
    __meta: {
      ...entity.__meta,
      deleted: Date.now(),
    },
  }
}

export function isDeleted<T extends Identified>(entity: Storable<T>): boolean {
  return entity.__meta.deleted !== undefined
}

export function getVersion<T extends Identified>(entity: Storable<T>): number {
  return entity.__meta.version
}

export function incrementVersion<T extends Identified>(entity: Storable<T>): Storable<T> {
  return {
    ...entity,
    __meta: {
      ...entity.__meta,
      version: entity.__meta.version + 1,
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
    return storable.__meta.created
  },
  modified<T extends Identified>(storable: unknown | Storable<T>): number | undefined {
    if (!isStorable(storable)) {
      return undefined
    }
    return storable.__meta.modified
  },
  deleted<T extends Identified>(storable: unknown | Storable<T>): number | undefined {
    if (!isStorable(storable)) {
      return undefined
    }
    return storable.__meta.deleted
  },
  version<T extends Identified>(storable: unknown | Storable<T>): number | undefined {
    if (!isStorable(storable)) {
      return undefined
    }
    return storable.__meta.version
  },
}
