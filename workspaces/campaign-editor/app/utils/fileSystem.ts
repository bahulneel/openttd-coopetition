import type { Campaign, Goal, Scenario, CampaignManifest, FileSystemAdapter } from '~/types/campaign'
import { parse as parseYAML, stringify as stringifyYAML } from 'yaml'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

// Local file system adapter (for development/server mode)
export class LocalFileSystemAdapter implements FileSystemAdapter {
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

  async loadManifest(): Promise<CampaignManifest | null> {
    try {
      const response = await $fetch<{ manifest: CampaignManifest }>('/api/manifest')
      return response.manifest || null
    } catch (error) {
      console.warn('Failed to load manifest from API:', error)
      return null
    }
  }

  async saveCampaign(campaign: Campaign): Promise<void> {
    await $fetch('/api/campaigns', {
      method: 'POST',
      body: { campaign }
    })
  }

  async saveGoal(goal: Goal): Promise<void> {
    await $fetch('/api/goals', {
      method: 'POST',
      body: { goal }
    })
  }

  async saveScenario(scenario: Scenario): Promise<void> {
    await $fetch('/api/scenarios', {
      method: 'POST',
      body: { scenario }
    })
  }

  async saveManifest(manifest: CampaignManifest): Promise<void> {
    await $fetch('/api/manifest', {
      method: 'POST',
      body: { manifest }
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
    const response = await $fetch<Blob>('/api/export', {
      method: 'GET',
      responseType: 'blob'
    })
    return response
  }
}

// SPA/In-memory adapter (for browser-only mode)
export class SPAFileSystemAdapter implements FileSystemAdapter {
  private campaigns: Campaign[] = []
  private goals: Goal[] = []
  private scenarios: Scenario[] = []
  private manifest: CampaignManifest | null = null

  constructor() {
    // Load from localStorage if available
    this.loadFromLocalStorage()
  }

  async loadCampaigns(): Promise<Campaign[]> {
    return [...this.campaigns]
  }

  async loadGoals(): Promise<Goal[]> {
    return [...this.goals]
  }

  async loadScenarios(): Promise<Scenario[]> {
    return [...this.scenarios]
  }

  async loadManifest(): Promise<CampaignManifest | null> {
    return this.manifest ? { ...this.manifest } : null
  }

  async saveCampaign(campaign: Campaign): Promise<void> {
    const existingIndex = this.campaigns.findIndex(c => c.id === campaign.id)
    const updatedCampaign = {
      ...campaign,
      lastModified: Date.now(),
      modified: true
    }

    if (existingIndex !== -1) {
      this.campaigns[existingIndex] = updatedCampaign
    } else {
      this.campaigns.push(updatedCampaign)
    }

    this.saveToLocalStorage()
  }

  async saveGoal(goal: Goal): Promise<void> {
    const existingIndex = this.goals.findIndex(g => g.id === goal.id)
    if (existingIndex !== -1) {
      this.goals[existingIndex] = goal
    } else {
      this.goals.push(goal)
    }

    this.saveToLocalStorage()
  }

  async saveScenario(scenario: Scenario): Promise<void> {
    const existingIndex = this.scenarios.findIndex(s => s.id === scenario.id)
    if (existingIndex !== -1) {
      this.scenarios[existingIndex] = scenario
    } else {
      this.scenarios.push(scenario)
    }

    this.saveToLocalStorage()
  }

  async saveManifest(manifest: CampaignManifest): Promise<void> {
    this.manifest = manifest
    this.saveToLocalStorage()
  }

  async deleteCampaign(id: string): Promise<void> {
    this.campaigns = this.campaigns.filter(c => c.id !== id)
    this.saveToLocalStorage()
  }

  async deleteGoal(id: string): Promise<void> {
    this.goals = this.goals.filter(g => g.id !== id)
    this.saveToLocalStorage()
  }

  async deleteScenario(id: string): Promise<void> {
    this.scenarios = this.scenarios.filter(s => s.id !== id)
    this.saveToLocalStorage()
  }

  async exportAll(): Promise<Blob> {
    const zip = new JSZip()

    // Add campaigns
    this.campaigns.forEach(campaign => {
      const yamlContent = this.toYAML(campaign)
      zip.file(`${campaign.id}.yaml`, yamlContent)
    })

    // Add goals folder
    const goalsFolder = zip.folder('goals')
    this.goals.forEach(goal => {
      const yamlContent = this.toYAML(goal)
      goalsFolder?.file(`${goal.id}.yaml`, yamlContent)
    })

    // Add scenarios folder
    const scenariosFolder = zip.folder('scenarios')
    this.scenarios.forEach(scenario => {
      const yamlContent = this.toYAML(scenario)
      scenariosFolder?.file(`${scenario.id}.yaml`, yamlContent)
    })

    // Add manifest
    if (this.manifest) {
      const manifestContent = this.toYAML(this.manifest)
      zip.file('manifest.yaml', manifestContent)
    }

    return await zip.generateAsync({ type: 'blob' })
  }

  // Import from ZIP file
  async importFromZip(file: File): Promise<void> {
    const zip = new JSZip()
    const contents = await zip.loadAsync(file)

    // Clear existing data
    this.campaigns = []
    this.goals = []
    this.scenarios = []
    this.manifest = null

    // Import files
    for (const [fileName, zipEntry] of Object.entries(contents.files)) {
      if (zipEntry.dir) continue

      const content = await zipEntry.async('string')
      
      try {
        if (fileName === 'manifest.yaml') {
          this.manifest = parseYAML(content) as CampaignManifest
        } else if (fileName.startsWith('goals/') && fileName.endsWith('.yaml')) {
          const goal = parseYAML(content) as Goal
          this.goals.push(goal)
        } else if (fileName.startsWith('scenarios/') && fileName.endsWith('.yaml')) {
          const scenario = parseYAML(content) as Scenario
          this.scenarios.push(scenario)
        } else if (fileName.endsWith('.yaml') && !fileName.includes('/')) {
          // Root level YAML files are campaigns
          const campaign = parseYAML(content) as Campaign
          this.campaigns.push(campaign)
        }
      } catch (error) {
        console.warn(`Failed to parse ${fileName}:`, error)
      }
    }

    this.saveToLocalStorage()
  }

  // Download export as ZIP
  async downloadExport(filename = 'campaigns.zip'): Promise<void> {
    const blob = await this.exportAll()
    saveAs(blob, filename)
  }

  private toYAML(obj: any): string {
    // Remove editor-specific properties before export
    const cleanObj = { ...obj }
    delete cleanObj.lastModified
    delete cleanObj.modified
    delete cleanObj.filePath
    
    return stringifyYAML(cleanObj, {
      indent: 2,
      lineWidth: 100,
      minContentWidth: 40
    })
  }

  private loadFromLocalStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const campaignsData = localStorage.getItem('coopetition-campaigns')
      if (campaignsData) {
        this.campaigns = JSON.parse(campaignsData)
      }

      const goalsData = localStorage.getItem('coopetition-goals')
      if (goalsData) {
        this.goals = JSON.parse(goalsData)
      }

      const scenariosData = localStorage.getItem('coopetition-scenarios')
      if (scenariosData) {
        this.scenarios = JSON.parse(scenariosData)
      }

      const manifestData = localStorage.getItem('coopetition-manifest')
      if (manifestData) {
        this.manifest = JSON.parse(manifestData)
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error)
    }
  }

  private saveToLocalStorage(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem('coopetition-campaigns', JSON.stringify(this.campaigns))
      localStorage.setItem('coopetition-goals', JSON.stringify(this.goals))
      localStorage.setItem('coopetition-scenarios', JSON.stringify(this.scenarios))
      
      if (this.manifest) {
        localStorage.setItem('coopetition-manifest', JSON.stringify(this.manifest))
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }
}

// Factory function to create the appropriate adapter
export function createFileSystemAdapter(spaMode: boolean): FileSystemAdapter {
  return spaMode ? new SPAFileSystemAdapter() : new LocalFileSystemAdapter()
}