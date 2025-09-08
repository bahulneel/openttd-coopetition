<template>
  <FormField v-slot="{ componentField }" :name="name">
    <MoleculeFormGroup>
      <FormField v-slot="{ componentField: countField }" name="count">
        <FormItem>
          <FormLabel>Number of Stations</FormLabel>
          <FormControl>
            <Input v-bind="countField" type="number" placeholder="e.g., 5" class="openttd-input" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField: locationField }" name="location">
        <FormItem>
          <FormLabel>Location (Optional)</FormLabel>
          <FormControl>
            <Input v-bind="locationField" placeholder="e.g., Near coal mine" class="openttd-input" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </MoleculeFormGroup>
  </FormField>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainObjectiveStationBuiltInputDetails'
})

interface Props {
  name: string
}

defineProps<Props>()
</script>