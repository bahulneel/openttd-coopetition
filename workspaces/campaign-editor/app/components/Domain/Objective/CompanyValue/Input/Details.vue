<template>
  <MoleculeFormGroup>
    <FormField v-slot="{ componentField }" name="min_value">
      <FormItem>
        <FormLabel>Minimum Company Value (£)</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="number" placeholder="e.g., 1000000" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </MoleculeFormGroup>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainObjectiveCompanyValueInputDetails'
})
</script>