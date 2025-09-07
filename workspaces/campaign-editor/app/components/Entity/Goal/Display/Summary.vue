<template>
  <div class="flex items-center space-x-3">
    <span class="font-medium text-foreground">{{ goal.name }}</span>
    <Badge :class="getGoalTypeBadgeClass(goal.type)" class="text-xs">
      {{ goal.type || 'player' }}
    </Badge>
    <Badge v-if="goal.meta?.difficulty" :class="getDifficultyBadgeClass(goal.meta.difficulty)" class="text-xs">
      {{ goal.meta.difficulty }}
    </Badge>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

defineOptions({
  name: 'EntityGoalDisplaySummary'
})

interface Props {
  goal: Goal
}

defineProps<Props>()

function getGoalTypeBadgeClass(type: string | undefined) {
  switch (type) {
    case 'player': return 'bg-openttd-blue text-white'
    case 'company': return 'bg-openttd-purple text-white'
    case 'scenario': return 'bg-openttd-orange text-white'
    case 'campaign': return 'bg-openttd-red text-white'
    default: return 'bg-gray-500 text-white'
  }
}

function getDifficultyBadgeClass(difficulty: string | undefined) {
  switch (difficulty) {
    case 'easy': return 'bg-green-500 text-white'
    case 'medium': return 'bg-yellow-500 text-white'
    case 'hard': return 'bg-orange-500 text-white'
    case 'expert': return 'bg-red-500 text-white'
    case 'legendary': return 'bg-purple-500 text-white'
    default: return 'bg-gray-500 text-white'
  }
}
</script>