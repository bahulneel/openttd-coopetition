<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          Goals
        </h1>
        <p class="text-muted-foreground">
          Manage individual goals that can be used in scenarios
        </p>
      </div>
      
      <div class="flex items-center space-x-2">
        <UButton
          icon="i-heroicons-plus"
          @click="createGoal"
        >
          New Goal
        </UButton>
        
        <UButton
          variant="outline"
          icon="i-heroicons-arrow-path"
          :loading="loading"
          @click="refreshGoals"
        >
          Refresh
        </UButton>
      </div>
    </div>

    <!-- Coming Soon Notice -->
    <UCard>
      <div class="text-center py-12">
        <Icon name="heroicons:target" class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-foreground mb-2">
          Goals Editor Coming Soon
        </h3>
        <p class="text-muted-foreground mb-6">
          The goals editor is under development. For now, you can manage goals through the campaign editor
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

    <!-- Goals Count -->
    <UCard v-if="goals.length > 0">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">Available Goals</h3>
          <p class="text-muted-foreground">{{ goals.length }} goals currently defined</p>
        </div>
        <UBadge size="lg">{{ goals.length }}</UBadge>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { goals, loading, loadGoals } = useCampaignStore()

// Load goals on mount
onMounted(async () => {
  if (goals.value.length === 0) {
    await loadGoals()
  }
})

// Methods
function createGoal() {
  // TODO: Navigate to goal creation page when implemented
  const toast = useToast()
  toast.add({
    title: 'Coming Soon',
    description: 'Goal editor is under development',
    color: 'blue'
  })
}

async function refreshGoals() {
  await loadGoals()
}
</script>