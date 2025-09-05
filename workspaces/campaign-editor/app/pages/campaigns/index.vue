<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          {{ showNewForm ? 'New Campaign' : 'Campaigns' }}
        </h1>
        <p class="text-muted-foreground">
          {{ showNewForm ? 'Create a new campaign' : 'Manage and edit your OpenTTD Coopetition campaigns' }}
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <Button v-if="!showNewForm" class="openttd-button bg-openttd-green text-white" @click="createCampaign">
          ➕ New Campaign
        </Button>

        <Button v-if="!showNewForm" variant="outline" :disabled="campaignStore.loading" class="openttd-button"
          @click="refreshCampaigns">
          {{ campaignStore.loading ? '🔄' : '↻' }} Refresh
        </Button>

        <template v-if="showNewForm">
          <Button :disabled="!meta.valid || saving" class="openttd-button bg-openttd-green text-white"
            @click="saveCampaign">
            {{ saving ? '💾 Saving...' : '✨ Create Campaign' }}
          </Button>

          <Button variant="outline" class="openttd-button" @click="closeNewForm">
            ← Back to List
          </Button>
        </template>
      </div>
    </div>

    <!-- Search and Filters -->
    <Card v-if="!showNewForm" class="openttd-titlebar">
      <CardContent class="pt-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <Input v-model="searchQuery" placeholder="🔍 Search campaigns..." class="w-full" />
          </div>

          <div class="flex items-center space-x-2">
            <Select v-model="difficultyFilter">
              <SelectTrigger class="w-48 openttd-button">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">🟢 Easy</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="hard">🟠 Hard</SelectItem>
                <SelectItem value="expert">🔴 Expert</SelectItem>
                <SelectItem value="legendary">🟣 Legendary</SelectItem>
              </SelectContent>
            </Select>

            <Select v-model="sortBy">
              <SelectTrigger class="w-48 openttd-button">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastModified">🕒 Last Modified</SelectItem>
                <SelectItem value="title">📝 Title</SelectItem>
                <SelectItem value="id">🏷️ ID</SelectItem>
                <SelectItem value="difficulty">⚡ Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Campaign List -->
    <div v-if="!showNewForm">
      <!-- Loading State -->
      <div v-if="campaignStore.loading && campaignStore.campaigns.length === 0" class="flex justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p class="text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>

      <!-- Error State -->
      <Alert v-if="campaignStore.error" class="border-destructive bg-destructive/10">
        <AlertTitle class="text-destructive">⚠️ Error</AlertTitle>
        <AlertDescription class="text-destructive">
          {{ campaignStore.error }}
          <Button variant="ghost" size="sm" class="ml-2 text-destructive hover:text-destructive-foreground"
            @click="() => { }">
            ✕ Dismiss
          </Button>
        </AlertDescription>
      </Alert>

      <!-- Empty State -->
      <Card v-if="!campaignStore.loading && filteredCampaigns.length === 0 && !campaignStore.error"
        class="openttd-titlebar">
        <CardContent class="pt-12 pb-12">
          <div class="text-center">
            <div class="text-6xl mb-4">📁</div>
            <CardTitle class="text-lg font-semibold text-foreground mb-2">
              {{ searchQuery ? 'No campaigns found' : 'No campaigns yet' }}
            </CardTitle>
            <p class="text-muted-foreground mb-6">
              {{ searchQuery ? 'Try adjusting your search or filters' : 'Create your first campaign to get started' }}
            </p>
            <Button v-if="!searchQuery" class="openttd-button bg-openttd-green text-white" @click="createCampaign">
              ➕ Create Campaign
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Campaigns Grid -->
      <div v-if="!campaignStore.loading && filteredCampaigns.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card v-for="campaign in filteredCampaigns" :key="campaign.id"
          class="campaign-card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          @click="editCampaign(campaign.id)">
          <CardContent class="space-y-4 p-6">
            <!-- Header -->
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <CardTitle class="font-semibold text-foreground truncate text-base">
                  {{ campaign.meta?.title || campaign.id }}
                </CardTitle>
                <p class="text-sm text-muted-foreground">
                  ID: {{ campaign.id }}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger as-child @click.stop>
                  <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                    ⋮
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="editCampaign(campaign.id)">
                    ✏️ Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="handleDuplicate(campaign.id)">
                    📄 Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(campaign.id)">
                    🗑️ Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <!-- Description -->
            <p v-if="campaign.meta?.description" class="text-sm text-muted-foreground line-clamp-2">
              {{ campaign.meta.description }}
            </p>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-muted-foreground">Scenarios:</span>
                <span class="font-medium ml-1">{{ campaign.scenarios?.length || 0 }}</span>
              </div>
              <div>
                <span class="text-muted-foreground">Difficulty:</span>
                <Badge :class="getDifficultyClasses(campaign.meta?.difficulty)" class="ml-1 text-xs">
                  {{ campaign.meta?.difficulty || 'Unknown' }}
                </Badge>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="campaign.meta?.tags && campaign.meta.tags.length > 0" class="flex flex-wrap gap-1">
              <Badge v-for="tag in campaign.meta.tags.slice(0, 3)" :key="tag" variant="secondary" class="text-xs">
                {{ tag }}
              </Badge>
              <Badge v-if="campaign.meta.tags.length > 3" variant="secondary" class="text-xs text-muted-foreground">
                +{{ campaign.meta.tags.length - 3 }}
              </Badge>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between pt-2 border-t border-border">
              <div class="text-xs text-muted-foreground">
                {{ campaign.modified ? 'Modified' : 'Saved' }}
                {{ formatDate(campaign.lastModified) }}
              </div>

              <div class="flex items-center space-x-1">
                <span v-if="campaign.modified" class="text-orange-500">✏️</span>
                <span class="text-muted-foreground">→</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center">
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" :disabled="currentPage === 1" class="openttd-button"
            @click="currentPage--">
            ← Previous
          </Button>

          <div class="flex items-center space-x-1">
            <span class="text-sm text-muted-foreground">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
          </div>

          <Button variant="outline" size="sm" :disabled="currentPage === totalPages" class="openttd-button"
            @click="currentPage++">
            Next →
          </Button>
        </div>
      </div>
    </div>

    <!-- New Campaign Form -->
    <div v-else-if="showNewForm" class="space-y-6">
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
                  <Button variant="ghost" size="sm"
                    class="ml-2 h-4 w-4 p-0 text-muted-foreground hover:text-destructive" @click="removeTag(index)">
                    ✕
                  </Button>
                </Badge>
              </div>

              <div class="flex space-x-2">
                <Input v-model="newTag" placeholder="Add tag..." class="flex-1" @keyup.enter="addTag" />
                <Button type="button" variant="outline" :disabled="!newTag.trim()" class="openttd-button"
                  @click="addTag">
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
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'

const campaignStore = useCampaignStore()
const route = useRoute()
const router = useRouter()

// Reactive data
const searchQuery = ref('')
const difficultyFilter = ref('')
const sortBy = ref('lastModified')
const currentPage = ref(1)
const pageSize = 12

// View state
const showNewForm = ref(false)
const saving = ref(false)
const newTag = ref('')

// Form setup
const form = useForm({
  validationSchema: campaignSchema,
  initialValues: {
    id: '',
    meta: {
      title: '',
      description: '',
      difficulty: 'medium' as const,
      tags: [],
    },
    scenarios: [],
  }
})

const { values: formData, meta } = form

// Hash-based routing
const handleHashChange = () => {
  const hash = route.hash
  if (hash === '#new') {
    showNewForm.value = true
    initializeNewCampaign()
  } else {
    showNewForm.value = false
  }
}

// Load campaigns on mount
onMounted(async () => {
  if (campaignStore.campaigns.length === 0) {
    await campaignStore.loadCampaigns()
  }
  handleHashChange()
})

// Watch for hash changes
watch(() => route.hash, handleHashChange)

// Options
const _difficultyOptions = [
  { value: '', label: 'All Difficulties' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
  { value: 'legendary', label: 'Legendary' }
]

const _sortOptions = [
  { value: 'lastModified', label: 'Last Modified' },
  { value: 'title', label: 'Title' },
  { value: 'id', label: 'ID' },
  { value: 'difficulty', label: 'Difficulty' }
]

// Computed
const filteredCampaigns = computed(() => {
  let filtered = campaignStore.campaigns

  // Search filter
  if (searchQuery.value) {
    filtered = campaignStore.searchCampaigns(searchQuery.value)
  }

  // Difficulty filter
  if (difficultyFilter.value) {
    filtered = filtered.filter((c) => c.meta?.difficulty === difficultyFilter.value)
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return (a.meta?.title || a.id).localeCompare(b.meta?.title || b.id)
      case 'id':
        return a.id.localeCompare(b.id)
      case 'difficulty': {
        const difficulties = ['easy', 'medium', 'hard', 'expert', 'legendary']
        const aDiff = difficulties.indexOf(a.meta?.difficulty || 'medium')
        const bDiff = difficulties.indexOf(b.meta?.difficulty || 'medium')
        return aDiff - bDiff
      }
      case 'lastModified':
      default:
        return (b.lastModified || 0) - (a.lastModified || 0)
    }
  })

  // Pagination
  const start = (currentPage.value - 1) * pageSize
  return filtered.slice(start, start + pageSize)
})

const totalPages = computed(() => {
  let totalCount = campaignStore.campaigns.length

  if (searchQuery.value) {
    totalCount = campaignStore.searchCampaigns(searchQuery.value).length
  }

  if (difficultyFilter.value) {
    totalCount = campaignStore.campaigns.filter((c) => c.meta?.difficulty === difficultyFilter.value).length
  }

  return Math.ceil(totalCount / pageSize)
})

// Methods
function _getDifficultyColor(difficulty: string | undefined) {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'green'
    case 'medium': return 'yellow'
    case 'hard': return 'orange'
    case 'expert': return 'red'
    case 'legendary': return 'purple'
    default: return 'gray'
  }
}

function formatDate(timestamp: number | undefined) {
  if (!timestamp) return 'Unknown'

  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`

  return date.toLocaleDateString()
}

// Helper function for difficulty classes
function getDifficultyClasses(difficulty: string | undefined) {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-openttd-green/20 border-openttd-green/40 text-openttd-green'
    case 'medium':
      return 'bg-openttd-cream/40 border-openttd-brown/40 text-openttd-brown'
    case 'hard':
      return 'bg-openttd-blue/20 border-openttd-blue/40 text-openttd-blue'
    case 'expert':
      return 'bg-destructive/20 border-destructive/40 text-destructive'
    case 'legendary':
      return 'bg-openttd-purple/20 border-openttd-purple/40 text-openttd-purple'
    default:
      return 'bg-openttd-grey/20 border-openttd-grey/40 text-openttd-grey'
  }
}

// Form methods
function initializeNewCampaign() {
  form.setValues({
    id: '',
    meta: {
      title: '',
      description: '',
      difficulty: 'medium' as const,
      tags: [],
    },
    scenarios: [],
  })
}

const saveCampaign = form.handleSubmit(async (values) => {
  saving.value = true

  try {
    await campaignStore.saveCampaign(values)

    const toast = useToast()
    toast.add({
      title: '✨ Campaign Created',
      description: `Campaign "${values.meta?.title || values.id}" has been created.`,
      color: 'green'
    })

    // Return to list view
    closeNewForm()
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

function closeNewForm() {
  router.push('/campaigns')
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
  newScenarios.forEach((scenario: { order: number }, idx: number) => {
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

// Navigation and actions
function createCampaign() {
  router.push('/campaigns#new')
}

function editCampaign(id: string) {
  router.push(`/campaigns/${id}`)
}

async function refreshCampaigns() {
  await campaignStore.loadCampaigns()
}

async function handleDuplicate(id: string) {
  try {
    const duplicate = await campaignStore.duplicateCampaign(id)
    // Show success message
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

async function handleDelete(id: string) {
  const campaign = campaignStore.campaigns.find((c) => c.id === id)
  if (!campaign) return

  // Show confirmation dialog
  const confirmed = confirm(
    `Are you sure you want to delete "${campaign.meta?.title || campaign.id}"? This action cannot be undone.`
  )

  if (!confirmed) return

  try {
    await campaignStore.deleteCampaign(id)
    const toast = useToast()
    toast.add({
      title: '🗑️ Campaign Deleted',
      description: `Campaign "${campaign.meta?.title || campaign.id}" has been deleted.`,
      color: 'green'
    })
  } catch (error) {
    console.error('Failed to delete campaign:', error)
    const toast = useToast()
    toast.add({
      title: '❌ Error',
      description: 'Failed to delete campaign',
      color: 'red'
    })
  }
}

// Reset page when filters change
watch([searchQuery, difficultyFilter, sortBy], () => {
  currentPage.value = 1
})
</script>