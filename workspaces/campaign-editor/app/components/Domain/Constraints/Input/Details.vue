<template>
  <FormField :name="name">
    <MoleculeFormGroup>
      <FormField
        v-slot="{ componentField: playersMinField }"
        name="players.min"
      >
        <FormItem>
          <FormLabel>Minimum Players</FormLabel>
          <FormControl>
            <Input
              v-bind="playersMinField"
              type="number"
              min="1"
              max="8"
              class="openttd-input"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField
        v-slot="{ componentField: playersMaxField }"
        name="players.max"
      >
        <FormItem>
          <FormLabel>Maximum Players</FormLabel>
          <FormControl>
            <Input
              v-bind="playersMaxField"
              type="number"
              min="1"
              max="8"
              class="openttd-input"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField
        v-slot="{ componentField: dateMinField }"
        name="date.min"
      >
        <FormItem>
          <FormLabel>Minimum Date</FormLabel>
          <FormControl>
            <Input
              v-bind="dateMinField"
              type="number"
              placeholder="e.g., 1950"
              class="openttd-input"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField
        v-slot="{ componentField: dateMaxField }"
        name="date.max"
      >
        <FormItem>
          <FormLabel>Maximum Date</FormLabel>
          <FormControl>
            <Input
              v-bind="dateMaxField"
              type="number"
              placeholder="e.g., 2050"
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
  name: 'DomainConstraintsInputDetails',
})

interface Props {
  name: string
}

defineProps<Props>()
</script>
