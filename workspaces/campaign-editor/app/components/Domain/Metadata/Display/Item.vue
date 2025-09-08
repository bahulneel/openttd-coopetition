<template>
  <div v-if="metadata" class="text-xs text-muted-foreground">
    {{ formatDate(metadata?.modified) }}
  </div>
</template>

<script setup lang="ts" generic="T extends AnyEntity">
import type { AnyEntity } from '~/types'
import { storableMeta } from '~/utils/storable'

defineOptions({
  name: 'DomainMetadataDisplayItem'
})

interface Props {
  entity: T
}

const props = defineProps<Props>()

const metadata = computed(() => isStorable(props.entity) ? storableMeta(props.entity) : undefined)

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
