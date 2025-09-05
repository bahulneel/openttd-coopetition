// Base interfaces for campaign system

export interface BaseItem {
  id: string
  comment?: string
}

export interface MetaInfo {
  title?: string
  description?: string
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert' | 'legendary'
  estimated_time?: string
  tags?: string[]
  requirements?: string[]
  prerequisites?: string[]
  comment?: string
}

export interface Constraints {
  players?: {
    min?: number
    max?: number
  }
  date?: {
    min?: number
    max?: number
  }
  map_size?: {
    min?: number
    max?: number
  }
  difficulty?: {
    min?: string
    max?: string
  }
  conditional?: ConditionalConstraint[]
  comment?: string
}

export interface ConditionalConstraint {
  condition: {
    type: string
    operator?: string
    value?: number | string
  }
  constraint: Partial<Constraints>
}

export interface SharedInfrastructure {
  track?: boolean
  stations?: boolean
  vehicles?: boolean
  depots?: boolean
  comment?: string
}

export interface Rewards {
  completion?: RewardSet
  partial?: RewardSet
  conditional?: ConditionalReward[]
  comment?: string
}

export interface RewardSet {
  cash?: number
  score?: number
  reputation?: number
  unlock?: string
  achievement?: string
  bonus?: {
    type: 'multiplier' | 'percentage'
    amount: number
    target: string
  }
}

export interface ConditionalReward {
  condition: {
    type: string
    threshold: number
  }
  reward: RewardSet
}

export interface Objective {
  type: 'cargo_delivered' | 'network_length' | 'profit' | 'station_built' | 'company_value' | 'town_growth'
  amount?: number
  cargo?: string
  cargo_types?: string[]
  time_limit?: number
  track_type?: string
  target?: string
  min_value?: number
  town_id?: string
  target_population?: number
  location?: string
  count?: number
  comment?: string
}

// Goal interface
export interface Goal extends BaseItem {
  type?: 'player' | 'company' | 'scenario' | 'campaign'
  objective: Objective
  constraints?: Constraints
  shared?: SharedInfrastructure
  result?: RewardSet
  meta?: MetaInfo
}

// Scenario interface
export interface ScenarioGoal {
  include: string
  order?: number
  required?: boolean
  branch?: string
  condition?: {
    type: string
    threshold?: number
    target?: string
  }
  overrides?: {
    objective?: Partial<Objective>
    constraints?: Partial<Constraints>
    result?: Partial<RewardSet>
  }
  comment?: string
}

export interface ScenarioDependency {
  goal: string
  required_by: string
  comment?: string
}

export interface ConditionalScenarioReward {
  condition: {
    type: string
    threshold: number
  }
  reward: RewardSet
  comment?: string
}

export interface ScenarioProgression {
  unlock_order?: string[]
  milestone_rewards?: Array<{
    milestone: string
    reward: string
  }>
  comment?: string
}

export interface Scenario extends BaseItem {
  defaults?: {
    shared?: SharedInfrastructure
    result?: RewardSet
    constraints?: Constraints
    comment?: string
  }
  goals?: ScenarioGoal[]
  constraints?: Constraints
  meta?: MetaInfo
  settings?: {
    economy?: string
    disasters?: boolean
    breakdowns?: boolean
    inflation?: boolean
    seasons?: boolean
    comment?: string
  }
  rewards?: Rewards
  objectives?: {
    primary?: string[]
    secondary?: string[]
    comment?: string
  }
  dependencies?: ScenarioDependency[]
  conditional_rewards?: ConditionalScenarioReward[]
  progression?: ScenarioProgression
}

// Campaign interfaces
export interface CampaignScenario {
  include: string
  order: number
  required: boolean
  branch?: string
  condition?: {
    type: string
    threshold?: number
    target?: string
  }
  comment?: string
}

export interface CampaignBranch {
  [branchName: string]: string[]
}

export interface CampaignProgression {
  type: 'linear' | 'branching'
  unlock_requirements?: Array<{
    scenario: string
    completion_threshold: number
    unlocks?: string
    comment?: string
  }>
  unlock_order?: string[]
  comment?: string
}

export interface CampaignMilestone {
  name: string
  description: string
  reward: RewardSet
  condition?: {
    type: string
    threshold?: number
    scenario?: string
  }
}

export interface DifficultyScaling {
  enabled: boolean
  base_difficulty: string
  scaling_factors?: Array<{
    factor: string
    adjustment: number
  }>
  adaptive?: {
    enabled: boolean
    adjustment_rate: number
    max_adjustment: number
  }
  comment?: string
}

export interface Campaign extends BaseItem {
  scenarios?: CampaignScenario[]
  branches?: CampaignBranch
  progression?: CampaignProgression
  constraints?: Constraints
  rewards?: Rewards
  meta?: MetaInfo
  settings?: {
    economy?: string
    disasters?: boolean
    breakdowns?: boolean
    inflation?: boolean
    seasons?: boolean
    comment?: string
  }
  features?: string[]
  milestones?: CampaignMilestone[]
  difficulty_scaling?: DifficultyScaling
  // Editor-specific properties
  lastModified?: number
  modified?: boolean
  filePath?: string
}

// Manifest interface
export interface CampaignManifest {
  name: string
  version: string
  description: string
  author: string
  tags: string[]
  structure: {
    goals: string
    scenarios: string
    campaigns: string
  }
  main_campaign: string
  dependencies: {
    coopetition_version: string
  }
  install: {
    copy_to: string
    requires: string[]
  }
  created: string
  updated: string
}

// Store state interfaces
export interface CampaignStore {
  campaigns: Campaign[]
  goals: Goal[]
  scenarios: Scenario[]
  manifest?: CampaignManifest
  loading: boolean
  error: string | undefined
}

// File system operations
// File system feature detection
export enum FileSystemFeature {
  ZIP_IMPORT = 'zip_import',
  ZIP_EXPORT = 'zip_export'
}

// Feature interfaces
export interface FeatureZipImport {
  importFromZip(file: File): Promise<void>
}

export interface FeatureZipExport {
  downloadExport(filename?: string): Promise<void>
}

export interface FileSystemAdapter {
  loadCampaigns(): Promise<Campaign[]>
  loadGoals(): Promise<Goal[]>
  loadScenarios(): Promise<Scenario[]>
  loadManifest(): Promise<CampaignManifest | undefined>
  saveCampaign(campaign: Campaign): Promise<void>
  saveGoal(goal: Goal): Promise<void>
  saveScenario(scenario: Scenario): Promise<void>
  saveManifest(manifest: CampaignManifest): Promise<void>
  deleteCampaign(id: string): Promise<void>
  deleteGoal(id: string): Promise<void>
  deleteScenario(id: string): Promise<void>
  exportAll(): Promise<Blob>
  
  // Feature detection
  supports(feature: FileSystemFeature): boolean
}

// Editor configuration
export interface EditorConfig {
  hasBackend: boolean
  campaignsPath: string
  autoSave: boolean
  autoSaveInterval: number
}