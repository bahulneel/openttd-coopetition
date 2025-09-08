<template>
  <div v-if="metadata" class="space-y-2">
    <div class="flex items-center text-sm">
      <span class="text-muted-foreground">Created:</span>
      <span class="text-muted-foreground ml-2">{{ formatDate(metadata?.created) }}</span>
    </div>

    <div v-if="metadata?.modified" class="flex items-center text-sm">
      <span class="text-muted-foreground">Modified:</span>
      <span class="text-muted-foreground ml-2">{{ formatDate(metadata.modified) }}</span>
    </div>

    <div v-if="metadata?.version" class="flex items-center text-sm">
      <span class="text-muted-foreground">Version:</span>
      <span class="text-muted-foreground ml-2">{{ metadata.version }}</span>
    </div>

    <div v-if="metadata?.filename" class="flex items-center text-sm">
      <span class="text-muted-foreground">File:</span>
      <span class="text-muted-foreground ml-2 font-mono text-xs">{{ metadata.filename }}</span>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends AnyEntity">
import type { AnyEntity } from '~/types'
import { storableMeta } from '~/utils/storable'

defineOptions({
  name: 'DomainMetadataDisplayDetails'
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
