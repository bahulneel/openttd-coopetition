<template>
  <MoleculeFormGroup>
    <FormField
      v-slot="{ componentField: playersMinField }"
      :name="`${name}.players.min`"
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
      :name="`${name}.players.max`"
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
      :name="`${name}.date.min`"
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
      :name="`${name}.date.max`"
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
