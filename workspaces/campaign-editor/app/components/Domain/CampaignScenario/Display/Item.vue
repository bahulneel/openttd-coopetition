<template>
  <div class="space-y-2">
    <!-- Join-specific details -->
    <div class="flex items-center space-x-2 text-sm">
      <Badge v-if="campaignScenario.required" variant="default" class="text-xs">
        Required
      </Badge>
      <Badge v-else variant="secondary" class="text-xs">
        Optional
      </Badge>
      <span class="text-muted-foreground">Order: {{ campaignScenario.order || 0 }}</span>
      <span v-if="campaignScenario.branch" class="text-muted-foreground">
        Branch: {{ campaignScenario.branch }}
      </span>
    </div>

    <!-- Scenario info (currently using include string, should be entity reference) -->
    <div class="p-3 border border-border rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-foreground truncate">
            {{ campaignScenario.include }}
          </h4>
          <p class="text-sm text-muted-foreground mt-1">
            Include file: {{ campaignScenario.include }}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <Button variant="ghost" size="sm" @click="$emit('edit', campaignScenario)">
            ✏️
          </Button>
        </div>
      </div>
    </div>

    <!-- Join-specific comment -->
    <p v-if="campaignScenario.comment" class="text-sm text-muted-foreground italic">
      {{ campaignScenario.comment }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { CampaignScenario, Scenario } from '~/types'

defineOptions({
  name: 'DomainCampaignScenarioDisplayItem'
})

interface Props {
  campaignScenario: CampaignScenario
}

const props = defineProps<Props>()

defineEmits<{
  edit: [campaignScenario: CampaignScenario]
}>()

// TODO: When CampaignScenario is updated to use EntityReference<Scenario>,
// this component should use WithEntity pattern like ScenarioGoal components
</script>
