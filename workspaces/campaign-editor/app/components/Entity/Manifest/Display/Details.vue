<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">{{ manifest.name }}</h1>
        <p class="text-muted-foreground">Version: {{ manifest.version }}</p>
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
            <span class="font-medium text-foreground">Version:</span>
            <span class="text-muted-foreground ml-2">{{ manifest.version }}</span>
          </div>
          <div v-if="manifest.author">
            <span class="font-medium text-foreground">Author:</span>
            <span class="text-muted-foreground ml-2">{{ manifest.author }}</span>
          </div>
          <div v-if="manifest.description">
            <span class="font-medium text-foreground">Description:</span>
            <span class="text-muted-foreground ml-2">{{ manifest.description }}</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Campaigns -->
    <Card v-if="manifest.campaigns && manifest.campaigns.length > 0" class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>📁</span>
          <span>Campaigns ({{ manifest.campaigns.length }})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div v-for="(campaign, index) in manifest.campaigns" :key="index" 
               class="flex items-center justify-between p-3 border border-border rounded-lg">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <span class="font-medium">{{ campaign.name || `Campaign ${index + 1}` }}</span>
                <Badge v-if="campaign.difficulty" :class="getDifficultyClasses(campaign.difficulty)" class="text-xs">
                  {{ campaign.difficulty }}
                </Badge>
              </div>
              <p v-if="campaign.description" class="text-sm text-muted-foreground mt-1">
                {{ campaign.description }}
              </p>
            </div>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-medium text-foreground">Created:</span>
            <span class="text-muted-foreground ml-2">{{ formatDate(manifest.__meta?.created) }}</span>
          </div>
          <div>
            <span class="font-medium text-foreground">Last Modified:</span>
            <span class="text-muted-foreground ml-2">{{ formatDate(manifest.__meta?.modified) }}</span>
          </div>
        </div>
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

function formatDate(timestamp: number | undefined) {
  if (!timestamp) return 'Unknown'

  const date = new Date(timestamp)
  return date.toLocaleDateString()
}

function getDifficultyClasses(difficulty: string | undefined) {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-openttd-green/20 border-openttd-green/40 text-openttd-green'
    case 'medium':
      return 'bg-openttd-cream/40 border-openttd-brown/40 text-openttd-brown'
    case 'hard':
      return 'bg-openttd-blue/20 border-openttd-blue/40 text-openttd-blue'
    case 'expert':
      return 'bg-destructive/20 border-destructive/40 text-destructive'
    case 'legendary':
      return 'bg-openttd-purple/20 border-openttd-purple/40 text-openttd-purple'
    default:
      return 'bg-openttd-grey/20 border-openttd-grey/40 text-openttd-grey'
  }
}
</script>