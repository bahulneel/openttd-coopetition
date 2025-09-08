import type { EntityReference, AnyEntity, ModelEntity, TypeMap, Entity, ModelTypes } from '~/types'

/**
 * Composable to resolve an entity reference to its actual entity
 * @param entityRef - The entity reference to resolve
 * @returns The resolved entity or undefined if not found
 */
export function useResolveEntity<T extends ModelTypes, E extends AnyEntity = TypeMap[T]>(
  entityRef: EntityReference<E>,
): E | undefined {
  const entityStore = useEntityStore()

  return entityStore.get(entityRef.__ref.id, entityRef.__ref.type as unknown as T)
}
