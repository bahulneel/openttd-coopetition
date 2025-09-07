<template>
  <div class="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
    <div class="flex-1 min-w-0">
      <div class="flex items-center space-x-3">
        <h3 class="font-medium text-foreground truncate">{{ scenario.name }}</h3>
        <Badge v-if="scenario.required" variant="default" class="text-xs">
          Required
        </Badge>
        <Badge v-else variant="secondary" class="text-xs">
          Optional
        </Badge>
        <Badge v-if="scenario.meta?.difficulty" :class="getDifficultyClasses(scenario.meta.difficulty)" class="text-xs">
          {{ scenario.meta.difficulty }}
        </Badge>
      </div>
      <p class="text-sm text-muted-foreground mt-1">
        Order: {{ scenario.order }} • {{ scenario.goals?.length || 0 }} goals
      </p>
    </div>

    <div class="flex items-center space-x-2">
      <span class="text-xs text-muted-foreground">
        {{ formatDate(scenario.__meta?.modified) }}
      </span>
      <Button variant="ghost" size="sm" @click="$emit('edit', scenario)">
        ✏️
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Scenario } from '~/types'

defineOptions({
  name: 'EntityScenarioDisplayItem'
})

interface Props {
  scenario: Scenario
}

defineProps<Props>()

defineEmits<{
  edit: [scenario: Scenario]
}>()

function formatDate(timestamp: number | undefined) {
  if (!timestamp) return 'Unknown'

  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`

  return date.toLocaleDateString()
}

function getDifficultyClasses(difficulty: string | undefined) {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-openttd-green/20 border-openttd-green/40 text-openttd-green'
    case 'medium':
      return 'bg-openttd-cream/40 border-openttd-brown/40 text-openttd-brown'
    case 'hard':
      return 'bg-openttd-blue/20 border-openttd-blue/40 text-openttd-blue'
    case 'expert':
      return 'bg-destructive/20 border-destructive/40 text-destructive'
    case 'legendary':
      return 'bg-openttd-purple/20 border-openttd-purple/40 text-openttd-purple'
    default:
      return 'bg-openttd-grey/20 border-openttd-grey/40 text-openttd-grey'
  }
}
</script>