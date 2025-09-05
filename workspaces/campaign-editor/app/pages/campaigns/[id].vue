<template>
  <div v-if="loading" class="flex justify-center py-12">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-muted-foreground">Loading campaign...</p>
    </div>
  </div>

  <div v-else-if="error" class="space-y-6">
    <Alert class="border-destructive bg-destructive/10">
      <AlertTitle class="text-destructive">⚠️ Error</AlertTitle>
      <AlertDescription class="text-destructive">
        {{ error }}
        <Button 
          variant="ghost" 
          size="sm" 
          @click="error = null"
          class="ml-2 text-destructive"
        >
          ✕ Dismiss
        </Button>
      </AlertDescription>
    </Alert>
    
    <div class="flex justify-center">
      <Button
        variant="outline"
        @click="$router.back()"
        class="openttd-button"
      >
        ← Go Back
      </Button>
    </div>
  </div>

  <div v-else class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          @click="$router.back()"
          class="openttd-button"
        >
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
        <Button
          v-if="!isNew"
          variant="outline"
          @click="duplicateCampaign"
          class="openttd-button"
        >
          📄 Duplicate
        </Button>
        
        <Button
          variant="outline"
          @click="previewCampaign"
          class="openttd-button"
        >
          👁️ Preview
        </Button>
        
        <Button
          :disabled="!isValid || saving"
          @click="saveCampaign"
          class="openttd-button bg-openttd-green text-white"
        >
          {{ saving ? '💾 Saving...' : (isNew ? '✨ Create Campaign' : '💾 Save Changes') }}
        </Button>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="saveCampaign" class="space-y-6">
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
            <div class="space-y-2">
              <Label for="campaign-id">Campaign ID *</Label>
              <Input
                id="campaign-id"
                v-model="formData.id"
                placeholder="campaign_unique_id"
                :disabled="!isNew"
                pattern="[a-zA-Z0-9_-]+"
              />
              <p class="text-xs text-muted-foreground">Unique identifier for this campaign</p>
            </div>

            <div class="space-y-2">
              <Label for="title">Title</Label>
              <Input
                id="title"
                v-model="formData.meta.title"
                placeholder="Campaign Title"
              />
              <p class="text-xs text-muted-foreground">Display name for the campaign</p>
            </div>

            <div class="space-y-2">
              <Label for="difficulty">Difficulty</Label>
              <Select v-model="formData.meta.difficulty">
                <SelectTrigger id="difficulty" class="openttd-button">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">🟢 Easy</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="hard">🟠 Hard</SelectItem>
                  <SelectItem value="expert">🔴 Expert</SelectItem>
                  <SelectItem value="legendary">🟣 Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="estimated-time">Estimated Time</Label>
              <Input
                id="estimated-time"
                v-model="formData.meta.estimated_time"
                placeholder="2-4 hours"
              />
              <p class="text-xs text-muted-foreground">How long this campaign typically takes</p>
            </div>

            <div class="space-y-2 md:col-span-2">
              <Label for="description">Description</Label>
              <Textarea
                id="description"
                v-model="formData.meta.description"
                placeholder="Describe what this campaign involves..."
                rows="3"
              />
            </div>

            <div class="space-y-2 md:col-span-2">
              <Label for="tags">Tags</Label>
              <div class="space-y-2">
                <div class="flex flex-wrap gap-2">
                  <Badge
                    v-for="(tag, index) in formData.meta?.tags || []"
                    :key="index"
                    variant="secondary"
                    class="flex items-center space-x-1"
                  >
                    <span>{{ tag }}</span>
                    <button
                      type="button"
                      @click="removeTag(index)"
                      class="ml-1 text-muted-foreground hover:text-foreground text-sm"
                    >
                      ✕
                    </button>
                  </Badge>
                </div>
                
                <div class="flex space-x-2">
                  <Input
                    v-model="newTag"
                    placeholder="Add tag..."
                    @keyup.enter="addTag"
                    class="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    @click="addTag"
                    :disabled="!newTag.trim()"
                    class="openttd-button"
                  >
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
            <div class="space-y-2">
              <Label for="min-players">Min Players</Label>
              <Input
                id="min-players"
                v-model.number="formData.constraints.players.min"
                type="number"
                min="1"
                max="8"
                placeholder="1"
              />
            </div>

            <div class="space-y-2">
              <Label for="max-players">Max Players</Label>
              <Input
                id="max-players"
                v-model.number="formData.constraints.players.max"
                type="number"
                min="1"
                max="8"
                placeholder="8"
              />
            </div>

            <div class="space-y-2">
              <Label for="start-year">Start Year</Label>
              <Input
                id="start-year"
                v-model.number="formData.constraints.date.min"
                type="number"
                min="1920"
                max="2100"
                placeholder="1950"
              />
            </div>

            <div class="space-y-2">
              <Label for="end-year">End Year</Label>
              <Input
                id="end-year"
                v-model.number="formData.constraints.date.max"
                type="number"
                min="1920"
                max="2100"
                placeholder="2050"
              />
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
            
            <Button
              variant="outline"
              size="sm"
              @click="addScenario"
              class="openttd-button"
            >
              ➕ Add Scenario
            </Button>
          </div>
        </CardHeader>
        <CardContent>

          <div v-if="formData.scenarios.length === 0" class="text-center py-8 text-muted-foreground">
            <div class="text-4xl mb-2">🗺️</div>
            <p>No scenarios added yet</p>
            <Button
              variant="outline"
              size="sm"
              class="mt-4 openttd-button"
              @click="addScenario"
            >
              ➕ Add First Scenario
            </Button>
          </div>

        <div v-else class="space-y-4">
          <div
            v-for="(scenario, index) in formData.scenarios"
            :key="index"
            class="scenario-item"
          >
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium">Scenario {{ index + 1 }}</h4>
              <Button
                variant="ghost"
                size="sm"
                @click="removeScenario(index)"
                class="h-8 w-8 p-0 text-destructive"
              >
                🗑️
              </Button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label :for="`scenario-id-${index}`">Scenario ID *</Label>
                <Input
                  :id="`scenario-id-${index}`"
                  v-model="scenario.include"
                  placeholder="scenario_id"
                  :list="`scenarios-${index}`"
                />
                <datalist :id="`scenarios-${index}`">
                  <option v-for="s in availableScenarios" :key="s.id" :value="s.id">
                    {{ s.meta?.title || s.id }}
                  </option>
                </datalist>
              </div>

              <div class="space-y-2">
                <Label :for="`scenario-order-${index}`">Order</Label>
                <Input
                  :id="`scenario-order-${index}`"
                  v-model.number="scenario.order"
                  type="number"
                  min="1"
                  placeholder="1"
                />
              </div>

              <div class="space-y-2">
                <Label :for="`scenario-required-${index}`">Required</Label>
                <Toggle
                  :id="`scenario-required-${index}`"
                  v-model="scenario.required"
                  class="openttd-button"
                />
              </div>
            </div>

            <div v-if="scenario.comment !== undefined" class="space-y-2 mt-4">
              <Label :for="`scenario-comment-${index}`">Comment</Label>
              <Input
                :id="`scenario-comment-${index}`"
                v-model="scenario.comment"
                placeholder="Optional comment about this scenario"
              />
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
            <div class="space-y-2">
              <Label for="cash-reward">Cash Reward</Label>
              <Input
                id="cash-reward"
                v-model.number="formData.rewards.completion.cash"
                type="number"
                min="0"
                placeholder="1000000"
              />
            </div>

            <div class="space-y-2">
              <Label for="score-points">Score Points</Label>
              <Input
                id="score-points"
                v-model.number="formData.rewards.completion.score"
                type="number"
                min="0"
                placeholder="100"
              />
            </div>

            <div class="space-y-2">
              <Label for="reputation">Reputation</Label>
              <Input
                id="reputation"
                v-model.number="formData.rewards.completion.reputation"
                type="number"
                min="0"
                placeholder="25"
              />
            </div>

            <div class="space-y-2">
              <Label for="achievement">Achievement</Label>
              <Input
                id="achievement"
                v-model="formData.rewards.completion.achievement"
                placeholder="achievement_id"
              />
            </div>
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
                <div class="space-y-2">
                  <Label for="economy">Economy</Label>
                  <Select v-model="formData.settings.economy">
                    <SelectTrigger id="economy" class="openttd-button">
                      <SelectValue placeholder="Select economy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">🏦 Realistic</SelectItem>
                      <SelectItem value="balanced">⚖️ Balanced</SelectItem>
                      <SelectItem value="arcade">🎮 Arcade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2">
                  <Label for="disasters">Disasters</Label>
                  <Toggle
                    id="disasters"
                    v-model="formData.settings.disasters"
                    class="openttd-button"
                  />
                </div>

                <div class="space-y-2">
                  <Label for="breakdowns">Breakdowns</Label>
                  <Toggle
                    id="breakdowns"
                    v-model="formData.settings.breakdowns"
                    class="openttd-button"
                  />
                </div>

                <div class="space-y-2">
                  <Label for="inflation">Inflation</Label>
                  <Toggle
                    id="inflation"
                    v-model="formData.settings.inflation"
                    class="openttd-button"
                  />
                </div>
              </div>
            </div>

            <!-- Comment -->
            <div class="space-y-2">
              <Label for="developer-comment">Developer Comment</Label>
              <Textarea
                id="developer-comment"
                v-model="formData.comment"
                placeholder="Internal notes about this campaign..."
                rows="3"
              />
            </div>
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
            
            <div v-if="validationErrors.length > 0" class="flex items-center space-x-2">
              <span class="text-destructive">⚠️</span>
              <span class="text-sm text-destructive">{{ validationErrors.length }} validation error(s)</span>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <Button
              variant="outline"
              @click="resetForm"
              :disabled="!hasChanges"
              class="openttd-button"
            >
              🔄 Reset
            </Button>
            
            <Button
              type="submit"
              :disabled="!isValid || saving"
              @click="saveCampaign"
              class="openttd-button bg-openttd-green text-white"
            >
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
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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
      title: isNew.value ? '✨ Campaign Created' : '💾 Campaign Saved',
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
      title: '❌ Error',
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
      title: '📄 Campaign Duplicated',
      description: `Campaign "${duplicate.meta?.title || duplicate.id}" has been created.`,
      color: 'green'
    })
  } catch (err) {
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