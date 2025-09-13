import type { Campaign, Goal, Scenario, Manifest } from '~/types'

export function createMockCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: 'test-campaign',
    name: 'Test Campaign',
    description: 'A test campaign',
    scenarios: [],
    goals: [],
    __type: 'Campaign',
    __meta: {
      filename: 'test-campaign.yaml',
      created: Date.now(),
      modified: Date.now(),
    },
    ...overrides,
  }
}

export function createMockGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: 'test-goal',
    name: 'Test Goal',
    description: 'A test goal',
    type: 'company_efficiency',
    __type: 'Goal',
    __meta: {
      filename: 'test-goal.yaml',
      created: Date.now(),
      modified: Date.now(),
    },
    ...overrides,
  }
}

export function createMockScenario(overrides: Partial<Scenario> = {}): Scenario {
  return {
    id: 'test-scenario',
    name: 'Test Scenario',
    description: 'A test scenario',
    __type: 'Scenario',
    __meta: {
      filename: 'test-scenario.yaml',
      created: Date.now(),
      modified: Date.now(),
    },
    ...overrides,
  }
}

export function createMockManifest(overrides: Partial<Manifest> = {}): Manifest {
  return {
    id: 'test-manifest',
    name: 'Test Manifest',
    description: 'A test manifest',
    contents: {
      Campaign: [],
      Goal: [],
      Scenario: []
    },
    __type: 'Manifest',
    __meta: {
      filename: 'manifest.yaml',
      created: Date.now(),
      modified: Date.now(),
    },
    ...overrides,
  }
}

export function createMockFileSystemStore(): Array<[string, any]> {
  return [
    ['campaigns/test-campaign.yaml', createMockCampaign()],
    ['goals/test-goal.yaml', createMockGoal()],
    ['scenarios/test-scenario.yaml', createMockScenario()],
    ['manifest.yaml', createMockManifest()],
  ]
}