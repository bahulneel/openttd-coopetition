<template>
  <MoleculeFormGroup>
    <FormField v-slot="{ componentField }" name="count">
      <FormItem>
        <FormLabel>Number of Stations</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="number" placeholder="e.g., 5" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="location">
      <FormItem>
        <FormLabel>Location (Optional)</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="e.g., Near coal mine" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </MoleculeFormGroup>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainObjectiveStationBuiltInputDetails'
})
</script>