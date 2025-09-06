<template>
  <div class="space-y-4">
    <EntityGoalDisplayCard 
      v-for="goal in goals" 
      :key="entityId(goal)" 
      :goal="goal"
      @edit="$emit('edit', $event)"
      @duplicate="$emit('duplicate', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

defineOptions({
  name: 'AggregateGoals'
})

interface Props {
  goals: Goal[]
}

defineProps<Props>()

defineEmits<{
  edit: [goal: Goal]
  duplicate: [goal: Goal]
  delete: [goal: Goal]
}>()
</script>