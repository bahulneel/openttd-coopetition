<template>
  <DefineContent>
    <div class="space-y-4 p-6">
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

        <DropdownMenu v-if="!asPartial">
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
      <DomainMetaInfoDisplayCard :meta-info="campaign.meta" as-partial />

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-muted-foreground">Scenarios:</span>
          <span class="font-medium ml-1">{{ campaign.scenarios?.length || 0 }}</span>
        </div>
        <div>
          <span class="text-muted-foreground">Difficulty:</span>
          <DomainMetaInfoDisplayCard :meta-info="campaign.meta" as-partial class="ml-1" />
        </div>
      </div>


      <!-- Footer -->
      <DomainMetadataDisplayCard :entity="campaign" :as-partial="asPartial" />
    </div>
  </DefineContent>

  <!-- Standalone mode (default) -->
  <Card v-if="!asPartial" class="campaign-card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    @click="$emit('edit', campaign)">
    <CardContent>
      <Content />
    </CardContent>
  </Card>

  <!-- Partial mode (for composition) -->
  <Content v-else />
</template>

<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import type { Campaign } from '~/types'

defineOptions({
  name: 'EntityCampaignDisplayCard'
})

interface Props {
  campaign: Campaign
  asPartial?: boolean
}

defineProps<Props>()

defineEmits<{
  edit: [campaign: Campaign]
  duplicate: [campaign: Campaign]
  delete: [campaign: Campaign]
}>()

const [DefineContent, Content] = createReusableTemplate()
</script>