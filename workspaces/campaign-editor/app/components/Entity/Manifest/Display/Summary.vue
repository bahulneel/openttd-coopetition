<template>
  <div class="flex items-center space-x-3">
    <span class="font-medium text-foreground">{{ manifest.name }}</span>
    <Badge variant="secondary" class="text-xs">
      v{{ manifest.version }}
    </Badge>
    <span class="text-sm text-muted-foreground">
      {{ manifest.campaigns?.length || 0 }} campaigns
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Manifest } from '~/types'

defineOptions({
  name: 'EntityManifestDisplaySummary'
})

interface Props {
  manifest: Manifest
}

defineProps<Props>()
</script>