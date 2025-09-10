<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface SequentialProps {
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'TemplateLayoutSequential' })

const props = withDefaults(defineProps<SequentialProps>(), {
  class: undefined,
})
const rootClass = computed(() => cn('space-y-6 md:space-y-8', props.class))
</script>

<template>
  <div :class="rootClass">
    <slot />
  </div>
</template>

<style scoped></style>
