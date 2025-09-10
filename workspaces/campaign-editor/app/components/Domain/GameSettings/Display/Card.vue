<template>
  <DefineContent>
    <div class="space-y-3 p-4">
      <!-- Economy -->
      <div
        v-if="settings.economy"
        class="text-sm"
      >
        <span class="font-medium text-foreground">Economy:</span>
        <Badge
          variant="outline"
          class="ml-2 text-xs"
        >
          {{ settings.economy }}
        </Badge>
      </div>

      <!-- Game Options -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="flex items-center space-x-2">
          <span class="text-muted-foreground">Disasters:</span>
          <Badge
            :variant="settings.disasters ? 'default' : 'secondary'"
            class="text-xs"
          >
            {{ settings.disasters ? 'On' : 'Off' }}
          </Badge>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-muted-foreground">Breakdowns:</span>
          <Badge
            :variant="settings.breakdowns ? 'default' : 'secondary'"
            class="text-xs"
          >
            {{ settings.breakdowns ? 'On' : 'Off' }}
          </Badge>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-muted-foreground">Inflation:</span>
          <Badge
            :variant="settings.inflation ? 'default' : 'secondary'"
            class="text-xs"
          >
            {{ settings.inflation ? 'On' : 'Off' }}
          </Badge>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-muted-foreground">Seasons:</span>
          <Badge
            :variant="settings.seasons ? 'default' : 'secondary'"
            class="text-xs"
          >
            {{ settings.seasons ? 'On' : 'Off' }}
          </Badge>
        </div>
      </div>

      <!-- Comment -->
      <div
        v-if="settings.comment"
        class="text-sm"
      >
        <span class="font-medium text-foreground">Note:</span>
        <p class="text-muted-foreground mt-1">{{ settings.comment }}</p>
      </div>
    </div>
  </DefineContent>

  <!-- Standalone mode (default) -->
  <Card
    v-if="!asPartial"
    class="game-settings-card hover:shadow-lg transition-shadow duration-200"
  >
    <CardContent>
      <Content />
    </CardContent>
  </Card>

  <!-- Partial mode (for composition) -->
  <Content v-else />
</template>

<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import type { CampaignSettings } from '~/types'

defineOptions({
  name: 'DomainGameSettingsDisplayCard',
})

interface Props {
  settings: CampaignSettings
  asPartial?: boolean
}

defineProps<Props>()

const [DefineContent, Content] = createReusableTemplate()
</script>
