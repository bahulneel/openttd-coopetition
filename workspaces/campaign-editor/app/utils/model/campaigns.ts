import defu from 'defu'
import type { Campaign, EntityOptions, ModelOptions } from '~/types'

export const campaignTemplate = {
  defaults: {
    meta: {
      tags: [],
    },
    scenarios: [],
    constraints: {},
    settings: {},
  },
  newItem: {
    comment: 'New campaign created with the editor',
    scenarios: [],
    constraints: {
      players: { min: 1, max: 8 },
      date: { min: 1950, max: 2050 },
    },
    settings: {
      economy: 'normal',
      disasters: false,
      breakdowns: false,
      inflation: false,
      seasons: false,
    },
    meta: {
      description: 'A new campaign created with the editor',
      difficulty: 'medium' as const,
      tags: [],
    },
  } satisfies EntityOptions<Campaign>,
  linear: {
    comment: 'Sequential scenarios with clear progression',
    scenarios: [],
    progression: {
      type: 'linear' as const,
      unlock_requirements: [],
      unlock_order: ['basic_construction', 'advanced_vehicles', 'complex_networks'],
    },
    constraints: {
      players: { min: 2, max: 8 },
      date: { min: 1950, max: 2000 },
      map_size: { min: 256, max: 1024 },
      difficulty: { min: 1, max: 5 },
    },
    rewards: {
      completion: {
        cash: 10000000,
        score: 1000,
        reputation: 100,
        unlocks: ['campaign_master'],
      },
      milestones: [
        {
          name: 'First Steps',
          description: 'Complete your first scenario',
          reward: {
            cash: 1000000,
            score: 100,
            reputation: 10,
          },
        },
      ],
    },
    settings: {
      economy: 'realistic',
      disasters: true,
      breakdowns: true,
      inflation: true,
      seasons: true,
    },
  } satisfies EntityOptions<Campaign>,
  branching: {
    comment: 'Multiple paths with different scenarios',
    scenarios: [],
    branches: {
      name: 'Main Branch',
      description: 'Primary campaign path',
      scenarios: [],
    },
    progression: {
      type: 'branching' as const,
      unlock_requirements: [],
      unlock_order: ['path_choice', 'advanced_techniques'],
    },
    constraints: {
      players: { min: 1, max: 6 },
      date: { min: 1950, max: 2050 },
      map_size: { min: 128, max: 2048 },
    },
    rewards: {
      completion: {
        cash: 5000000,
        score: 500,
        reputation: 50,
        unlocks: ['branch_master'],
      },
    },
    settings: {
      economy: 'normal',
      disasters: false,
      breakdowns: true,
      inflation: false,
    },
  } satisfies EntityOptions<Campaign>,
  tutorial: {
    comment: 'Learning-focused campaign with guided progression',
    scenarios: [],
    progression: {
      type: 'linear' as const,
      unlock_requirements: [],
      unlock_order: ['basic_controls', 'construction', 'management', 'advanced'],
    },
    constraints: {
      players: { min: 1, max: 4 },
      date: { min: 1950, max: 1970 },
      map_size: { min: 64, max: 256 },
      difficulty: { min: 1, max: 3 },
    },
    rewards: {
      completion: {
        cash: 1000000,
        score: 100,
        reputation: 25,
        unlocks: ['tutorial_complete'],
      },
      milestones: [
        {
          name: 'First Station',
          description: 'Build your first station',
          reward: {
            cash: 10000,
            score: 5,
            reputation: 1,
          },
        },
        {
          name: 'First Route',
          description: 'Create your first transport route',
          reward: {
            cash: 25000,
            score: 10,
            reputation: 2,
          },
        },
      ],
    },
    settings: {
      economy: 'normal',
      disasters: false,
      breakdowns: false,
      inflation: false,
    },
  } satisfies EntityOptions<Campaign>,
}

export function createCampaign(name: string, data: EntityOptions<Campaign> = {}): Campaign {
  return {
    __id: useIdentifier('campaign'),
    __type: 'Campaign',
    name,
    ...defu(campaignTemplate.defaults, data),
  }
}

export function isCampaign(value: unknown): value is Campaign {
  return isEntityType(value, 'Campaign')
}

export function asCampaign<T extends ModelOptions<Campaign>>(value: T): Campaign {
  return asEntity('Campaign', defu(campaignTemplate.defaults, value))
}

export const campaignTemplatePieces = {
  defaults: {
    name: 'Basic Campaign',
    description: 'Minimal campaign with just required fields',
    category: 'basic',
    icon: '📝',
    data: campaignTemplate.defaults,
  },
  linear: {
    name: 'Linear Progression Campaign',
    description: 'Sequential scenarios with clear progression',
    category: 'progression',
    icon: '📈',
    data: campaignTemplate.linear,
  },
  branching: {
    name: 'Branching Campaign',
    description: 'Multiple paths with different scenarios',
    category: 'progression',
    icon: '🌳',
    data: campaignTemplate.branching,
  },
  tutorial: {
    name: 'Tutorial Campaign',
    description: 'Learning-focused campaign with guided progression',
    category: 'learning',
    icon: '🎓',
    data: campaignTemplate.tutorial,
  },
} as const
