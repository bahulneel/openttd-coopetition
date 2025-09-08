<template>
  <div class="space-y-4">
    <!-- Basic Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <span class="font-medium text-foreground">Include File:</span>
        <span class="text-muted-foreground ml-2 font-mono">{{ campaignScenario.include }}</span>
      </div>
      <div>
        <span class="font-medium text-foreground">Order:</span>
        <span class="text-muted-foreground ml-2">{{ campaignScenario.order || 0 }}</span>
      </div>
      <div>
        <span class="font-medium text-foreground">Required:</span>
        <Badge :variant="campaignScenario.required ? 'default' : 'secondary'" class="ml-2">
          {{ campaignScenario.required ? 'Yes' : 'No' }}
        </Badge>
      </div>
      <div v-if="campaignScenario.branch">
        <span class="font-medium text-foreground">Branch:</span>
        <span class="text-muted-foreground ml-2">{{ campaignScenario.branch }}</span>
      </div>
    </div>

    <!-- Comment -->
    <div v-if="campaignScenario.comment" class="text-sm">
      <span class="font-medium text-foreground">Comment:</span>
      <p class="text-muted-foreground mt-1">{{ campaignScenario.comment }}</p>
    </div>

    <!-- Condition -->
    <div v-if="campaignScenario.condition" class="text-sm">
      <span class="font-medium text-foreground">Condition:</span>
      <div class="text-muted-foreground mt-1">
        <p>Type: {{ campaignScenario.condition.type }}</p>
        <p v-if="campaignScenario.condition.threshold">Threshold: {{ campaignScenario.condition.threshold }}</p>
        <p v-if="campaignScenario.condition.target">Target: {{ campaignScenario.condition.target }}</p>
        <p v-if="campaignScenario.condition.comment">{{ campaignScenario.condition.comment }}</p>
      </div>
    </div>

    <!-- Overrides -->
    <div v-if="campaignScenario.overrides" class="text-sm">
      <span class="font-medium text-foreground">Overrides:</span>
      <div class="text-muted-foreground mt-1">
        <div v-if="campaignScenario.overrides.shared">
          <p class="font-medium">Shared Infrastructure:</p>
          <ul class="ml-4 list-disc">
            <li v-if="campaignScenario.overrides.shared.track">Track</li>
            <li v-if="campaignScenario.overrides.shared.stations">Stations</li>
            <li v-if="campaignScenario.overrides.shared.vehicles">Vehicles</li>
            <li v-if="campaignScenario.overrides.shared.depots">Depots</li>
          </ul>
        </div>
        <div v-if="campaignScenario.overrides.result">
          <p class="font-medium">Result Rewards:</p>
          <ul class="ml-4 list-disc">
            <li v-if="campaignScenario.overrides.result.cash">Cash: {{ campaignScenario.overrides.result.cash }}</li>
            <li v-if="campaignScenario.overrides.result.score">Score: {{ campaignScenario.overrides.result.score }}</li>
            <li v-if="campaignScenario.overrides.result.reputation">Reputation: {{
              campaignScenario.overrides.result.reputation }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CampaignScenario } from '~/types'

defineOptions({
  name: 'DomainCampaignScenarioDisplayDetails'
})

interface Props {
  campaignScenario: CampaignScenario
}

defineProps<Props>()
</script>
