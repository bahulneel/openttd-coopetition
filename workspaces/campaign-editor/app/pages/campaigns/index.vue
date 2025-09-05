<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          Campaigns
        </h1>
        <p class="text-muted-foreground">
          Manage and edit your OpenTTD Coopetition campaigns
        </p>
      </div>
      
      <div class="flex items-center space-x-2">
        <UButton
          icon="i-heroicons-plus"
          @click="createCampaign"
        >
          New Campaign
        </UButton>
        
        <UButton
          variant="outline"
          icon="i-heroicons-arrow-path"
          :loading="loading"
          @click="refreshCampaigns"
        >
          Refresh
        </UButton>
      </div>
    </div>

    <!-- Search and Filters -->
    <UCard>
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search campaigns..."
            class="w-full"
          />
        </div>
        
        <div class="flex items-center space-x-2">
          <USelect
            v-model="difficultyFilter"
            :options="difficultyOptions"
            placeholder="All Difficulties"
            class="w-48"
          />
          
          <USelect
            v-model="sortBy"
            :options="sortOptions"
            class="w-48"
          />
        </div>
      </div>
    </UCard>

    <!-- Loading State -->
    <div v-if="loading && campaigns.length === 0" class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-muted-foreground">Loading campaigns...</p>
      </div>
    </div>

    <!-- Error State -->
    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="solid"
      :title="error"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: false }"
      @close="error = null"
    />

    <!-- Empty State -->
    <UCard v-if="!loading && filteredCampaigns.length === 0 && !error">
      <div class="text-center py-12">
        <Icon name="heroicons:folder" class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-foreground mb-2">
          {{ searchQuery ? 'No campaigns found' : 'No campaigns yet' }}
        </h3>
        <p class="text-muted-foreground mb-6">
          {{ searchQuery ? 'Try adjusting your search or filters' : 'Create your first campaign to get started' }}
        </p>
        <UButton
          v-if="!searchQuery"
          icon="i-heroicons-plus"
          @click="createCampaign"
        >
          Create Campaign
        </UButton>
      </div>
    </UCard>

    <!-- Campaigns Grid -->
    <div v-if="!loading && filteredCampaigns.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="campaign in filteredCampaigns"
        :key="campaign.id"
        class="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        @click="editCampaign(campaign.id)"
      >
        <div class="space-y-4">
          <!-- Header -->
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-foreground truncate">
                {{ campaign.meta?.title || campaign.id }}
              </h3>
              <p class="text-sm text-muted-foreground">
                ID: {{ campaign.id }}
              </p>
            </div>
            
            <UDropdown :items="getCampaignMenuItems(campaign)" :popper="{ placement: 'bottom-start' }">
              <UButton
                variant="ghost"
                size="sm"
                icon="i-heroicons-ellipsis-vertical"
                @click.stop
              />
            </UDropdown>
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
              <UBadge
                :color="getDifficultyColor(campaign.meta?.difficulty)"
                size="xs"
                class="ml-1"
              >
                {{ campaign.meta?.difficulty || 'Unknown' }}
              </UBadge>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="campaign.meta?.tags && campaign.meta.tags.length > 0" class="flex flex-wrap gap-1">
            <UBadge
              v-for="tag in campaign.meta.tags.slice(0, 3)"
              :key="tag"
              variant="soft"
              size="xs"
            >
              {{ tag }}
            </UBadge>
            <UBadge
              v-if="campaign.meta.tags.length > 3"
              variant="soft"
              size="xs"
              class="text-muted-foreground"
            >
              +{{ campaign.meta.tags.length - 3 }}
            </UBadge>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-2 border-t border-border">
            <div class="text-xs text-muted-foreground">
              {{ campaign.modified ? 'Modified' : 'Saved' }}
              {{ formatDate(campaign.lastModified) }}
            </div>
            
            <div class="flex items-center space-x-1">
              <UIcon
                v-if="campaign.modified"
                name="i-heroicons-pencil"
                class="h-3 w-3 text-orange-500"
              />
              <UIcon
                name="i-heroicons-chevron-right"
                class="h-4 w-4 text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center">
      <UPagination
        v-model="currentPage"
        :page-count="pageSize"
        :total="filteredCampaigns.length"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  campaigns,
  loading,
  error,
  loadCampaigns,
  deleteCampaign,
  duplicateCampaign,
  searchCampaigns,
  spaMode
} = useCampaignStore()

// Reactive data
const searchQuery = ref('')
const difficultyFilter = ref('')
const sortBy = ref('lastModified')
const currentPage = ref(1)
const pageSize = 12

// Load campaigns on mount
onMounted(async () => {
  if (campaigns.value.length === 0) {
    await loadCampaigns()
  }
})

// Options
const difficultyOptions = [
  { value: '', label: 'All Difficulties' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
  { value: 'legendary', label: 'Legendary' }
]

const sortOptions = [
  { value: 'lastModified', label: 'Last Modified' },
  { value: 'title', label: 'Title' },
  { value: 'id', label: 'ID' },
  { value: 'difficulty', label: 'Difficulty' }
]

// Computed
const filteredCampaigns = computed(() => {
  let filtered = campaigns.value

  // Search filter
  if (searchQuery.value) {
    filtered = searchCampaigns(searchQuery.value)
  }

  // Difficulty filter
  if (difficultyFilter.value) {
    filtered = filtered.filter(c => c.meta?.difficulty === difficultyFilter.value)
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return (a.meta?.title || a.id).localeCompare(b.meta?.title || b.id)
      case 'id':
        return a.id.localeCompare(b.id)
      case 'difficulty':
        const difficulties = ['easy', 'medium', 'hard', 'expert', 'legendary']
        const aDiff = difficulties.indexOf(a.meta?.difficulty || 'medium')
        const bDiff = difficulties.indexOf(b.meta?.difficulty || 'medium')
        return aDiff - bDiff
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
  let totalCount = campaigns.value.length
  
  if (searchQuery.value) {
    totalCount = searchCampaigns(searchQuery.value).length
  }
  
  if (difficultyFilter.value) {
    totalCount = campaigns.value.filter(c => c.meta?.difficulty === difficultyFilter.value).length
  }
  
  return Math.ceil(totalCount / pageSize)
})

// Methods
function getDifficultyColor(difficulty: string | undefined) {
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

function getCampaignMenuItems(campaign: any) {
  return [
    [{
      label: 'Edit',
      icon: 'i-heroicons-pencil',
      click: () => editCampaign(campaign.id)
    }],
    [{
      label: 'Duplicate',
      icon: 'i-heroicons-document-duplicate',
      click: () => handleDuplicate(campaign.id)
    }],
    [{
      label: 'Delete',
      icon: 'i-heroicons-trash',
      click: () => handleDelete(campaign.id)
    }]
  ]
}

// Navigation and actions
function createCampaign() {
  navigateTo('/campaigns/new')
}

function editCampaign(id: string) {
  navigateTo(`/campaigns/${id}`)
}

async function refreshCampaigns() {
  await loadCampaigns()
}

async function handleDuplicate(id: string) {
  try {
    const duplicate = await duplicateCampaign(id)
    // Show success message
    const toast = useToast()
    toast.add({
      title: 'Campaign Duplicated',
      description: `Campaign "${duplicate.meta?.title || duplicate.id}" has been created.`,
      color: 'green'
    })
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to duplicate campaign',
      color: 'red'
    })
  }
}

async function handleDelete(id: string) {
  const campaign = campaigns.value.find(c => c.id === id)
  if (!campaign) return

  // Show confirmation dialog
  const confirmed = confirm(
    `Are you sure you want to delete "${campaign.meta?.title || campaign.id}"? This action cannot be undone.`
  )
  
  if (!confirmed) return

  try {
    await deleteCampaign(id)
    const toast = useToast()
    toast.add({
      title: 'Campaign Deleted',
      description: `Campaign "${campaign.meta?.title || campaign.id}" has been deleted.`,
      color: 'green'
    })
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
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