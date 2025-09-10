<template>
  <div class="flex items-center space-x-3">
    <span class="font-medium text-foreground">{{ campaign.name }}</span>
    <DomainMetaInfoDisplayCard
      :meta-info="campaign.meta"
      as-partial
    />
    <span class="text-sm text-muted-foreground"> {{ campaign.scenarios?.length || 0 }} scenarios </span>
  </div>
</template>

<script setup lang="ts">
import type { Campaign } from '~/types'

defineOptions({
  name: 'EntityCampaignDisplaySummary',
})

interface Props {
  campaign: Campaign
}

defineProps<Props>()
</script>
