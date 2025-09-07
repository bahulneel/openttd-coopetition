<template>
  <MoleculeFormGroup>
    <FormField v-slot="{ componentField }" name="players.min">
      <FormItem>
        <FormLabel>Minimum Players</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="number" min="1" max="8" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="players.max">
      <FormItem>
        <FormLabel>Maximum Players</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="number" min="1" max="8" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="date.min">
      <FormItem>
        <FormLabel>Minimum Date</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="number" placeholder="e.g., 1950" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="date.max">
      <FormItem>
        <FormLabel>Maximum Date</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="number" placeholder="e.g., 2050" class="openttd-input" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </MoleculeFormGroup>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainConstraintsInputDetails'
})
</script>