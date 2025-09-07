<template>
  <div class="flex items-center space-x-3">
    <span class="font-medium text-foreground">{{ scenario.name }}</span>
    <Badge v-if="scenario.required" variant="default" class="text-xs">
      Required
    </Badge>
    <Badge v-else variant="secondary" class="text-xs">
      Optional
    </Badge>
    <span class="text-sm text-muted-foreground">
      Order: {{ scenario.order }}
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