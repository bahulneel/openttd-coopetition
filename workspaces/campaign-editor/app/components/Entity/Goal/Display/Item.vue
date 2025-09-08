<template>
  <div
    class="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
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
      <DomainMetadataDisplayItem :entity="goal" />
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

</script>