<template>
  <MoleculeFormGroup>
    <FormField v-slot="{ componentField }" name="target_population">
      <FormItem>
        <FormLabel>Target Population</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="number" placeholder="e.g., 5000" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="town_id">
      <FormItem>
        <FormLabel>Town ID</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="e.g., TOWN_001" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </MoleculeFormGroup>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainObjectiveTownGrowthInputDetails'
})
</script>