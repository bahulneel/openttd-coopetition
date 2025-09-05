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
        <UButton
          icon="i-heroicons-plus"
          @click="createScenario"
        >
          New Scenario
        </UButton>
        
        <UButton
          variant="outline"
          icon="i-heroicons-arrow-path"
          :loading="loading"
          @click="refreshScenarios"
        >
          Refresh
        </UButton>
      </div>
    </div>

    <!-- Coming Soon Notice -->
    <UCard>
      <div class="text-center py-12">
        <Icon name="heroicons:map" class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-foreground mb-2">
          Scenarios Editor Coming Soon
        </h3>
        <p class="text-muted-foreground mb-6">
          The scenarios editor is under development. For now, you can manage scenarios through the campaign editor
          or by editing YAML files directly.
        </p>
        <div class="flex justify-center space-x-2">
          <UButton
            variant="outline"
            @click="navigateTo('/campaigns')"
          >
            Edit Campaigns
          </UButton>
          <UButton
            variant="outline"
            @click="navigateTo('/')"
          >
            Back to Dashboard
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Scenarios Count -->
    <UCard v-if="scenarios.length > 0">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">Available Scenarios</h3>
          <p class="text-muted-foreground">{{ scenarios.length }} scenarios currently defined</p>
        </div>
        <UBadge size="lg">{{ scenarios.length }}</UBadge>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
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
    title: 'Coming Soon',
    description: 'Scenario editor is under development',
    color: 'blue'
  })
}

async function refreshScenarios() {
  await loadScenarios()
}
</script>