<template>
  <div>
    <!-- This page redirects to the main edit page -->
  </div>
</template>

<script setup lang="ts">
// Redirect to the dynamic route with 'new' as ID
await navigateTo('/campaigns/new')
</script>