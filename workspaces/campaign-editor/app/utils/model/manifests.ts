import defu from 'defu'
import type { Manifest, EntityOptions, ModelOptions } from '~/types'

import { isEntityType } from '../entities'

const defaults = {
  tags: [],
  structure: {
    goals: 'goals/',
    scenarios: 'scenarios/',
    campaigns: 'campaigns/',
  },
  meta: {},
  dependencies: {
    coopetition_version: '1.0.0',
  },
} satisfies EntityOptions<Manifest>

export const manifestTemplate = {
  defaults,
  newItem: {
    name: 'New Campaign Pack',
    ...defaults,
    meta: {
      description: 'A new campaign pack created with the editor',
      author: 'Unknown',
    },
    main_campaign: 'main',
    install: {
      copy_to: 'campaigns/',
      requires: [],
    },
  } satisfies EntityOptions<Manifest>,
}

export function createManifest(name: string, data: EntityOptions<Manifest> = {}): Manifest {
  return {
    __id: useIdentifier('manifest'),
    __type: 'Manifest',
    name,
    ...defu(manifestTemplate.defaults, data),
  }
}

export function isManifest(value: unknown): value is Manifest {
  return isEntityType(value, 'Manifest')
}

export function asManifest<T extends ModelOptions<Manifest>>(value: T): Manifest {
  return asEntity('Manifest', defu(manifestTemplate.defaults, value))
}
