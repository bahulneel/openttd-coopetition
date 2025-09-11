import defu from 'defu'
import type { Goal, EntityOptions, GoalType, ModelOptions } from '~/types'

export const goalTypes: GoalType[] = ['player', 'company', 'scenario', 'campaign'] as const

export const goalTemplate = {
  defaults: {
    meta: {},
  },
  newItem: {
    comment: 'New goal created with the editor',
    type: 'player' as const,
    objective: {
      type: 'profit' as const,
      amount: 100000,
      comment: 'Basic profit objective',
    },
    constraints: {
      players: { min: 1, max: 8 },
    },
    shared: {
      track: false,
      stations: false,
      vehicles: false,
      depots: false,
    },
    result: {
      cash: 50000,
      score: 10,
      reputation: 5,
    },
    meta: {
      description: 'A new goal created with the editor',
      difficulty: 'medium' as const,
    },
  } satisfies EntityOptions<Goal>,
  profit: {
    comment: 'Track company profit with cash rewards',
    type: 'player' as const,
    objective: {
      type: 'profit' as const,
      amount: 1000000,
      comment: 'Track company profit - requires £1M total profit',
    },
    constraints: {
      players: { min: 1, max: 8 },
    },
    result: {
      cash: 500000,
      score: 25,
      reputation: 10,
    },
  } satisfies EntityOptions<Goal>,
  cargo: {
    comment: 'Deliver specific cargo with time constraints',
    type: 'company' as const,
    objective: {
      type: 'cargo_delivered' as const,
      cargo: 'PASSENGERS',
      amount: 1000,
      time_limit: 365,
      comment: 'Deliver 1000 passengers within 365 days',
    },
    constraints: {
      players: { min: 2, max: 4 },
      date: { min: 1950, max: 2000 },
    },
    shared: {
      track: true,
      stations: true,
      vehicles: false,
    },
    result: {
      cash: 200000,
      score: 15,
      reputation: 5,
      unlocks: ['high_speed_trains'],
    },
  } satisfies EntityOptions<Goal>,
  network: {
    comment: 'Build network infrastructure with shared resources',
    type: 'scenario' as const,
    objective: {
      type: 'network_length' as const,
      amount: 5000,
      track_type: 'RAIL',
      comment: 'Build 5000 tiles of rail network',
    },
    constraints: {
      players: { min: 2, max: 6 },
      map_size: { min: 256, max: 1024 },
    },
    shared: {
      track: true,
      stations: true,
      vehicles: true,
      depots: true,
    },
    result: {
      cash: 1000000,
      score: 50,
      reputation: 20,
      unlocks: ['advanced_networks'],
    },
  } satisfies EntityOptions<Goal>,
  station: {
    comment: 'Build stations in specific locations',
    type: 'player' as const,
    objective: {
      type: 'station_built' as const,
      count: 10,
      location: 'industrial',
      comment: 'Build 10 stations in industrial areas',
    },
    constraints: {
      players: { min: 1, max: 8 },
      date: { min: 1960, max: 1980 },
    },
    result: {
      cash: 100000,
      score: 10,
      reputation: 5,
    },
  } satisfies EntityOptions<Goal>,
  company: {
    comment: 'Reach minimum company value target',
    type: 'company' as const,
    objective: {
      type: 'company_value' as const,
      min_value: 5000000,
      comment: 'Reach £5M company value',
    },
    constraints: {
      players: { min: 1, max: 4 },
      date: { min: 1970, max: 2010 },
    },
    result: {
      cash: 2000000,
      score: 100,
      reputation: 50,
      unlocks: ['premium_vehicles'],
    },
  } satisfies EntityOptions<Goal>,
  town: {
    comment: 'Grow specific town to target population',
    type: 'scenario' as const,
    objective: {
      type: 'town_growth' as const,
      target_population: 50000,
      town_id: 'main_city',
      comment: 'Grow main city to 50,000 population',
    },
    constraints: {
      players: { min: 2, max: 6 },
      date: { min: 1950, max: 2000 },
    },
    shared: {
      track: true,
      stations: true,
      vehicles: false,
    },
    result: {
      cash: 500000,
      score: 75,
      reputation: 25,
      unlocks: ['city_services'],
    },
  } satisfies EntityOptions<Goal>,
}

export function createGoal(name: string, data: EntityOptions<Goal> = {}): Goal {
  return {
    __id: useIdentifier('goal'),
    __type: 'Goal',
    name,
    ...defu(goalTemplate.defaults, data),
  }
}

export function isGoal(value: unknown): value is Goal {
  return isEntityType(value, 'Goal')
}

export function asGoal<T extends ModelOptions<Goal>>(value: T): Goal {
  return asEntity('Goal', defu(goalTemplate.defaults, value))
}

export const goalTemplatePieces = {
  defaults: {
    name: 'Basic Goal',
    description: 'Minimal goal with just required fields',
    category: 'basic',
    icon: '📝',
    data: goalTemplate.defaults,
  },
  profit: {
    name: 'Profit Goal',
    description: 'Track company profit with cash rewards',
    category: 'objective',
    icon: '💰',
    data: goalTemplate.profit,
  },
  cargo: {
    name: 'Cargo Delivery Goal',
    description: 'Deliver specific cargo with time constraints',
    category: 'objective',
    icon: '🚚',
    data: goalTemplate.cargo,
  },
  network: {
    name: 'Network Building Goal',
    description: 'Build network infrastructure with shared resources',
    category: 'infrastructure',
    icon: '🛤️',
    data: goalTemplate.network,
  },
  station: {
    name: 'Station Building Goal',
    description: 'Build stations in specific locations',
    category: 'infrastructure',
    icon: '🏗️',
    data: goalTemplate.station,
  },
  company: {
    name: 'Company Value Goal',
    description: 'Reach minimum company value target',
    category: 'objective',
    icon: '🏢',
    data: goalTemplate.company,
  },
  town: {
    name: 'Town Growth Goal',
    description: 'Grow specific town to target population',
    category: 'objective',
    icon: '🏘️',
    data: goalTemplate.town,
  },
} as const
