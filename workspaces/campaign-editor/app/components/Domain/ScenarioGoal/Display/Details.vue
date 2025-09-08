<template>
  <div class="space-y-4">
    <!-- Basic Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <span class="font-medium text-foreground">Goal ID:</span>
        <span class="text-muted-foreground ml-2 font-mono">{{ scenarioGoal.include.__ref.id }}</span>
      </div>
      <div>
        <span class="font-medium text-foreground">Goal Type:</span>
        <span class="text-muted-foreground ml-2">{{ scenarioGoal.include.__ref.type }}</span>
      </div>
      <div>
        <span class="font-medium text-foreground">Order:</span>
        <span class="text-muted-foreground ml-2">{{ scenarioGoal.order || 0 }}</span>
      </div>
      <div>
        <span class="font-medium text-foreground">Required:</span>
        <Badge :variant="scenarioGoal.required ? 'default' : 'secondary'" class="ml-2">
          {{ scenarioGoal.required ? 'Yes' : 'No' }}
        </Badge>
      </div>
    </div>

    <!-- Branch Info -->
    <div v-if="scenarioGoal.branch" class="text-sm">
      <span class="font-medium text-foreground">Branch:</span>
      <span class="text-muted-foreground ml-2">{{ scenarioGoal.branch }}</span>
    </div>

    <!-- Comment -->
    <div v-if="scenarioGoal.comment" class="text-sm">
      <span class="font-medium text-foreground">Comment:</span>
      <p class="text-muted-foreground mt-1">{{ scenarioGoal.comment }}</p>
    </div>

    <!-- Condition -->
    <div v-if="scenarioGoal.condition" class="text-sm">
      <span class="font-medium text-foreground">Condition:</span>
      <div class="text-muted-foreground mt-1">
        <p>Type: {{ scenarioGoal.condition.type }}</p>
        <p v-if="scenarioGoal.condition.threshold">Threshold: {{ scenarioGoal.condition.threshold }}</p>
        <p v-if="scenarioGoal.condition.target">Target: {{ scenarioGoal.condition.target }}</p>
        <p v-if="scenarioGoal.condition.comment">{{ scenarioGoal.condition.comment }}</p>
      </div>
    </div>

    <!-- Overrides -->
    <div v-if="scenarioGoal.overrides" class="text-sm">
      <span class="font-medium text-foreground">Overrides:</span>
      <div class="text-muted-foreground mt-1">
        <p v-if="scenarioGoal.overrides.comment">{{ scenarioGoal.overrides.comment }}</p>
        <!-- Add more override details as needed -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScenarioGoal } from '~/types'

defineOptions({
  name: 'DomainScenarioGoalDisplayDetails'
})

interface Props {
  scenarioGoal: ScenarioGoal
}

defineProps<Props>()
</script>
