import type { Goal, Scenario, Campaign, EntityOptions } from '../types'
import { updateEntity } from './entities'

// Template pieces for Goals
export const goalTemplatePieces = {
  basic: {
    name: 'Basic Goal',
    description: 'Minimal goal with just required fields',
    data: {
      meta: {},
    } satisfies EntityOptions<Goal>,
  },
  player: {
    name: 'Player Goal',
    description: 'Goal for individual players',
    data: {
      type: 'player' as const,
      objective: {
        type: 'profit' as const,
        amount: 100000,
        comment: 'Basic profit objective',
      },
    } satisfies EntityOptions<Goal>,
  },
  constraints: {
    name: 'Player Constraints',
    description: 'Player count constraints',
    data: {
      constraints: {
        players: { min: 1, max: 8 },
      },
    } satisfies EntityOptions<Goal>,
  },
  shared: {
    name: 'Shared Infrastructure',
    description: 'Shared infrastructure settings',
    data: {
      shared: {
        track: false,
        stations: false,
        vehicles: false,
        depots: false,
      },
    } satisfies EntityOptions<Goal>,
  },
  rewards: {
    name: 'Rewards',
    description: 'Cash, score, and reputation rewards',
    data: {
      result: {
        cash: 50000,
        score: 10,
        reputation: 5,
      },
    } satisfies EntityOptions<Goal>,
  },
} as const

// Template pieces for Scenarios
export const scenarioTemplatePieces = {
  basic: {
    name: 'Basic Scenario',
    description: 'Minimal scenario with just required fields',
    data: {
      meta: {},
      goals: [],
    } satisfies EntityOptions<Scenario>,
  },
  multiplayer: {
    name: 'Multiplayer Constraints',
    description: 'Player count constraints for multiplayer',
    data: {
      constraints: {
        players: { min: 2, max: 6 },
      },
    } satisfies EntityOptions<Scenario>,
  },
  description: {
    name: 'Description & Difficulty',
    description: 'Basic description and difficulty settings',
    data: {
      meta: {
        description: 'A new scenario created with the editor',
        difficulty: 'medium' as const,
      },
    } satisfies EntityOptions<Scenario>,
  },
} as const

// Template pieces for Campaigns
export const campaignTemplatePieces = {
  basic: {
    name: 'Basic Campaign',
    description: 'Minimal campaign with just required fields',
    data: {
      meta: {
        tags: [],
      },
      scenarios: [],
      constraints: {},
      settings: {},
    } satisfies EntityOptions<Campaign>,
  },
  playerConstraints: {
    name: 'Player Constraints',
    description: 'Player count and date constraints',
    data: {
      constraints: {
        players: { min: 1, max: 8 },
        date: { min: 1950, max: 2050 },
      },
    } satisfies EntityOptions<Campaign>,
  },
  gameSettings: {
    name: 'Game Settings',
    description: 'Economy and game feature settings',
    data: {
      settings: {
        economy: 'normal',
        disasters: false,
        breakdowns: false,
        inflation: false,
        seasons: false,
      },
    } satisfies EntityOptions<Campaign>,
  },
  description: {
    name: 'Description & Difficulty',
    description: 'Basic description and difficulty settings',
    data: {
      meta: {
        description: 'A new campaign created with the editor',
        difficulty: 'medium' as const,
        tags: [],
      },
    } satisfies EntityOptions<Campaign>,
  },
} as const

// Helper function to compose template pieces
export function composeTemplate<T extends Goal | Scenario | Campaign>(
  base: EntityOptions<T>,
  selectedPieces: EntityOptions<T>[],
): EntityOptions<T> {
  return selectedPieces.reduce((acc, piece) => updateEntity(acc, piece), base)
}

// Helper function to get all available template pieces for a type
export function getTemplatePieces<T extends 'goal' | 'scenario' | 'campaign'>(
  type: T,
): T extends 'goal'
  ? typeof goalTemplatePieces
  : T extends 'scenario'
  ? typeof scenarioTemplatePieces
  : typeof campaignTemplatePieces {
  switch (type) {
    case 'goal':
      return goalTemplatePieces as any
    case 'scenario':
      return scenarioTemplatePieces as any
    case 'campaign':
      return campaignTemplatePieces as any
    default:
      throw new Error(`Unknown template type: ${type}`)
  }
}