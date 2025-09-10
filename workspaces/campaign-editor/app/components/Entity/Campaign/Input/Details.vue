<template>
  <div class="space-y-6">
    <!-- Basic Information -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <div class="flex items-center space-x-2">
          <span class="text-lg">ℹ️</span>
          <CardTitle class="text-lg font-semibold">Basic Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <MoleculeFormGroup>
          <FormField
            v-slot="{ componentField }"
            name="id"
          >
            <FormItem>
              <FormLabel>Campaign ID *</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="campaign_unique_id"
                />
              </FormControl>
              <FormDescription>Unique identifier for this campaign</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="meta.title"
          >
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Campaign Title"
                />
              </FormControl>
              <FormDescription>Display name for the campaign</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="meta.difficulty"
          >
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="openttd-button">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="easy">🟢 Easy</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="hard">🟠 Hard</SelectItem>
                  <SelectItem value="expert">🔴 Expert</SelectItem>
                  <SelectItem value="legendary">🟣 Legendary</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Difficulty level for this campaign</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="meta.estimated_time"
          >
            <FormItem>
              <FormLabel>Estimated Time</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="e.g., 2-3 hours"
                />
              </FormControl>
              <FormDescription>Expected time to complete</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </MoleculeFormGroup>

        <div class="mt-6">
          <FormField
            v-slot="{ componentField }"
            name="meta.description"
          >
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  placeholder="Describe your campaign..."
                  class="min-h-24"
                />
              </FormControl>
              <FormDescription>Detailed description of the campaign</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </CardContent>
    </Card>

    <!-- Tags -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <div class="flex items-center space-x-2">
          <span class="text-lg">🏷️</span>
          <CardTitle class="text-lg font-semibold">Tags</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <MoleculeFormInputTags
          name="meta.tags"
          label="Tags"
          placeholder="Add tags..."
          description="Add relevant tags for categorization"
        />
      </CardContent>
    </Card>

    <!-- Scenarios -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <div class="flex items-center space-x-2">
          <span class="text-lg">🗺️</span>
          <CardTitle class="text-lg font-semibold">Scenarios</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <AggregateInput
          v-model="formData.scenarios"
          :default-item="createDefaultScenario"
        >
          <template #collection="{ items }">
            <div
              v-for="(scenario, index) in items"
              :key="`scenario-${index}`"
              class="space-y-4"
            >
              <div class="p-4 border border-border rounded-lg">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-medium">Scenario {{ scenario.order }}</h4>
                </div>

                <MoleculeFormGroup>
                  <FormField
                    v-slot="{ componentField }"
                    :name="`scenarios.${index}.include.id`"
                  >
                    <FormItem>
                      <FormLabel>Include</FormLabel>
                      <FormControl>
                        <Input
                          v-bind="componentField"
                          placeholder="scenario_file.nut"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField
                    v-slot="{ componentField }"
                    :name="`scenarios.${index}.order`"
                  >
                    <FormItem>
                      <FormLabel>Order</FormLabel>
                      <FormControl>
                        <Input
                          v-bind="componentField"
                          type="number"
                          :value="scenario.order"
                          @input="updateScenarioOrder(index, $event)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField
                    v-slot="{ componentField }"
                    :name="`scenarios.${index}.required`"
                  >
                    <FormItem class="flex items-center space-x-2">
                      <FormControl>
                        <Toggle
                          v-bind="componentField"
                          :pressed="scenario.required"
                        />
                      </FormControl>
                      <FormLabel class="text-sm">Required</FormLabel>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </MoleculeFormGroup>
              </div>
            </div>
          </template>

          <template #empty>
            <p>No scenarios added yet. Click "Add Scenario" to get started.</p>
          </template>

          <template #new-item>
            <Button
              type="button"
              variant="outline"
              class="openttd-button"
            >
              ➕ Add Scenario
            </Button>
          </template>
        </AggregateInput>
      </CardContent>
    </Card>

    <!-- Game Settings -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <div class="flex items-center space-x-2">
          <span class="text-lg">⚙️</span>
          <CardTitle class="text-lg font-semibold">Game Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <DomainGameSettingsInput name="settings" />
      </CardContent>
    </Card>

    <!-- Actions Slot -->
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
import type { CampaignFormData } from '~/types'

defineOptions({
  name: 'EntityCampaignInputDetails',
})

const formData = defineModel<CampaignFormData>({ required: true })

// Default scenario creation function
function createDefaultScenario() {
  const currentScenarios = formData.value.scenarios || []
  return {
    include: {
      __ref: {
        id: '',
        type: 'Scenario' as const,
      },
    },
    order: currentScenarios.length + 1,
    required: true,
  }
}

function updateScenarioOrder(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const newOrder = parseInt(target.value) || 1
  const currentScenarios = formData.value.scenarios || []
  const updatedScenarios = [...currentScenarios]
  const currentScenario = updatedScenarios[index]
  if (currentScenario) {
    updatedScenarios[index] = {
      ...currentScenario,
      order: newOrder,
      include: currentScenario.include || '',
      required: currentScenario.required ?? true,
    }
  }
  formData.value = {
    ...formData.value,
    scenarios: updatedScenarios,
  }
}
</script>
