<template>
  <div class="flex items-center space-x-3">
    <span class="font-medium text-foreground">{{ goal.name }}</span>
    <EntityGoalDisplayBadge :goal="goal" />
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

defineOptions({
  name: 'EntityGoalDisplaySummary',
})

interface Props {
  goal: Goal
}

defineProps<Props>()
</script>
