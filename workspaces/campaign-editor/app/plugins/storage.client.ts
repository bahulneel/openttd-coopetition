import type { Storable, AnyEntity, Manifest } from '~/types'

export default defineNuxtPlugin(() => {
  const store = useEntityStore()
  const fileSystem = useFileSystem()

  // Watch for changes in the entity store and persist them
  watch(
    () => store.index,
    (newIndex, oldIndex) => {
      if (!oldIndex) return // Skip initial load

      // Find changed entities by comparing with previous state
      for (const [type, typeMap] of newIndex.entries()) {
        for (const [id, entity] of typeMap.entries()) {
          const oldEntity = oldIndex.get(type)?.get(id)

          // Entity is new or modified
          handleEntityChange(entity, oldEntity)
        }
      }
    },
    { deep: true },
  )

  // Watch for manifest changes
  watch(() => store.manifest, handleEntityChange, { deep: true })

  async function handleEntityChange<T extends AnyEntity>(entity?: Storable<T>, oldEntity?: Storable<T>) {
    if (!entity) {
      return
    }
    if (!hasChanged(entity, oldEntity)) {
      return persistEntity(entity)
    }
    if (conflictsWith(entity, oldEntity)) {
      throw new Error('Entity conflicts with previous version')
    }
    persistEntity(entity)
  }

  // Persist individual entity
  async function persistEntity<T extends AnyEntity>(entity: Storable<T>) {
    const type = entityType(entity)
    const id = entityId(entity)
    try {
      if (isDeleted(entity)) {
        // Handle soft delete - could remove file or mark as deleted
        console.log(`Entity ${type}[${id}] was deleted (soft delete)`)
        return
      }

      const manifest = store.manifest

      if (!manifest) {
        console.warn('No manifest available for storage layout')
        return
      }

      const fullPath = getEntityPath(entity, manifest)

      // Use generic save method
      await fileSystem.save({ path: fullPath, storable: entity })
    } catch (error) {
      console.error(`Failed to persist ${type}[${id}]:`, error)
    }
  }

  // Load initial data from storage
  async function loadFromStorage() {
    try {
      // Load manifest first
      const entities = await fileSystem.loadAll('*')
      for (const entity of entities) {
        store.assert(entity)
      }
    } catch (error) {
      console.error('Failed to load data from storage:', error)
    }
  }

  // Helper function to get entity path from entity and manifest
  function getEntityPath<T extends AnyEntity>(entity: Storable<T>, manifest: Storable<Manifest>): string {
    const filename = entity.__meta.filename
    const type = entityType(entity)

    let directory: string
    switch (type) {
      case 'Campaign':
        directory = manifest.structure.campaigns
        break
      case 'Goal':
        directory = manifest.structure.goals
        break
      case 'Scenario':
        directory = manifest.structure.scenarios
        break
      case 'Manifest':
        directory = '.' // Manifest is at root
        break
      default:
        console.warn(`Unknown entity type for directory mapping: ${type}`)
        directory = 'unknown'
    }

    return `${directory}/${filename}`
  }

  // Load data on plugin initialization
  loadFromStorage()
})
