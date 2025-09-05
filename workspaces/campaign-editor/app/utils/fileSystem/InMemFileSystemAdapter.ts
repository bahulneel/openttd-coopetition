import { FileSystemFeature } from '~/types/campaign'
import { parse as parseYAML, stringify as stringifyYAML } from 'yaml'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { Campaign, Goal, Scenario, CampaignManifest, FileSystemAdapter, FeatureZipImport, FeatureZipExport } from '~/types/index'

// In-memory adapter (for browser-only mode)
export class InMemFileSystemAdapter implements FileSystemAdapter, FeatureZipImport, FeatureZipExport {
  private campaigns: Campaign[] = []
  private goals: Goal[] = []
  private scenarios: Scenario[] = []
  private manifest: CampaignManifest | undefined = undefined

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

  async loadManifest(): Promise<CampaignManifest | undefined> {
    return this.manifest
  }

  async saveCampaign(campaign: Campaign): Promise<void> {
    const existingIndex = this.campaigns.findIndex(c => c.id === campaign.id)
    if (existingIndex !== -1) {
      this.campaigns[existingIndex] = campaign
    } else {
      this.campaigns.push(campaign)
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
    const campaignsFolder = zip.folder('campaigns')
    for (const campaign of this.campaigns) {
      const yamlContent = stringifyYAML(campaign)
      campaignsFolder?.file(`${campaign.id}.yaml`, yamlContent)
    }
    
    // Add goals
    const goalsFolder = zip.folder('goals')
    for (const goal of this.goals) {
      const yamlContent = stringifyYAML(goal)
      goalsFolder?.file(`${goal.id}.yaml`, yamlContent)
    }
    
    // Add scenarios
    const scenariosFolder = zip.folder('scenarios')
    for (const scenario of this.scenarios) {
      const yamlContent = stringifyYAML(scenario)
      scenariosFolder?.file(`${scenario.id}.yaml`, yamlContent)
    }
    
    // Add manifest
    if (this.manifest) {
      const manifestContent = stringifyYAML(this.manifest)
      zip.file('manifest.yaml', manifestContent)
    }
    
    return await zip.generateAsync({ type: 'blob' })
  }

  async importFromZip(file: File): Promise<void> {
    const zip = new JSZip()
    const zipContents = await zip.loadAsync(file)
    
    // Clear existing data
    this.campaigns = []
    this.goals = []
    this.scenarios = []
    this.manifest = undefined
    
    // Process each file in the ZIP
    for (const [filename, zipFile] of Object.entries(zipContents.files)) {
      if (zipFile.dir) continue
      
      const content = await zipFile.async('text')
      const yamlData = parseYAML(content)
      
      if (filename.startsWith('campaigns/') && filename.endsWith('.yaml')) {
        this.campaigns.push(yamlData as Campaign)
      } else if (filename.startsWith('goals/') && filename.endsWith('.yaml')) {
        this.goals.push(yamlData as Goal)
      } else if (filename.startsWith('scenarios/') && filename.endsWith('.yaml')) {
        this.scenarios.push(yamlData as Scenario)
      } else if (filename === 'manifest.yaml') {
        this.manifest = yamlData as CampaignManifest
      }
    }
    
    this.saveToLocalStorage()
  }

  async downloadExport(filename = 'campaigns.zip'): Promise<void> {
    const blob = await this.exportAll()
    saveAs(blob, filename)
  }

  private loadFromLocalStorage(): void {
    try {
      const campaignsData = localStorage.getItem('campaigns')
      if (campaignsData) {
        this.campaigns = JSON.parse(campaignsData)
      }
      
      const goalsData = localStorage.getItem('goals')
      if (goalsData) {
        this.goals = JSON.parse(goalsData)
      }
      
      const scenariosData = localStorage.getItem('scenarios')
      if (scenariosData) {
        this.scenarios = JSON.parse(scenariosData)
      }
      
      const manifestData = localStorage.getItem('manifest')
      if (manifestData) {
        this.manifest = JSON.parse(manifestData)
      }
    } catch (error) {
      console.warn('Failed to load data from localStorage:', error)
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('campaigns', JSON.stringify(this.campaigns))
      localStorage.setItem('goals', JSON.stringify(this.goals))
      localStorage.setItem('scenarios', JSON.stringify(this.scenarios))
      if (this.manifest) {
        localStorage.setItem('manifest', JSON.stringify(this.manifest))
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  supports(feature: FileSystemFeature): boolean {
    switch (feature) {
      case FileSystemFeature.ZIP_IMPORT:
        return true // In-memory adapter supports ZIP import
      case FileSystemFeature.ZIP_EXPORT:
        return true // In-memory adapter supports ZIP export
      default:
        return false
    }
  }
}
