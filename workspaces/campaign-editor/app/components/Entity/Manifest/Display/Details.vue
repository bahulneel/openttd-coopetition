<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">{{ manifest.name }}</h1>
        <p class="text-muted-foreground">ID: {{ entityId(manifest) }}</p>
      </div>
      <div class="flex items-center space-x-2">
        <Button variant="outline" class="openttd-button" @click="$emit('edit', manifest)">
          ✏️ Edit Manifest
        </Button>
      </div>
    </div>

    <!-- Basic Information -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>ℹ️</span>
          <span>Manifest Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="font-medium text-foreground">Name:</span>
            <span class="text-muted-foreground ml-2">{{ manifest.name }}</span>
          </div>
          <div>
            <span class="font-medium text-foreground">Dependencies:</span>
            <span class="text-muted-foreground ml-2">{{ manifest.dependencies.coopetition_version }}</span>
          </div>
        </div>

        <DomainMetaInfoDisplayCard :meta-info="manifest.meta" as-partial />
      </CardContent>
    </Card>

    <!-- Contents -->
    <Card
      v-if="manifest.contents && (manifest.contents.campaigns.length > 0 || manifest.contents.scenarios.length > 0 || manifest.contents.goals.length > 0)"
      class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>📁</span>
          <span>Contents</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div v-if="manifest.contents.campaigns.length > 0" class="text-sm">
            <span class="font-medium text-foreground">Campaigns:</span>
            <span class="text-muted-foreground ml-2">{{ manifest.contents.campaigns.length }}</span>
          </div>
          <div v-if="manifest.contents.scenarios.length > 0" class="text-sm">
            <span class="font-medium text-foreground">Scenarios:</span>
            <span class="text-muted-foreground ml-2">{{ manifest.contents.scenarios.length }}</span>
          </div>
          <div v-if="manifest.contents.goals.length > 0" class="text-sm">
            <span class="font-medium text-foreground">Goals:</span>
            <span class="text-muted-foreground ml-2">{{ manifest.contents.goals.length }}</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Metadata -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>📊</span>
          <span>Metadata</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DomainMetadataDisplayDetails :entity="manifest" />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { Manifest } from '~/types'

defineOptions({
  name: 'EntityManifestDisplayDetails'
})

interface Props {
  manifest: Manifest
}

defineProps<Props>()

defineEmits<{
  edit: [manifest: Manifest]
}>()
</script>