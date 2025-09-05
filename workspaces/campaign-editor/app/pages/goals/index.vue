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
        <Button
          @click="createGoal"
          class="openttd-button bg-openttd-green text-white"
        >
          ➕ New Goal
        </Button>
        
        <Button
          variant="outline"
          :disabled="loading"
          @click="refreshGoals"
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
          <div class="text-6xl mb-4">🎯</div>
          <CardTitle class="text-lg font-semibold text-foreground mb-2">
            Goals Editor Coming Soon
          </CardTitle>
          <p class="text-muted-foreground mb-6">
            The goals editor is under development. For now, you can manage goals through the campaign editor
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

    <!-- Goals Count -->
    <Card v-if="goals.length > 0" class="openttd-titlebar">
      <CardContent class="pt-6">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-lg font-semibold">Available Goals</CardTitle>
            <p class="text-muted-foreground">{{ goals.length }} goals currently defined</p>
          </div>
          <Badge class="bg-openttd-blue text-white px-3 py-1 text-lg">{{ goals.length }}</Badge>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    title: '🚧 Coming Soon',
    description: 'Goal editor is under development',
    color: 'blue'
  })
}

async function refreshGoals() {
  await loadGoals()
}
</script>