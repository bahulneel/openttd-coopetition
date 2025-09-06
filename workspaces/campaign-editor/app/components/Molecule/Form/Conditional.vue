<template>
  <div v-if="condition">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MoleculeFormConditional'
})

interface Props {
  condition: boolean
}

defineProps<Props>()
</script>