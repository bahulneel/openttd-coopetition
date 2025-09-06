<template>
  <div v-if="loading" class="flex justify-center py-12">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
      <p class="text-muted-foreground">Loading campaign...</p>
    </div>
  </div>

  <div v-else-if="error" class="space-y-6">
    <Alert class="border-destructive bg-destructive/10">
      <AlertTitle class="text-destructive">⚠️ Error</AlertTitle>
      <AlertDescription class="text-destructive">
        {{ error }}
        <Button variant="ghost" size="sm" class="ml-2 text-destructive" @click="error = undefined">
          ✕ Dismiss
        </Button>
      </AlertDescription>
    </Alert>

    <div class="flex justify-center">
      <Button variant="outline" class="openttd-button" @click="$router.back()">
        ← Go Back
      </Button>
    </div>
  </div>

  <div v-else class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center space-x-4">
        <Button variant="ghost" size="sm" class="openttd-button" @click="$router.back()">
          ← Back
        </Button>

        <div>
          <h1 class="text-2xl font-bold text-foreground">
            {{ formData.name }}
          </h1>
          <p class="text-muted-foreground">
            Edit campaign details and configuration
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <Button variant="outline" class="openttd-button" @click="duplicateCampaign">
          📄 Duplicate
        </Button>

        <Button variant="outline" class="openttd-button" @click="previewCampaign">
          👁️ Preview
        </Button>

        <Button :disabled="!meta.valid || saving" class="openttd-button bg-openttd-green text-white"
          @click="saveCampaign">
          {{ saving ? '💾 Saving...' : '💾 Save Changes' }}
        </Button>
      </div>
    </div>

    <!-- Form -->
    <form class="space-y-6" @submit.prevent="saveCampaign">
      <!-- Basic Information -->
      <Card class="openttd-titlebar">
        <CardHeader>
          <div class="flex items-center space-x-2">
            <span class="text-lg">ℹ️</span>
            <CardTitle class="text-lg font-semibold">Basic Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="id">
              <FormItem>
                <FormLabel>Campaign ID *</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="campaign_unique_id" disabled />
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
          </div>

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
            <div v-for="(scenario, index) in formData.scenarios" :key="index"
              class="p-4 border border-border rounded-lg">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-medium">Scenario {{ scenario.order }}</h4>
                <Button type="button" variant="ghost" size="sm"
                  class="text-destructive hover:text-destructive-foreground" @click="removeScenario(index)">
                  🗑️ Remove
                </Button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField v-slot="{ componentField }" :name="`scenarios.${index}.include`">
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
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-muted-foreground">
            <p>No scenarios added yet. Click "Add Scenario" to get started.</p>
          </div>
        </CardContent>
      </Card>

      <!-- Footer Actions -->
      <div class="flex items-center justify-between pt-6 border-t border-border">
        <div class="flex items-center space-x-4">
          <div class="text-sm text-muted-foreground">
            {{ hasChanges ? '📝 Unsaved changes' : '✅ All changes saved' }}
          </div>

          <div v-if="customValidationErrors.length > 0" class="flex items-center space-x-2">
            <span class="text-destructive text-sm">⚠️ {{ customValidationErrors.length }} validation errors</span>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <Button type="button" variant="outline" class="openttd-button" @click="resetForm">
            ↺ Reset
          </Button>

          <Button type="submit" :disabled="!meta.valid || saving" class="openttd-button bg-openttd-green text-white"
            @click="saveCampaign">
            {{ saving ? '💾 Saving...' : '💾 Save Changes' }}
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import type { Campaign, CampaignScenario, EntityValue } from '~/types'
import { entityId } from '~/utils/entities'

const route = useRoute()
const router = useRouter()
const campaignStore = useEntityStore()

// Reactive data
const loading = ref(false)
const error = ref<string | undefined>(undefined)
const saving = ref(false)
const newTag = ref('')

// Form setup
const form = useForm({
  validationSchema: campaignSchema,
  initialValues: {
    name: '',
    meta: {
      description: '',
      difficulty: 'medium' as const,
      tags: [],
    },
    scenarios: [],
  } satisfies EntityValue<Campaign>
})

const { values: formData, meta } = form

// Computed
const campaignId = computed(() => route.params.id as string)
const hasChanges = computed(() => meta.value.dirty)

// Custom validation errors
const customValidationErrors = computed(() => {
  const errors: string[] = []
  // Add custom validation logic here if needed
  return errors
})

// Load campaign on mount
onMounted(async () => {
  await loadCampaign()
})

// Methods
async function loadCampaign() {
  loading.value = true
  error.value = undefined

  try {
    const campaign = await campaignStore.get(campaignId.value, 'Campaign')
    if (campaign) {
      // Transform Campaign type to form schema
      form.setValues({
        id: entityId(campaign),
        ...toEntityValue(campaign),
      })
    } else {
      error.value = 'Campaign not found'
    }
  } catch (err) {
    error.value = 'Failed to load campaign'
    console.error('Failed to load campaign:', err)
  } finally {
    loading.value = false
  }
}

const saveCampaign = form.handleSubmit(async (values) => {
  saving.value = true

  try {
    await campaignStore.assert(asCampaign(values))

    const toast = useToast()
    toast.add({
      title: '💾 Campaign Saved',
      description: `Campaign "${values.name}" has been saved.`,
      color: 'green'
    })

    // Reload the campaign to get updated data
    await loadCampaign()
  } catch (err) {
    console.error('Failed to save campaign:', err)
    const toast = useToast()
    toast.add({
      title: '❌ Error',
      description: 'Failed to save campaign',
      color: 'red'
    })
  } finally {
    saving.value = false
  }
})

function resetForm() {
  loadCampaign()
}

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !formData.meta?.tags?.includes(tag)) {
    const currentTags = formData.meta?.tags || []
    form.setFieldValue('meta.tags', [...currentTags, tag])
    newTag.value = ''
  }
}

function removeTag(index: number) {
  const currentTags = formData.meta?.tags || []
  const newTags = currentTags.filter((_: string, i: number) => i !== index)
  form.setFieldValue('meta.tags', newTags)
}

function addScenario() {
  const currentScenarios = formData.scenarios || []
  const newScenario = {
    include: '',
    order: currentScenarios.length + 1,
    required: true
  }
  form.setFieldValue('scenarios', [...currentScenarios, newScenario])
}

function removeScenario(index: number) {
  const currentScenarios = formData.scenarios || []
  const newScenarios = currentScenarios.filter((_: unknown, i: number) => i !== index)
  // Reorder remaining scenarios
  newScenarios.forEach((scenario: CampaignScenario, idx: number) => {
    scenario.order = idx + 1
  })
  form.setFieldValue('scenarios', newScenarios)
}

function updateScenarioOrder(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const newOrder = parseInt(target.value) || 1
  const currentScenarios = formData.scenarios || []
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
  form.setFieldValue('scenarios', updatedScenarios)
}

function previewCampaign() {
  // TODO: Implement preview functionality
  console.log('Preview campaign:', formData)
}

async function duplicateCampaign() {
  try {
    const duplicate = campaignStore.copy(campaignId.value, { name: `${formData.name} (Copy)` })
    const toast = useToast()
    toast.add({
      title: '📄 Campaign Duplicated',
      description: `Campaign "${duplicate.name}" has been created.`,
      color: 'green'
    })
    // Navigate to the duplicated campaign
    router.push(`/campaigns/${entityId(duplicate)}`)
  } catch (err) {
    console.error('Failed to duplicate campaign:', err)
    const toast = useToast()
    toast.add({
      title: '❌ Error',
      description: 'Failed to duplicate campaign',
      color: 'red'
    })
  }
}
</script>
