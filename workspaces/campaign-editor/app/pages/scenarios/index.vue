<template>
  <TemplateScreenCollection
    title="Scenarios"
    subtitle="Manage scenarios that combine goals into cohesive experiences"
    :has-content="scenarios.length > 0"
    empty-title="No Scenarios Yet"
    empty-description="Create your first scenario to combine goals into a cohesive experience."
  >
    <template #actions>
      <Button class="openttd-button bg-openttd-purple text-white" @click="createScenario">
        ➕ New Scenario
      </Button>

      <Button variant="outline" :disabled="loading" class="openttd-button" @click="refreshScenarios">
        {{ loading ? '🔄' : '↻' }} Refresh
      </Button>
    </template>

    <template #empty-actions>
      <Button class="openttd-button bg-openttd-purple text-white" @click="createScenario">
        ➕ Create Your First Scenario
      </Button>
    </template>

    <AggregateScenarios 
      :scenarios="scenarios"
      @edit="editScenario"
      @duplicate="duplicateScenarioHandler"
      @delete="deleteScenario"
    />
  </TemplateScreenCollection>
</template>

<script setup lang="ts">
import type { Scenario } from '~/types'

const entityStore = useEntityStore()
const toast = useToast()

// Loading state
const { isLoading: loading, start, finish } = useLoadingIndicator()

// Get scenarios from entity store
const scenarios = computed(() => entityStore.select('Scenario').value)

// Methods
function createScenario() {
  navigateTo('/scenarios/new')
}

function editScenario(scenario: Scenario) {
  navigateTo(`/scenarios/${entityId(scenario)}/edit`)
}

async function duplicateScenarioHandler(scenario: Scenario) {
  try {
    const scenarioId = entityId(scenario)
    if (!entityStore.has(scenarioId)) {
      throw new Error('Scenario not found')
    }

    // Use entity store copy method to create a duplicate
    const duplicate = entityStore.copy(scenarioId, {
      name: `${scenario.name} (Copy)`
    })

    toast.add({
      title: '✅ Scenario Duplicated',
      description: `Scenario "${scenario.name}" has been duplicated`,
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
  if (confirm(`Are you sure you want to delete the scenario "${scenario.name}"?`)) {
    try {
      // Remove from store
      entityStore.retract(entityId(scenario))

      toast.add({
        title: '✅ Scenario Deleted',
        description: `Scenario "${scenario.name}" has been deleted`,
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
  start()
  try {
    const { scenarios } = await $fetch('/api/scenarios')
    // Clear existing scenarios and add new ones
    scenarios.forEach((scenario: Scenario) => {
      entityStore.assert(scenario)
    })
    finish()
  } catch (error) {
    console.error('Failed to refresh scenarios:', error)
    finish({ error: true })
    toast.add({
      title: '❌ Error',
      description: 'Failed to refresh scenarios',
      color: 'red'
    })
  }
}

</script>