<template>
  <TemplateLayoutList>
    <EntityScenarioDisplayCard 
      v-for="scenario in scenarios" 
      :key="entityId(scenario)" 
      :scenario="scenario"
      @edit="$emit('edit', $event)"
      @duplicate="$emit('duplicate', $event)"
      @delete="$emit('delete', $event)"
    />
  </TemplateLayoutList>
</template>

<script setup lang="ts">
import type { Scenario } from '~/types'

defineOptions({
  name: 'AggregateScenarios'
})

interface Props {
  scenarios: Scenario[]
}

defineProps<Props>()

defineEmits<{
  edit: [scenario: Scenario]
  duplicate: [scenario: Scenario]
  delete: [scenario: Scenario]
}>()
</script>