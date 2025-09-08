<script setup lang="ts" generic="T extends ModelTypes, E extends AnyEntity = TypeMap[T]">
import type { ModelTypes, TypeMap, AnyEntity, EntityReference } from '~/types'

const props = defineProps<{
  ref: EntityReference<E>
}>()

const entity = computed(() => useResolveEntity(props.ref))
</script>

<template>
  <slot :value="entity" />
</template>