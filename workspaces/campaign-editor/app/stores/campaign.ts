import { defineStore } from 'pinia'
import type { 
  Campaign, 
  Goal, 
  Scenario, 
  CampaignManifest
} from '~/types/campaign'

export const useCampaignStore = defineStore('campaign', () => {
  // State
  const campaigns = ref<Campaign[]>([])
  const goals = ref<Goal[]>([])
  const scenarios = ref<Scenario[]>([])
  const manifest = ref<CampaignManifest | undefined>(undefined)
  const loading = ref(false)
  const error = ref<string | undefined>(undefined)

  // Get file system instance
  const fileSystem = useFileSystem()

  // Loading state management
  const setLoading = (loadingState: boolean) => {
    loading.value = loadingState
  }

  const setError = (errorState: string | undefined) => {
    error.value = errorState
  }

  // Data loading
  const loadAll = async () => {
    if (!fileSystem) return

    setLoading(true)
    setError(undefined)

    try {
      const [campaignsData, goalsData, scenariosData, manifestData] = await Promise.all([
        fileSystem.loadCampaigns(),
        fileSystem.loadGoals(),
        fileSystem.loadScenarios(),
        fileSystem.loadManifest()
      ])

      campaigns.value = campaignsData
      goals.value = goalsData
      scenarios.value = scenariosData
      manifest.value = manifestData || undefined
    } catch (err) {
      console.error('Failed to load data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadCampaigns = async () => {
    if (!fileSystem) return

    setLoading(true)
    setError(undefined)

    try {
      campaigns.value = await fileSystem.loadCampaigns()
    } catch (err) {
      console.error('Failed to load campaigns:', err)
      setError('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  const loadGoals = async () => {
    if (!fileSystem) return

    setLoading(true)
    setError(undefined)

    try {
      goals.value = await fileSystem.loadGoals()
    } catch (err) {
      console.error('Failed to load goals:', err)
      setError('Failed to load goals')
    } finally {
      setLoading(false)
    }
  }

  const loadScenarios = async () => {
    if (!fileSystem) return

    setLoading(true)
    setError(undefined)

    try {
      scenarios.value = await fileSystem.loadScenarios()
    } catch (err) {
      console.error('Failed to load scenarios:', err)
      setError('Failed to load scenarios')
    } finally {
      setLoading(false)
    }
  }

  // Campaign operations
  const saveCampaign = async (campaign: Campaign) => {
    if (!fileSystem) throw new Error('File system not initialized')

    setError(undefined)
    try {
      await fileSystem.saveCampaign(campaign)
      
      // Update store
      const existingIndex = campaigns.value.findIndex(c => c.id === campaign.id)
      if (existingIndex !== -1) {
        campaigns.value[existingIndex] = campaign
      } else {
        campaigns.value.push(campaign)
      }
    } catch (err) {
      console.error('Failed to save campaign:', err)
      setError('Failed to save campaign')
      throw err
    }
  }

  const deleteCampaign = async (id: string) => {
    if (!fileSystem) throw new Error('File system not initialized')

    setError(undefined)
    try {
      await fileSystem.deleteCampaign(id)
      campaigns.value = campaigns.value.filter(c => c.id !== id)
    } catch (err) {
      console.error('Failed to delete campaign:', err)
      setError('Failed to delete campaign')
      throw err
    }
  }

  const getCampaign = (id: string): Campaign | undefined => {
    return campaigns.value.find(c => c.id === id)
  }

  const duplicateCampaign = async (id: string, newId?: string): Promise<Campaign> => {
    const original = getCampaign(id)
    if (!original) throw new Error('Campaign not found')

    const duplicate: Campaign = {
      ...JSON.parse(JSON.stringify(original)), // Deep clone
      id: newId || useIdentifier(`${original.id}_copy`),
      meta: {
        ...original.meta,
        title: original.meta?.title ? `${original.meta.title} (Copy)` : undefined
      },
      lastModified: Date.now(),
      modified: true
    }

    await saveCampaign(duplicate)
    return duplicate
  }

  // Goal operations
  const saveGoal = async (goal: Goal) => {
    if (!fileSystem) throw new Error('File system not initialized')

    setError(undefined)
    try {
      await fileSystem.saveGoal(goal)
      
      const existingIndex = goals.value.findIndex(g => g.id === goal.id)
      if (existingIndex !== -1) {
        goals.value[existingIndex] = goal
      } else {
        goals.value.push(goal)
      }
    } catch (err) {
      console.error('Failed to save goal:', err)
      setError('Failed to save goal')
      throw err
    }
  }

  const deleteGoal = async (id: string) => {
    if (!fileSystem) throw new Error('File system not initialized')

    setError(undefined)
    try {
      await fileSystem.deleteGoal(id)
      goals.value = goals.value.filter(g => g.id !== id)
    } catch (err) {
      console.error('Failed to delete goal:', err)
      setError('Failed to delete goal')
      throw err
    }
  }

  const getGoal = (id: string): Goal | undefined => {
    return goals.value.find(g => g.id === id)
  }

  const duplicateGoal = async (id: string, newId?: string): Promise<Goal> => {
    const original = getGoal(id)
    if (!original) throw new Error('Goal not found')

    const duplicate: Goal = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId || useIdentifier(`${original.id}_copy`),
      meta: {
        ...original.meta,
        title: original.meta?.title ? `${original.meta.title} (Copy)` : undefined
      }
    }

    await saveGoal(duplicate)
    return duplicate
  }

  // Scenario operations
  const saveScenario = async (scenario: Scenario) => {
    if (!fileSystem) throw new Error('File system not initialized')

    setError(undefined)
    try {
      await fileSystem.saveScenario(scenario)
      
      const existingIndex = scenarios.value.findIndex(s => s.id === scenario.id)
      if (existingIndex !== -1) {
        scenarios.value[existingIndex] = scenario
      } else {
        scenarios.value.push(scenario)
      }
    } catch (err) {
      console.error('Failed to save scenario:', err)
      setError('Failed to save scenario')
      throw err
    }
  }

  const deleteScenario = async (id: string) => {
    if (!fileSystem) throw new Error('File system not initialized')

    setError(undefined)
    try {
      await fileSystem.deleteScenario(id)
      scenarios.value = scenarios.value.filter(s => s.id !== id)
    } catch (err) {
      console.error('Failed to delete scenario:', err)
      setError('Failed to delete scenario')
      throw err
    }
  }

  const getScenario = (id: string): Scenario | undefined => {
    return scenarios.value.find(s => s.id === id)
  }

  const duplicateScenario = async (id: string, newId?: string): Promise<Scenario> => {
    const original = getScenario(id)
    if (!original) throw new Error('Scenario not found')

    const duplicate: Scenario = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId || useIdentifier(`${original.id}_copy`),
      meta: {
        ...original.meta,
        title: original.meta?.title ? `${original.meta.title} (Copy)` : undefined
      }
    }

    await saveScenario(duplicate)
    return duplicate
  }

  // Manifest operations
  const saveManifest = async (manifestData: CampaignManifest) => {
    if (!fileSystem) throw new Error('File system not initialized')

    setError(undefined)
    try {
      await fileSystem.saveManifest(manifestData)
      manifest.value = manifestData
    } catch (err) {
      console.error('Failed to save manifest:', err)
      setError('Failed to save manifest')
      throw err
    }
  }

  // Import/Export operations
  const exportAll = async (): Promise<Blob> => {
    if (!fileSystem) throw new Error('File system not initialized')

    try {
      return await fileSystem.exportAll()
    } catch (err) {
      console.error('Failed to export data:', err)
      setError('Failed to export data')
      throw err
    }
  }

  const importFromFile = async (file: File) => {
    // Check if the file system adapter supports ZIP import
    if (hasFeatureZipImport(fileSystem)) {
      setLoading(true)
      try {
        await fileSystem.importFromZip(file)
        await loadAll() // Reload all data
      } catch (err) {
        console.error('Failed to import data:', err)
        setError('Failed to import data')
        throw err
      } finally {
        setLoading(false)
      }
    } else {
      throw new Error('Import not supported in this mode')
    }
  }

  const downloadExport = async (filename = 'campaigns.zip') => {
    if (hasFeatureZipExport(fileSystem)) {
      await fileSystem.downloadExport(filename)
    } else {
      const blob = await exportAll()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  // Utility functions
  const createEmptyCampaign = (id?: string): Campaign => ({
    id: id || useIdentifier('campaign'),
    comment: 'New campaign created with the editor',
    scenarios: [],
    constraints: {
      players: { min: 1, max: 8 },
      date: { min: 1950, max: 2050 }
    },
    meta: {
      title: 'New Campaign',
      description: 'A new campaign created with the editor',
      difficulty: 'medium',
      tags: []
    },
    lastModified: Date.now(),
    modified: true
  })

  const createEmptyGoal = (id?: string): Goal => ({
    id: id || useIdentifier('goal'),
    comment: 'New goal created with the editor',
    type: 'player',
    objective: {
      type: 'profit',
      amount: 100000,
      comment: 'Basic profit objective'
    },
    constraints: {
      players: { min: 1, max: 8 }
    },
    shared: {
      track: false,
      stations: false,
      vehicles: false,
      depots: false
    },
    result: {
      cash: 50000,
      score: 10,
      reputation: 5
    },
    meta: {
      title: 'New Goal',
      description: 'A new goal created with the editor',
      difficulty: 'medium'
    }
  })

  const createEmptyScenario = (id?: string): Scenario => ({
    id: id || useIdentifier('scenario'),
    comment: 'New scenario created with the editor',
    goals: [],
    constraints: {
      players: { min: 2, max: 6 }
    },
    meta: {
      title: 'New Scenario',
      description: 'A new scenario created with the editor',
      difficulty: 'medium'
    }
  })

  // Search and filtering
  const searchCampaigns = (query: string) => {
    const lowerQuery = query.toLowerCase()
    return campaigns.value.filter(campaign => 
      campaign.id.toLowerCase().includes(lowerQuery) ||
      campaign.meta?.title?.toLowerCase().includes(lowerQuery) ||
      campaign.meta?.description?.toLowerCase().includes(lowerQuery) ||
      campaign.meta?.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  const searchGoals = (query: string) => {
    const lowerQuery = query.toLowerCase()
    return goals.value.filter(goal =>
      goal.id.toLowerCase().includes(lowerQuery) ||
      goal.meta?.title?.toLowerCase().includes(lowerQuery) ||
      goal.meta?.description?.toLowerCase().includes(lowerQuery)
    )
  }

  const searchScenarios = (query: string) => {
    const lowerQuery = query.toLowerCase()
    return scenarios.value.filter(scenario =>
      scenario.id.toLowerCase().includes(lowerQuery) ||
      scenario.meta?.title?.toLowerCase().includes(lowerQuery) ||
      scenario.meta?.description?.toLowerCase().includes(lowerQuery)
    )
  }

  return {
    // State
    campaigns: readonly(campaigns),
    goals: readonly(goals),
    scenarios: readonly(scenarios),
    manifest: readonly(manifest),
    loading: readonly(loading),
    error: readonly(error),
    
    // Loading
    loadAll,
    loadCampaigns,
    loadGoals,
    loadScenarios,
    
    // Campaign operations
    saveCampaign,
    deleteCampaign,
    getCampaign,
    duplicateCampaign,
    
    // Goal operations
    saveGoal,
    deleteGoal,
    getGoal,
    duplicateGoal,
    
    // Scenario operations
    saveScenario,
    deleteScenario,
    getScenario,
    duplicateScenario,
    
    // Manifest operations
    saveManifest,
    
    // Import/Export
    exportAll,
    importFromFile,
    downloadExport,
    
    // Utilities
    createEmptyCampaign,
    createEmptyGoal,
    createEmptyScenario,
    
    // Search
    searchCampaigns,
    searchGoals,
    searchScenarios
  }
})
