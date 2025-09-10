<template>
  <DefineContent>
    <div class="space-y-3 p-4">
      <!-- Track -->
      <div v-if="sharedInfrastructure.track" class="text-sm">
        <span class="font-medium text-foreground">Track:</span>
        <Badge variant="outline" class="ml-2 text-xs">
          {{ sharedInfrastructure.track }}
        </Badge>
      </div>

      <!-- Shared Infrastructure Options -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="flex items-center space-x-2">
          <span class="text-muted-foreground">Stations:</span>
          <Badge :variant="sharedInfrastructure.stations ? 'default' : 'secondary'" class="text-xs">
            {{ sharedInfrastructure.stations ? 'Shared' : 'Individual' }}
          </Badge>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-muted-foreground">Vehicles:</span>
          <Badge :variant="sharedInfrastructure.vehicles ? 'default' : 'secondary'" class="text-xs">
            {{ sharedInfrastructure.vehicles ? 'Shared' : 'Individual' }}
          </Badge>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-muted-foreground">Depots:</span>
          <Badge :variant="sharedInfrastructure.depots ? 'default' : 'secondary'" class="text-xs">
            {{ sharedInfrastructure.depots ? 'Shared' : 'Individual' }}
          </Badge>
        </div>
      </div>

      <!-- Comment -->
      <div v-if="sharedInfrastructure.comment" class="text-sm">
        <span class="font-medium text-foreground">Note:</span>
        <p class="text-muted-foreground mt-1">{{ sharedInfrastructure.comment }}</p>
      </div>
    </div>
  </DefineContent>

  <!-- Standalone mode (default) -->
  <Card v-if="!asPartial" class="shared-infrastructure-card hover:shadow-lg transition-shadow duration-200">
    <CardContent>
      <Content />
    </CardContent>
  </Card>

  <!-- Partial mode (for composition) -->
  <Content v-else />
</template>

<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import type { SharedInfrastructure } from '~/types'

defineOptions({
  name: 'DomainSharedInfrastructureDisplayCard'
})

interface Props {
  sharedInfrastructure: SharedInfrastructure
  asPartial?: boolean
}

defineProps<Props>()

const [DefineContent, Content] = createReusableTemplate()
</script>
