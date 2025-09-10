<template>
  <AggregateInput v-model="modelValue" class="space-y-4">
    <template #collection="{ items, remove }">
      <div v-for="(campaignScenario, index) in items"
        :key="`${referenceId(campaignScenario.include)}-${campaignScenario.order || 0}`" class="space-y-2">
        <div class="flex items-center justify-between p-3 border border-border rounded-lg">
          <div class="flex-1">
            <DomainCampaignScenarioDisplayItem :campaign-scenario="campaignScenario" @edit="handleEdit(index)" />
          </div>
          <Button type="button" variant="ghost" size="sm" class="text-destructive hover:text-destructive-foreground"
            @click="remove(index)">
            🗑️ Remove
          </Button>
        </div>
      </div>
    </template>

    <template #empty>
      <p>No campaign scenarios added yet.</p>
    </template>

    <template #new-item="{ add }">
      <Button type="button" variant="outline" class="openttd-button" @click="add">
        ➕ Add Campaign Scenario
      </Button>
    </template>
  </AggregateInput>
</template>

<script setup lang="ts" generic="T extends CampaignScenario">
import type { CampaignScenario } from '~/types'

defineOptions({
  name: 'AggregateCampaignScenariosInput'
})

interface Props<T extends CampaignScenario> {
  modelValue: T[]
}

const props = defineProps<Props<T>>()

const emit = defineEmits<{
  'update:modelValue': [value: T[]]
  'add-item': []
  'edit': [index: number, campaignScenario: T]
}>()

const modelValue = defineModel<T[]>({ required: true })

function handleEdit(index: number) {
  const campaignScenario = modelValue.value[index]
  emit('edit', index, campaignScenario)
}
</script>
