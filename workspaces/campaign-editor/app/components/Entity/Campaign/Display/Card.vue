<template>
  <Card class="campaign-card hover:shadow-lg transition-shadow duration-200 cursor-pointer" @click="$emit('edit', campaign)">
    <CardContent class="space-y-4 p-6">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <CardTitle class="font-semibold text-foreground truncate text-base">
            {{ campaign.name }}
          </CardTitle>
          <p class="text-sm text-muted-foreground">
            ID: {{ entityId(campaign) }}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger as-child @click.stop>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
              ⋮
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="$emit('edit', campaign)">
              ✏️ Edit
            </DropdownMenuItem>
            <DropdownMenuItem @click="$emit('duplicate', campaign)">
              📄 Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem class="text-destructive focus:text-destructive" @click="$emit('delete', campaign)">
              🗑️ Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Description -->
      <p v-if="campaign.meta?.description" class="text-sm text-muted-foreground line-clamp-2">
        {{ campaign.meta.description }}
      </p>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-muted-foreground">Scenarios:</span>
          <span class="font-medium ml-1">{{ campaign.scenarios?.length || 0 }}</span>
        </div>
        <div>
          <span class="text-muted-foreground">Difficulty:</span>
          <Badge :class="getDifficultyClasses(campaign.meta?.difficulty)" class="ml-1 text-xs">
            {{ campaign.meta?.difficulty || 'Unknown' }}
          </Badge>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="campaign.meta?.tags && campaign.meta.tags.length > 0" class="flex flex-wrap gap-1">
        <Badge v-for="tag in campaign.meta.tags.slice(0, 3)" :key="tag" variant="secondary" class="text-xs">
          {{ tag }}
        </Badge>
        <Badge v-if="campaign.meta.tags.length > 3" variant="secondary" class="text-xs text-muted-foreground">
          +{{ campaign.meta.tags.length - 3 }}
        </Badge>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-2 border-t border-border">
        <div class="text-xs text-muted-foreground">
          {{ campaign.__meta?.modified ? 'Modified' : 'Saved' }}
          {{ formatDate(campaign.__meta?.modified) }}
        </div>

        <div class="flex items-center space-x-1">
          <span v-if="campaign.__meta?.modified" class="text-orange-500">✏️</span>
          <span class="text-muted-foreground">→</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { Campaign } from '~/types'

defineOptions({
  name: 'EntityCampaignDisplayCard'
})

interface Props {
  campaign: Campaign
}

defineProps<Props>()

defineEmits<{
  edit: [campaign: Campaign]
  duplicate: [campaign: Campaign]
  delete: [campaign: Campaign]
}>()

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