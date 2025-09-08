<template>
  <div class="flex items-center space-x-2">
    <Badge v-if="scenarioGoal.required" variant="default" class="text-xs">
      Required
    </Badge>
    <Badge v-else variant="secondary" class="text-xs">
      Optional
    </Badge>
    <span class="text-sm text-muted-foreground">
      Order: {{ scenarioGoal.order || 0 }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { ScenarioGoal } from '~/types'

defineOptions({
  name: 'DomainScenarioGoalDisplaySummary'
})

interface Props {
  scenarioGoal: ScenarioGoal
}

defineProps<Props>()
</script>
