<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-foreground">
          Campaign Editor Dashboard
        </h1>
        <p class="text-muted-foreground mt-2">
          Create, edit, and manage OpenTTD Coopetition campaigns
        </p>
      </div>
      
      <div class="flex items-center space-x-2">
        <UButton
          icon="i-heroicons-plus"
          size="sm"
          @click="createNewCampaign"
        >
          New Campaign
        </UButton>
        
        <UButton
          variant="outline"
          icon="i-heroicons-arrow-path"
          size="sm"
          :loading="refreshing"
          @click="refreshData"
        >
          Refresh
        </UButton>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard class="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-600 dark:text-blue-400">Campaigns</p>
            <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ campaignStats.total }}</p>
          </div>
          <div class="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:folder" class="h-6 w-6 text-white" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950 dark:to-green-900 dark:border-green-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-600 dark:text-green-400">Goals</p>
            <p class="text-2xl font-bold text-green-900 dark:text-green-100">{{ goalStats.total }}</p>
          </div>
          <div class="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:target" class="h-6 w-6 text-white" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-950 dark:to-purple-900 dark:border-purple-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-600 dark:text-purple-400">Scenarios</p>
            <p class="text-2xl font-bold text-purple-900 dark:text-purple-100">{{ scenarioStats.total }}</p>
          </div>
          <div class="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:map" class="h-6 w-6 text-white" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-950 dark:to-orange-900 dark:border-orange-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-orange-600 dark:text-orange-400">Modified</p>
            <p class="text-2xl font-bold text-orange-900 dark:text-orange-100">{{ modifiedStats.count }}</p>
          </div>
          <div class="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:clock" class="h-6 w-6 text-white" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Recent Activity / Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Campaigns -->
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Recent Campaigns</h3>
              <NuxtLink to="/campaigns">
                <UButton variant="ghost" size="sm">
                  View All
                </UButton>
              </NuxtLink>
            </div>
          </template>

          <div class="space-y-3">
            <div
              v-for="campaign in recentCampaigns"
              :key="campaign.id"
              class="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
              @click="editCampaign(campaign.id)"
            >
              <div class="flex items-center space-x-3">
                <div class="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="heroicons:folder" class="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p class="font-medium">{{ campaign.meta?.title || campaign.id }}</p>
                  <p class="text-sm text-muted-foreground">
                    {{ campaign.scenarios?.length || 0 }} scenarios • 
                    {{ campaign.meta?.difficulty || 'Unknown' }} difficulty
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <UBadge :color="getDifficultyColor(campaign.meta?.difficulty)">
                  {{ campaign.meta?.difficulty || 'Unknown' }}
                </UBadge>
                <Icon name="heroicons:chevron-right" class="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div v-if="recentCampaigns.length === 0" class="text-center py-8 text-muted-foreground">
              No campaigns found. Create your first campaign to get started!
            </div>
          </div>
        </UCard>
      </div>

      <!-- Quick Actions -->
      <div>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Quick Actions</h3>
          </template>

          <div class="space-y-3">
            <UButton
              block
              variant="outline"
              icon="i-heroicons-plus"
              @click="createNewCampaign"
            >
              New Campaign
            </UButton>

            <UButton
              block
              variant="outline"
              icon="i-heroicons-target"
              @click="createNewGoal"
            >
              New Goal
            </UButton>

            <UButton
              block
              variant="outline"
              icon="i-heroicons-map"
              @click="createNewScenario"
            >
              New Scenario
            </UButton>

            <UDivider />

            <UButton
              block
              variant="outline"
              icon="i-heroicons-arrow-up-tray"
              @click="importData"
            >
              Import Data
            </UButton>

            <UButton
              block
              variant="outline"
              icon="i-heroicons-arrow-down-tray"
              @click="exportAll"
            >
              Export All
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $campaignStore } = useNuxtApp()

// Reactive data
const refreshing = ref(false)
const campaigns = ref([])
const goals = ref([])
const scenarios = ref([])

// Load initial data
onMounted(async () => {
  await loadData()
})

// Computed stats
const campaignStats = computed(() => ({
  total: campaigns.value.length
}))

const goalStats = computed(() => ({
  total: goals.value.length
}))

const scenarioStats = computed(() => ({
  total: scenarios.value.length
}))

const modifiedStats = computed(() => ({
  count: campaigns.value.filter(c => c.modified).length
}))

const recentCampaigns = computed(() => 
  campaigns.value
    .sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0))
    .slice(0, 5)
)

// Methods
async function loadData() {
  try {
    // Load campaigns, goals, and scenarios
    // This will be implemented with the store
    campaigns.value = []
    goals.value = []
    scenarios.value = []
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

async function refreshData() {
  refreshing.value = true
  try {
    await loadData()
  } finally {
    refreshing.value = false
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'green'
    case 'medium': return 'yellow'
    case 'hard': return 'orange'
    case 'expert': return 'red'
    case 'legendary': return 'purple'
    default: return 'gray'
  }
}

// Navigation methods
function createNewCampaign() {
  navigateTo('/campaigns/new')
}

function createNewGoal() {
  navigateTo('/goals/new')
}

function createNewScenario() {
  navigateTo('/scenarios/new')
}

function editCampaign(id: string) {
  navigateTo(`/campaigns/${id}`)
}

function importData() {
  // TODO: Implement import functionality
}

function exportAll() {
  // TODO: Implement export functionality
}
</script>