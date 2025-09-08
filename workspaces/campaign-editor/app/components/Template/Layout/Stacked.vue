<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface StackedLayoutProps {
  order?: string[]
  classes?: Record<string, HTMLAttributes['class'] | undefined>
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'TemplateLayoutStacked' })

const props = withDefaults(defineProps<StackedLayoutProps>(), {
  order: undefined,
  classes: undefined,
  class: undefined
})

const slots = useSlots()

const slotOrder = computed(() => (isEmpty(props.order) ? slotNames(slots) : props.order!))

const renderOrder = computed(() => uniq(slotOrder.value.filter((name) => name in slots)))

const rootClass = computed(() => cn(props.class))
</script>

<template>
  <div :class="rootClass">
    <template v-for="name in renderOrder" :key="name">
      <div :class="classes?.[name]">
        <slot :name="name" />
      </div>
    </template>
  </div>
</template>

<style scoped></style>
