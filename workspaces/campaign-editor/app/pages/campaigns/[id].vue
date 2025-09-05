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
            {{ isNew ? 'New Campaign' : (formData.meta?.title || formData.id) }}
          </h1>
          <p class="text-muted-foreground">
            {{ isNew ? 'Create a new campaign' : 'Edit campaign details and configuration' }}
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <Button v-if="!isNew" variant="outline" class="openttd-button" @click="duplicateCampaign">
          📄 Duplicate
        </Button>

        <Button variant="outline" class="openttd-button" @click="previewCampaign">
          👁️ Preview
        </Button>

        <Button
:disabled="!meta.valid || saving" class="openttd-button bg-openttd-green text-white"
          @click="saveCampaign">
          {{ saving ? '💾 Saving...' : (isNew ? '✨ Create Campaign' : '💾 Save Changes') }}
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
                  <Input v-bind="componentField" placeholder="campaign_unique_id" :disabled="!isNew" />
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
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="meta.estimated_time">
              <FormItem>
                <FormLabel>Estimated Time</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="2-4 hours" />
                </FormControl>
                <FormDescription>How long this campaign typically takes</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="meta.description" class="md:col-span-2">
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea v-bind="componentField" placeholder="Describe what this campaign involves..." rows="3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="space-y-2 md:col-span-2">
              <Label for="tags">Tags</Label>
              <div class="space-y-2">
                <div class="flex flex-wrap gap-2">
                  <Badge
v-for="(tag, index) in formData.meta?.tags || []" :key="index" variant="secondary"
                    class="flex items-center space-x-1">
                    <span>{{ tag }}</span>
                    <button
type="button" class="ml-1 text-muted-foreground hover:text-foreground text-sm"
                      @click="removeTag(index)">
                      ✕
                    </button>
                  </Badge>
                </div>

                <div class="flex space-x-2">
                  <Input v-model="newTag" placeholder="Add tag..." class="flex-1" @keyup.enter="addTag" />
                  <Button
type="button" variant="outline" :disabled="!newTag.trim()" class="openttd-button"
                    @click="addTag">
                    ➕ Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Constraints -->
      <Card class="openttd-titlebar">
        <CardHeader>
          <div class="flex items-center space-x-2">
            <span class="text-lg">⚙️</span>
            <CardTitle class="text-lg font-semibold">Constraints</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField v-slot="{ componentField }" name="constraints.players.min">
              <FormItem>
                <FormLabel>Min Players</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" min="1" max="8" placeholder="1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="constraints.players.max">
              <FormItem>
                <FormLabel>Max Players</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" min="1" max="8" placeholder="8" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="constraints.date.min">
              <FormItem>
                <FormLabel>Start Year</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" min="1920" max="2100" placeholder="1950" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="constraints.date.max">
              <FormItem>
                <FormLabel>End Year</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" min="1920" max="2100" placeholder="2050" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
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

            <Button variant="outline" size="sm" class="openttd-button" @click="addScenario">
              ➕ Add Scenario
            </Button>
          </div>
        </CardHeader>
        <CardContent>

          <div v-if="formData.scenarios?.length === 0" class="text-center py-8 text-muted-foreground">
            <div class="text-4xl mb-2">🗺️</div>
            <p>No scenarios added yet</p>
            <Button variant="outline" size="sm" class="mt-4 openttd-button" @click="addScenario">
              ➕ Add First Scenario
            </Button>
          </div>

          <div v-else class="space-y-4">
            <div
v-for="(scenario, index) in formData.scenarios" :key="index"
              class="bg-secondary/50 rounded-md p-4 border border-border">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-medium">Scenario {{ index + 1 }}</h4>
                <Button variant="ghost" size="sm" class="h-8 w-8 p-0 text-destructive" @click="removeScenario(index)">
                  🗑️
                </Button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField :name="`scenarios.${index}.include`">
                  <FormItem>
                    <FormLabel>Scenario ID *</FormLabel>
                    <FormControl>
                      <Input v-model="scenario.include" placeholder="scenario_id" :list="`scenarios-${index}`" />
                    </FormControl>
                    <datalist :id="`scenarios-${index}`">
                      <option v-for="s in availableScenarios" :key="s.id" :value="s.id">
                        {{ s.meta?.title || s.id }}
                      </option>
                    </datalist>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :name="`scenarios.${index}.order`">
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input v-model.number="scenario.order" type="number" min="1" placeholder="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :name="`scenarios.${index}.required`">
                  <FormItem>
                    <FormLabel>Required</FormLabel>
                    <FormControl>
                      <Toggle v-model="scenario.required" class="openttd-button" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div v-if="scenario.comment !== undefined" class="space-y-2 mt-4">
                <FormField :name="`scenarios.${index}.comment`">
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Input v-model="scenario.comment" placeholder="Optional comment about this scenario" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Rewards -->
      <Card class="openttd-titlebar">
        <CardHeader>
          <div class="flex items-center space-x-2">
            <span class="text-lg">🎁</span>
            <CardTitle class="text-lg font-semibold">Completion Rewards</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField v-slot="{ componentField }" name="rewards.completion.cash">
              <FormItem>
                <FormLabel>Cash Reward</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" min="0" placeholder="1000000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="rewards.completion.score">
              <FormItem>
                <FormLabel>Score Points</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" min="0" placeholder="100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="rewards.completion.reputation">
              <FormItem>
                <FormLabel>Reputation</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" min="0" placeholder="25" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="rewards.completion.achievement">
              <FormItem>
                <FormLabel>Achievement</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="achievement_id" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </CardContent>
      </Card>

      <!-- Advanced Settings -->
      <Card class="openttd-titlebar">
        <CardHeader>
          <div class="flex items-center space-x-2">
            <span class="text-lg">⚙️</span>
            <CardTitle class="text-lg font-semibold">Advanced Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-6">
            <!-- Game Settings -->
            <div>
              <h4 class="font-medium mb-4">Game Settings</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField v-slot="{ componentField }" name="settings.economy">
                  <FormItem>
                    <FormLabel>Economy</FormLabel>
                    <Select v-bind="componentField">
                      <FormControl>
                        <SelectTrigger class="openttd-button">
                          <SelectValue placeholder="Select economy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="realistic">🏦 Realistic</SelectItem>
                        <SelectItem value="balanced">⚖️ Balanced</SelectItem>
                        <SelectItem value="arcade">🎮 Arcade</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="settings.disasters">
                  <FormItem>
                    <FormLabel>Disasters</FormLabel>
                    <FormControl>
                      <Toggle v-bind="componentField" class="openttd-button" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="settings.breakdowns">
                  <FormItem>
                    <FormLabel>Breakdowns</FormLabel>
                    <FormControl>
                      <Toggle v-bind="componentField" class="openttd-button" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="settings.inflation">
                  <FormItem>
                    <FormLabel>Inflation</FormLabel>
                    <FormControl>
                      <Toggle v-bind="componentField" class="openttd-button" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>

            <!-- Comment -->
            <FormField v-slot="{ componentField }" name="comment">
              <FormItem>
                <FormLabel>Developer Comment</FormLabel>
                <FormControl>
                  <Textarea v-bind="componentField" placeholder="Internal notes about this campaign..." rows="3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </CardContent>
      </Card>
    </form>

    <!-- Action Bar (Sticky) -->
    <Card class="sticky bottom-4 bg-card border-2 border-border shadow-lg">
      <CardContent class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-sm text-muted-foreground">
              {{ isNew ? '✨ Unsaved campaign' : (hasChanges ? '📝 Unsaved changes' : '✅ All changes saved') }}
            </div>

            <div v-if="customValidationErrors.length > 0" class="flex items-center space-x-2">
              <span class="text-destructive">⚠️</span>
              <span class="text-sm text-destructive">{{ customValidationErrors.length }} validation error(s)</span>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <Button variant="outline" :disabled="!hasChanges" class="openttd-button" @click="resetForm">
              🔄 Reset
            </Button>

            <Button
type="submit" :disabled="!meta.valid || saving" class="openttd-button bg-openttd-green text-white"
              @click="saveCampaign">
              {{ saving ? '💾 Saving...' : (isNew ? '✨ Create Campaign' : '💾 Save Changes') }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { Campaign } from '~/types/campaign'
import { useForm } from 'vee-validate'
import { campaignSchema } from '~/utils/schemas'

const route = useRoute()
const router = useRouter()
const {
  campaigns,
  scenarios: availableScenarios,
  loading,
  error,
  getCampaign,
  saveCampaign: saveCampaignStore,
  createEmptyCampaign,
  duplicateCampaign: duplicateCampaignStore,
  loadAll
} = useCampaignStore()

// Form setup
const form = useForm({
  validationSchema: campaignSchema,
  initialValues: createEmptyCampaign()
})

// Reactive data
const originalData = ref<Campaign | undefined>(undefined)
const saving = ref(false)
const newTag = ref('')

// Computed
const campaignId = computed(() => route.params.id as string)
const isNew = computed(() => campaignId.value === 'new')

// Form values and validation
const { values: formData, meta } = form

// Load data on mount
onMounted(async () => {
  if (campaigns.length === 0 || availableScenarios.length === 0) {
    await loadAll()
  }

  if (isNew.value) {
    form.setValues(createEmptyCampaign())
    originalData.value = undefined
  } else {
    const campaign = getCampaign(campaignId.value)
    if (campaign) {
      form.setValues(JSON.parse(JSON.stringify(campaign))) // Deep clone
      originalData.value = campaign
    } else {
      // error.value = 'Campaign not found' // Error is readonly from store
    }
  }
})

// Custom validation for cross-field validation
const customValidationErrors = computed(() => {
  const errors: string[] = []
  const values = formData

  if (values.constraints?.players?.min && values.constraints?.players?.max) {
    if (values.constraints.players.min > values.constraints.players.max) {
      errors.push('Minimum players cannot be greater than maximum players')
    }
  }

  if (values.constraints?.date?.min && values.constraints?.date?.max) {
    if (values.constraints.date.min > values.constraints.date.max) {
      errors.push('Start year cannot be later than end year')
    }
  }

  return errors
})

const hasChanges = computed(() => {
  if (isNew.value) return true
  if (!originalData.value) return false
  return meta.value.dirty || JSON.stringify(formData) !== JSON.stringify(originalData.value)
})

// Options
const _difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
  { value: 'legendary', label: 'Legendary' }
]

const _economyOptions = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'arcade', label: 'Arcade' }
]

// Methods
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.meta?.tags?.includes(tag)) {
    const currentTags = formData.meta?.tags || []
    form.setFieldValue('meta.tags', [...currentTags, tag])
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  const currentTags = formData.meta?.tags || []
  const newTags = currentTags.filter((_: string, i: number) => i !== index)
  form.setFieldValue('meta.tags', newTags)
}

const addScenario = () => {
  const currentScenarios = formData.scenarios || []
  const newScenario = {
    include: '',
    order: currentScenarios.length + 1,
    required: true
  }
  form.setFieldValue('scenarios', [...currentScenarios, newScenario])
}

const removeScenario = (index: number) => {
  const currentScenarios = formData.scenarios || []
  const newScenarios = currentScenarios.filter((_: unknown, i: number) => i !== index)
  // Reorder remaining scenarios
  newScenarios.forEach((scenario: { order: number }, idx: number) => {
    scenario.order = idx + 1
  })
  form.setFieldValue('scenarios', newScenarios)
}

const saveCampaign = form.handleSubmit(async (values) => {
  if (customValidationErrors.value.length > 0) return

  saving.value = true
  try {
    await saveCampaignStore(values)

    const toast = useToast()
    toast.add({
      title: isNew.value ? '✨ Campaign Created' : '💾 Campaign Saved',
      description: `Campaign "${values.meta?.title || values.id}" has been saved.`,
      color: 'green'
    })

    if (isNew.value) {
      router.push(`/campaigns/${values.id}`)
    } else {
      originalData.value = JSON.parse(JSON.stringify(values))
    }
  } catch (error) {
    console.error('Failed to save campaign:', error)
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

const resetForm = () => {
  if (isNew.value) {
    form.setValues(createEmptyCampaign())
  } else if (originalData.value) {
    form.setValues(JSON.parse(JSON.stringify(originalData.value)))
  }
}

const duplicateCampaign = async () => {
  if (isNew.value) return

  try {
    const duplicate = await duplicateCampaignStore(campaignId.value)
    router.push(`/campaigns/${duplicate.id}`)

    const toast = useToast()
    toast.add({
      title: '📄 Campaign Duplicated',
      description: `Campaign "${duplicate.meta?.title || duplicate.id}" has been created.`,
      color: 'green'
    })
  } catch (error) {
    console.error('Failed to duplicate campaign:', error)
    const toast = useToast()
    toast.add({
      title: '❌ Error',
      description: 'Failed to duplicate campaign',
      color: 'red'
    })
  }
}

const previewCampaign = () => {
  // TODO: Implement preview functionality
  const toast = useToast()
  toast.add({
    title: '👁️ Preview',
    description: 'Preview functionality coming soon',
    color: 'blue'
  })
}


// Page meta
definePageMeta({
  title: 'Edit Campaign'
})
</script>
