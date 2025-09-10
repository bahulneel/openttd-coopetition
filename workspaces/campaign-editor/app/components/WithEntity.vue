<script setup lang="ts" generic="T extends ModelTypes, E extends AnyEntity = TypeMap[T]">
import type { ModelTypes, TypeMap, AnyEntity, EntityReference } from '~/types'

const props = defineProps<{
  entity: EntityReference<E>
}>()

const entity = computed(() => useResolveEntity<T, E>(props.entity))
</script>

<template>
  <slot
    v-if="entity"
    :value="entity"
  />
  <slot
    v-else
    name="fallback"
  />
</template>
