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
