<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface NavigationBarProps {
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'MoleculeNavigationBar' })

const props = withDefaults(defineProps<NavigationBarProps>(), {
  class: undefined
})
const rootClass = computed(() => cn('hidden md:flex items-center space-x-2', props.class))
</script>

<template>
  <nav :class="rootClass">
    <NuxtLink to="/campaigns">
      <button class="openttd-button text-sm font-medium">
        📁 Campaigns
      </button>
    </NuxtLink>
    <NuxtLink to="/goals">
      <button class="openttd-button text-sm font-medium">
        🎯 Goals
      </button>
    </NuxtLink>
    <NuxtLink to="/scenarios">
      <button class="openttd-button text-sm font-medium">
        🗺️ Scenarios
      </button>
    </NuxtLink>
  </nav>

</template>

<style scoped></style>
