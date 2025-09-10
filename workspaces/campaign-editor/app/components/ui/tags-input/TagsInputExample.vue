<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Tags Input Example</h3>

    <TagsInput
      v-model="tags"
      placeholder="Add tags..."
    >
      <TagsInputItem
        v-for="tag in tags"
        :key="tag"
        :value="tag"
      >
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
      <TagsInputInput placeholder="Add tags..." />
    </TagsInput>

    <div class="text-sm text-muted-foreground">Current tags: {{ tags.join(', ') }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref<string[]>(['vue', 'typescript'])
</script>
