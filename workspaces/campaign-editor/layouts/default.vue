<template>
  <div class="min-h-screen bg-background">
    <!-- Header/Navigation -->
    <header class="border-b bg-card/50 sticky top-0 z-50 backdrop-blur">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo/Title -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <div class="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <span class="text-primary-foreground font-bold text-sm">C</span>
              </div>
              <span class="font-semibold text-foreground">Campaign Editor</span>
            </NuxtLink>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-6">
            <NuxtLink
              to="/campaigns"
              class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Campaigns
            </NuxtLink>
            <NuxtLink
              to="/goals"
              class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Goals
            </NuxtLink>
            <NuxtLink
              to="/scenarios"
              class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Scenarios
            </NuxtLink>
          </nav>

          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <!-- SPA Mode indicator -->
            <div v-if="spaMode" class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              SPA Mode
            </div>
            
            <!-- Dark mode toggle -->
            <UButton
              variant="ghost"
              size="sm"
              icon="i-heroicons-sun"
              @click="toggleColorMode"
            />
            
            <!-- Import/Export -->
            <UDropdown :items="menuItems">
              <UButton
                variant="outline"
                size="sm"
                icon="i-heroicons-ellipsis-vertical"
              />
            </UDropdown>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t bg-card/30 mt-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p class="text-sm text-muted-foreground">
            OpenTTD Coopetition Campaign Editor
          </p>
          <div class="flex items-center space-x-4 text-sm text-muted-foreground">
            <a
              href="https://github.com/bahulneel/openttd-coopetition"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-foreground transition-colors"
            >
              GitHub
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