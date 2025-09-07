<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Moon, Sun } from 'lucide-vue-next'

interface HeaderProps {
  class?: HTMLAttributes['class']
}

defineOptions({ name: 'MoleculeHeader' })

const props = withDefaults(defineProps<HeaderProps>(), {})
const rootClass = computed(() => cn('openttd-toolbar', props.class))

const colorMode = useColorMode()
const { public: { spaMode } } = useRuntimeConfig()

const toast = useToast()

const importCampaign = () => {
  // TODO: Implement import functionality
  toast.add({ title: 'Import functionality coming soon!', color: 'blue' })
}

const exportAll = () => {
  // TODO: Implement export functionality
  toast.add({ title: 'Export functionality coming soon!', color: 'blue' })
}

const resetAll = () => {
  // TODO: Implement reset functionality
  toast.add({ title: 'Reset functionality coming soon!', color: 'yellow' })
}
</script>

<template>
  <header :class="rootClass">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Left: Logo/Title (no choice) -->
        <div class="flex items-center space-x-4">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div
              class="h-10 w-10 bg-openttd-brown rounded border-2 border-border flex items-center justify-center openttd-button">
              <span class="text-foreground font-bold text-lg">🚂</span>
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-foreground text-lg">Coopetition</span>
              <span class="text-sm text-foreground/80">Campaign Editor</span>
            </div>
          </NuxtLink>
        </div>

        <!-- Middle: default slot -->
        <slot />

        <!-- Right: Actions (no choice) -->
        <div class="flex items-center space-x-3">
          <div
v-if="spaMode"
            class="text-xs bg-openttd-light-blue/20 text-openttd-blue px-3 py-1 rounded border-2 border-openttd-blue/30">
            Browser Mode
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="sm" class="openttd-button">
                <Moon class="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Sun class="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span class="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="colorMode.preference = 'light'">
                ☀️ Light
              </DropdownMenuItem>
              <DropdownMenuItem @click="colorMode.preference = 'dark'">
                🌙 Dark
              </DropdownMenuItem>
              <DropdownMenuItem @click="colorMode.preference = 'system'">
                💻 System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="sm" class="openttd-button">
                ⚙️ Tools
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="importCampaign">
                📤 Import Campaign
              </DropdownMenuItem>
              <DropdownMenuItem @click="exportAll">
                📥 Export All
              </DropdownMenuItem>
              <DropdownMenuItem class="text-destructive" @click="resetAll">
                🗑️ Reset All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
