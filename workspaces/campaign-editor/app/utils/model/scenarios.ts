import defu from 'defu'
import type { Scenario, EntityOptions, ModelOptions } from '~/types'

export const scenarioTemplate = {
  defaults: {
    meta: {},
    goals: [],
  },
  newItem: {
    comment: 'New scenario created with the editor',
    goals: [],
    constraints: {
      players: { min: 2, max: 6 },
    },
    meta: {
      description: 'A new scenario created with the editor',
      difficulty: 'medium' as const,
    },
  } satisfies EntityOptions<Scenario>,
  industrial: {
    comment: 'Develop industrial areas with shared infrastructure',
    goals: [],
    constraints: {
      players: { min: 2, max: 6 },
      date: { min: 1950, max: 2000 },
      map_size: { min: 256, max: 1024 },
      difficulty: { min: 1, max: 4 },
    },
    defaults: {
      shared: {
        track: true,
        stations: true,
        vehicles: false,
      },
      result: {
        cash: 50000,
        score: 5,
        reputation: 2,
      },
    },
    settings: {
      economy: 'realistic',
      disasters: true,
      breakdowns: true,
      inflation: true,
    },
  } satisfies EntityOptions<Scenario>,
  transport: {
    comment: 'Efficient cargo transport with time pressure',
    goals: [],
    constraints: {
      players: { min: 2, max: 4 },
      date: { min: 1960, max: 1980 },
      map_size: { min: 128, max: 512 },
    },
    defaults: {
      shared: {
        track: false,
        stations: false,
        vehicles: false,
      },
      result: {
        cash: 100000,
        score: 10,
        reputation: 5,
      },
    },
    settings: {
      economy: 'normal',
      disasters: false,
      breakdowns: true,
      inflation: false,
    },
  } satisfies EntityOptions<Scenario>,
  multiplayer: {
    comment: 'Collaborative scenario with shared resources',
    goals: [],
    constraints: {
      players: { min: 4, max: 8 },
      date: { min: 1950, max: 2050 },
      map_size: { min: 512, max: 2048 },
    },
    defaults: {
      shared: {
        track: true,
        stations: true,
        vehicles: true,
        depots: true,
      },
      result: {
        cash: 25000,
        score: 3,
        reputation: 1,
      },
    },
    settings: {
      economy: 'realistic',
      disasters: true,
      breakdowns: true,
      inflation: true,
      seasons: true,
    },
  } satisfies EntityOptions<Scenario>,
}

export function createScenario(name: string, data: EntityOptions<Scenario> = {}): Scenario {
  return {
    __id: useIdentifier('scenario'),
    __type: 'Scenario',
    name,
    ...defu(scenarioTemplate.defaults, data),
  }
}

export function isScenario(value: unknown): value is Scenario {
  return isEntityType(value, 'Scenario')
}

export function asScenario<T extends ModelOptions<Scenario>>(value: T): Scenario {
  return asEntity('Scenario', defu(scenarioTemplate.defaults, value))
}

export const scenarioTemplatePieces = {
  defaults: {
    name: 'Basic Scenario',
    description: 'Minimal scenario with just required fields',
    category: 'basic',
    icon: '📝',
    data: scenarioTemplate.defaults,
  },
  industrial: {
    name: 'Industrial Hub Scenario',
    description: 'Develop industrial areas with shared infrastructure',
    category: 'theme',
    icon: '🏭',
    data: scenarioTemplate.industrial,
  },
  transport: {
    name: 'Transport Challenge Scenario',
    description: 'Efficient cargo transport with time pressure',
    category: 'theme',
    icon: '🚛',
    data: scenarioTemplate.transport,
  },
  multiplayer: {
    name: 'Multiplayer Cooperation Scenario',
    description: 'Collaborative scenario with shared resources',
    category: 'multiplayer',
    icon: '👥',
    data: scenarioTemplate.multiplayer,
  },
} as const
