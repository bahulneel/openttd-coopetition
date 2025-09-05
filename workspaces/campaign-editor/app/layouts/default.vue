<template>
  <div class="min-h-screen bg-background">
    <!-- Header/Navigation - OpenTTD Style -->
    <header class="openttd-toolbar sticky top-0 z-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo/Title -->
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

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-2">
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

          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <!-- SPA Mode indicator -->
            <div
v-if="spaMode"
              class="text-xs bg-openttd-light-blue/20 text-openttd-blue px-3 py-1 rounded border-2 border-openttd-blue/30">
              Browser Mode
            </div>

            <!-- Dark mode toggle with shadcn-vue and Nuxt Color Mode -->
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

            <!-- Import/Export -->
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

    <!-- Main Content -->
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Toast notifications -->
    <Toaster />

    <!-- Footer - OpenTTD Style -->
    <footer class="openttd-titlebar mt-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-foreground">🚂</span>
            <span class="text-sm text-foreground font-medium">
              OpenTTD Coopetition Campaign Editor
            </span>
          </div>
          <div class="flex items-center space-x-4 text-sm text-foreground/80">
            <a
href="https://github.com/bahulneel/openttd-coopetition" target="_blank" rel="noopener noreferrer"
              class="hover:text-foreground transition-colors underline">
              📂 GitHub
            </a>
            <span>•</span>
            <span>v{{ version }}</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'

const colorMode = useColorMode()
const { public: { spaMode } } = useRuntimeConfig()
const version = '1.0.0'

// Menu functions
const importCampaign = () => {
  // TODO: Implement import functionality
  console.log('Import campaign clicked')
}

const exportAll = () => {
  // TODO: Implement export functionality
  console.log('Export all clicked')
}

const resetAll = () => {
  // TODO: Implement reset functionality
  console.log('Reset all clicked')
}
</script>