<script setup lang="ts">
import type { Action } from '~/types';

interface SectionProps {
  title: string
  subtitle?: string
  actions?: Action[]
}

defineOptions({ name: 'TemplateLayoutSection' })

const props = withDefaults(defineProps<SectionProps>(), {
  subtitle: undefined,
  actions: undefined
})
const slots = useSlots()

const hasHeader = computed(() => !!props.title || !!props.subtitle || !!slots.actions)
</script>

<template>
  <section>
    <div v-if="hasHeader" class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-foreground">{{ title }}</h1>
        <p v-if="subtitle" class="text-muted-foreground mt-2">{{ subtitle }}</p>
      </div>
      <div v-if="slots.actions" class="flex items-center space-x-2">
        <slot name="actions">
          <MoleculeAction v-for="action in actions" :key="action.label" :action="action" />
        </slot>
      </div>
    </div>

    <div class="space-y-8">
      <slot ></slot>
    </div>
  </section>
</template>

<style scoped></style>
