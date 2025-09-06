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
        <Button class="openttd-button bg-openttd-purple text-white" @click="createScenario">
          ➕ New Scenario
        </Button>

        <Button variant="outline" :disabled="loading" class="openttd-button" @click="refreshScenarios">
          {{ loading ? '🔄' : '↻' }} Refresh
        </Button>
      </div>
    </div>

    <!-- Scenarios List -->
    <div v-if="scenarios.length > 0" class="space-y-4">
      <Card v-for="scenario in scenarios" :key="scenario.id" class="openttd-titlebar">
        <CardContent class="pt-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <CardTitle class="text-lg font-semibold">{{ scenario.meta?.title || scenario.id }}</CardTitle>
                <Badge :class="getDifficultyBadgeClass(scenario.meta?.difficulty)">
                  {{ scenario.meta?.difficulty || 'medium' }}
                </Badge>
                <Badge class="bg-openttd-purple text-white">
                  {{ scenario.goals?.length || 0 }} goals
                </Badge>
              </div>
              
              <p class="text-muted-foreground mb-3">
                {{ scenario.meta?.description || scenario.comment || 'No description available' }}
              </p>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div v-if="scenario.constraints?.players">
                  <span class="font-medium text-foreground">Players:</span>
                  <p class="text-muted-foreground">
                    {{ scenario.constraints.players.min || 1 }}-{{ scenario.constraints.players.max || 8 }}
                  </p>
                </div>
                <div v-if="scenario.constraints?.date">
                  <span class="font-medium text-foreground">Date Range:</span>
                  <p class="text-muted-foreground">
                    {{ scenario.constraints.date.min || 1950 }}-{{ scenario.constraints.date.max || 2050 }}
                  </p>
                </div>
                <div v-if="scenario.settings">
                  <span class="font-medium text-foreground">Settings:</span>
                  <p class="text-muted-foreground">{{ getSettingsDescription(scenario.settings) }}</p>
                </div>
                <div v-if="scenario.goals">
                  <span class="font-medium text-foreground">Goals:</span>
                  <p class="text-muted-foreground">{{ scenario.goals.length }} included</p>
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2 ml-4">
              <Button 
                variant="outline" 
                size="sm" 
                class="openttd-button"
                @click="editScenario(scenario)"
              >
                ✏️ Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                class="openttd-button"
                @click="duplicateScenarioHandler(scenario)"
              >
                📋 Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                class="openttd-button text-red-600 hover:text-red-700"
                @click="deleteScenario(scenario)"
              >
                🗑️ Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <Card v-else class="openttd-titlebar">
      <CardContent class="pt-12 pb-12">
        <div class="text-center">
          <div class="text-6xl mb-4">🗺️</div>
          <CardTitle class="text-lg font-semibold text-foreground mb-2">
            No Scenarios Yet
          </CardTitle>
          <p class="text-muted-foreground mb-6">
            Create your first scenario to combine goals into a cohesive experience.
          </p>
          <Button class="openttd-button bg-openttd-purple text-white" @click="createScenario">
            ➕ Create Your First Scenario
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { Scenario } from '~/types/campaign'

const { scenarios, loading, loadScenarios, deleteScenario: deleteScenarioStore, duplicateScenario } = useCampaignStore()
const toast = useToast()

// Load scenarios on mount
onMounted(async () => {
  if (scenarios.length === 0) {
    await loadScenarios()
  }
})

// Methods
function createScenario() {
  navigateTo('/scenarios/new')
}

function editScenario(scenario: Scenario) {
  navigateTo(`/scenarios/${scenario.id}/edit`)
}

async function duplicateScenarioHandler(scenario: Scenario) {
  try {
    await duplicateScenario(scenario.id)
    toast.add({
      title: '✅ Scenario Duplicated',
      description: `Scenario "${scenario.meta?.title || scenario.id}" has been duplicated`,
      color: 'green'
    })
  } catch (error) {
    console.error('Failed to duplicate scenario:', error)
    toast.add({
      title: '❌ Error',
      description: 'Failed to duplicate scenario',
      color: 'red'
    })
  }
}

async function deleteScenario(scenario: Scenario) {
  if (confirm(`Are you sure you want to delete the scenario "${scenario.meta?.title || scenario.id}"?`)) {
    try {
      await deleteScenarioStore(scenario.id)
      toast.add({
        title: '✅ Scenario Deleted',
        description: `Scenario "${scenario.meta?.title || scenario.id}" has been deleted`,
        color: 'green'
      })
    } catch (error) {
      console.error('Failed to delete scenario:', error)
      toast.add({
        title: '❌ Error',
        description: 'Failed to delete scenario',
        color: 'red'
      })
    }
  }
}

async function refreshScenarios() {
  await loadScenarios()
}

// Helper functions for display
function getDifficultyBadgeClass(difficulty: string | undefined) {
  switch (difficulty) {
    case 'easy': return 'bg-green-500 text-white'
    case 'medium': return 'bg-yellow-500 text-white'
    case 'hard': return 'bg-orange-500 text-white'
    case 'expert': return 'bg-red-500 text-white'
    case 'legendary': return 'bg-purple-500 text-white'
    default: return 'bg-gray-500 text-white'
  }
}

function getSettingsDescription(settings: Record<string, unknown>) {
  if (!settings) return 'Default settings'
  
  const parts = []
  if (settings.economy) parts.push(`Economy: ${settings.economy}`)
  if (settings.disasters !== undefined) parts.push(`Disasters: ${settings.disasters ? 'On' : 'Off'}`)
  if (settings.breakdowns !== undefined) parts.push(`Breakdowns: ${settings.breakdowns ? 'On' : 'Off'}`)
  if (settings.inflation !== undefined) parts.push(`Inflation: ${settings.inflation ? 'On' : 'Off'}`)
  if (settings.seasons !== undefined) parts.push(`Seasons: ${settings.seasons ? 'On' : 'Off'}`)
  
  return parts.length > 0 ? parts.join(', ') : 'Default settings'
}
</script>