<template>
  <div class="campaign-editor-layout">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Global app configuration
useSeoMeta({
  title: 'OpenTTD Coopetition Campaign Editor',
  description: 'Create and edit campaigns for OpenTTD Coopetition GameScript',
  ogTitle: 'OpenTTD Coopetition Campaign Editor',
  ogDescription: 'Create and edit campaigns for OpenTTD Coopetition GameScript',
  ogType: 'website'
})

// Check if we're in SPA mode
const { public: { spaMode } } = useRuntimeConfig()

// Provide global state for SPA mode
provide('spaMode', spaMode)
</script>