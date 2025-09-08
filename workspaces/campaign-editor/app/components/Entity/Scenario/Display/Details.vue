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
          <DomainScenarioGoalDisplayItem v-for="(goal, index) in scenario.goals" :key="index" :scenario-goal="goal"
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

</script>