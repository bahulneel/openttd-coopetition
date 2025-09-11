<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Create New Scenario</h1>
        <p class="text-muted-foreground">Define a new scenario that combines goals into a cohesive experience</p>
      </div>

      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="openttd-button"
          @click="navigateTo('/scenarios')"
        >
          ← Back to Scenarios
        </Button>
      </div>
    </div>

    <!-- Scenario Form -->
    <Form @submit="form.handleSubmit(saveScenario)">
      <EntityScenarioInputDetails>
        <template #actions>
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              class="openttd-button"
              @click="navigateTo('/scenarios')"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              :disabled="!meta.valid"
              class="openttd-button bg-openttd-purple text-white"
            >
              Create Scenario
            </Button>
          </div>
        </template>
      </EntityScenarioInputDetails>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import type { Scenario, ScenarioValue } from '~/types'
import { createScenario } from '~/utils/model/scenarios'
import { scenarioSchema } from '~/utils/schemas'
import { toEntityValue } from '~/utils/entities'

const store = useEntityStore()
const toast = useToast()

// Initialize form with validation
const form = useForm({
  validationSchema: scenarioSchema,
  initialValues: toEntityValue(createScenario('New Scenario')) as ScenarioValue,
})

const { meta } = form

function saveScenario(values: ScenarioValue) {
  try {
    // Create scenario entity manually
    const scenario: Scenario = createScenario(values.name, values)
    store.assert(scenario)

    toast.add({
      title: '✅ Scenario Created',
      description: `Scenario "${values.name}" has been created successfully`,
      color: 'green',
    })
    navigateTo('/scenarios')
  } catch (error) {
    console.error('Failed to save scenario:', error)
    toast.add({
      title: '❌ Error',
      description: 'Failed to save scenario',
      color: 'red',
    })
  }
}
</script>
