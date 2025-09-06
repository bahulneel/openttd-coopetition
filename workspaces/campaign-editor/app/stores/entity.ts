import type { TypeMap, PackageManifest, AnyEntity, EntityOptions, Storable } from '~/types'

export const useEntityStore = defineStore('entity', () => {
  // State - type => id => entity
  const index = ref<Map<string, Map<string, Storable<AnyEntity>>>>(new Map())
  const manifest = ref<Storable<PackageManifest> | undefined>(undefined)

  function has(id: string): boolean {
    if (manifest.value && id === entityId(manifest.value)) {
      return true
    }
    return Array.from(index.value.values()).some((typeMap) => typeMap.has(id))
  }

  // Generic entity operations
  function assert<T extends AnyEntity>(entity: T): void
  function assert<T extends AnyEntity>(entities: T[]): void
  function assert<T extends AnyEntity>(entityOrEntities: T | T[]): void {
    if (Array.isArray(entityOrEntities)) {
      for (const entity of entityOrEntities) {
        assert(entity)
      }
      return
    }
    const entity = entityOrEntities as T
    let storable = toStorable(entity)

    if (has(entityId(entity))) {
      storable = ops.modified(storable)
    } else {
      storable = ops.created(storable)
    }

    if (isManifest(storable)) {
      manifest.value = storable
    }
    const typeMap = index.value.get(entityType(entity)) || new Map()
    typeMap.set(entityId(entity), storable)
    index.value.set(entityType(entity), typeMap)
  }

  function get<T extends keyof TypeMap, S = Storable<TypeMap[T]>>(id: string, type?: T): S | undefined {
    if (type) {
      if (type === 'Manifest') {
        return manifest.value as S | undefined
      }
      const typeMap = index.value.get(type)
      return typeMap?.get(id) as S | undefined
    }

    if (manifest.value && id === entityId(manifest.value)) {
      return manifest.value as S | undefined
    }

    // Search all types if no type specified
    for (const typeMap of index.value.values()) {
      const entity = typeMap.get(id)
      if (entity) return entity as S
    }
    return undefined
  }

  function retract(id: string): void {
    if (manifest.value && id === entityId(manifest.value)) {
      manifest.value = ops.deleted(manifest.value)
      return
    }

    for (const typeMap of index.value.values()) {
      if (typeMap.has(id)) {
        const entity = typeMap.get(id)!
        typeMap.set(id, ops.deleted(entity))
        return
      }
    }
  }

  function copy<T extends keyof TypeMap, E extends AnyEntity = TypeMap[T]>(
    id: string,
    changes: EntityOptions<E> = {},
  ): Storable<E> {
    const original = get<T>(id) as Storable<E> | undefined
    if (!original) throw new Error('Entity not found')

    const duplicate: E = updateEntity<E>(copyEntity(toStorableValue(original)), changes)

    assert(duplicate)
    const stored = get<T>(entityId(duplicate)) as Storable<E> | undefined
    if (!stored) throw new Error('Unexpected entity not found')
    return stored
  }

  function select<T extends AnyEntity>(type: string): ComputedRef<Storable<T>[]> {
    return computed(() =>
      Array.from(index.value.get(type)?.values() || [])
        .filter((entity) => !isDeleted(entity))
        .map((entity) => entity as Storable<T>),
    )
  }

  return {
    // State
    index: computed(() => index.value),
    manifest: computed(() => manifest.value),

    // Generic operations
    assert,
    get,
    retract,
    copy,
    has,
    select,
  }
})
