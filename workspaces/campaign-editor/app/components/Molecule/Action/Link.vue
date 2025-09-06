<script setup lang="ts">
import type { ActionInfo } from '@/types'

defineOptions({ name: 'MoleculeActionLink' })

interface Props extends ActionInfo {
  to: string
}

defineProps<Props>()
</script>

<template>
  <NuxtLink :to="to">
    <Button :variant="'outline'" size="sm" class="openttd-button">
      {{ label }}
    </Button>
  </NuxtLink>
</template>

<style scoped></style>
