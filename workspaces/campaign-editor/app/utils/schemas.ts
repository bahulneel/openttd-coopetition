import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

// Base schemas
const baseItemSchema = z.object({
  id: z.string().min(1, 'ID is required').regex(/^[a-zA-Z0-9_-]+$/, 'ID can only contain letters, numbers, underscores, and hyphens'),
  comment: z.string().optional()
})

const metaInfoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert', 'legendary']).optional(),
  estimated_time: z.string().optional(),
  tags: z.array(z.string()).default([]).readonly(),
  requirements: z.array(z.string()).default([]).readonly(),
  prerequisites: z.array(z.string()).default([]).readonly(),
  comment: z.string().optional()
}).default({})

const constraintsSchema = z.object({
  players: z.object({
    min: z.number().min(1, 'Minimum players must be at least 1').max(8, 'Maximum players cannot exceed 8').optional(),
    max: z.number().min(1, 'Minimum players must be at least 1').max(8, 'Maximum players cannot exceed 8').optional()
  }).default({}),
  date: z.object({
    min: z.number().min(1920, 'Start year must be 1920 or later').max(2100, 'Start year cannot exceed 2100').optional(),
    max: z.number().min(1920, 'End year must be 1920 or later').max(2100, 'End year cannot exceed 2100').optional()
  }).default({}),
  map_size: z.object({
    min: z.number().min(64, 'Minimum map size must be at least 64').max(2048, 'Maximum map size cannot exceed 2048').optional(),
    max: z.number().min(64, 'Minimum map size must be at least 64').max(2048, 'Maximum map size cannot exceed 2048').optional()
  }).default({}),
  difficulty: z.object({
    min: z.string().optional(),
    max: z.string().optional()
  }).default({}),
  comment: z.string().optional()
}).default({})

const sharedInfrastructureSchema = z.object({
  track: z.boolean().default(false),
  stations: z.boolean().default(false),
  vehicles: z.boolean().default(false),
  depots: z.boolean().default(false),
  comment: z.string().optional()
}).default({})

const rewardSetSchema = z.object({
  cash: z.number().min(0, 'Cash reward cannot be negative').optional(),
  score: z.number().min(0, 'Score points cannot be negative').optional(),
  reputation: z.number().min(0, 'Reputation cannot be negative').optional(),
  unlock: z.string().optional(),
  achievement: z.string().optional(),
  bonus: z.object({
    type: z.enum(['multiplier', 'percentage']),
    amount: z.number().min(0, 'Bonus amount cannot be negative'),
    target: z.string().min(1, 'Bonus target is required')
  }).optional()
}).default({})

const rewardsSchema = z.object({
  completion: rewardSetSchema,
  partial: rewardSetSchema.optional(),
  comment: z.string().optional()
}).default({})

const objectiveSchema = z.object({
  type: z.enum(['cargo_delivered', 'network_length', 'profit', 'station_built', 'company_value', 'town_growth']),
  amount: z.number().min(0, 'Amount must be non-negative').optional(),
  cargo: z.string().optional(),
  cargo_types: z.array(z.string()).default([]).readonly(),
  time_limit: z.number().min(0, 'Time limit must be non-negative').optional(),
  track_type: z.string().optional(),
  target: z.string().optional(),
  min_value: z.number().min(0, 'Minimum value must be non-negative').optional(),
  town_id: z.string().optional(),
  target_population: z.number().min(0, 'Target population must be non-negative').optional(),
  location: z.string().optional(),
  count: z.number().min(0, 'Count must be non-negative').optional(),
  comment: z.string().optional()
})

// Goal schema
const goalSchemaBase = baseItemSchema.extend({
  type: z.enum(['player', 'company', 'scenario', 'campaign']).optional(),
  objective: objectiveSchema,
  constraints: constraintsSchema.optional(),
  shared: sharedInfrastructureSchema.optional(),
  result: rewardSetSchema.optional(),
  meta: metaInfoSchema.optional()
})

export const goalSchema = toTypedSchema(goalSchemaBase)

// Scenario schema
const scenarioGoalSchema = z.object({
  include: z.string().min(1, 'Scenario ID is required'),
  order: z.number().min(1, 'Order must be at least 1').optional(),
  required: z.boolean().default(true),
  branch: z.string().optional(),
  condition: z.object({
    type: z.string(),
    threshold: z.number().optional(),
    target: z.string().optional()
  }).optional(),
  overrides: z.object({
    objective: objectiveSchema.optional(),
    constraints: constraintsSchema.optional(),
    result: rewardSetSchema.optional()
  }).optional(),
  comment: z.string().optional()
})

const scenarioSettingsSchema = z.object({
  economy: z.string().optional(),
  disasters: z.boolean().default(false),
  breakdowns: z.boolean().default(false),
  inflation: z.boolean().default(false),
  seasons: z.boolean().default(false),
  comment: z.string().optional()
}).default({})

const scenarioSchemaBase = baseItemSchema.extend({
  defaults: z.object({
    shared: sharedInfrastructureSchema.optional(),
    result: rewardSetSchema.optional(),
    constraints: constraintsSchema.optional(),
    comment: z.string().optional()
  }).optional(),
  goals: z.array(scenarioGoalSchema).default([]).readonly(),
  constraints: constraintsSchema.optional(),
  meta: metaInfoSchema.optional(),
  settings: scenarioSettingsSchema.optional(),
  rewards: rewardsSchema.optional(),
  objectives: z.object({
    primary: z.array(z.string()).default([]).readonly(),
    secondary: z.array(z.string()).default([]).readonly(),
    comment: z.string().optional()
  }).optional(),
  dependencies: z.array(z.object({
    goal: z.string(),
    required_by: z.string(),
    comment: z.string().optional()
  })).default([]),
  conditional_rewards: z.array(z.object({
    condition: z.object({
      type: z.string(),
      threshold: z.number(),
    }),
    reward: rewardSetSchema,
    comment: z.string().optional()
  })).default([]),
  progression: z.object({
    unlock_order: z.array(z.string()).default([]).readonly(),
    milestone_rewards: z.array(z.object({
      milestone: z.string(),
      reward: z.string()
    })).default([]),
    comment: z.string().optional()
  }).optional()
})

export const scenarioSchema = toTypedSchema(scenarioSchemaBase)

// Campaign schema
const campaignScenarioSchema = z.object({
  include: z.string().min(1, 'Scenario ID is required'),
  order: z.number().min(1, 'Order must be at least 1'),
  required: z.boolean().default(true),
  branch: z.string().optional(),
  condition: z.object({
    type: z.string(),
    threshold: z.number().optional(),
    target: z.string().optional()
  }).optional(),
  comment: z.string().optional()
})

const campaignSettingsSchema = z.object({
  economy: z.string().optional(),
  disasters: z.boolean().default(false),
  breakdowns: z.boolean().default(false),
  inflation: z.boolean().default(false),
  seasons: z.boolean().default(false),
  comment: z.string().optional()
}).default({})

const campaignSchemaBase = baseItemSchema.extend({
  scenarios: z.array(campaignScenarioSchema).default([]).readonly(),
  branches: z.record(z.array(z.string())).optional(),
  progression: z.object({
    type: z.enum(['linear', 'branching']),
    unlock_requirements: z.array(z.object({
      scenario: z.string(),
      completion_threshold: z.number().min(0).max(100),
      unlocks: z.string().optional(),
      comment: z.string().optional()
    })).default([]),
    unlock_order: z.array(z.string()).default([]).readonly(),
    comment: z.string().optional()
  }).optional(),
  constraints: constraintsSchema.optional(),
  rewards: rewardsSchema.optional(),
  meta: metaInfoSchema.optional(),
  settings: campaignSettingsSchema.optional(),
  features: z.array(z.string()).default([]).readonly(),
  milestones: z.array(z.object({
    name: z.string().min(1, 'Milestone name is required'),
    description: z.string().min(1, 'Milestone description is required'),
    reward: rewardSetSchema,
    condition: z.object({
      type: z.string(),
      threshold: z.number().optional(),
      scenario: z.string().optional()
    }).optional()
  })).default([]),
  difficulty_scaling: z.object({
    enabled: z.boolean().default(false),
    base_difficulty: z.string(),
    scaling_factors: z.array(z.object({
      factor: z.string(),
      adjustment: z.number()
    })).default([]),
    adaptive: z.object({
      enabled: z.boolean().default(false),
      adjustment_rate: z.number().min(0).max(1),
      max_adjustment: z.number().min(0)
    }).optional(),
    comment: z.string().optional()
  }).optional(),
  // Editor-specific properties
  lastModified: z.number().optional(),
  modified: z.boolean().default(false),
  filePath: z.string().optional()
})

export const campaignSchema = toTypedSchema(campaignSchemaBase)

// Campaign Manifest schema
const campaignManifestSchemaBase = z.object({
  name: z.string().min(1, 'Manifest name is required'),
  version: z.string().min(1, 'Version is required').regex(/^\d+\.\d+\.\d+$/, 'Version must be in format x.y.z'),
  description: z.string().min(1, 'Description is required'),
  author: z.string().min(1, 'Author is required'),
  tags: z.array(z.string()).default([]).readonly(),
  structure: z.object({
    goals: z.string().min(1, 'Goals path is required'),
    scenarios: z.string().min(1, 'Scenarios path is required'),
    campaigns: z.string().min(1, 'Campaigns path is required')
  }),
  main_campaign: z.string().min(1, 'Main campaign is required'),
  dependencies: z.object({
    coopetition_version: z.string().min(1, 'Coopetition version is required')
  }),
  install: z.object({
    copy_to: z.string().min(1, 'Install path is required'),
    requires: z.array(z.string()).default([]).readonly()
  }),
  created: z.string().min(1, 'Created date is required'),
  updated: z.string().min(1, 'Updated date is required')
})

export const campaignManifestSchema = toTypedSchema(campaignManifestSchemaBase)

// Export all schemas as a collection
export const schemas = {
  goal: goalSchemaBase,
  scenario: scenarioSchemaBase,
  campaign: campaignSchemaBase,
  campaignManifest: campaignManifestSchemaBase
} as const

// Type exports for use in components
export type GoalFormData = z.infer<typeof goalSchemaBase>
export type ScenarioFormData = z.infer<typeof scenarioSchemaBase>
export type CampaignFormData = z.infer<typeof campaignSchemaBase>
export type CampaignManifestFormData = z.infer<typeof campaignManifestSchemaBase>
