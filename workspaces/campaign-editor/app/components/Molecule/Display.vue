<template>
  <div class="space-y-2">
    <div v-for="(value, key) in data" :key="key" class="flex justify-between">
      <span class="font-medium text-foreground">{{ formatKey(key) }}:</span>
      <span class="text-muted-foreground">{{ formatValue(value) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MoleculeDisplay'
})

interface Props {
  data: Record<string, unknown>
}

defineProps<Props>()

function formatKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return 'N/A'
  if (typeof value === 'object') return JSON.stringify(value)
  if (typeof value === 'number') return value.toLocaleString()
  return String(value)
}
</script>