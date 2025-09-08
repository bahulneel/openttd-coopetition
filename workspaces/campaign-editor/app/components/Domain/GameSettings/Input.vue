<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-foreground">Game Settings</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label for="economy">Economy</Label>
        <Select :model-value="settings.economy" @update:model-value="updateField('economy', $event)">
          <SelectTrigger class="openttd-input">
            <SelectValue placeholder="Select economy type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="flat">Flat</SelectItem>
            <SelectItem value="realistic">Realistic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="flex items-center space-x-2">
        <input
id="disasters" :checked="settings.disasters" type="checkbox" class="openttd-checkbox"
          @change="updateField('disasters', ($event.target as HTMLInputElement).checked)">
        <label for="disasters" class="text-sm">Disasters</label>
      </div>

      <div class="flex items-center space-x-2">
        <input
id="breakdowns" :checked="settings.breakdowns" type="checkbox" class="openttd-checkbox"
          @change="updateField('breakdowns', ($event.target as HTMLInputElement).checked)">
        <label for="breakdowns" class="text-sm">Breakdowns</label>
      </div>

      <div class="flex items-center space-x-2">
        <input
id="inflation" :checked="settings.inflation" type="checkbox" class="openttd-checkbox"
          @change="updateField('inflation', ($event.target as HTMLInputElement).checked)">
        <label for="inflation" class="text-sm">Inflation</label>
      </div>

      <div class="flex items-center space-x-2">
        <input
id="seasons" :checked="settings.seasons" type="checkbox" class="openttd-checkbox"
          @change="updateField('seasons', ($event.target as HTMLInputElement).checked)">
        <label for="seasons" class="text-sm">Seasons</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CampaignSettings } from '~/types'

defineOptions({
  name: 'DomainGameSettingsInput'
})

interface Props {
  settings: CampaignSettings
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:settings': [value: CampaignSettings]
}>()

function updateField<K extends keyof CampaignSettings>(field: K, value: CampaignSettings[K]) {
  emit('update:settings', {
    ...props.settings,
    [field]: value
  })
}
</script>
