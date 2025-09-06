<template>
  <MoleculeFormGroup>
    <FormField v-slot="{ componentField }" name="amount">
      <FormItem>
        <FormLabel>Amount (£)</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="number" placeholder="e.g., 100000" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </MoleculeFormGroup>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainObjectiveProfitInputDetails'
})
</script>