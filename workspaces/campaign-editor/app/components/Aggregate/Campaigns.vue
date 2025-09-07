<template>
  <div class="space-y-4">
    <EntityCampaignDisplayCard 
      v-for="campaign in campaigns" 
      :key="entityId(campaign)" 
      :campaign="campaign"
      @edit="$emit('edit', $event)"
      @duplicate="$emit('duplicate', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Campaign } from '~/types'

defineOptions({
  name: 'AggregateCampaigns'
})

interface Props {
  campaigns: Campaign[]
}

defineProps<Props>()

defineEmits<{
  edit: [campaign: Campaign]
  duplicate: [campaign: Campaign]
  delete: [campaign: Campaign]
}>()
</script>