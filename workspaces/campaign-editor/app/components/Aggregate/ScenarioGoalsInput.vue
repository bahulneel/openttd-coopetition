<template>
  <AggregateInput
    v-model="modelValue"
    class="space-y-4"
  >
    <template #collection="{ items, remove }">
      <div
        v-for="(scenarioGoal, index) in items"
        :key="`${referenceId(scenarioGoal.include)}-${scenarioGoal.order || 0}`"
        class="space-y-2"
      >
        <div class="flex items-center justify-between p-3 border border-border rounded-lg">
          <div class="flex-1">
            <DomainScenarioGoalDisplayItem
              :scenario-goal="scenarioGoal"
              @edit="handleEdit(index)"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            class="text-destructive hover:text-destructive-foreground"
            @click="remove(index)"
          >
            🗑️ Remove
          </Button>
        </div>
      </div>
    </template>

    <template #empty>
      <p>No scenario goals added yet.</p>
    </template>

    <template #new-item="{ add }">
      <Button
        type="button"
        variant="outline"
        class="openttd-button"
        @click="add"
      >
        ➕ Add Scenario Goal
      </Button>
    </template>
  </AggregateInput>
</template>

<script setup lang="ts" generic="T extends ScenarioGoal">
import type { ScenarioGoal } from '~/types'

defineOptions({
  name: 'AggregateScenarioGoalsInput',
})

const emit = defineEmits<{
  'add-item': []
  edit: [index: number, scenarioGoal: T]
}>()

const modelValue = defineModel<T[]>({ required: true })

function handleEdit(index: number) {
  const scenarioGoal = modelValue.value[index]
  if (!scenarioGoal) return
  emit('edit', index, scenarioGoal)
}
</script>
