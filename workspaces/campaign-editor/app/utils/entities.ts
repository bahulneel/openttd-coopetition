import { defu } from 'defu'
import { hash } from './hash'

import type {
  AnyEntity,
  EntityOptions,
  EntityReference,
  EntityType,
  EntityValue,
  Identified,
  Typed,
} from '~/types/entity'
import type { ModelTypes, TypeMap } from '~/types'

/**
 * Extracts the value data from an entity, removing metadata fields
 */
export function toEntityValue<T extends AnyEntity>(entity: T): EntityValue<T> {
  const { __id, __type, ...value } = entity
  return value as EntityValue<T>
}

/**
 * Deep merges two entities, with the second entity taking precedence
 * Uses defu library for robust deep merging
 */
export function updateEntity<T extends AnyEntity>(x: T, y: EntityOptions<T>): T {
  return defu(y, x) as T
}

export function copyEntity<T extends AnyEntity>(entity: T, changes: EntityOptions<T> = {}): T {
  const { __id } = entity
  const parts = __id.split('/')
  const prefix = parts.slice(0, -1)
  return defu(changes, {
    ...entity,
    __id: useIdentifier(...prefix),
  }) as T
}

/**
 * Checks if a value is a Typed entity
 */
export function isTyped(value: unknown | Typed): value is Typed {
  return typeof value === 'object' && value !== null && '__type' in value
}

/**
 * Checks if a value is an Identified entity
 */
export function isIdentified(value: unknown | Identified): value is Identified {
  return typeof value === 'object' && value !== null && '__id' in value
}

/**
 * Checks if a value is an Entity
 */
export function isEntity<T extends AnyEntity>(value: unknown | T): value is T {
  return isTyped(value) && isIdentified(value)
}

export function hashEntity<T extends AnyEntity>(entity: T): string {
  return hash(toEntityValue(entity))
}

export function isEntityType<T extends AnyEntity>(value: unknown | T, type: EntityType<T>): value is T {
  return isEntity(value) && value.__type === type
}

export function entityType<T extends AnyEntity>(value: T): EntityType<T> {
  return value.__type as EntityType<T>
}

export function entityId<T extends Identified>(value: T): string {
  return value.__id
}

export function asEntity<K extends ModelTypes, T extends AnyEntity = TypeMap[K]>(type: K, value: EntityValue<T>): T {
  const { id, ...rest } = value as { id?: string } & EntityValue<T>
  if (id) {
    return {
      ...rest,
      __type: type,
      __id: id,
    } as T
  }
  if (isEntity(value)) {
    return value as T
  }
  return {
    ...value,
    __type: type,
    __id: useIdentifier(type.toLowerCase()),
  } as T
}

export function entityRef<T extends AnyEntity>(id: string, type: EntityType<T>): EntityReference<T> {
  return {
    __ref: {
      id,
      type,
    },
  }
}

export function toEntityRef<T extends AnyEntity>(entity: T): EntityReference<T> {
  return entityRef<T>(entity.__id, entity.__type)
}

/**
 * Gets the ID from an EntityReference
 */
export function referenceId<T extends AnyEntity>(ref: EntityReference<T>): string {
  return ref.__ref.id
}

/**
 * Gets the type from an EntityReference
 */
export function referenceType<T extends AnyEntity>(ref: EntityReference<T>): EntityType<T> {
  return ref.__ref.type
}
