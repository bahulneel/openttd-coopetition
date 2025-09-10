<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">{{ campaign.name }}</h1>
        <p class="text-muted-foreground">ID: {{ entityId(campaign) }}</p>
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="openttd-button"
          @click="$emit('edit', campaign)"
        >
          ✏️ Edit Campaign
        </Button>
      </div>
    </div>

    <!-- Meta Information -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>ℹ️</span>
          <span>Campaign Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="font-medium text-foreground">Scenarios:</span>
            <span class="text-muted-foreground ml-2">{{ campaign.scenarios?.length || 0 }}</span>
          </div>
        </div>

        <DomainMetaInfoDisplayCard
          :meta-info="campaign.meta"
          as-partial
        />
      </CardContent>
    </Card>

    <!-- Scenarios -->
    <Card
      v-if="campaign.scenarios && campaign.scenarios.length > 0"
      class="openttd-titlebar"
    >
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <span>🗺️</span>
          <span>Scenarios ({{ campaign.scenarios.length }})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div
            v-for="(scenario, index) in campaign.scenarios"
            :key="index"
            class="flex items-center justify-between p-3 border border-border rounded-lg"
          >
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <span class="font-medium">{{ scenario.include }}</span>
                <Badge
                  v-if="scenario.required"
                  variant="default"
                  class="text-xs"
                >
                  Required
                </Badge>
                <Badge
                  v-else
                  variant="secondary"
                  class="text-xs"
                >
                  Optional
                </Badge>
              </div>
              <p class="text-sm text-muted-foreground mt-1">Order: {{ scenario.order }}</p>
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
        <DomainMetadataDisplayDetails :entity="campaign" />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { Campaign } from '~/types'

defineOptions({
  name: 'EntityCampaignDisplayDetails',
})

interface Props {
  campaign: Campaign
}

defineProps<Props>()

defineEmits<{
  edit: [campaign: Campaign]
}>()
</script>
