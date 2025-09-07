<template>
  <div class="space-y-4">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface ListProps {
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'TemplateLayoutList' })

const props = withDefaults(defineProps<ListProps>(), {})
const rootClass = computed(() => cn('space-y-4', props.class))
</script>

<template>
  <div :class="rootClass">
    <slot />
  </div>
</template>