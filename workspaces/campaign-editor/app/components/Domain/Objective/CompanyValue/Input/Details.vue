<template>
  <FormField :name="name">
    <MoleculeFormGroup>
      <FormField
        v-slot="{ componentField: minValueField }"
        name="min_value"
      >
        <FormItem>
          <FormLabel>Minimum Company Value (£)</FormLabel>
          <FormControl>
            <Input
              v-bind="minValueField"
              type="number"
              placeholder="e.g., 1000000"
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
  name: 'DomainObjectiveCompanyValueInputDetails',
})

interface Props {
  name: string
}

defineProps<Props>()
</script>
