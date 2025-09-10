<template>
  <div class="space-y-4">
    <TemplateLayoutList>
      <DomainCampaignScenarioDisplayItem v-for="campaignScenario in campaignScenarios"
        :key="`${referenceId(campaignScenario.include)}-${campaignScenario.order || 0}`"
        :campaign-scenario="campaignScenario" @edit="$emit('edit', $event)" />
    </TemplateLayoutList>

    <!-- Action Slot -->
    <div v-if="$slots.actions" class="flex justify-end">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CampaignScenario } from '~/types'

defineOptions({
  name: 'AggregateCampaignScenarios'
})

interface Props {
  campaignScenarios: CampaignScenario[]
}

defineProps<Props>()

defineEmits<{
  edit: [campaignScenario: CampaignScenario]
}>()
</script>
