<template>
  <div class="space-y-4">
    <TemplateLayoutList>
      <DomainScenarioGoalDisplayItem
v-for="scenarioGoal in scenarioGoals"
        :key="`${referenceId(scenarioGoal.include)}-${scenarioGoal.order || 0}`" :scenario-goal="scenarioGoal"
        @edit="$emit('edit', $event)" />
    </TemplateLayoutList>

    <!-- Action Slot -->
    <div v-if="$slots.actions" class="flex justify-end">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScenarioGoal } from '~/types'

defineOptions({
  name: 'AggregateScenarioGoals'
})

interface Props {
  scenarioGoals: ScenarioGoal[]
}

defineProps<Props>()

defineEmits<{
  edit: [scenarioGoal: ScenarioGoal]
}>()
</script>
