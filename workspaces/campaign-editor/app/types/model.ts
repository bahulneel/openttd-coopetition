// Model type definitions - the core domain entities
import type { AnyEntity, Entity, EntityOptions, EntityReference } from './entity'

export interface Named {
  name: string
}

export interface Commentable {
  comment?: string
}

export interface BaseItem<T extends string> extends Named, Commentable, Entity<T> {
  meta: MetaInfo
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'legendary'
export interface MetaInfo extends Commentable {
  author?: string
  description?: string
  difficulty?: Difficulty
  estimated_time?: string
  tags?: readonly string[]
  requirements?: readonly string[]
  prerequisites?: readonly string[]
}

export interface Range {
  min?: number
  max?: number
}

export interface Constraints extends Commentable {
  players?: Range
  date?: Range
  map_size?: Range
  difficulty?: Range
  conditional?: ConditionalConstraint[]
}

export interface ConditionalConstraint {
  condition: {
    type: string
    operator?: string
    value?: number | string
  }
  constraint: Constraints
}

export interface SharedInfrastructure extends Commentable {
  track?: boolean
  stations?: boolean
  vehicles?: boolean
  depots?: boolean
}

export interface RewardSet extends Commentable {
  cash?: number
  score?: number
  reputation?: number
  unlocks?: string[]
}

// Base objective interface with common fields
export interface BaseObjective extends Commentable {
  time_limit?: number
}

// Cargo delivery objective - requires cargo type and amount
export interface CargoDeliveredObjective extends BaseObjective {
  type: 'cargo_delivered'
  amount: number
  cargo: string
  cargo_types?: string[]
}

// Network length objective - requires amount (in tiles)
export interface NetworkLengthObjective extends BaseObjective {
  type: 'network_length'
  amount: number
  track_type?: string
}

// Profit objective - requires amount (in currency)
export interface ProfitObjective extends BaseObjective {
  type: 'profit'
  amount: number
}

// Station building objective - requires count
export interface StationBuiltObjective extends BaseObjective {
  type: 'station_built'
  count: number
  location?: string
}

// Company value objective - requires min_value
export interface CompanyValueObjective extends BaseObjective {
  type: 'company_value'
  min_value: number
}

// Town growth objective - requires target_population and town_id
export interface TownGrowthObjective extends BaseObjective {
  type: 'town_growth'
  target_population: number
  town_id: string
}

// Discriminated union of all objective types
export type Objective =
  | CargoDeliveredObjective
  | NetworkLengthObjective
  | ProfitObjective
  | StationBuiltObjective
  | CompanyValueObjective
  | TownGrowthObjective

// Legacy type for backward compatibility (deprecated)
export type ObjectiveType = Objective['type']

export interface Rewards extends Commentable {
  completion?: RewardSet
  milestones?: CampaignMilestone[]
  scaling?: DifficultyScaling
}

export interface Condition extends Commentable {
  type: string
  threshold?: number
  target?: string
}

export interface CampaignScenarioOverrides extends Commentable {
  shared?: Partial<SharedInfrastructure>
  result?: Partial<RewardSet>
  constraints?: Partial<Constraints>
}

export type ScenarioReference = EntityReference<Scenario>
export interface CampaignScenario extends Commentable {
  include: ScenarioReference
  order?: number
  required?: boolean
  branch?: string
  condition?: Condition
  overrides?: CampaignScenarioOverrides
}

export interface CampaignBranch extends Named, Commentable {
  description?: string
  unlock_condition?: Condition
  scenarios: CampaignScenario[]
}

export interface CampaignProgressionRequirement extends Commentable {
  scenario: ScenarioReference
  completion_threshold: number
  unlocks?: string
}

export interface CampaignProgression extends Commentable {
  type: 'linear' | 'branching'
  unlock_requirements?: CampaignProgressionRequirement[]
  unlock_order?: string[]
}

export interface CampaignMilestone extends Named, Commentable {
  description: string
  reward: RewardSet
  condition?: Condition
}

export interface ScalingFactor {
  factor: string
  adjustment: number
}

export interface DifficultyScalingAdaptation extends Commentable {
  enabled: boolean
  adjustment_rate: number
  max_adjustment: number
}

export interface DifficultyScaling extends Commentable {
  enabled: boolean
  base_difficulty: string
  scaling_factors?: ScalingFactor[]
  adaptive?: DifficultyScalingAdaptation
}

export interface CampaignSettings extends Commentable {
  economy?: string
  disasters?: boolean
  breakdowns?: boolean
  inflation?: boolean
  seasons?: boolean
}

export interface Campaign extends BaseItem<'Campaign'> {
  scenarios?: CampaignScenario[]
  branches?: CampaignBranch
  progression?: CampaignProgression
  constraints?: Constraints
  rewards?: Rewards
  settings?: CampaignSettings
}

export type GoalType = 'player' | 'company' | 'scenario' | 'campaign'

export interface Goal extends BaseItem<'Goal'> {
  type?: GoalType
  objective?: Objective
  constraints?: Constraints
  shared?: SharedInfrastructure
  result?: RewardSet
}

export interface GoalOverrides extends Commentable {
  shared?: Partial<SharedInfrastructure>
  result?: Partial<RewardSet>
  constraints?: Partial<Constraints>
}

export type GoalReference = EntityReference<Goal>
export interface ScenarioGoal extends Commentable {
  include: GoalReference
  order?: number
  required?: boolean
  branch?: string
  condition?: Condition
  overrides?: GoalOverrides
}

export interface ScenarioDefaults extends Commentable {
  shared?: SharedInfrastructure
  result?: RewardSet
  constraints?: Constraints
}

export interface Scenario extends BaseItem<'Scenario'> {
  goals?: ScenarioGoal[]
  constraints?: Constraints
  defaults?: ScenarioDefaults
  settings?: CampaignSettings
}

export interface PackageStructure extends Commentable {
  goalPath: string
  scenarioPath: string
  campaignPath: string
}

export type CampaignReference = EntityReference<Campaign>

export interface FileReference<T extends AnyEntity> {
  filename: string
  entity: EntityReference<T>
}
export interface Manifest extends BaseItem<'Manifest'> {
  tags: string[]
  structure: PackageStructure
  main_campaign?: string
  dependencies: {
    coopetition_version: string
  }
  install?: {
    copy_to: string
    requires: string[]
  }
  contents: {
    goals: FileReference<Goal>[]
    scenarios: FileReference<Scenario>[]
    campaigns: FileReference<Campaign>[]
  }
}
export interface TypeMap {
  Manifest: Manifest
  Campaign: Campaign
  Goal: Goal
  Scenario: Scenario
}

export type ModelTypes = keyof TypeMap
export type AnyItem = BaseItem<string>
export type ModelOptions<T extends AnyItem> = EntityOptions<T> & Pick<T, 'name'>
export type ModelEntity = Entity<ModelTypes>
