<template>
  <div v-if="loading" class="flex justify-center py-12">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-muted-foreground">Loading campaign...</p>
    </div>
  </div>

  <div v-else-if="error" class="space-y-6">
    <UAlert
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="solid"
      :title="error"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: false }"
      @close="error = null"
    />
    
    <div class="flex justify-center">
      <UButton
        variant="outline"
        icon="i-heroicons-arrow-left"
        @click="$router.back()"
      >
        Go Back
      </UButton>
    </div>
  </div>

  <div v-else class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center space-x-4">
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-arrow-left"
          @click="$router.back()"
        >
          Back
        </UButton>
        
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
        <UButton
          v-if="!isNew"
          variant="outline"
          icon="i-heroicons-document-duplicate"
          @click="duplicateCampaign"
        >
          Duplicate
        </UButton>
        
        <UButton
          variant="outline"
          icon="i-heroicons-eye"
          @click="previewCampaign"
        >
          Preview
        </UButton>
        
        <UButton
          icon="i-heroicons-check"
          :loading="saving"
          :disabled="!isValid"
          @click="saveCampaign"
        >
          {{ isNew ? 'Create Campaign' : 'Save Changes' }}
        </UButton>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="saveCampaign" class="space-y-6">
      <!-- Basic Information -->
      <UCard>
        <template #header>
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:information-circle" class="h-5 w-5 text-primary" />
            <h3 class="text-lg font-semibold">Basic Information</h3>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="Campaign ID" required>
            <UInput
              v-model="formData.id"
              placeholder="campaign_unique_id"
              :disabled="!isNew"
              pattern="[a-zA-Z0-9_-]+"
              help="Unique identifier for this campaign"
            />
          </UFormGroup>

          <UFormGroup label="Title">
            <UInput
              v-model="formData.meta.title"
              placeholder="Campaign Title"
              help="Display name for the campaign"
            />
          </UFormGroup>

          <UFormGroup label="Difficulty" class="md:col-span-1">
            <USelect
              v-model="formData.meta.difficulty"
              :options="difficultyOptions"
              placeholder="Select difficulty"
            />
          </UFormGroup>

          <UFormGroup label="Estimated Time" class="md:col-span-1">
            <UInput
              v-model="formData.meta.estimated_time"
              placeholder="2-4 hours"
              help="How long this campaign typically takes"
            />
          </UFormGroup>

          <UFormGroup label="Description" class="md:col-span-2">
            <UTextarea
              v-model="formData.meta.description"
              placeholder="Describe what this campaign involves..."
              rows="3"
            />
          </UFormGroup>

          <UFormGroup label="Tags" class="md:col-span-2">
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="(tag, index) in formData.meta.tags"
                  :key="index"
                  variant="soft"
                  class="flex items-center space-x-1"
                >
                  <span>{{ tag }}</span>
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </UBadge>
              </div>
              
              <div class="flex space-x-2">
                <UInput
                  v-model="newTag"
                  placeholder="Add tag..."
                  @keyup.enter="addTag"
                  class="flex-1"
                />
                <UButton
                  type="button"
                  variant="outline"
                  @click="addTag"
                  :disabled="!newTag.trim()"
                >
                  Add
                </UButton>
              </div>
            </div>
          </UFormGroup>
        </div>
      </UCard>

      <!-- Constraints -->
      <UCard>
        <template #header>
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:cog-6-tooth" class="h-5 w-5 text-primary" />
            <h3 class="text-lg font-semibold">Constraints</h3>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <UFormGroup label="Min Players">
            <UInput
              v-model.number="formData.constraints.players.min"
              type="number"
              min="1"
              max="8"
              placeholder="1"
            />
          </UFormGroup>

          <UFormGroup label="Max Players">
            <UInput
              v-model.number="formData.constraints.players.max"
              type="number"
              min="1"
              max="8"
              placeholder="8"
            />
          </UFormGroup>

          <UFormGroup label="Start Year">
            <UInput
              v-model.number="formData.constraints.date.min"
              type="number"
              min="1920"
              max="2100"
              placeholder="1950"
            />
          </UFormGroup>

          <UFormGroup label="End Year">
            <UInput
              v-model.number="formData.constraints.date.max"
              type="number"
              min="1920"
              max="2100"
              placeholder="2050"
            />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Scenarios -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <Icon name="heroicons:map" class="h-5 w-5 text-primary" />
              <h3 class="text-lg font-semibold">Scenarios</h3>
            </div>
            
            <UButton
              variant="outline"
              size="sm"
              icon="i-heroicons-plus"
              @click="addScenario"
            >
              Add Scenario
            </UButton>
          </div>
        </template>

        <div v-if="formData.scenarios.length === 0" class="text-center py-8 text-muted-foreground">
          <Icon name="heroicons:map" class="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No scenarios added yet</p>
          <UButton
            variant="outline"
            size="sm"
            icon="i-heroicons-plus"
            class="mt-4"
            @click="addScenario"
          >
            Add First Scenario
          </UButton>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(scenario, index) in formData.scenarios"
            :key="index"
            class="scenario-item"
          >
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium">Scenario {{ index + 1 }}</h4>
              <UButton
                variant="ghost"
                size="sm"
                icon="i-heroicons-trash"
                @click="removeScenario(index)"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormGroup label="Scenario ID" required>
                <UInput
                  v-model="scenario.include"
                  placeholder="scenario_id"
                  :list="`scenarios-${index}`"
                />
                <datalist :id="`scenarios-${index}`">
                  <option v-for="s in availableScenarios" :key="s.id" :value="s.id">
                    {{ s.meta?.title || s.id }}
                  </option>
                </datalist>
              </UFormGroup>

              <UFormGroup label="Order">
                <UInput
                  v-model.number="scenario.order"
                  type="number"
                  min="1"
                  placeholder="1"
                />
              </UFormGroup>

              <UFormGroup label="Required">
                <UToggle v-model="scenario.required" />
              </UFormGroup>
            </div>

            <UFormGroup v-if="scenario.comment !== undefined" label="Comment" class="mt-4">
              <UInput
                v-model="scenario.comment"
                placeholder="Optional comment about this scenario"
              />
            </UFormGroup>
          </div>
        </div>
      </UCard>

      <!-- Rewards -->
      <UCard>
        <template #header>
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:gift" class="h-5 w-5 text-primary" />
            <h3 class="text-lg font-semibold">Completion Rewards</h3>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <UFormGroup label="Cash Reward">
            <UInput
              v-model.number="formData.rewards.completion.cash"
              type="number"
              min="0"
              placeholder="1000000"
            />
          </UFormGroup>

          <UFormGroup label="Score Points">
            <UInput
              v-model.number="formData.rewards.completion.score"
              type="number"
              min="0"
              placeholder="100"
            />
          </UFormGroup>

          <UFormGroup label="Reputation">
            <UInput
              v-model.number="formData.rewards.completion.reputation"
              type="number"
              min="0"
              placeholder="25"
            />
          </UFormGroup>

          <UFormGroup label="Achievement">
            <UInput
              v-model="formData.rewards.completion.achievement"
              placeholder="achievement_id"
            />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Advanced Settings -->
      <UCard>
        <template #header>
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:adjustments-horizontal" class="h-5 w-5 text-primary" />
            <h3 class="text-lg font-semibold">Advanced Settings</h3>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Game Settings -->
          <div>
            <h4 class="font-medium mb-4">Game Settings</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <UFormGroup label="Economy">
                <USelect
                  v-model="formData.settings.economy"
                  :options="economyOptions"
                  placeholder="Select economy"
                />
              </UFormGroup>

              <UFormGroup label="Disasters">
                <UToggle v-model="formData.settings.disasters" />
              </UFormGroup>

              <UFormGroup label="Breakdowns">
                <UToggle v-model="formData.settings.breakdowns" />
              </UFormGroup>

              <UFormGroup label="Inflation">
                <UToggle v-model="formData.settings.inflation" />
              </UFormGroup>
            </div>
          </div>

          <!-- Comment -->
          <UFormGroup label="Developer Comment">
            <UTextarea
              v-model="formData.comment"
              placeholder="Internal notes about this campaign..."
              rows="3"
            />
          </UFormGroup>
        </div>
      </UCard>
    </form>

    <!-- Action Bar (Sticky) -->
    <div class="sticky bottom-4 bg-card border rounded-lg p-4 shadow-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="text-sm text-muted-foreground">
            {{ isNew ? 'Unsaved campaign' : (hasChanges ? 'Unsaved changes' : 'All changes saved') }}
          </div>
          
          <div v-if="validationErrors.length > 0" class="flex items-center space-x-2">
            <Icon name="heroicons:exclamation-triangle" class="h-4 w-4 text-destructive" />
            <span class="text-sm text-destructive">{{ validationErrors.length }} validation error(s)</span>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <UButton
            variant="outline"
            @click="resetForm"
            :disabled="!hasChanges"
          >
            Reset
          </UButton>
          
          <UButton
            type="submit"
            :loading="saving"
            :disabled="!isValid"
            @click="saveCampaign"
          >
            {{ isNew ? 'Create Campaign' : 'Save Changes' }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Campaign } from '~/types/campaign'

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

// Reactive data
const formData = ref<Campaign>(createEmptyCampaign())
const originalData = ref<Campaign | null>(null)
const saving = ref(false)
const newTag = ref('')

// Computed
const campaignId = computed(() => route.params.id as string)
const isNew = computed(() => campaignId.value === 'new')

// Load data on mount
onMounted(async () => {
  if (campaigns.value.length === 0 || availableScenarios.value.length === 0) {
    await loadAll()
  }

  if (isNew.value) {
    formData.value = createEmptyCampaign()
    originalData.value = null
  } else {
    const campaign = getCampaign(campaignId.value)
    if (campaign) {
      formData.value = JSON.parse(JSON.stringify(campaign)) // Deep clone
      originalData.value = campaign
    } else {
      error.value = 'Campaign not found'
    }
  }
})

// Validation
const validationErrors = computed(() => {
  const errors: string[] = []
  
  if (!formData.value.id?.trim()) {
    errors.push('Campaign ID is required')
  }
  
  if (formData.value.constraints?.players?.min && formData.value.constraints?.players?.max) {
    if (formData.value.constraints.players.min > formData.value.constraints.players.max) {
      errors.push('Minimum players cannot be greater than maximum players')
    }
  }
  
  if (formData.value.constraints?.date?.min && formData.value.constraints?.date?.max) {
    if (formData.value.constraints.date.min > formData.value.constraints.date.max) {
      errors.push('Start year cannot be later than end year')
    }
  }
  
  return errors
})

const isValid = computed(() => validationErrors.value.length === 0)

const hasChanges = computed(() => {
  if (isNew.value) return true
  if (!originalData.value) return false
  return JSON.stringify(formData.value) !== JSON.stringify(originalData.value)
})

// Options
const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
  { value: 'legendary', label: 'Legendary' }
]

const economyOptions = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'arcade', label: 'Arcade' }
]

// Methods
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.value.meta?.tags?.includes(tag)) {
    if (!formData.value.meta) formData.value.meta = {}
    if (!formData.value.meta.tags) formData.value.meta.tags = []
    formData.value.meta.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  if (formData.value.meta?.tags) {
    formData.value.meta.tags.splice(index, 1)
  }
}

const addScenario = () => {
  if (!formData.value.scenarios) formData.value.scenarios = []
  formData.value.scenarios.push({
    include: '',
    order: formData.value.scenarios.length + 1,
    required: true
  })
}

const removeScenario = (index: number) => {
  if (formData.value.scenarios) {
    formData.value.scenarios.splice(index, 1)
    // Reorder remaining scenarios
    formData.value.scenarios.forEach((scenario, idx) => {
      scenario.order = idx + 1
    })
  }
}

const saveCampaign = async () => {
  if (!isValid.value) return

  saving.value = true
  try {
    await saveCampaignStore(formData.value)
    
    const toast = useToast()
    toast.add({
      title: isNew.value ? 'Campaign Created' : 'Campaign Saved',
      description: `Campaign "${formData.value.meta?.title || formData.value.id}" has been saved.`,
      color: 'green'
    })

    if (isNew.value) {
      router.push(`/campaigns/${formData.value.id}`)
    } else {
      originalData.value = JSON.parse(JSON.stringify(formData.value))
    }
  } catch (err) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to save campaign',
      color: 'red'
    })
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  if (isNew.value) {
    formData.value = createEmptyCampaign()
  } else if (originalData.value) {
    formData.value = JSON.parse(JSON.stringify(originalData.value))
  }
}

const duplicateCampaign = async () => {
  if (isNew.value) return
  
  try {
    const duplicate = await duplicateCampaignStore(campaignId.value)
    router.push(`/campaigns/${duplicate.id}`)
    
    const toast = useToast()
    toast.add({
      title: 'Campaign Duplicated',
      description: `Campaign "${duplicate.meta?.title || duplicate.id}" has been created.`,
      color: 'green'
    })
  } catch (err) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to duplicate campaign',
      color: 'red'
    })
  }
}

const previewCampaign = () => {
  // TODO: Implement preview functionality
  const toast = useToast()
  toast.add({
    title: 'Preview',
    description: 'Preview functionality coming soon',
    color: 'blue'
  })
}

// Initialize reactive objects if they don't exist
watchEffect(() => {
  if (!formData.value.meta) formData.value.meta = {}
  if (!formData.value.meta.tags) formData.value.meta.tags = []
  if (!formData.value.constraints) formData.value.constraints = {}
  if (!formData.value.constraints.players) formData.value.constraints.players = {}
  if (!formData.value.constraints.date) formData.value.constraints.date = {}
  if (!formData.value.scenarios) formData.value.scenarios = []
  if (!formData.value.rewards) formData.value.rewards = {}
  if (!formData.value.rewards.completion) formData.value.rewards.completion = {}
  if (!formData.value.settings) formData.value.settings = {}
})

// Page meta
definePageMeta({
  title: 'Edit Campaign'
})
</script>

<style scoped>
.scenario-item {
  @apply bg-secondary/50 rounded-md p-4 border border-border;
}
</style>