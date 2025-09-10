<template>
  <FormField :name="name">
    <MoleculeFormGroup>
      <FormField
        v-slot="{ componentField: typeField }"
        name="type"
      >
        <FormItem>
          <FormLabel>Objective Type</FormLabel>
          <FormControl>
            <Select v-bind="typeField">
              <SelectTrigger class="openttd-input">
                <SelectValue placeholder="Select objective type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cargo_delivered">Cargo Delivered</SelectItem>
                <SelectItem value="network_length">Network Length</SelectItem>
                <SelectItem value="profit">Profit</SelectItem>
                <SelectItem value="station_built">Stations Built</SelectItem>
                <SelectItem value="company_value">Company Value</SelectItem>
                <SelectItem value="town_growth">Town Growth</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField
        v-slot="{ componentField: timeLimitField }"
        name="time_limit"
      >
        <FormItem>
          <FormLabel>Time Limit (Optional)</FormLabel>
          <FormControl>
            <Input
              v-bind="timeLimitField"
              type="number"
              placeholder="e.g., 365 (days)"
              class="openttd-input"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </MoleculeFormGroup>
  </FormField>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainObjectiveDefaultInputDetails',
})

interface Props {
  name: string
}

defineProps<Props>()
</script>
