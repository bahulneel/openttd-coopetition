import { goalTemplate } from '../utils/model/goals'
import { scenarioTemplate } from '../utils/model/scenarios'
import { campaignTemplate } from '../utils/model/campaigns'
import { updateEntity } from '../utils/entities'

export function useTemplateComposer(type: 'goal' | 'scenario' | 'campaign') {
  const selectedPieces = ref<string[]>(['defaults'])

  const templatePieces = computed(() => {
    switch (type) {
      case 'goal':
        return {
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
            data: {
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
            },
          },
          cargo: {
            name: 'Cargo Delivery Goal',
            description: 'Deliver specific cargo with time constraints',
            category: 'objective',
            icon: '🚚',
            data: {
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
            },
          },
          network: {
            name: 'Network Building Goal',
            description: 'Build network infrastructure with shared resources',
            category: 'infrastructure',
            icon: '🛤️',
            data: {
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
            },
          },
          station: {
            name: 'Station Building Goal',
            description: 'Build stations in specific locations',
            category: 'infrastructure',
            icon: '🏗️',
            data: {
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
            },
          },
          company: {
            name: 'Company Value Goal',
            description: 'Reach minimum company value target',
            category: 'objective',
            icon: '🏢',
            data: {
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
            },
          },
          town: {
            name: 'Town Growth Goal',
            description: 'Grow specific town to target population',
            category: 'objective',
            icon: '🏘️',
            data: {
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
            },
          },
        }
      case 'scenario':
        return {
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
            data: {
              goals: [],
              constraints: {
                players: { min: 2, max: 6 },
                date: { min: 1950, max: 2000 },
                map_size: { min: 256, max: 1024 },
                difficulty: { min: 'easy', max: 'hard' },
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
            },
          },
          transport: {
            name: 'Transport Challenge Scenario',
            description: 'Efficient cargo transport with time pressure',
            category: 'theme',
            icon: '🚛',
            data: {
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
            },
          },
          multiplayer: {
            name: 'Multiplayer Cooperation Scenario',
            description: 'Collaborative scenario with shared resources',
            category: 'multiplayer',
            icon: '👥',
            data: {
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
            },
          },
        }
      case 'campaign':
        return {
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
            data: {
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
                difficulty: { min: 'easy', max: 'expert' },
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
            },
          },
          branching: {
            name: 'Branching Campaign',
            description: 'Multiple paths with different scenarios',
            category: 'progression',
            icon: '🌳',
            data: {
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
            },
          },
          tutorial: {
            name: 'Tutorial Campaign',
            description: 'Learning-focused campaign with guided progression',
            category: 'learning',
            icon: '🎓',
            data: {
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
                difficulty: { min: 'easy', max: 'medium' },
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
            },
          },
        }
      default:
        return {}
    }
  })

  const availablePieces = computed(() => {
    return Object.entries(templatePieces.value).map(([key, value]) => ({
      key,
      name: value.name,
      description: value.description,
      category: value.category,
      icon: value.icon,
      data: value.data,
    }))
  })

  const selectedPiecesData = computed(() => {
    return selectedPieces.value.map(key => {
      const piece = templatePieces.value[key as keyof typeof templatePieces.value]
      return piece ? piece.data : {}
    })
  })

  const composedTemplate = computed(() => {
    const base = templatePieces.value.defaults?.data || {}
    return selectedPiecesData.value.reduce((acc, piece) => updateEntity(acc as any, piece), base)
  })

  function updateSelectedPieces(pieces: string[]) {
    // Always keep 'defaults' selected
    const newPieces = pieces.includes('defaults') ? pieces : ['defaults', ...pieces]
    selectedPieces.value = newPieces
  }

  function togglePiece(key: string) {
    if (key === 'defaults') return // Can't deselect defaults

    if (selectedPieces.value.includes(key)) {
      selectedPieces.value = selectedPieces.value.filter(k => k !== key)
    } else {
      selectedPieces.value = [...selectedPieces.value, key]
    }
  }

  function clearAll() {
    selectedPieces.value = ['defaults']
  }

  function selectAll() {
    selectedPieces.value = Object.keys(templatePieces.value)
  }

  function reset() {
    selectedPieces.value = ['defaults']
  }

  return {
    selectedPieces,
    templatePieces,
    availablePieces,
    selectedPiecesData,
    composedTemplate,
    updateSelectedPieces,
    togglePiece,
    clearAll,
    selectAll,
    reset,
  }
}