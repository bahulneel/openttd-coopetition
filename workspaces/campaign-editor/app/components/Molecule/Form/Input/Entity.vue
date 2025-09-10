<template>
  <Combobox v-model="modelValue" class="w-full">
    <ComboboxAnchor>
      <div class="relative w-full">
        <ComboboxInput :placeholder="placeholder" class="openttd-input" />
        <ComboboxTrigger class="absolute right-0 top-0 h-full px-3 flex items-center">
          <ChevronDown class="h-4 w-4 opacity-50" />
        </ComboboxTrigger>
      </div>
    </ComboboxAnchor>
    <ComboboxList>
      <ComboboxEmpty>
        <slot name="empty">
          No {{ entityType }} found.
        </slot>
      </ComboboxEmpty>
      <ComboboxGroup>
        <ComboboxItem v-for="entity in entities" :key="entityId(entity)" :value="entity">
          <slot name="item" :entity="entity">
            {{ name }}
          </slot>
          <ComboboxItemIndicator>
            <Check class="ml-auto h-4 w-4" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>

<script setup lang="ts" generic="T extends AnyEntity">
import { Check, ChevronDown } from 'lucide-vue-next'
import type { AnyEntity, EntityReference } from '~/types'

defineOptions({
  name: 'MoleculeFormInputEntity'
})

interface Props<T extends AnyEntity = AnyEntity> {
  entities: T[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an entity...',
  entities: () => [],
})

// Define model for EntityReference
const modelValue = defineModel<EntityReference<AnyEntity> | undefined>()

const entity = computed(() => {
  return props.entities.find((entity) => enttiyEq(entity, modelValue.value))
})

const name = computed(() => {
  const value = entity.value
  if (!value) {
    return ''
  }
  if ('name' in value) {
    return value.name
  }
  return ''
})
</script>
