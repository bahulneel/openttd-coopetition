<template>
  <MoleculeFormGroup>
    <FormField v-slot="{ componentField }" name="amount">
      <FormItem>
        <FormLabel>Amount (Tiles)</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="number" placeholder="e.g., 1000" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="track_type">
      <FormItem>
        <FormLabel>Track Type</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="e.g., RAIL" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </MoleculeFormGroup>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainObjectiveNetworkLengthInputDetails'
})
</script>