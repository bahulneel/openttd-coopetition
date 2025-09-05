<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          Scenarios
        </h1>
        <p class="text-muted-foreground">
          Manage scenarios that combine goals into cohesive experiences
        </p>
      </div>
      
      <div class="flex items-center space-x-2">
        <Button
          @click="createScenario"
          class="openttd-button bg-openttd-purple text-white"
        >
          ➕ New Scenario
        </Button>
        
        <Button
          variant="outline"
          :disabled="loading"
          @click="refreshScenarios"
          class="openttd-button"
        >
          {{ loading ? '🔄' : '↻' }} Refresh
        </Button>
      </div>
    </div>

    <!-- Coming Soon Notice -->
    <Card class="openttd-titlebar">
      <CardContent class="pt-12 pb-12">
        <div class="text-center">
          <div class="text-6xl mb-4">🗺️</div>
          <CardTitle class="text-lg font-semibold text-foreground mb-2">
            Scenarios Editor Coming Soon
          </CardTitle>
          <p class="text-muted-foreground mb-6">
            The scenarios editor is under development. For now, you can manage scenarios through the campaign editor
            or by editing YAML files directly.
          </p>
          <div class="flex justify-center space-x-2">
            <Button
              variant="outline"
              @click="navigateTo('/campaigns')"
              class="openttd-button"
            >
              📝 Edit Campaigns
            </Button>
            <Button
              variant="outline"
              @click="navigateTo('/')"
              class="openttd-button"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Scenarios Count -->
    <Card v-if="scenarios.length > 0" class="openttd-titlebar">
      <CardContent class="pt-6">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-lg font-semibold">Available Scenarios</CardTitle>
            <p class="text-muted-foreground">{{ scenarios.length }} scenarios currently defined</p>
          </div>
          <Badge class="bg-openttd-purple text-white px-3 py-1 text-lg">{{ scenarios.length }}</Badge>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const { scenarios, loading, loadScenarios } = useCampaignStore()

// Load scenarios on mount
onMounted(async () => {
  if (scenarios.value.length === 0) {
    await loadScenarios()
  }
})

// Methods
function createScenario() {
  // TODO: Navigate to scenario creation page when implemented
  const toast = useToast()
  toast.add({
    title: '🚧 Coming Soon',
    description: 'Scenario editor is under development',
    color: 'blue'
  })
}

async function refreshScenarios() {
  await loadScenarios()
}
</script>