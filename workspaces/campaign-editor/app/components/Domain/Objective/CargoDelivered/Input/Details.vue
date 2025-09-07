<template>
  <MoleculeFormGroup>
    <FormField v-slot="{ componentField }" name="amount">
      <FormItem>
        <FormLabel>Amount</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="number" placeholder="e.g., 1000" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="cargo">
      <FormItem>
        <FormLabel>Cargo Type</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="e.g., COAL" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </MoleculeFormGroup>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainObjectiveCargoDeliveredInputDetails'
})
</script>