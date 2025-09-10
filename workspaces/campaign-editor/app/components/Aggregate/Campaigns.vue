<template>
  <div class="space-y-4">
    <TemplateLayoutGrid class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <EntityCampaignDisplayCard
v-for="campaign in campaigns" :key="entityId(campaign)" :campaign="campaign"
        @edit="$emit('edit', $event)" @duplicate="$emit('duplicate', $event)" @delete="$emit('delete', $event)" />
    </TemplateLayoutGrid>

    <!-- Action Slot -->
    <div v-if="$slots.actions" class="flex justify-end">
      <slot name="actions" ></slot>
    </div>
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