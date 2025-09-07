<script setup lang="ts">
import type { Action } from '@/types'

defineOptions({ name: 'MoleculeAction' })

interface Props {
  action: Action
}

defineProps<Props>()
</script>

<template>
  <MoleculeActionLink
v-if="action.type === 'link'" :label="action.label" :variant="action.variant"
    :to="action.to || '#'" />
  <MoleculeActionButton
v-else :label="action.label" :variant="action.variant" :disabled="action.disabled"
    @click="action.action?.()" />
</template>

<style scoped></style>
