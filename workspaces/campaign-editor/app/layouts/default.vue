<template>
  <div class="min-h-screen bg-background">
    <!-- Header/Navigation - OpenTTD Style -->
    <header class="openttd-toolbar sticky top-0 z-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo/Title -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="flex items-center space-x-3">
              <div class="h-10 w-10 bg-openttd-brown rounded border-2 border-border flex items-center justify-center openttd-button">
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
            <div v-if="spaMode" class="text-xs bg-openttd-light-blue/20 text-openttd-blue px-3 py-1 rounded border-2 border-openttd-blue/30">
              Browser Mode
            </div>
            
            <!-- Dark mode toggle -->
            <button
              class="openttd-button text-sm"
              @click="toggleColorMode"
            >
              {{ colorMode.value === 'dark' ? '☀️' : '🌙' }}
            </button>
            
            <!-- Import/Export -->
            <UDropdown :items="menuItems">
              <button class="openttd-button text-sm">
                ⚙️ Tools
              </button>
            </UDropdown>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

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
              href="https://github.com/bahulneel/openttd-coopetition"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-foreground transition-colors underline"
            >
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
const colorMode = useColorMode()
const { public: { spaMode } } = useRuntimeConfig()
const version = '1.0.0'

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const menuItems = [
  [{
    label: 'Import Campaign',
    icon: 'i-heroicons-arrow-up-tray',
    click: () => {
      // TODO: Implement import functionality
    }
  }],
  [{
    label: 'Export All',
    icon: 'i-heroicons-arrow-down-tray',
    click: () => {
      // TODO: Implement export functionality
    }
  }],
  [{
    label: 'Reset All',
    icon: 'i-heroicons-trash',
    click: () => {
      // TODO: Implement reset functionality
    }
  }]
]
</script>