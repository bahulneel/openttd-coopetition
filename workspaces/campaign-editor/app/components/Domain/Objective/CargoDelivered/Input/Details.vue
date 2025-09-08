<template>
  <FormField v-slot="{ componentField }" :name="name">
    <MoleculeFormGroup>
      <FormField v-slot="{ componentField: amountField }" name="amount">
        <FormItem>
          <FormLabel>Amount</FormLabel>
          <FormControl>
            <Input v-bind="amountField" type="number" placeholder="e.g., 1000" class="openttd-input" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField: cargoField }" name="cargo">
        <FormItem>
          <FormLabel>Cargo Type</FormLabel>
          <FormControl>
            <Input v-bind="cargoField" placeholder="e.g., COAL" class="openttd-input" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </MoleculeFormGroup>
  </FormField>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainObjectiveCargoDeliveredInputDetails'
})

interface Props {
  name: string
}

defineProps<Props>()
</script>