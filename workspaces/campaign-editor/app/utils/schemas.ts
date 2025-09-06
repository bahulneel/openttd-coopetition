import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type { EntityValue } from '~/types'
import type {
  Difficulty,
  MetaInfo,
  Range,
  Constraints,
  ConditionalConstraint,
  SharedInfrastructure,
  RewardSet,
  ObjectiveType,
  Objective,
  Rewards,
  Condition,
  CampaignScenarioOverrides,
  CampaignScenario,
  CampaignBranch,
  CampaignProgressionRequirement,
  CampaignProgression,
  CampaignMilestone,
  ScalingFactor,
  DifficultyScalingAdaptation,
  DifficultyScaling,
  CampaignSettings,
  Campaign,
  GoalType,
  Goal,
  GoalOverrides,
  ScenarioGoal,
  ScenarioDefaults,
  Scenario,
  PackageStructure,
  PackageManifest,
  AnyItem,
} from '~/types/model'

// Form data utility type and aliases
type FormData<T extends AnyItem> = EntityValue<T> & { id: string }

export type GoalFormData = FormData<Goal>
export type ScenarioFormData = FormData<Scenario>
export type CampaignFormData = FormData<Campaign>
export type CampaignManifestFormData = FormData<PackageManifest>

// Common field schemas - reusable patterns
const optionalString = z.string().optional()
const requiredString = z.string().min(1, 'This field is required')
const optionalNumber = z.number().optional()
const optionalBoolean = z.boolean().optional()
const optionalStringArray = z.array(z.string()).optional()

// Semantic field names
const commentField = optionalString
const nameField = z.string().min(1, 'Name is required')
const idField = z
  .string()
  .min(1, 'ID is required')
  .regex(/^[a-zA-Z0-9_-]+$/, 'ID can only contain letters, numbers, underscores, and hyphens')

// Common object patterns - removed unused helper functions

// Reusable object schemas for common patterns
const sharedInfrastructureShape = {
  track: optionalBoolean,
  stations: optionalBoolean,
  vehicles: optionalBoolean,
  depots: optionalBoolean,
  comment: commentField,
} as const

const rewardSetShape = {
  cash: optionalNumber,
  score: optionalNumber,
  reputation: optionalNumber,
  unlocks: optionalStringArray,
  comment: commentField,
} as const

const constraintsShape = () =>
  ({
    players: rangeSchema.optional(),
    date: rangeSchema.optional(),
    map_size: rangeSchema.optional(),
    difficulty: rangeSchema.optional(),
    conditional: z.array(conditionalConstraintSchema).optional(),
    comment: commentField,
  }) as const

// Note: Since SharedInfrastructure, RewardSet, and Constraints already have all optional fields,
// Partial<T> is identical to T, so we can use the base schemas directly with .optional()

// Common validation ranges
const playerRange = z.number().min(1, 'Minimum players must be at least 1').max(8, 'Maximum players cannot exceed 8')
const yearRange = z.number().min(1920, 'Start year must be 1920 or later').max(2100, 'End year cannot exceed 2100')
const mapSizeRange = z
  .number()
  .min(64, 'Minimum map size must be at least 64')
  .max(2048, 'Maximum map size cannot exceed 2048')
const nonNegativeNumber = z.number().min(0, 'Value must be non-negative')
const difficultySchema = z.enum(['easy', 'medium', 'hard', 'expert', 'legendary'] as const)

// Base schemas that match model types exactly
const metaInfoSchema: z.ZodType<MetaInfo> = z.object({
  author: optionalString,
  description: optionalString,
  difficulty: difficultySchema.optional(),
  estimated_time: optionalString,
  tags: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  comment: commentField,
})

const rangeSchema: z.ZodType<Range> = z.object({
  min: optionalNumber,
  max: optionalNumber,
})

// Use lazy evaluation to handle circular reference in Constraints
const constraintsSchema: z.ZodType<Constraints> = z.lazy(() => z.object(constraintsShape()))

const conditionalConstraintSchema: z.ZodType<ConditionalConstraint> = z.object({
  condition: z.object({
    type: z.string(),
    operator: optionalString,
    value: z.union([z.number(), z.string()]).optional(),
  }),
  constraint: constraintsSchema,
})

const sharedInfrastructureSchema: z.ZodType<SharedInfrastructure> = z.object(sharedInfrastructureShape)

const rewardSetSchema: z.ZodType<RewardSet> = z.object(rewardSetShape)

const objectiveTypeSchema = z.enum([
  'cargo_delivered',
  'network_length',
  'profit',
  'station_built',
  'company_value',
  'town_growth',
] as const)

const objectiveSchema: z.ZodType<Objective> = z.object({
  type: objectiveTypeSchema,
  amount: optionalNumber,
  cargo: optionalString,
  cargo_types: optionalStringArray,
  time_limit: optionalNumber,
  track_type: optionalString,
  target: optionalString,
  min_value: optionalNumber,
  town_id: optionalString,
  target_population: optionalNumber,
  location: optionalString,
  count: optionalNumber,
  comment: commentField,
})

const conditionSchema: z.ZodType<Condition> = z.object({
  type: z.string(),
  threshold: optionalNumber,
  target: optionalString,
  comment: commentField,
})

const campaignScenarioOverridesSchema: z.ZodType<CampaignScenarioOverrides> = z.object({
  shared: sharedInfrastructureSchema.optional(),
  result: rewardSetSchema.optional(),
  constraints: constraintsSchema.optional(),
  comment: commentField,
})

const campaignScenarioSchema: z.ZodType<CampaignScenario> = z.object({
  include: z.string(),
  order: optionalNumber,
  required: optionalBoolean,
  branch: optionalString,
  condition: conditionSchema.optional(),
  overrides: campaignScenarioOverridesSchema.optional(),
  comment: commentField,
})

const campaignBranchSchema: z.ZodType<CampaignBranch> = z.object({
  name: z.string(),
  description: optionalString,
  unlock_condition: conditionSchema.optional(),
  scenarios: z.array(campaignScenarioSchema),
  comment: commentField,
})

const campaignProgressionRequirementSchema: z.ZodType<CampaignProgressionRequirement> = z.object({
  scenario: z.string(),
  completion_threshold: z.number(),
  unlocks: optionalString,
  comment: commentField,
})

const campaignProgressionSchema: z.ZodType<CampaignProgression> = z.object({
  type: z.enum(['linear', 'branching'] as const),
  unlock_requirements: z.array(campaignProgressionRequirementSchema).optional(),
  unlock_order: optionalStringArray,
  comment: commentField,
})

const campaignMilestoneSchema: z.ZodType<CampaignMilestone> = z.object({
  name: z.string(),
  description: z.string(),
  reward: rewardSetSchema,
  condition: conditionSchema.optional(),
  comment: commentField,
})

const scalingFactorSchema: z.ZodType<ScalingFactor> = z.object({
  factor: z.string(),
  adjustment: z.number(),
})

const difficultyScalingAdaptationSchema: z.ZodType<DifficultyScalingAdaptation> = z.object({
  enabled: z.boolean(),
  adjustment_rate: z.number(),
  max_adjustment: z.number(),
  comment: commentField,
})

const difficultyScalingSchema: z.ZodType<DifficultyScaling> = z.object({
  enabled: z.boolean(),
  base_difficulty: z.string(),
  scaling_factors: z.array(scalingFactorSchema).optional(),
  adaptive: difficultyScalingAdaptationSchema.optional(),
  comment: z.string().optional(),
})

const rewardsSchema: z.ZodType<Rewards> = z.object({
  completion: rewardSetSchema.optional(),
  milestones: z.array(campaignMilestoneSchema).optional(),
  scaling: difficultyScalingSchema.optional(),
  comment: z.string().optional(),
})

const campaignSettingsSchema: z.ZodType<CampaignSettings> = z.object({
  economy: z.string().optional(),
  disasters: z.boolean().optional(),
  breakdowns: z.boolean().optional(),
  inflation: z.boolean().optional(),
  comment: z.string().optional(),
})

const goalTypeSchema = z.enum(['player', 'company', 'scenario', 'campaign'] as const)

const goalOverridesSchema: z.ZodType<GoalOverrides> = z.object({
  shared: sharedInfrastructureSchema.optional(),
  result: rewardSetSchema.optional(),
  constraints: constraintsSchema.optional(),
  comment: commentField,
})

const scenarioGoalSchema: z.ZodType<ScenarioGoal> = z.object({
  include: z.string(),
  order: z.number().optional(),
  required: z.boolean().optional(),
  branch: z.string().optional(),
  condition: conditionSchema.optional(),
  overrides: goalOverridesSchema.optional(),
  comment: z.string().optional(),
})

const scenarioDefaultsSchema: z.ZodType<ScenarioDefaults> = z.object({
  shared: sharedInfrastructureSchema.optional(),
  result: rewardSetSchema.optional(),
  constraints: constraintsSchema.optional(),
  comment: z.string().optional(),
})

const packageStructureSchema: z.ZodType<PackageStructure> = z.object({
  goals: z.string(),
  scenarios: z.string(),
  campaigns: z.string(),
  comment: z.string().optional(),
})

// Main entity schemas - using FormData types for form validation
const goalSchemaBase: z.ZodType<GoalFormData> = z.object({
  id: z.string(),
  name: z.string(),
  comment: z.string().optional(),
  meta: metaInfoSchema,
  type: goalTypeSchema.optional(),
  objective: objectiveSchema.optional(),
  constraints: constraintsSchema.optional(),
  shared: sharedInfrastructureSchema.optional(),
  result: rewardSetSchema.optional(),
})

const scenarioSchemaBase: z.ZodType<ScenarioFormData> = z.object({
  id: z.string(),
  name: z.string(),
  comment: z.string().optional(),
  meta: metaInfoSchema,
  goals: z.array(scenarioGoalSchema).optional(),
  constraints: constraintsSchema.optional(),
  defaults: scenarioDefaultsSchema.optional(),
})

const campaignSchemaBase: z.ZodType<CampaignFormData> = z.object({
  id: z.string(),
  name: z.string(),
  comment: z.string().optional(),
  meta: metaInfoSchema,
  scenarios: z.array(campaignScenarioSchema).optional(),
  branches: campaignBranchSchema.optional(),
  progression: campaignProgressionSchema.optional(),
  constraints: constraintsSchema.optional(),
  rewards: rewardsSchema.optional(),
  settings: campaignSettingsSchema.optional(),
})

const campaignManifestSchemaBase: z.ZodType<CampaignManifestFormData> = z.object({
  id: z.string(),
  name: z.string(),
  comment: z.string().optional(),
  meta: metaInfoSchema,
  tags: z.array(z.string()),
  structure: packageStructureSchema,
  main_campaign: z.string().optional(),
  dependencies: z.object({
    coopetition_version: z.string(),
  }),
  install: z
    .object({
      copy_to: z.string(),
      requires: z.array(z.string()),
    })
    .optional(),
})

// VeeValidate typed schemas
export const goalSchema = toTypedSchema(goalSchemaBase)
export const scenarioSchema = toTypedSchema(scenarioSchemaBase)
export const campaignSchema = toTypedSchema(campaignSchemaBase)
export const campaignManifestSchema = toTypedSchema(campaignManifestSchemaBase)

// Export all schemas as a collection
export const schemas = {
  goal: goalSchemaBase,
  scenario: scenarioSchemaBase,
  campaign: campaignSchemaBase,
  campaignManifest: campaignManifestSchemaBase,
} as const

// Type exports are now at the top of the file with the utility type
