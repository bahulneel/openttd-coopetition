import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type * as Types from '~/types'

// Form data utility type and aliases - just use EntityValue directly

// Common field schemas - reusable patterns
const optionalString = z.string().optional()
const optionalNumber = z.number().optional()
const optionalBoolean = z.boolean().optional()
const optionalStringArray = z.array(z.string()).optional()

// Semantic field names
const commentField = optionalString

const scenarioRefSchema = z.object({
  __ref: z.object({
    id: z.string(),
    type: z.literal('Scenario'),
  }),
})

const goalRefSchema = z.object({
  __ref: z.object({
    id: z.string(),
    type: z.literal('Goal'),
  }),
})

const campaignRefSchema = z.object({
  __ref: z.object({
    id: z.string(),
    type: z.literal('Campaign'),
  }),
})

// Common object patterns - removed unused helper functions

// Reusable object schemas for common patterns
const sharedInfrastructureShape = {
  track: optionalBoolean,
  stations: optionalBoolean,
  vehicles: optionalBoolean,
  depots: optionalBoolean,
  comment: commentField,
} as const

// Common validation ranges
const nonNegativeNumber = z.number().min(0, 'Value must be non-negative')

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
        },
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
        },
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
        },
      )
      .optional(),
    difficulty: rangeSchema.optional(),
    conditional: z.array(conditionalConstraintSchema).optional(),
    comment: commentField,
  }) as const

// Note: Since SharedInfrastructure, RewardSet, and Constraints already have all optional fields,
// Partial<T> is identical to T, so we can use the base schemas directly with .optional()

const difficultySchema = z.enum(['easy', 'medium', 'hard', 'expert', 'legendary'] as const)

// Base schemas that match model types exactly
const metaInfoSchema: z.ZodType<Types.MetaInfo> = z.object({
  author: optionalString,
  description: optionalString,
  difficulty: difficultySchema.optional(),
  estimated_time: optionalString,
  tags: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  comment: commentField,
})

const rangeSchema: z.ZodType<Types.Range> = z
  .object({
    min: optionalNumber,
    max: optionalNumber,
  })
  .refine(
    (range) => {
      if (range.min !== undefined && range.max !== undefined) {
        return range.min <= range.max
      }
      return true
    },
    {
      message: 'Minimum value must be less than or equal to maximum value',
    },
  )

// Use lazy evaluation to handle circular reference in Constraints
const constraintsSchema: z.ZodType<Types.Constraints> = z.lazy(() => z.object(constraintsShape()))

const conditionalConstraintSchema: z.ZodType<Types.ConditionalConstraint> = z.object({
  condition: z.object({
    type: z.string(),
    operator: optionalString,
    value: z.union([z.number(), z.string()]).optional(),
  }),
  constraint: constraintsSchema,
})

const sharedInfrastructureSchema: z.ZodType<Types.SharedInfrastructure> = z.object(sharedInfrastructureShape)

const rewardSetSchema: z.ZodType<Types.RewardSet> = z.object(rewardSetShape)

// Base objective schema with common fields
const baseObjectiveSchema = z.object({
  time_limit: nonNegativeNumber.optional(),
  comment: commentField,
})

// Individual objective type schemas
const cargoDeliveredObjectiveSchema = baseObjectiveSchema.extend({
  type: z.literal('cargo_delivered'),
  amount: nonNegativeNumber,
  cargo: z.string().min(1, 'Cargo type is required'),
  cargo_types: optionalStringArray,
})

const networkLengthObjectiveSchema = baseObjectiveSchema.extend({
  type: z.literal('network_length'),
  amount: nonNegativeNumber,
  track_type: optionalString,
})

const profitObjectiveSchema = baseObjectiveSchema.extend({
  type: z.literal('profit'),
  amount: nonNegativeNumber,
})

const stationBuiltObjectiveSchema = baseObjectiveSchema.extend({
  type: z.literal('station_built'),
  count: nonNegativeNumber,
  location: optionalString,
})

const companyValueObjectiveSchema = baseObjectiveSchema.extend({
  type: z.literal('company_value'),
  min_value: nonNegativeNumber,
})

const townGrowthObjectiveSchema = baseObjectiveSchema.extend({
  type: z.literal('town_growth'),
  target_population: nonNegativeNumber,
  town_id: z.string().min(1, 'Town ID is required'),
})

// Discriminated union schema for objectives
const objectiveSchema = z.discriminatedUnion('type', [
  cargoDeliveredObjectiveSchema,
  networkLengthObjectiveSchema,
  profitObjectiveSchema,
  stationBuiltObjectiveSchema,
  companyValueObjectiveSchema,
  townGrowthObjectiveSchema,
])

const conditionSchema: z.ZodType<Types.Condition> = z.object({
  type: z.string(),
  threshold: nonNegativeNumber.optional(),
  target: optionalString,
  comment: commentField,
})

const campaignScenarioOverridesSchema: z.ZodType<Types.CampaignScenarioOverrides> = z.object({
  shared: sharedInfrastructureSchema.optional(),
  result: rewardSetSchema.optional(),
  constraints: constraintsSchema.optional(),
  comment: commentField,
})

const campaignScenarioSchema: z.ZodType<Types.CampaignScenario> = z.object({
  include: scenarioRefSchema,
  order: nonNegativeNumber.optional(),
  required: optionalBoolean,
  branch: optionalString,
  condition: conditionSchema.optional(),
  overrides: campaignScenarioOverridesSchema.optional(),
  comment: commentField,
})

const campaignBranchSchema: z.ZodType<Types.CampaignBranch> = z.object({
  name: z.string(),
  description: optionalString,
  unlock_condition: conditionSchema.optional(),
  scenarios: z.array(campaignScenarioSchema),
  comment: commentField,
})

const campaignProgressionRequirementSchema: z.ZodType<Types.CampaignProgressionRequirement> = z.object({
  scenario: scenarioRefSchema,
  completion_threshold: z.number(),
  unlocks: optionalString,
  comment: commentField,
})

const campaignProgressionSchema: z.ZodType<Types.CampaignProgression> = z.object({
  type: z.enum(['linear', 'branching'] as const),
  unlock_requirements: z.array(campaignProgressionRequirementSchema).optional(),
  unlock_order: optionalStringArray,
  comment: commentField,
})

const campaignMilestoneSchema: z.ZodType<Types.CampaignMilestone> = z.object({
  name: z.string(),
  description: z.string(),
  reward: rewardSetSchema,
  condition: conditionSchema.optional(),
  comment: commentField,
})

const scalingFactorSchema: z.ZodType<Types.ScalingFactor> = z.object({
  factor: z.string(),
  adjustment: z.number(),
})

const difficultyScalingAdaptationSchema: z.ZodType<Types.DifficultyScalingAdaptation> = z.object({
  enabled: z.boolean(),
  adjustment_rate: z.number(),
  max_adjustment: z.number(),
  comment: commentField,
})

const difficultyScalingSchema: z.ZodType<Types.DifficultyScaling> = z.object({
  enabled: z.boolean(),
  base_difficulty: z.string(),
  scaling_factors: z.array(scalingFactorSchema).optional(),
  adaptive: difficultyScalingAdaptationSchema.optional(),
  comment: z.string().optional(),
})

const rewardsSchema: z.ZodType<Types.Rewards> = z.object({
  completion: rewardSetSchema.optional(),
  milestones: z.array(campaignMilestoneSchema).optional(),
  scaling: difficultyScalingSchema.optional(),
  comment: z.string().optional(),
})

const campaignSettingsSchema: z.ZodType<Types.CampaignSettings> = z.object({
  economy: z.string().optional(),
  disasters: z.boolean().optional(),
  breakdowns: z.boolean().optional(),
  inflation: z.boolean().optional(),
  seasons: z.boolean().optional(),
  comment: z.string().optional(),
})

const goalTypeSchema = z.enum(['player', 'company', 'scenario', 'campaign'] as const)

const goalOverridesSchema: z.ZodType<Types.GoalOverrides> = z.object({
  shared: sharedInfrastructureSchema.optional(),
  result: rewardSetSchema.optional(),
  constraints: constraintsSchema.optional(),
  comment: commentField,
})

const scenarioGoalSchema: z.ZodType<Types.ScenarioGoal> = z.object({
  include: goalRefSchema,
  order: z.number().optional(),
  required: z.boolean().optional(),
  branch: z.string().optional(),
  condition: conditionSchema.optional(),
  overrides: goalOverridesSchema.optional(),
  comment: z.string().optional(),
})

const scenarioDefaultsSchema: z.ZodType<Types.ScenarioDefaults> = z.object({
  shared: sharedInfrastructureSchema.optional(),
  result: rewardSetSchema.optional(),
  constraints: constraintsSchema.optional(),
  comment: z.string().optional(),
})

const packageStructureSchema: z.ZodType<Types.PackageStructure> = z.object({
  goalPath: z.string(),
  scenarioPath: z.string(),
  campaignPath: z.string(),
  comment: z.string().optional(),
})

// Main entity schemas - using EntityValue types for form validation
const goalSchemaBase: z.ZodType<Types.GoalValue> = z.object({
  name: z.string(),
  comment: z.string().optional(),
  meta: metaInfoSchema,
  type: goalTypeSchema.optional(),
  objective: objectiveSchema.optional(),
  constraints: constraintsSchema.optional(),
  shared: sharedInfrastructureSchema.optional(),
  result: rewardSetSchema.optional(),
})

const scenarioSchemaBase: z.ZodType<Types.ScenarioValue> = z.object({
  name: z.string(),
  comment: z.string().optional(),
  meta: metaInfoSchema,
  goals: z.array(scenarioGoalSchema),
  constraints: constraintsSchema.optional(),
  defaults: scenarioDefaultsSchema.optional(),
  settings: campaignSettingsSchema.optional(),
})

const campaignSchemaBase: z.ZodType<Types.CampaignValue> = z.object({
  name: z.string(),
  comment: z.string().optional(),
  meta: metaInfoSchema,
  scenarios: z.array(campaignScenarioSchema),
  branches: campaignBranchSchema.optional(),
  progression: campaignProgressionSchema.optional(),
  constraints: constraintsSchema.optional(),
  rewards: rewardsSchema.optional(),
  settings: campaignSettingsSchema.optional(),
})

const campaignManifestSchemaBase: z.ZodType<Types.ManifestValue> = z.object({
  name: z.string(),
  comment: z.string().optional(),
  meta: metaInfoSchema,
  tags: z.array(z.string()),
  structure: packageStructureSchema,
  main_campaign: z.string().optional(),
  dependencies: z.object({
    coopetition_version: z.string(),
  }),
  contents: z.object({
    goals: z.array(
      z.object({
        filename: z.string(),
        entity: goalRefSchema,
      }),
    ),
    scenarios: z.array(
      z.object({
        filename: z.string(),
        entity: scenarioRefSchema,
      }),
    ),
    campaigns: z.array(
      z.object({
        filename: z.string(),
        entity: campaignRefSchema,
      }),
    ),
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
