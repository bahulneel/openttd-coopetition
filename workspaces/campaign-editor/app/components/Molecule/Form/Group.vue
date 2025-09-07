<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MoleculeFormGroup'
})
</script>