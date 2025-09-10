<template>
  <FormField
    v-slot="{ componentField }"
    :name="name"
  >
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Game Settings</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label for="economy">Economy</Label>
          <Select
            v-bind="componentField"
            name="economy"
          >
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
            id="disasters"
            v-bind="componentField"
            name="disasters"
            type="checkbox"
            class="openttd-checkbox"
          />
          <label
            for="disasters"
            class="text-sm"
            >Disasters</label
          >
        </div>

        <div class="flex items-center space-x-2">
          <input
            id="breakdowns"
            v-bind="componentField"
            name="breakdowns"
            type="checkbox"
            class="openttd-checkbox"
          />
          <label
            for="breakdowns"
            class="text-sm"
            >Breakdowns</label
          >
        </div>

        <div class="flex items-center space-x-2">
          <input
            id="inflation"
            v-bind="componentField"
            name="inflation"
            type="checkbox"
            class="openttd-checkbox"
          />
          <label
            for="inflation"
            class="text-sm"
            >Inflation</label
          >
        </div>

        <div class="flex items-center space-x-2">
          <input
            id="seasons"
            v-bind="componentField"
            name="seasons"
            type="checkbox"
            class="openttd-checkbox"
          />
          <label
            for="seasons"
            class="text-sm"
            >Seasons</label
          >
        </div>
      </div>
    </div>
  </FormField>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainGameSettingsInput',
})

interface Props {
  name: string
}

defineProps<Props>()
</script>
