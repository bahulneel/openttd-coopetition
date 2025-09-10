<template>
  <FormField :name="name">
    <MoleculeFormGroup>
      <FormField
        v-slot="{ componentField: targetPopulationField }"
        name="target_population"
      >
        <FormItem>
          <FormLabel>Target Population</FormLabel>
          <FormControl>
            <Input
              v-bind="targetPopulationField"
              type="number"
              placeholder="e.g., 5000"
              class="openttd-input"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField
        v-slot="{ componentField: townIdField }"
        name="town_id"
      >
        <FormItem>
          <FormLabel>Town ID</FormLabel>
          <FormControl>
            <Input
              v-bind="townIdField"
              placeholder="e.g., TOWN_001"
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
  name: 'DomainObjectiveTownGrowthInputDetails',
})

interface Props {
  name: string
}

defineProps<Props>()
</script>
