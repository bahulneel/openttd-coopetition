import type { 
  Campaign, 
  Goal, 
  Scenario, 
  CampaignManifest, 
  CampaignStore, 
  FileSystemAdapter 
} from '~/types/campaign'
import { createFileSystemAdapter } from '~/utils/fileSystem'

// Global store state
const store = reactive<CampaignStore>({
  campaigns: [],
  goals: [],
  scenarios: [],
  manifest: undefined,
  loading: false,
  error: undefined
})

let fileSystem: FileSystemAdapter | undefined = undefined

export const useCampaignStore = () => {
  const { public: { spaMode } } = useRuntimeConfig()

  // Initialize file system adapter
  if (!fileSystem) {
    fileSystem = createFileSystemAdapter(spaMode)
  }

  // Loading state management
  const setLoading = (loading: boolean) => {
    store.loading = loading
  }

  const setError = (error: string | undefined) => {
    store.error = error
  }

  // Data loading
  const loadAll = async () => {
    if (!fileSystem) return

    setLoading(true)
    setError(undefined)

    try {
      const [campaigns, goals, scenarios, manifest] = await Promise.all([
        fileSystem.loadCampaigns(),
        fileSystem.loadGoals(),
        fileSystem.loadScenarios(),
        fileSystem.loadManifest()
      ])

      store.campaigns = campaigns
      store.goals = goals
      store.scenarios = scenarios
      store.manifest = manifest || undefined
    } catch (error) {
      console.error('Failed to load data:', error)
      setError(error instanceof Error ? error.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadCampaigns = async () => {
    if (!fileSystem) return

    setLoading(true)
    setError(undefined)

    try {
      store.campaigns = await fileSystem.loadCampaigns()
    } catch (error) {
      console.error('Failed to load campaigns:', error)
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
      store.goals = await fileSystem.loadGoals()
    } catch (error) {
      console.error('Failed to load goals:', error)
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
      store.scenarios = await fileSystem.loadScenarios()
    } catch (error) {
      console.error('Failed to load scenarios:', error)
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
      const existingIndex = store.campaigns.findIndex(c => c.id === campaign.id)
      if (existingIndex !== -1) {
        store.campaigns[existingIndex] = campaign
      } else {
        store.campaigns.push(campaign)
      }
    } catch (error) {
      console.error('Failed to save campaign:', error)
      setError('Failed to save campaign')
      throw error
    }
  }

  const deleteCampaign = async (id: string) => {
    if (!fileSystem) throw new Error('File system not initialized')

    setError(undefined)
    try {
      await fileSystem.deleteCampaign(id)
      store.campaigns = store.campaigns.filter(c => c.id !== id)
    } catch (error) {
      console.error('Failed to delete campaign:', error)
      setError('Failed to delete campaign')
      throw error
    }
  }

  const getCampaign = (id: string): Campaign | undefined => {
    return store.campaigns.find(c => c.id === id)
  }

  const duplicateCampaign = async (id: string, newId?: string): Promise<Campaign> => {
    const original = getCampaign(id)
    if (!original) throw new Error('Campaign not found')

    const duplicate: Campaign = {
      ...JSON.parse(JSON.stringify(original)), // Deep clone
      id: newId || `${original.id}_copy_${Date.now()}`,
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
      
      const existingIndex = store.goals.findIndex(g => g.id === goal.id)
      if (existingIndex !== -1) {
        store.goals[existingIndex] = goal
      } else {
        store.goals.push(goal)
      }
    } catch (error) {
      console.error('Failed to save goal:', error)
      setError('Failed to save goal')
      throw error
    }
  }

  const deleteGoal = async (id: string) => {
    if (!fileSystem) throw new Error('File system not initialized')

    setError(undefined)
    try {
      await fileSystem.deleteGoal(id)
      store.goals = store.goals.filter(g => g.id !== id)
    } catch (error) {
      console.error('Failed to delete goal:', error)
      setError('Failed to delete goal')
      throw error
    }
  }

  const getGoal = (id: string): Goal | undefined => {
    return store.goals.find(g => g.id === id)
  }

  const duplicateGoal = async (id: string, newId?: string): Promise<Goal> => {
    const original = getGoal(id)
    if (!original) throw new Error('Goal not found')

    const duplicate: Goal = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId || `${original.id}_copy_${Date.now()}`,
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
      
      const existingIndex = store.scenarios.findIndex(s => s.id === scenario.id)
      if (existingIndex !== -1) {
        store.scenarios[existingIndex] = scenario
      } else {
        store.scenarios.push(scenario)
      }
    } catch (error) {
      console.error('Failed to save scenario:', error)
      setError('Failed to save scenario')
      throw error
    }
  }

  const deleteScenario = async (id: string) => {
    if (!fileSystem) throw new Error('File system not initialized')

    setError(undefined)
    try {
      await fileSystem.deleteScenario(id)
      store.scenarios = store.scenarios.filter(s => s.id !== id)
    } catch (error) {
      console.error('Failed to delete scenario:', error)
      setError('Failed to delete scenario')
      throw error
    }
  }

  const getScenario = (id: string): Scenario | undefined => {
    return store.scenarios.find(s => s.id === id)
  }

  const duplicateScenario = async (id: string, newId?: string): Promise<Scenario> => {
    const original = getScenario(id)
    if (!original) throw new Error('Scenario not found')

    const duplicate: Scenario = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId || `${original.id}_copy_${Date.now()}`,
      meta: {
        ...original.meta,
        title: original.meta?.title ? `${original.meta.title} (Copy)` : undefined
      }
    }

    await saveScenario(duplicate)
    return duplicate
  }

  // Manifest operations
  const saveManifest = async (manifest: CampaignManifest) => {
    if (!fileSystem) throw new Error('File system not initialized')

    setError(undefined)
    try {
      await fileSystem.saveManifest(manifest)
      store.manifest = manifest
    } catch (error) {
      console.error('Failed to save manifest:', error)
      setError('Failed to save manifest')
      throw error
    }
  }

  // Import/Export operations
  const exportAll = async (): Promise<Blob> => {
    if (!fileSystem) throw new Error('File system not initialized')

    try {
      return await fileSystem.exportAll()
    } catch (error) {
      console.error('Failed to export data:', error)
      setError('Failed to export data')
      throw error
    }
  }

  const importFromFile = async (file: File) => {
    if (!fileSystem) throw new Error('File system not initialized')

    // For SPA mode, we can import directly
    if (spaMode && 'importFromZip' in fileSystem) {
      setLoading(true)
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic method call on optional interface property
        await (fileSystem as any).importFromZip(file)
        await loadAll() // Reload all data
      } catch (error) {
        console.error('Failed to import data:', error)
        setError('Failed to import data')
        throw error
      } finally {
        setLoading(false)
      }
    } else {
      throw new Error('Import not supported in this mode')
    }
  }

  const downloadExport = async (filename = 'campaigns.zip') => {
    if (spaMode && fileSystem && 'downloadExport' in fileSystem) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic method call on optional interface property
      await (fileSystem as any).downloadExport(filename)
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
    id: id || `campaign_${Date.now()}`,
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
    id: id || `goal_${Date.now()}`,
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
    id: id || `scenario_${Date.now()}`,
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
    return store.campaigns.filter(campaign => 
      campaign.id.toLowerCase().includes(lowerQuery) ||
      campaign.meta?.title?.toLowerCase().includes(lowerQuery) ||
      campaign.meta?.description?.toLowerCase().includes(lowerQuery) ||
      campaign.meta?.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  const searchGoals = (query: string) => {
    const lowerQuery = query.toLowerCase()
    return store.goals.filter(goal =>
      goal.id.toLowerCase().includes(lowerQuery) ||
      goal.meta?.title?.toLowerCase().includes(lowerQuery) ||
      goal.meta?.description?.toLowerCase().includes(lowerQuery)
    )
  }

  const searchScenarios = (query: string) => {
    const lowerQuery = query.toLowerCase()
    return store.scenarios.filter(scenario =>
      scenario.id.toLowerCase().includes(lowerQuery) ||
      scenario.meta?.title?.toLowerCase().includes(lowerQuery) ||
      scenario.meta?.description?.toLowerCase().includes(lowerQuery)
    )
  }

  return {
    // State
    ...toRefs(store),
    
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
    searchScenarios,
    
    // Config
    spaMode: readonly(ref(spaMode))
  }
}