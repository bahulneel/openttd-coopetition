<template>
  <div class="text-sm text-muted-foreground">
    <span v-if="objective" class="font-medium">{{ getObjectiveDescription(objective) }}</span>
    <span v-else>No objective defined</span>
  </div>
</template>

<script setup lang="ts">
import type { Objective } from '~/types'

defineOptions({
  name: 'DomainObjectiveDefaultDisplaySummary'
})

interface Props {
  objective?: Objective
  asPartial?: boolean
}

defineProps<Props>()

function getObjectiveDescription(objective: Objective): string {
  switch (objective.type) {
    case 'cargo_delivered':
      return `Deliver ${objective.amount.toLocaleString()} units of ${objective.cargo}`
    case 'network_length':
      return `Build ${objective.amount.toLocaleString()} tiles of network${objective.track_type ? ` (${objective.track_type})` : ''}`
    case 'profit':
      return `Reach £${objective.amount.toLocaleString()} profit`
    case 'station_built':
      return `Build ${objective.count} stations${objective.location ? ` at ${objective.location}` : ''}`
    case 'company_value':
      return `Reach £${objective.min_value.toLocaleString()} company value`
    case 'town_growth':
      return `Grow town ${objective.town_id} to ${objective.target_population.toLocaleString()} population`
    default:
      return `Unknown objective type: ${(objective as { type: string }).type}`
  }
}
</script>