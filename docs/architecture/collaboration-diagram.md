# Campaign Editor Architecture - Collaboration Diagram

## Current Architecture (Mixed Responsibilities)

```
┌─────────────────────────────────────────────────────────────┐
│                    Campaign Store                           │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │   Persistence   │ │ Object Factory  │ │  Form State     │ │
│  │   - loadAll()   │ │ - createEmpty() │ │ - form binding  │ │
│  │   - save()      │ │ - duplicate()   │ │ - validation    │ │
│  │   - delete()    │ │ - ID generation │ │ - UI defaults   │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │   Vue Components    │
                    │  - scenarios/new    │
                    │  - goals/new        │
                    │  - campaigns/new    │
                    └─────────────────────┘
```

## Proposed Architecture (Separated Concerns)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              UI Layer                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ Scenario Form   │  │   Goal Form     │  │ Campaign Form   │             │
│  │ Component       │  │   Component     │  │   Component     │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│           │                     │                     │                    │
│           ▼                     ▼                     ▼                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │useScenarioForm()│  │  useGoalForm()  │  │useCampaignForm()│             │
│  │ Composable      │  │   Composable    │  │   Composable    │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Domain Layer                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ScenarioFactory  │  │   GoalFactory   │  │CampaignFactory  │             │
│  │- createEmpty()  │  │ - createEmpty() │  │ - createEmpty() │             │
│  │- duplicate()    │  │ - duplicate()   │  │ - duplicate()   │             │
│  │- validate()     │  │ - validate()    │  │ - validate()    │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Data Layer                                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ Campaign Data   │  │  Persistence    │  │  File System    │             │
│  │ Store           │  │  Service        │  │  Adapter        │             │
│  │- campaigns[]    │  │- loadCampaigns()│  │- BackendFS      │
│  │- goals[]        │  │- saveCampaign() │  │- InMemFS        │
│  │- scenarios[]    │  │- deleteCampaign │  │- LocalFS        │
│  │- add/update/    │  │- loadGoals()    │  │                 │
│  │  remove()       │  │- saveGoal()     │  │                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Example: Creating a New Scenario

```
1. User clicks "Create Scenario" button
   │
   ▼
2. Scenario Form Component loads
   │
   ▼
3. useScenarioForm() composable initializes
   │
   ▼
4. ScenarioFactory.createEmpty() called
   │
   ▼
5. Form state populated with empty scenario object
   │
   ▼
6. User fills out form (reactive updates)
   │
   ▼
7. User clicks "Save"
   │
   ▼
8. useScenarioForm().save() called
   │
   ▼
9. ScenarioFactory.validate() called
   │
   ▼
10. PersistenceService.saveScenario() called
    │
    ▼
11. FileSystemAdapter writes to storage
    │
    ▼
12. CampaignDataStore.addCampaign() called
    │
    ▼
13. UI updates with new scenario in list
```

## Key Interactions

### Form Composable → Factory
```typescript
// useScenarioForm.ts
const form = ref<Scenario>(ScenarioFactory.createEmpty())
const isValid = computed(() => ScenarioFactory.validate(form.value))
```

### Form Composable → Persistence Service
```typescript
// useScenarioForm.ts
const save = async () => {
  const persistenceService = new PersistenceService(useFileSystem())
  await persistenceService.saveScenario(form.value)
  campaignDataStore.addCampaign(form.value)
}
```

### Persistence Service → Data Store
```typescript
// persistence-service.ts
async saveScenario(scenario: Scenario) {
  await this.fileSystem.saveScenario(scenario)
  this.campaignDataStore.addCampaign(scenario) // Update reactive state
}
```

### Data Store → UI Components
```typescript
// scenarios/index.vue
const { scenarios, loading } = useCampaignDataStore()
// scenarios is reactive and updates UI automatically
```

## Benefits of This Architecture

1. **Single Responsibility**: Each layer has one clear purpose
2. **Loose Coupling**: Changes in one layer don't affect others
3. **Testability**: Each layer can be tested independently
4. **Reusability**: Factories can be used outside of forms
5. **Maintainability**: Clear separation of concerns
6. **Flexibility**: Can swap implementations (e.g., different file systems)
