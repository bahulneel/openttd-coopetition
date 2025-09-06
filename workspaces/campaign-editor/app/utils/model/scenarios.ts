import defu from 'defu'
import type { Scenario, EntityOptions, ModelOptions } from '~/types'

export const scenarioTemplate = {
  defaults: {
    meta: {},
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
