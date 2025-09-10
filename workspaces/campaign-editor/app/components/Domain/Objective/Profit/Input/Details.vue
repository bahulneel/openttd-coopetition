<template>
  <FormField :name="name">
    <MoleculeFormGroup>
      <FormField
        v-slot="{ componentField: amountField }"
        name="amount"
      >
        <FormItem>
          <FormLabel>Amount (£)</FormLabel>
          <FormControl>
            <Input
              v-bind="amountField"
              type="number"
              placeholder="e.g., 100000"
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
  name: 'DomainObjectiveProfitInputDetails',
})

interface Props {
  name: string
}

defineProps<Props>()
</script>
