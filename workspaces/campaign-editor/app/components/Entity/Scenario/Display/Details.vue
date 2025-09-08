<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex items-center space-x-2">
        <Button variant="outline" class="openttd-button" @click="$emit('edit', scenario)">
          ✏️ Edit Scenario
        </Button>
      </div>
    </div>

    <!-- Meta Information -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>ℹ️</span>
          <span>Scenario Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="scenario.meta?.difficulty">
            <span class="font-medium text-foreground">Difficulty:</span>
            <Badge :class="getDifficultyClasses(scenario.meta.difficulty)" class="ml-2">
              {{ scenario.meta.difficulty }}
            </Badge>
          </div>
          <div v-if="scenario.meta?.estimated_time">
            <span class="font-medium text-foreground">Estimated Time:</span>
            <span class="text-muted-foreground ml-2">{{ scenario.meta.estimated_time }}</span>
          </div>
          <div v-if="scenario.meta?.author">
            <span class="font-medium text-foreground">Author:</span>
            <span class="text-muted-foreground ml-2">{{ scenario.meta.author }}</span>
          </div>
          <div>
            <span class="font-medium text-foreground">Goals:</span>
            <span class="text-muted-foreground ml-2">{{ scenario.goals?.length || 0 }}</span>
          </div>
        </div>

        <div v-if="scenario.meta?.description">
          <span class="font-medium text-foreground">Description:</span>
          <p class="text-muted-foreground mt-1">{{ scenario.meta.description }}</p>
        </div>

        <div v-if="scenario.meta?.tags && scenario.meta.tags.length > 0">
          <span class="font-medium text-foreground">Tags:</span>
          <div class="flex flex-wrap gap-2 mt-1">
            <Badge v-for="tag in scenario.meta.tags" :key="tag" variant="secondary">
              {{ tag }}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Goals -->
    <Card v-if="scenario.goals && scenario.goals.length > 0" class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>🎯</span>
          <span>Goals ({{ scenario.goals.length }})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <DomainScenarioGoalDisplayItem
v-for="(goal, index) in scenario.goals" :key="index" :scenario-goal="goal"
            @edit="$emit('edit', goal)" />
        </div>
      </CardContent>
    </Card>

    <!-- Metadata -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>📊</span>
          <span>Metadata</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DomainMetadataDisplayDetails :entity="scenario" />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { Scenario, ScenarioGoal } from '~/types'

defineOptions({
  name: 'EntityScenarioDisplayDetails'
})

interface Props {
  scenario: Scenario
}

defineProps<Props>()

defineEmits<{
  edit: [scenario: Scenario | ScenarioGoal]
}>()

function formatDate(timestamp: number | undefined) {
  if (!timestamp) return 'Unknown'

  const date = new Date(timestamp)
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

function getGoalTypeBadgeClass(type: string | undefined) {
  switch (type) {
    case 'player': return 'bg-openttd-blue text-white'
    case 'company': return 'bg-openttd-purple text-white'
    case 'scenario': return 'bg-openttd-orange text-white'
    case 'campaign': return 'bg-openttd-red text-white'
    default: return 'bg-gray-500 text-white'
  }
}
</script>