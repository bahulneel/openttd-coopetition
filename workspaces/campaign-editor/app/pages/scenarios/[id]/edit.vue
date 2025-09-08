<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          Edit Scenario
        </h1>
        <p class="text-muted-foreground">
          Modify the scenario configuration
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <Button variant="outline" class="openttd-button" @click="navigateTo('/scenarios')">
          ← Back to Scenarios
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <div class="text-4xl mb-4">🔄</div>
        <p class="text-muted-foreground">Loading scenario...</p>
      </div>
    </div>

    <!-- Scenario Not Found -->
    <Card v-else-if="!scenario" class="openttd-titlebar">
      <CardContent class="pt-12 pb-12">
        <div class="text-center">
          <div class="text-6xl mb-4">❌</div>
          <CardTitle class="text-lg font-semibold text-foreground mb-2">
            Scenario Not Found
          </CardTitle>
          <p class="text-muted-foreground mb-6">
            The scenario you're looking for doesn't exist or has been deleted.
          </p>
          <Button class="openttd-button bg-openttd-purple text-white" @click="navigateTo('/scenarios')">
            ← Back to Scenarios
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Scenario Form -->
    <Form v-else-if="form" @submit="saveScenario">
      <EntityScenarioInputDetails :form-data="form" @update:form-data="updateFormData">
        <template #actions>
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" class="openttd-button" @click="navigateTo('/scenarios')">
              Cancel
            </Button>
            <Button type="submit" :disabled="loading" class="openttd-button bg-openttd-purple text-white">
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </Button>
          </div>
        </template>
      </EntityScenarioInputDetails>
    </Form>
  </div>
</template>

<script setup lang="ts">
import type { Scenario, ScenarioFormData } from '~/types'

const route = useRoute()
const entityStore = useEntityStore()
const toast = useToast()

const scenarioId = route.params.id as string
const scenario = ref<Scenario | undefined>(undefined)
const form = ref<ScenarioFormData | undefined>(undefined)
const { isLoading: loading, start, finish } = useLoadingIndicator()

// Load scenario data
onMounted(async () => {
  const scenarioData = entityStore.get(scenarioId, 'Scenario')
  if (scenarioData) {
    const entity = toStorableValue(scenarioData)
    scenario.value = entity
    form.value = scenarioToFormData(entity) // Convert to FormData for form handling
  }
})

function updateFormData(newData: ScenarioFormData) {
  form.value = newData
}

async function saveScenario() {
  if (!form.value) return

  start()
  try {
    // Convert FormData back to Entity
    const entity = asScenario(form.value)

    // Update the entity in the store
    entityStore.assert(entity)

    // Save to backend
    await $fetch('/api/scenarios', {
      method: 'POST',
      body: { scenario: entity }
    })

    toast.add({
      title: '✅ Scenario Updated',
      description: `Scenario "${form.value.name}" has been updated successfully`,
      color: 'green'
    })
    finish()
    navigateTo('/scenarios')
  } catch {
    finish({ error: true })
    toast.add({
      title: '❌ Error',
      description: 'Failed to update scenario',
      color: 'red'
    })
  }
}
</script>