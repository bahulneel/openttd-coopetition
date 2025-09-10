<template>
  <div
    class="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
    <div class="flex-1 min-w-0">
      <div class="flex items-center space-x-3">
        <h3 class="font-medium text-foreground truncate">{{ campaign.name }}</h3>
        <DomainMetaInfoDisplayCard :meta-info="campaign.meta" as-partial />
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
</script>