<template>
  <Card class="openttd-titlebar">
    <CardContent class="pt-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-2">
            <CardTitle class="text-lg font-semibold">{{ scenario.name }}</CardTitle>
            <Badge v-if="scenario.required" variant="default" class="text-xs">
              Required
            </Badge>
            <Badge v-else variant="secondary" class="text-xs">
              Optional
            </Badge>
          </div>

          <p class="text-muted-foreground mb-3">
            {{ scenario.meta?.description || scenario.comment || 'No description available' }}
          </p>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="font-medium text-foreground">Order:</span>
              <p class="text-muted-foreground">{{ scenario.order }}</p>
            </div>
            <div v-if="scenario.meta?.difficulty">
              <span class="font-medium text-foreground">Difficulty:</span>
              <Badge :class="getDifficultyClasses(scenario.meta.difficulty)" class="ml-1 text-xs">
                {{ scenario.meta.difficulty }}
              </Badge>
            </div>
            <div v-if="scenario.meta?.estimated_time">
              <span class="font-medium text-foreground">Time:</span>
              <p class="text-muted-foreground">{{ scenario.meta.estimated_time }}</p>
            </div>
            <div v-if="scenario.goals && scenario.goals.length > 0">
              <span class="font-medium text-foreground">Goals:</span>
              <p class="text-muted-foreground">{{ scenario.goals.length }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2 ml-4">
          <Button variant="outline" size="sm" class="openttd-button" @click="$emit('edit', scenario)">
            ✏️ Edit
          </Button>
          <Button variant="outline" size="sm" class="openttd-button" @click="$emit('duplicate', scenario)">
            📋 Copy
          </Button>
          <Button variant="outline" size="sm" class="openttd-button text-red-600 hover:text-red-700" @click="$emit('delete', scenario)">
            🗑️ Delete
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { Scenario } from '~/types'

defineOptions({
  name: 'EntityScenarioDisplayCard'
})

interface Props {
  scenario: Scenario
}

defineProps<Props>()

defineEmits<{
  edit: [scenario: Scenario]
  duplicate: [scenario: Scenario]
  delete: [scenario: Scenario]
}>()

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