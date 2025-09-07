<template>
  <div v-if="!showNewForm">
    <TemplateScreenCollection
      title="Campaigns"
      subtitle="Manage and edit your OpenTTD Coopetition campaigns"
      :has-content="filteredCampaigns.length > 0"
      empty-title="No campaigns yet"
      empty-description="Create your first campaign to get started"
    >
      <template #actions>
        <Button class="openttd-button bg-openttd-green text-white" @click="newCampaign">
          ➕ New Campaign
        </Button>

        <Button variant="outline" class="openttd-button" @click="refreshCampaigns">
          ↻ Refresh
        </Button>
      </template>

      <template #empty-actions>
        <Button class="openttd-button bg-openttd-green text-white" @click="newCampaign">
          ➕ Create Campaign
        </Button>
      </template>

      <!-- Search and Filters -->
      <Card class="openttd-titlebar">
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

      <!-- Campaigns Grid -->
      <AggregateCampaigns 
        v-if="filteredCampaigns.length > 0"
        :campaigns="filteredCampaigns"
        @edit="editCampaignHandler"
        @duplicate="handleDuplicate"
        @delete="handleDelete"
      />

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
    </TemplateScreenCollection>
  </div>

  <TemplateScreenArticle v-else title="New Campaign" subtitle="Create a new campaign">
    <template #actions>
      <Button :disabled="!meta.valid || saving" class="openttd-button bg-openttd-green text-white"
        @click="saveCampaign">
        {{ saving ? '💾 Saving...' : '✨ Create Campaign' }}
      </Button>

      <Button variant="outline" class="openttd-button" @click="closeNewForm">
        ← Back to List
      </Button>
    </template>

    <Form @submit="saveCampaign">
      <EntityCampaignInputDetails :form-data="formData" @update:form-data="updateFormData">
        <template #actions>
          <div class="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" class="openttd-button" @click="closeNewForm">
              Cancel
            </Button>
            <Button type="submit" :disabled="!meta.valid || saving" class="openttd-button bg-openttd-green text-white">
              {{ saving ? '💾 Saving...' : '✨ Create Campaign' }}
            </Button>
          </div>
        </template>
      </EntityCampaignInputDetails>
    </Form>
  </TemplateScreenArticle>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import type { Campaign, CampaignScenario } from '~/types'

const entityStore = useEntityStore()
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
    name: '',
    meta: {
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
const campaigns = computed(() => entityStore.select('Campaign').value)

const filteredCampaigns = computed(() => {
  let filtered = campaigns.value

  // Search filter
  if (searchQuery.value) {
    const lowerQuery = searchQuery.value.toLowerCase()
    filtered = filtered.filter(campaign =>
      entityId(campaign).toLowerCase().includes(lowerQuery) ||
      campaign.name.toLowerCase().includes(lowerQuery) ||
      campaign.meta?.description?.toLowerCase().includes(lowerQuery) ||
      campaign.meta?.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
    )
  }

  // Difficulty filter
  if (difficultyFilter.value) {
    filtered = filtered.filter((c) => c.meta?.difficulty === difficultyFilter.value)
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'id':
        return entityId(a).localeCompare(entityId(b))
      case 'difficulty': {
        const difficulties = ['easy', 'medium', 'hard', 'expert', 'legendary']
        const aDiff = difficulties.indexOf(a.meta?.difficulty || 'medium')
        const bDiff = difficulties.indexOf(b.meta?.difficulty || 'medium')
        return aDiff - bDiff
      }
      case 'lastModified':
      default:
        return (b.__meta?.modified || 0) - (a.__meta?.modified || 0)
    }
  })

  // Pagination
  const start = (currentPage.value - 1) * pageSize
  return filtered.slice(start, start + pageSize)
})

const totalPages = computed(() => {
  let totalCount = campaigns.value.length

  if (searchQuery.value) {
    const lowerQuery = searchQuery.value.toLowerCase()
    totalCount = campaigns.value.filter(campaign =>
      entityId(campaign).toLowerCase().includes(lowerQuery) ||
      campaign.name?.toLowerCase().includes(lowerQuery) ||
      campaign.meta?.description?.toLowerCase().includes(lowerQuery) ||
      campaign.meta?.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
    ).length
  }

  if (difficultyFilter.value) {
    totalCount = campaigns.value.filter((c) => c.meta?.difficulty === difficultyFilter.value).length
  }

  return Math.ceil(totalCount / pageSize)
})

// Methods

// Form methods
function initializeNewCampaign() {
  form.setValues({
    id: '',
    name: '',
    meta: {
      author: '',
      description: '',
      difficulty: 'medium' as const,
      tags: [],
    },
    scenarios: [],
  })
}

function updateFormData(newData: any) {
  form.setValues(newData)
}

const saveCampaign = form.handleSubmit(async (values) => {
  saving.value = true

  try {
    // Create campaign entity manually
    const campaign: Campaign = asCampaign(values)
    entityStore.assert(campaign)

    const toast = useToast()
    toast.add({
      title: '✨ Campaign Created',
      description: `Campaign "${values.name}" has been created.`,
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


// Navigation and actions
function newCampaign() {
  router.push('/campaigns#new')
}

function editCampaign(id: string) {
  router.push(`/campaigns/${id}`)
}

function editCampaignHandler(campaign: Campaign) {
  editCampaign(entityId(campaign))
}

async function refreshCampaigns() {
  // No need to refresh as entity store is reactive
  // This could be used to trigger a reload from file system if needed
}

async function handleDuplicate(campaign: Campaign) {
  try {
    const id = entityId(campaign)
    const original = entityStore.get(id, 'Campaign')
    if (!original) {
      throw new Error('Campaign not found')
    }

    // Use copyEntity utility to create a duplicate
    const duplicate = copyEntity(toStorableValue(original))
    duplicate.name = `${original.name} (Copy)`

    entityStore.assert(duplicate)

    // Show success message
    const toast = useToast()
    toast.add({
      title: '📄 Campaign Duplicated',
      description: `Campaign "${duplicate.name}" has been created.`,
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

async function handleDelete(campaign: Campaign) {
  const id = entityId(campaign)
  
  // Show confirmation dialog
  const confirmed = confirm(
    `Are you sure you want to delete "${campaign.name}"? This action cannot be undone.`
  )

  if (!confirmed) return

  try {
    entityStore.retract(id)
    const toast = useToast()
    toast.add({
      title: '🗑️ Campaign Deleted',
      description: `Campaign "${campaign.name}" has been deleted.`,
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