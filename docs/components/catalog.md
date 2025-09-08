# Component Catalog

Complete listing of all components in the Campaign Editor atomic design system.

## Component Tree

- (shadcn components)
  - **Button** - Primary action component
  - **Input** - Text input fields
  - **Textarea** - Multi-line text input
  - **Label** - Form field labels
  - **Select** - Dropdown selection
    - **Trigger** - Select button trigger
    - **Content** - Select dropdown content
    - **Item** - Individual select option
    - **Value** - Selected value display
  - **Card** - Content container
    - **Header** - Card header section
    - **Content** - Card content section
    - **Title** - Card title
    - **Description** - Card description
  - **Separator** - Visual divider
  - **Badge** - Status/type indicators
  - **Alert** - Alert messages
  - **Form** - Form component with validation
    - **Field** - Form field wrapper with validation
    - **Item** - Form item container
    - **Label** - Form label with validation
    - **Control** - Form control wrapper
    - **Message** - Validation message display
  - **DropdownMenu** - Dropdown menu system
    - **Trigger** - Menu trigger
    - **Content** - Menu content
    - **Item** - Menu item
  - **Toast** - Notification system (via vue-sonner)

- **Atom** (empty - shadcn covers everything we need)
- **Molecule**
  - **Display** - key-value information display
  - **Dashboard**
    - **Card** - dashboard statistics card component
  - **Action**
    - **Button** - action button component
    - **Link** - action link component
  - **Form**
    - **Group** - responsive grid layout for form fields
    - **Conditional** - field that shows/hides based on conditions
    - **Collection** - form collection component
- **Domain** (only components needing specialization - all support `asPartial` prop)
  - **Objective**
    - **Default**
      - **Input**
        - **Details** - default objective input
      - **Display**
        - **Summary** - default objective summary (composable)
    - **CargoDelivered**
      - **Input**
        - **Details** - cargo delivered specific input (amount, cargo, cargo_types)
      - **Display**
        - **Card** - cargo delivered display (composable)
        - **Details** - cargo delivered detailed display (composable)
        - **Item** - cargo delivered list item (composable)
        - **Summary** - cargo delivered summary (composable)
    - **NetworkLength**
      - **Input**
        - **Details** - network length specific input (amount, track_type)
      - **Display**
        - **Card** - network length display (composable)
        - **Details** - network length detailed display (composable)
        - **Item** - network length list item (composable)
        - **Summary** - network length summary (composable)
    - **Profit**
      - **Input**
        - **Details** - profit specific input (amount)
      - **Display**
        - **Card** - profit display (composable)
        - **Details** - profit detailed display (composable)
        - **Item** - profit list item (composable)
        - **Summary** - profit summary (composable)
    - **StationBuilt**
      - **Input**
        - **Details** - station built specific input (count, location)
      - **Display**
        - **Card** - station built display (composable)
        - **Details** - station built detailed display (composable)
        - **Item** - station built list item (composable)
        - **Summary** - station built summary (composable)
    - **CompanyValue**
      - **Input**
        - **Details** - company value specific input (min_value)
      - **Display**
        - **Card** - company value display (composable)
        - **Details** - company value detailed display (composable)
        - **Item** - company value list item (composable)
        - **Summary** - company value summary (composable)
    - **TownGrowth**
      - **Input**
        - **Details** - town growth specific input (target_population, town_id)
      - **Display**
        - **Card** - town growth display (composable)
        - **Details** - town growth detailed display (composable)
        - **Item** - town growth list item (composable)
        - **Summary** - town growth summary (composable)
  - **Constraints**
    - **Input**
      - **Details** - constraints input (players, date, map_size ranges)
    - **Display**
      - **Card** - constraints display (composable) ✅
      - **Details** - constraints detailed display (composable)
      - **Item** - constraints list item (composable)
      - **Summary** - constraints summary (composable)
  - **RewardSet**
    - **Input**
      - **Details** - reward set input
      - **Card** - reward set input card
      - **Item** - reward set input item
    - **Display**
      - **Summary** - reward summary (cash, score, reputation, unlocks) (composable)
      - **Card** - reward set display (composable)
      - **Details** - reward set detailed display (composable)
      - **Item** - reward set list item (composable)
  - **MetaInfo**
    - **Input**
      - **Details** - meta info input (author, description, difficulty, tags)
    - **Display**
      - **Card** - meta info display (composable) ✅
      - **Details** - meta info detailed display (composable)
      - **Item** - meta info list item (composable)
      - **Summary** - meta info summary (composable)
  - **SharedInfrastructure**
    - **Input**
      - **Details** - shared infrastructure input (track, stations, vehicles, depots)
    - **Display**
      - **Card** - shared infrastructure display (composable) ✅
      - **Details** - shared infrastructure detailed display (composable)
      - **Item** - shared infrastructure list item (composable)
      - **Summary** - shared infrastructure summary (composable)
  - **GameSettings**
    - **Input** - game settings input ✅
    - **Display**
      - **Card** - game settings display (composable) ✅
      - **Details** - game settings detailed display (composable)
      - **Item** - game settings list item (composable)
      - **Summary** - game settings summary (composable)
  - **CampaignScenario**
    - **Display**
      - **Card** - campaign scenario display (composable) ✅
      - **Details** - campaign scenario detailed display ✅
      - **Item** - campaign scenario list item ✅
      - **Summary** - campaign scenario summary
  - **ScenarioGoal**
    - **Display**
      - **Card** - scenario goal display (composable) ✅
      - **Details** - scenario goal detailed display ✅
      - **Item** - scenario goal list item ✅
      - **Summary** - scenario goal summary (composable) ✅
  - **EntityReference**
    - **Display**
      - **Card** - entity reference display (composable) ✅
  - **Metadata**
    - **Display**
      - **Card** - metadata display (composable) ✅
      - **Details** - metadata detailed display ✅
      - **Item** - metadata list item ✅
      - **Summary** - metadata summary ✅
- **Entity** (using entityType names from TypeMap - all Card components support `asPartial` prop)
  - **Goal**
    - **Input**
      - **Details** - goal detailed input (composes Domain/ components)
    - **Display**
      - **Card** - goal card display (composable) ✅
      - **Item** - goal list item display
      - **Details** - goal detailed display (uses Domain components with `as-partial`) ✅
      - **Summary** - goal summary display
      - **Badge** - goal badge display
  - **Campaign**
    - **Input**
      - **Details** - campaign detailed input (uses Domain components)
    - **Display**
      - **Card** - campaign card display (composable) ✅
      - **Item** - campaign list item display
      - **Details** - campaign detailed display
      - **Summary** - campaign summary display
  - **Scenario**
    - **Input**
      - **Details** - scenario detailed input (uses Domain components)
    - **Display**
      - **Card** - scenario card display (composable) ✅
      - **Item** - scenario list item display
      - **Details** - scenario detailed display (uses Domain components)
      - **Summary** - scenario summary display
  - **Manifest**
    - **Input**
      - **Details** - manifest detailed input
    - **Display**
      - **Details** - manifest detailed display
      - **Summary** - manifest summary display
- **Aggregate**
  - **Goals** - collection of goals (uses Template/Layout/List)
  - **Campaigns** - collection of campaigns
  - **Scenarios** - collection of scenarios
- **Template**
  - **Layout**
    - **List** - list layout
    - **Grid** - grid layout
    - **Stack** - stack layout
    - **Group**
      - **Button** - button group layout
  - **Screen**
    - **Article** - article screen layout (uses Layout/Stack)
    - **Collection** - collection screen layout (uses Layout/List)

## Composability Pattern

All Domain and Entity Card components now support the `asPartial` prop for composable usage:

### Standalone Usage (Default)

```vue
<!-- Renders complete Card with container -->
<DomainMetaInfoDisplayCard :meta-info="goal.meta" />
<EntityGoalDisplayCard :goal="goal" />
```

### Composable Usage (New)

```vue
<!-- No nested Cards - clean composition -->
<Card class="openttd-titlebar">
  <CardContent>
    <DomainMetaInfoDisplayCard :meta-info="goal.meta" as-partial />
    <DomainConstraintsDisplayCard :constraints="goal.constraints" as-partial />
  </CardContent>
</Card>
```

### Nested Composition

```vue
<!-- Domain/ScenarioGoal/Display/Card.vue -->
<WithEntity :ref="scenarioGoal.include">
  <template #default="{ value: resolvedGoal }">
    <EntityGoalDisplayCard :goal="resolvedGoal" :as-partial="asPartial" />
  </template>
</WithEntity>
```

## Component Usage Examples

### Page Composition

```vue
<!-- pages/goals/index.vue -->
<template>
  <TemplateScreenCollection>
    <AggregateGoals />
  </TemplateScreenCollection>
</template>

<!-- pages/goals/[id]/edit.vue -->
<template>
  <TemplateScreenArticle>
    <EntityGoalInputDetails />
  </TemplateScreenArticle>
</template>
```

### Entity Component Structure

```vue
<!-- Entity/Goal/Display/Card.vue (Updated with composability) -->
<template>
  <DefineContent>
    <div class="pt-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <CardTitle>{{ goal.name }}</CardTitle>
          <EntityGoalDisplayBadge :goal="goal" />

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="font-medium text-foreground">Objective:</span>
              <DomainObjectiveDefaultDisplaySummary :objective="goal.objective" />
            </div>
            <div v-if="goal.constraints">
              <span class="font-medium text-foreground">Constraints:</span>
              <DomainConstraintsDisplayCard :constraints="goal.constraints" as-partial />
            </div>
          </div>
        </div>

        <div v-if="!asPartial" class="flex items-center space-x-2">
          <!-- Action buttons only in standalone mode -->
        </div>
      </div>
    </div>
  </DefineContent>

  <!-- Standalone mode (default) -->
  <Card v-if="!asPartial" class="openttd-titlebar">
    <CardContent>
      <Content />
    </CardContent>
  </Card>

  <!-- Partial mode (for composition) -->
  <Content v-else />
</template>
```

### Domain Component Specialization

```vue
<!-- Domain/Objective/CargoDelivered/Input/Details.vue -->
<template>
  <MoleculeFormGroup>
    <FormField name="amount">
      <FormLabel>Amount</FormLabel>
      <FormControl>
        <Input type="number" />
      </FormControl>
    </FormField>
    <FormField name="cargo">
      <FormLabel>Cargo Type</FormLabel>
      <FormControl>
        <Input placeholder="e.g., COAL" />
      </FormControl>
    </FormField>
  </MoleculeFormGroup>
</template>
```

## Implementation Status

### ✅ Complete Implementations

- **Domain Card Components**: 6 components with createReusableTemplate pattern
- **Entity Card Components**: 3 components with createReusableTemplate pattern
- **Summary Components**: 4 components with asPartial prop support
- **Composability**: All Card components support both standalone and partial modes

### 📋 Missing Components (Future Opportunities)

- **Objective Display Components**: 24 components (Card, Details, Item, Summary for 6 objective types)
- **Domain Details/Item Components**: 12 components for existing domain types
- **RewardSet Input Components**: 4 components
- **Condition Components**: 8 components (complete Input/Display set)
- **Range Components**: 8 components (complete Input/Display set)

### 🎯 Benefits Achieved

- **Zero Nested Cards**: `as-partial` eliminates container conflicts
- **Backward Compatible**: All existing usage unchanged
- **Type Safe**: Full TypeScript support with proper prop flow
- **Clean Composition**: Domain components compose cleanly in Entity components
- **Single Source of Truth**: Content defined once via createReusableTemplate

## FQN Reference

| File Path                                           | FQN                                         | Purpose                        | Composable |
| --------------------------------------------------- | ------------------------------------------- | ------------------------------ | ---------- |
| `Entity/Goal/Display/Card.vue`                      | `EntityGoalDisplayCard`                     | Goal card display              | ✅         |
| `Domain/Objective/CargoDelivered/Input/Details.vue` | `DomainObjectiveCargoDeliveredInputDetails` | Cargo delivery objective input | N/A        |
| `Domain/Constraints/Display/Card.vue`               | `DomainConstraintsDisplayCard`              | Constraints display            | ✅         |
| `Domain/MetaInfo/Display/Card.vue`                  | `DomainMetaInfoDisplayCard`                 | Meta info display              | ✅         |
| `Template/Screen/Collection.vue`                    | `TemplateScreenCollection`                  | Collection screen layout       | N/A        |
| `Molecule/Dashboard/Card.vue`                       | `MoleculeCardDashboard`                     | Dashboard statistics card      | N/A        |
| `Molecule/Action/Button.vue`                        | `MoleculeActionButton`                      | Action button component        | N/A        |
| `Molecule/Action/Link.vue`                          | `MoleculeActionLink`                        | Action link component          | N/A        |
| `Molecule/Form/Group.vue`                           | `MoleculeFormGroup`                         | Form field group               | N/A        |
| `Aggregate/Goals.vue`                               | `AggregateGoals`                            | Goals collection               | N/A        |
