<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <TagsInput v-bind="componentField" :placeholder="placeholder"
          :class="cn('openttd-input', componentField.class)" />
      </FormControl>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

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
