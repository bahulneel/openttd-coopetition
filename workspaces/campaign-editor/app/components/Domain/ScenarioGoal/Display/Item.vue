<template>
  <div class="space-y-2">
    <!-- Join-specific details -->
    <div class="flex items-center space-x-2 text-sm">
      <Badge v-if="scenarioGoal.required" variant="default" class="text-xs">
        Required
      </Badge>
      <Badge v-else variant="secondary" class="text-xs">
        Optional
      </Badge>
      <span class="text-muted-foreground">Order: {{ scenarioGoal.order || 0 }}</span>
      <span v-if="scenarioGoal.branch" class="text-muted-foreground">
        Branch: {{ scenarioGoal.branch }}
      </span>
    </div>

    <!-- Entity component -->
    <WithEntity :entity="scenarioGoal.include">
      <template #default="{ value: resolvedGoal }">
        <EntityGoalDisplayItem :goal="resolvedGoal" @edit="handleGoalEdit" />
      </template>
      <template #fallback>
        <div class="p-3 border border-dashed border-muted-foreground rounded-lg text-center text-muted-foreground">
          Goal not found: {{ scenarioGoal.include.__ref.id }}
        </div>
      </template>
    </WithEntity>

    <!-- Join-specific comment -->
    <p v-if="scenarioGoal.comment" class="text-sm text-muted-foreground italic">
      {{ scenarioGoal.comment }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ScenarioGoal, Goal } from '~/types'

defineOptions({
  name: 'DomainScenarioGoalDisplayItem'
})

interface Props {
  scenarioGoal: ScenarioGoal
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [scenarioGoal: ScenarioGoal]
}>()

function handleGoalEdit(goal: Goal) {
  // Forward the edit event with the scenario goal context
  // This allows the parent to know which scenario goal is being edited
  // even though the edit was triggered from the entity component
  emit('edit', props.scenarioGoal)
}

</script>
