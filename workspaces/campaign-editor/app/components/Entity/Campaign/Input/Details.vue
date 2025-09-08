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
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormLabel>Campaign ID *</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="campaign_unique_id" />
              </FormControl>
              <FormDescription>Unique identifier for this campaign</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="meta.title">
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Campaign Title" />
              </FormControl>
              <FormDescription>Display name for the campaign</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="meta.difficulty">
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

          <FormField v-slot="{ componentField }" name="meta.estimated_time">
            <FormItem>
              <FormLabel>Estimated Time</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="e.g., 2-3 hours" />
              </FormControl>
              <FormDescription>Expected time to complete</FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </MoleculeFormGroup>

        <div class="mt-6">
          <FormField v-slot="{ componentField }" name="meta.description">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" placeholder="Describe your campaign..." class="min-h-24" />
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
        <div class="space-y-4">
          <div v-if="formData.meta?.tags && formData.meta.tags.length > 0" class="flex flex-wrap gap-2">
            <Badge v-for="(tag, index) in formData.meta.tags" :key="index" variant="secondary" class="text-sm">
              {{ tag }}
              <Button variant="ghost" size="sm" class="ml-2 h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                @click="removeTag(index)">
                ✕
              </Button>
            </Badge>
          </div>

          <div class="flex space-x-2">
            <Input v-model="newTag" placeholder="Add tag..." class="flex-1" @keyup.enter="addTag" />
            <Button type="button" variant="outline" :disabled="!newTag.trim()" class="openttd-button" @click="addTag">
              ➕ Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Scenarios -->
    <Card class="openttd-titlebar">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-lg">🗺️</span>
            <CardTitle class="text-lg font-semibold">Scenarios</CardTitle>
          </div>
          <Button type="button" variant="outline" class="openttd-button" @click="addScenario">
            ➕ Add Scenario
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="formData.scenarios && formData.scenarios.length > 0" class="space-y-4">
          <div v-for="(scenario, index) in formData.scenarios" :key="index" class="p-4 border border-border rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium">Scenario {{ scenario.order }}</h4>
              <Button type="button" variant="ghost" size="sm" class="text-destructive hover:text-destructive-foreground"
                @click="removeScenario(index)">
                🗑️ Remove
              </Button>
            </div>

            <MoleculeFormGroup>
              <FormField v-slot="{ componentField }" :name="`scenarios.${index}.include.id`">
                <FormItem>
                  <FormLabel>Include</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="scenario_file.nut" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" :name="`scenarios.${index}.order`">
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" type="number" :value="scenario.order"
                      @input="updateScenarioOrder(index, $event)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" :name="`scenarios.${index}.required`">
                <FormItem class="flex items-center space-x-2">
                  <FormControl>
                    <Toggle v-bind="componentField" :pressed="scenario.required" />
                  </FormControl>
                  <FormLabel class="text-sm">Required</FormLabel>
                  <FormMessage />
                </FormItem>
              </FormField>
            </MoleculeFormGroup>
          </div>
        </div>

        <div v-else class="text-center py-8 text-muted-foreground">
          <p>No scenarios added yet. Click "Add Scenario" to get started.</p>
        </div>
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
import type { CampaignScenario, CampaignFormData, CampaignSettings } from '~/types'

defineOptions({
  name: 'EntityCampaignInputDetails'
})

const formData = defineModel<CampaignFormData>({ required: true })

const newTag = ref('')

// Form methods
function addTag() {
  const tag = newTag.value.trim()
  if (tag && !formData.value.meta?.tags?.includes(tag)) {
    const currentTags = formData.value.meta?.tags || []
    formData.value = {
      ...formData.value,
      meta: {
        ...formData.value.meta,
        tags: [...currentTags, tag]
      }
    }
    newTag.value = ''
  }
}

function removeTag(index: number) {
  const currentTags = formData.value.meta?.tags || []
  const newTags = currentTags.filter((_: string, i: number) => i !== index)
  formData.value = {
    ...formData.value,
    meta: {
      ...formData.value.meta,
      tags: newTags
    }
  }
}

function addScenario() {
  const currentScenarios = formData.value.scenarios || []
  const newScenario = {
    include: {
      __ref: {
        id: '',
        type: 'Scenario' as const
      }
    },
    order: currentScenarios.length + 1,
    required: true
  }
  formData.value = {
    ...formData.value,
    scenarios: [...currentScenarios, newScenario]
  }
}

function removeScenario(index: number) {
  const currentScenarios = formData.value.scenarios || []
  const newScenarios = currentScenarios.filter((_: unknown, i: number) => i !== index)
  // Reorder remaining scenarios
  newScenarios.forEach((scenario: CampaignScenario, idx: number) => {
    scenario.order = idx + 1
  })
  formData.value = {
    ...formData.value,
    scenarios: newScenarios
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
      required: currentScenario.required ?? true
    }
  }
  formData.value = {
    ...formData.value,
    scenarios: updatedScenarios
  }
}
</script>