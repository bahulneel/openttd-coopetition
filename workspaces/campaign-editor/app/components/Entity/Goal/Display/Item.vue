<template>
  <div class="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
    <div class="flex-1 min-w-0">
      <div class="flex items-center space-x-3">
        <h3 class="font-medium text-foreground truncate">{{ goal.name }}</h3>
        <EntityGoalDisplayBadge :goal="goal" />
      </div>
      <p class="text-sm text-muted-foreground mt-1">
        {{ goal.meta?.description || goal.comment || 'No description available' }}
      </p>
    </div>

    <div class="flex items-center space-x-2">
      <span class="text-xs text-muted-foreground">
        {{ formatDate(goal.__meta?.modified) }}
      </span>
      <Button variant="ghost" size="sm" @click="$emit('edit', goal)">
        ✏️
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

defineOptions({
  name: 'EntityGoalDisplayItem'
})

interface Props {
  goal: Goal
}

defineProps<Props>()

defineEmits<{
  edit: [goal: Goal]
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
</script>