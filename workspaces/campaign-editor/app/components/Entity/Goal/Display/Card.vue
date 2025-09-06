<template>
  <Card class="openttd-titlebar">
    <CardContent class="pt-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-2">
            <CardTitle class="text-lg font-semibold">{{ goal.name }}</CardTitle>
            <EntityGoalDisplayBadge :goal="goal" />
          </div>

          <p class="text-muted-foreground mb-3">
            {{ goal.meta?.description || goal.comment || 'No description available' }}
          </p>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="font-medium text-foreground">Objective:</span>
              <DomainObjectiveDefaultDisplaySummary :objective="goal.objective" />
            </div>
            <div v-if="goal.result">
              <span class="font-medium text-foreground">Reward:</span>
              <DomainRewardSetDisplaySummary :reward-set="goal.result" />
            </div>
            <div v-if="goal.constraints?.players">
              <span class="font-medium text-foreground">Players:</span>
              <p class="text-muted-foreground">
                {{ goal.constraints.players.min || 1 }}-{{ goal.constraints.players.max || 8 }}
              </p>
            </div>
            <div v-if="goal.constraints?.date">
              <span class="font-medium text-foreground">Date Range:</span>
              <p class="text-muted-foreground">
                {{ goal.constraints.date.min || 1950 }}-{{ goal.constraints.date.max || 2050 }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2 ml-4">
          <Button variant="outline" size="sm" class="openttd-button" @click="$emit('edit', goal)">
            ✏️ Edit
          </Button>
          <Button variant="outline" size="sm" class="openttd-button" @click="$emit('duplicate', goal)">
            📋 Copy
          </Button>
          <Button variant="outline" size="sm" class="openttd-button text-red-600 hover:text-red-700" @click="$emit('delete', goal)">
            🗑️ Delete
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

defineOptions({
  name: 'EntityGoalDisplayCard'
})

interface Props {
  goal: Goal
}

defineProps<Props>()

defineEmits<{
  edit: [goal: Goal]
  duplicate: [goal: Goal]
  delete: [goal: Goal]
}>()
</script>