<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <TagsInput v-bind="componentField" :placeholder="placeholder" class="openttd-input" />
      </FormControl>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MoleculeFormInputTags'
})

interface Props {
  name: string
  label: string
  placeholder?: string
  description?: string
}

defineProps<Props>()
</script>
