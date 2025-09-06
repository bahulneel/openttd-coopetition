<template>
  <TemplateLayoutStacked :order="layoutOrder" class="min-h-screen bg-background" :classes="layoutClasses">
    <!-- Header/Navigation - OpenTTD Style -->
    <template #header>
      <MoleculeHeader>
        <MoleculeNavigationBar />
      </MoleculeHeader>
    </template>

    <!-- Main Content + Toasts -->
    <template #default>
      <slot />
      <!-- Toast notifications -->
      <Toaster />
    </template>

    <!-- Footer - OpenTTD Style -->
    <template #footer>
      <MoleculeFooter :version="version" />
    </template>
  </TemplateLayoutStacked>
</template>

<script setup lang="ts">
const version = '1.0.0'
const layoutOrder = ['header', 'default', 'footer']
const layoutClasses = {
  header: 'sticky top-0 z-50',
  default: 'container mx-auto px-4 sm:px-6 lg:px-8 py-8',
  footer: 'mt-16'
}
</script>