import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type { EntityValue } from '~/types'
import type {
  MetaInfo,
  Range,
  Constraints,
  ConditionalConstraint,
  SharedInfrastructure,
  RewardSet,
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
const optionalNumber = z.number().optional()
const optionalBoolean = z.boolean().optional()
const optionalStringArray = z.array(z.string()).optional()

// Semantic field names
const commentField = optionalString

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
  cash: nonNegativeNumber.optional(),
  score: nonNegativeNumber.optional(),
  reputation: optionalNumber, // Reputation can be negative
  unlocks: optionalStringArray,
  comment: commentField,
} as const

const constraintsShape = () =>
  ({
    players: rangeSchema
      .refine(
        (range) => {
          if (range?.min !== undefined) {
            return range.min >= 1 && range.min <= 8
          }
          if (range?.max !== undefined) {
            return range.max >= 1 && range.max <= 8
          }
          return true
        },
        {
          message: 'Player count must be between 1 and 8',
        }
      )
      .optional(),
    date: rangeSchema
      .refine(
        (range) => {
          if (range?.min !== undefined) {
            return range.min >= 1920 && range.min <= 2100
          }
          if (range?.max !== undefined) {
            return range.max >= 1920 && range.max <= 2100
          }
          return true
        },
        {
          message: 'Date must be between 1920 and 2100',
        }
      )
      .optional(),
    map_size: rangeSchema
      .refine(
        (range) => {
          if (range?.min !== undefined) {
            return range.min >= 64 && range.min <= 2048
          }
          if (range?.max !== undefined) {
            return range.max >= 64 && range.max <= 2048
          }
          return true
        },
        {
          message: 'Map size must be between 64 and 2048',
        }
      )
      .optional(),
    difficulty: rangeSchema.optional(),
    conditional: z.array(conditionalConstraintSchema).optional(),
    comment: commentField,
  }) as const

// Note: Since SharedInfrastructure, RewardSet, and Constraints already have all optional fields,
// Partial<T> is identical to T, so we can use the base schemas directly with .optional()

// Common validation ranges
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
}).refine(
  (range) => {
    if (range.min !== undefined && range.max !== undefined) {
      return range.min <= range.max
    }
    return true
  },
  {
    message: 'Minimum value must be less than or equal to maximum value',
  }
)

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
  amount: nonNegativeNumber.optional(),
  cargo: optionalString,
  cargo_types: optionalStringArray,
  time_limit: nonNegativeNumber.optional(),
  track_type: optionalString,
  target: optionalString,
  min_value: nonNegativeNumber.optional(),
  town_id: optionalString,
  target_population: nonNegativeNumber.optional(),
  location: optionalString,
  count: nonNegativeNumber.optional(),
  comment: commentField,
})

const conditionSchema: z.ZodType<Condition> = z.object({
  type: z.string(),
  threshold: nonNegativeNumber.optional(),
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
  order: nonNegativeNumber.optional(),
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
