import type { Campaign, Goal, Scenario, CampaignManifest, FileSystemAdapter } from '~/types/campaign'
import { FileSystemFeature } from '~/types/campaign'

// Backend file system adapter (for development/server mode)
export class BackendFileSystemAdapter implements FileSystemAdapter {
  private basePath: string

  constructor(basePath = '/campaigns') {
    this.basePath = basePath
  }

  async loadCampaigns(): Promise<Campaign[]> {
    try {
      // In development mode, we can read from the file system
      const response = await $fetch<{ campaigns: Campaign[] }>('/api/campaigns')
      return response.campaigns || []
    } catch (error) {
      console.warn('Failed to load campaigns from API, using empty array:', error)
      return []
    }
  }

  async loadGoals(): Promise<Goal[]> {
    try {
      const response = await $fetch<{ goals: Goal[] }>('/api/goals')
      return response.goals || []
    } catch (error) {
      console.warn('Failed to load goals from API, using empty array:', error)
      return []
    }
  }

  async loadScenarios(): Promise<Scenario[]> {
    try {
      const response = await $fetch<{ scenarios: Scenario[] }>('/api/scenarios')
      return response.scenarios || []
    } catch (error) {
      console.warn('Failed to load scenarios from API, using empty array:', error)
      return []
    }
  }

  async loadManifest(): Promise<CampaignManifest | undefined> {
    try {
      const response = await $fetch<{ manifest: CampaignManifest }>('/api/manifest')
      return response.manifest || undefined
    } catch (error) {
      console.warn('Failed to load manifest from API:', error)
      return undefined
    }
  }

  async saveCampaign(campaign: Campaign): Promise<void> {
    await $fetch('/api/campaigns', {
      method: 'POST',
      body: campaign
    })
  }

  async saveGoal(goal: Goal): Promise<void> {
    await $fetch('/api/goals', {
      method: 'POST',
      body: goal
    })
  }

  async saveScenario(scenario: Scenario): Promise<void> {
    await $fetch('/api/scenarios', {
      method: 'POST',
      body: scenario
    })
  }

  async saveManifest(manifest: CampaignManifest): Promise<void> {
    await $fetch('/api/manifest', {
      method: 'POST',
      body: manifest
    })
  }

  async deleteCampaign(id: string): Promise<void> {
    await $fetch(`/api/campaigns/${id}`, {
      method: 'DELETE'
    })
  }

  async deleteGoal(id: string): Promise<void> {
    await $fetch(`/api/goals/${id}`, {
      method: 'DELETE'
    })
  }

  async deleteScenario(id: string): Promise<void> {
    await $fetch(`/api/scenarios/${id}`, {
      method: 'DELETE'
    })
  }

  async exportAll(): Promise<Blob> {
    const response = await $fetch('/api/export', {
      method: 'GET'
    })

    // Handle Buffer response from server
    if (response && typeof response === 'object' && 'data' in response) {
      const buffer = Buffer.from(response.data)
      return new Blob([buffer], { type: 'application/zip' })
    }
    
    // Fallback for other response types
    return new Blob([response], { type: 'application/zip' })
  }

  supports(feature: FileSystemFeature): boolean {
    switch (feature) {
      case FileSystemFeature.ZIP_IMPORT:
        return false // Backend doesn't support ZIP import
      case FileSystemFeature.ZIP_EXPORT:
        return false // Backend doesn't support ZIP export
      default:
        return false
    }
  }
}
