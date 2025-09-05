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

    <!-- Stats Cards - OpenTTD Style -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Campaigns Card - OpenTTD Brown Theme -->
      <div class="campaign-card bg-openttd-brown/20 border-openttd-brown/40">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-openttd-brown">📁 Campaigns</p>
            <p class="text-2xl font-bold text-foreground">{{ campaignStats.total }}</p>
          </div>
          <div class="h-12 w-12 bg-openttd-brown rounded border-2 border-border flex items-center justify-center openttd-button">
            <span class="text-lg">📂</span>
          </div>
        </div>
      </div>

      <!-- Goals Card - OpenTTD Green Theme -->
      <div class="campaign-card bg-openttd-green/20 border-openttd-green/40">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-openttd-green">🎯 Goals</p>
            <p class="text-2xl font-bold text-foreground">{{ goalStats.total }}</p>
          </div>
          <div class="h-12 w-12 bg-openttd-green rounded border-2 border-border flex items-center justify-center openttd-button">
            <span class="text-lg text-white">🎯</span>
          </div>
        </div>
      </div>

      <!-- Scenarios Card - OpenTTD Purple Theme -->
      <div class="campaign-card bg-openttd-purple/20 border-openttd-purple/40">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-openttd-purple">🗺️ Scenarios</p>
            <p class="text-2xl font-bold text-foreground">{{ scenarioStats.total }}</p>
          </div>
          <div class="h-12 w-12 bg-openttd-purple rounded border-2 border-border flex items-center justify-center openttd-button">
            <span class="text-lg text-white">🗺️</span>
          </div>
        </div>
      </div>

      <!-- Modified Card - OpenTTD Blue Theme -->
      <div class="campaign-card bg-openttd-blue/20 border-openttd-blue/40">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-openttd-blue">⚡ Modified</p>
            <p class="text-2xl font-bold text-foreground">{{ modifiedStats.count }}</p>
          </div>
          <div class="h-12 w-12 bg-openttd-blue rounded border-2 border-border flex items-center justify-center openttd-button">
            <span class="text-lg text-white">⚡</span>
          </div>
        </div>
      </div>
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
                <div 
                  class="px-2 py-1 text-xs rounded border-2 font-medium"
                  :class="getDifficultyClasses(campaign.meta?.difficulty)"
                >
                  {{ campaign.meta?.difficulty || 'Unknown' }}
                </div>
                <span class="text-muted-foreground">→</span>
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