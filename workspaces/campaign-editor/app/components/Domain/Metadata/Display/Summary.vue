<template>
  <div class="flex items-center justify-between text-xs text-muted-foreground">
    <div>
      {{ metadata?.modified ? 'Modified' : 'Saved' }}
      {{ formatDate(metadata?.modified) }}
    </div>

    <div class="flex items-center space-x-1">
      <span v-if="metadata?.modified" class="text-orange-500">✏️</span>
      <span class="text-muted-foreground">→</span>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends AnyEntity">
import type { Storable, AnyEntity } from '~/types'
import { storableMeta } from '~/utils/storable'

defineOptions({
  name: 'DomainMetadataDisplaySummary'
})

interface Props {
  entity: Storable<T>
}

const props = defineProps<Props>()

const metadata = computed(() => storableMeta(props.entity))

function formatDate(timestamp: number | undefined) {
  if (!timestamp) return 'Unknown'

  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`

  return date.toLocaleDateString()
}
</script>
