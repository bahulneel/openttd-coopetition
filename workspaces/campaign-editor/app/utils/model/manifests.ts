import defu from 'defu'
import type { PackageManifest, EntityOptions, ModelOptions } from '~/types'

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
} satisfies EntityOptions<PackageManifest>

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
  } satisfies EntityOptions<PackageManifest>,
}

export function createManifest(name: string, data: EntityOptions<PackageManifest> = {}): PackageManifest {
  return {
    __id: useIdentifier('manifest'),
    __type: 'Manifest',
    name,
    ...defu(manifestTemplate.defaults, data),
  }
}

export function isManifest(value: unknown): value is PackageManifest {
  return isEntityType(value, 'Manifest')
}

export function asManifest<T extends ModelOptions<PackageManifest>>(value: T): PackageManifest {
  return asEntity('Manifest', defu(manifestTemplate.defaults, value))
}
