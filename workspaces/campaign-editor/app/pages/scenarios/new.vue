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
    <Form
      :validation-schema="scenarioSchema"
      @submit="saveScenario"
    >
      <EntityScenarioInputDetails v-model="form">
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
import type { Scenario } from '~/types'
import { createScenario, scenarioTemplate } from '~/utils/model/scenarios'
import { scenarioSchema } from '~/utils/schemas'

const store = useEntityStore()
const toast = useToast()

// Initialize form with empty scenario
const form = ref<Scenario>(createScenario('New Scenario', scenarioTemplate.newItem))

function saveScenario() {
  store.assert(form.value)
  toast.add({
    title: '✅ Scenario Created',
    description: `Scenario "${form.value.name}" has been created successfully`,
    color: 'green',
  })
  navigateTo('/scenarios')
}
</script>
