<template>
  <div class="flex items-center space-x-3">
    <span class="font-medium text-foreground">{{ campaign.name }}</span>
    <Badge :class="getDifficultyClasses(campaign.meta?.difficulty)" class="text-xs">
      {{ campaign.meta?.difficulty || 'Unknown' }}
    </Badge>
    <span class="text-sm text-muted-foreground">
      {{ campaign.scenarios?.length || 0 }} scenarios
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Campaign } from '~/types'

defineOptions({
  name: 'EntityCampaignDisplaySummary'
})

interface Props {
  campaign: Campaign
}

defineProps<Props>()

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