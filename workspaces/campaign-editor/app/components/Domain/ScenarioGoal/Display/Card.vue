<template>
  <Card class="scenario-goal-card hover:shadow-lg transition-shadow duration-200">
    <CardContent class="space-y-3 p-4">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <CardTitle class="font-semibold text-foreground text-sm">
            Goal {{ scenarioGoal.order || 0 }}
          </CardTitle>
          <p class="text-xs text-muted-foreground">
            ID: {{ scenarioGoal.include.__ref.id }}
          </p>
        </div>

        <div class="flex items-center space-x-1">
          <Badge v-if="scenarioGoal.required" variant="default" class="text-xs">
            Required
          </Badge>
          <Badge v-else variant="secondary" class="text-xs">
            Optional
          </Badge>
        </div>
      </div>

      <!-- Goal Type -->
      <div class="text-sm">
        <span class="text-muted-foreground">Type:</span>
        <Badge variant="outline" class="ml-2 text-xs">
          {{ scenarioGoal.include.__ref.type }}
        </Badge>
      </div>

      <!-- Comment -->
      <p v-if="scenarioGoal.comment" class="text-sm text-muted-foreground line-clamp-2">
        {{ scenarioGoal.comment }}
      </p>

      <!-- Branch -->
      <div v-if="scenarioGoal.branch" class="text-sm">
        <span class="text-muted-foreground">Branch:</span>
        <span class="text-foreground ml-1">{{ scenarioGoal.branch }}</span>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { ScenarioGoal } from '~/types'

defineOptions({
  name: 'DomainScenarioGoalDisplayCard'
})

interface Props {
  scenarioGoal: ScenarioGoal
}

defineProps<Props>()
</script>
