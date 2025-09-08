<template>
  <div
    class="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
    <div class="flex-1 min-w-0">
      <div class="flex items-center space-x-3">
        <h3 class="font-medium text-foreground truncate">{{ campaign.name }}</h3>
        <Badge :class="getDifficultyClasses(campaign.meta?.difficulty)" class="text-xs">
          {{ campaign.meta?.difficulty || 'Unknown' }}
        </Badge>
      </div>
      <p class="text-sm text-muted-foreground mt-1">
        {{ campaign.scenarios?.length || 0 }} scenarios • ID: {{ entityId(campaign) }}
      </p>
    </div>

    <div class="flex items-center space-x-2">
      <DomainMetadataDisplayItem :entity="campaign" />
      <Button variant="ghost" size="sm" @click="$emit('edit', campaign)">
        ✏️
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Campaign } from '~/types'

defineOptions({
  name: 'EntityCampaignDisplayItem'
})

interface Props {
  campaign: Campaign
}

defineProps<Props>()

defineEmits<{
  edit: [campaign: Campaign]
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