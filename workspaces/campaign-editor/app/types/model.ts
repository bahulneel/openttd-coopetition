// Model type definitions - the core domain entities
import type { AnyEntity, Entity, EntityOptions } from './entity'
import type { Storable } from './storable'

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

export type ObjectiveType =
  | 'cargo_delivered'
  | 'network_length'
  | 'profit'
  | 'station_built'
  | 'company_value'
  | 'town_growth'

export interface Objective extends Commentable {
  type: ObjectiveType
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
}

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

export interface CampaignScenario extends Commentable {
  include: string
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
  scenario: string
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

export interface ScenarioGoal extends Commentable {
  include: string
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
}

export interface PackageStructure extends Commentable {
  goals: string
  scenarios: string
  campaigns: string
}

export interface PackageManifest extends BaseItem<'Manifest'> {
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
}

// Entity file for storage
export interface EntityFile<T extends AnyEntity> {
  path: string
  storable: Storable<T>
}

export interface TypeMap {
  Manifest: PackageManifest
  Campaign: Campaign
  Goal: Goal
  Scenario: Scenario
}

export type AnyItem = BaseItem<string>
export type ModelOptions<T extends AnyItem> = EntityOptions<T> & Pick<T, 'name'>
