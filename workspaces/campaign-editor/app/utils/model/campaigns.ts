import defu from 'defu'
import type { Campaign, EntityOptions, ModelOptions, CampaignFormData } from '~/types'

export const campaignTemplate = {
  defaults: {
    meta: {
      tags: [],
    },
    scenarios: [],
    constraints: {},
  },
  newItem: {
    comment: 'New campaign created with the editor',
    scenarios: [],
    constraints: {
      players: { min: 1, max: 8 },
      date: { min: 1950, max: 2050 },
    },
    meta: {
      description: 'A new campaign created with the editor',
      difficulty: 'medium' as const,
      tags: [],
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

export function campaignToFormData(campaign: Campaign): CampaignFormData {
  const { __id, __type, ...value } = campaign
  return {
    ...value,
    id: __id,
  }
}
