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
        <Button
          @click="createCampaign"
          class="openttd-button bg-openttd-green text-white"
        >
          ➕ New Campaign
        </Button>
        
        <Button
          variant="outline"
          :disabled="loading"
          @click="refreshCampaigns"
          class="openttd-button"
        >
          {{ loading ? '🔄' : '↻' }} Refresh
        </Button>
      </div>
    </div>

    <!-- Search and Filters -->
    <Card class="openttd-titlebar">
      <CardContent class="pt-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <Input
              v-model="searchQuery"
              placeholder="🔍 Search campaigns..."
              class="w-full"
            />
          </div>
          
          <div class="flex items-center space-x-2">
            <Select v-model="difficultyFilter">
              <SelectTrigger class="w-48 openttd-button">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Difficulties</SelectItem>
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

    <!-- Loading State -->
    <div v-if="loading && campaigns.length === 0" class="flex justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-muted-foreground">Loading campaigns...</p>
      </div>
    </div>

    <!-- Error State -->
    <Alert v-if="error" class="border-destructive bg-destructive/10">
      <AlertTitle class="text-destructive">⚠️ Error</AlertTitle>
      <AlertDescription class="text-destructive">
        {{ error }}
        <Button 
          variant="ghost" 
          size="sm" 
          @click="error = null"
          class="ml-2 text-destructive hover:text-destructive-foreground"
        >
          ✕ Dismiss
        </Button>
      </AlertDescription>
    </Alert>

    <!-- Empty State -->
    <Card v-if="!loading && filteredCampaigns.length === 0 && !error" class="openttd-titlebar">
      <CardContent class="pt-12 pb-12">
        <div class="text-center">
          <div class="text-6xl mb-4">📁</div>
          <CardTitle class="text-lg font-semibold text-foreground mb-2">
            {{ searchQuery ? 'No campaigns found' : 'No campaigns yet' }}
          </CardTitle>
          <p class="text-muted-foreground mb-6">
            {{ searchQuery ? 'Try adjusting your search or filters' : 'Create your first campaign to get started' }}
          </p>
          <Button
            v-if="!searchQuery"
            @click="createCampaign"
            class="openttd-button bg-openttd-green text-white"
          >
            ➕ Create Campaign
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Campaigns Grid -->
    <div v-if="!loading && filteredCampaigns.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="campaign in filteredCampaigns"
        :key="campaign.id"
        class="campaign-card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        @click="editCampaign(campaign.id)"
      >
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
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                >
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
                <DropdownMenuItem 
                  @click="handleDelete(campaign.id)"
                  class="text-destructive focus:text-destructive"
                >
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
              <Badge
                :class="getDifficultyClasses(campaign.meta?.difficulty)"
                class="ml-1 text-xs"
              >
                {{ campaign.meta?.difficulty || 'Unknown' }}
              </Badge>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="campaign.meta?.tags && campaign.meta.tags.length > 0" class="flex flex-wrap gap-1">
            <Badge
              v-for="tag in campaign.meta.tags.slice(0, 3)"
              :key="tag"
              variant="secondary"
              class="text-xs"
            >
              {{ tag }}
            </Badge>
            <Badge
              v-if="campaign.meta.tags.length > 3"
              variant="secondary"
              class="text-xs text-muted-foreground"
            >
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
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="openttd-button"
        >
          ← Previous
        </Button>
        
        <div class="flex items-center space-x-1">
          <span class="text-sm text-muted-foreground">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="openttd-button"
        >
          Next →
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

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
      title: '📄 Campaign Duplicated',
      description: `Campaign "${duplicate.meta?.title || duplicate.id}" has been created.`,
      color: 'green'
    })
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: '❌ Error',
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
      title: '🗑️ Campaign Deleted',
      description: `Campaign "${campaign.meta?.title || campaign.id}" has been deleted.`,
      color: 'green'
    })
  } catch (error) {
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