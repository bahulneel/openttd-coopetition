<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface GridProps {
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'TemplateLayoutGrid' })

const props = withDefaults(defineProps<GridProps>(), {
  class: undefined
})
const rootClass = computed(() => cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6', props.class))
</script>

<template>
  <div :class="rootClass">
    <slot ></slot>
  </div>
</template>

<style scoped></style>
