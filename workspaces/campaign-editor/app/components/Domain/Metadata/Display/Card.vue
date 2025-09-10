<template>
  <div class="flex items-center justify-between pt-2 border-t border-border">
    <div class="text-xs text-muted-foreground">
      {{ metadata?.modified ? 'Modified' : 'Saved' }}
      {{ timeAgo }}
    </div>

    <div class="flex items-center space-x-1">
      <span
        v-if="metadata?.modified"
        class="text-orange-500"
        >✏️</span
      >
      <span class="text-muted-foreground">→</span>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends AnyEntity">
import type { AnyEntity } from '~/types'

defineOptions({
  name: 'DomainMetadataDisplayCard',
})

interface Props {
  entity: T
  asPartial?: boolean
}

const props = defineProps<Props>()

const metadata = computed(() => (isStorable(props.entity) ? storableMeta(props.entity) : undefined))

const timeAgo = computed(() => toTimeAgo(metadata.value?.modified))
</script>
