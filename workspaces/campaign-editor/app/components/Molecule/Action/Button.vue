<script setup lang="ts">
import type { ActionInfo } from '@/types'

defineOptions({ name: 'MoleculeActionButton' })

interface Props extends ActionInfo {
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})
</script>

<template>
  <Button
    :variant="'outline'"
    size="sm"
    class="openttd-button"
    :disabled="disabled"
  >
    {{ label }}
  </Button>
</template>

<style scoped></style>
