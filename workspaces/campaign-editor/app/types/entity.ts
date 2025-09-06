// Core entity type definitions

export interface Identified {
  __id: string
}

export interface Typed {
  __type: string
}

export interface Entity<T extends string> extends Identified, Typed {
  __type: T
}

// Type helpers
export type AnyEntity = Entity<string>
export type EntityType<T> = T extends Entity<infer U> ? U : never

// Value types (without metadata)
export type EntityValue<T extends AnyEntity> = Omit<T, '__id' | '__type'>
export type EntityOptions<T extends AnyEntity> = Partial<EntityValue<T>>

export interface EntityReference<T extends AnyEntity> {
  __ref: {
    id: string
    type: EntityType<T>
  }
}

export type ManyReferences<T extends AnyEntity> = EntityReference<T>[]
