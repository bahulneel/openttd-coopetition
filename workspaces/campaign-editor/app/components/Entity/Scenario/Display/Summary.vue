<template>
  <div class="flex items-center space-x-3">
    <span class="font-medium text-foreground">{{ scenario.name }}</span>
    <span class="text-sm text-muted-foreground">
      {{ scenario.goals?.length || 0 }} goals
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Scenario } from '~/types'

defineOptions({
  name: 'EntityScenarioDisplaySummary'
})

interface Props {
  scenario: Scenario
}

defineProps<Props>()
</script>