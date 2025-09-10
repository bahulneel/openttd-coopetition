<template>
  <FormField
    v-slot="{ componentField }"
    :name="name"
  >
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <TagsInput
          v-bind="componentField"
          :placeholder="placeholder"
          class="openttd-input"
        >
          <TagsInputItem
            v-for="tag in componentField.modelValue"
            :key="tag"
            :value="tag"
          >
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
          <TagsInputInput :placeholder="placeholder" />
        </TagsInput>
      </FormControl>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MoleculeFormInputTags',
})

interface Props {
  name: string
  label: string
  placeholder?: string
  description?: string
}

defineProps<Props>()
</script>
