<template>
  <div class="flex items-center space-x-2">
    <Badge :class="getGoalTypeBadgeClass(goal.type)">
      {{ goal.type || 'player' }}
    </Badge>
    <Badge :class="getDifficultyBadgeClass(goal.meta?.difficulty)">
      {{ goal.meta?.difficulty || 'medium' }}
    </Badge>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

defineOptions({
  name: 'EntityGoalDisplayBadge',
})

interface Props {
  goal: Goal
}

defineProps<Props>()

function getGoalTypeBadgeClass(type: string | undefined) {
  switch (type) {
    case 'player':
      return 'bg-openttd-blue text-white'
    case 'company':
      return 'bg-openttd-purple text-white'
    case 'scenario':
      return 'bg-openttd-orange text-white'
    case 'campaign':
      return 'bg-openttd-red text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

function getDifficultyBadgeClass(difficulty: string | undefined) {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500 text-white'
    case 'medium':
      return 'bg-yellow-500 text-white'
    case 'hard':
      return 'bg-orange-500 text-white'
    case 'expert':
      return 'bg-red-500 text-white'
    case 'legendary':
      return 'bg-purple-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}
</script>
