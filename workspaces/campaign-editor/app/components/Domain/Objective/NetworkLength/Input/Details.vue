<template>
  <FormField :name="name">
    <MoleculeFormGroup>
      <FormField
        v-slot="{ componentField: amountField }"
        name="amount"
      >
        <FormItem>
          <FormLabel>Amount (Tiles)</FormLabel>
          <FormControl>
            <Input
              v-bind="amountField"
              type="number"
              placeholder="e.g., 1000"
              class="openttd-input"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField
        v-slot="{ componentField: trackTypeField }"
        name="track_type"
      >
        <FormItem>
          <FormLabel>Track Type</FormLabel>
          <FormControl>
            <Input
              v-bind="trackTypeField"
              placeholder="e.g., RAIL"
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
  name: 'DomainObjectiveNetworkLengthInputDetails',
})

interface Props {
  name: string
}

defineProps<Props>()
</script>
