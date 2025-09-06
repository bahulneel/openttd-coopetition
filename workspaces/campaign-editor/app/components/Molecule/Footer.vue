<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface FooterProps {
  version?: string
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'MoleculeFooter' })

const props = withDefaults(defineProps<FooterProps>(), {
  version: ''
})

const rootClass = computed(() => cn('openttd-titlebar', props.class))
</script>

<template>
  <footer :class="rootClass">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-foreground">🚂</span>
          <span class="text-sm text-foreground font-medium">
            OpenTTD Coopetition Campaign Editor
          </span>
        </div>
        <div class="flex items-center space-x-4 text-sm text-foreground/80">
          <a href="https://github.com/bahulneel/openttd-coopetition" target="_blank" rel="noopener noreferrer"
            class="hover:text-foreground transition-colors underline">
            📂 GitHub
          </a>
          <span>•</span>
          <span>v{{ version }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
