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
  - **Form**
    - **Group** - responsive grid layout for form fields
    - **Conditional** - field that shows/hides based on conditions
    - **Collection** - form collection component
- **Domain** (only components needing specialization)
  - **Objective**
    - **Default**
      - **Input**
        - **Details** - default objective input
      - **Display**
        - **Summary** - default objective summary
    - **CargoDelivered**
      - **Input**
        - **Details** - cargo delivered specific input (amount, cargo, cargo_types)
    - **NetworkLength**
      - **Input**
        - **Details** - network length specific input (amount, track_type)
    - **Profit**
      - **Input**
        - **Details** - profit specific input (amount)
    - **StationBuilt**
      - **Input**
        - **Details** - station built specific input (count, location)
    - **CompanyValue**
      - **Input**
        - **Details** - company value specific input (min_value)
    - **TownGrowth**
      - **Input**
        - **Details** - town growth specific input (target_population, town_id)
  - **Constraints**
    - **Input**
      - **Details** - constraints input (players, date, map_size ranges)
  - **RewardSet**
    - **Display**
      - **Summary** - reward summary (cash, score, reputation, unlocks)
  - **MetaInfo**
    - **Input**
      - **Details** - meta info input (author, description, difficulty, tags)
  - **SharedInfrastructure**
    - **Input**
      - **Details** - shared infrastructure input (track, stations, vehicles, depots)
- **Entity** (using enityType names from TypeMap)
  - **Goal**
    - **Input**
      - **Details** - goal detailed input (composes Domain/ components)
    - **Display**
      - **Card** - goal card display
      - **Item** - goal list item display
      - **Details** - goal detailed display
      - **Summary** - goal summary display
      - **Badge** - goal badge display
  - **Campaign**
    - **Input**
      - **Details** - campaign detailed input
    - **Display**
      - **Card** - campaign card display
      - **Item** - campaign list item display
      - **Details** - campaign detailed display
      - **Summary** - campaign summary display
  - **Scenario**
    - **Input**
      - **Details** - scenario detailed input
    - **Display**
      - **Card** - scenario card display
      - **Item** - scenario list item display
      - **Details** - scenario detailed display
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
<!-- Entity/Goal/Display/Card.vue -->
<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ goal.name }}</CardTitle>
      <EntityGoalDisplayBadge :goal="goal" />
    </CardHeader>
    <CardContent>
      <DomainObjectiveDefaultDisplaySummary :objective="goal.objective" />
      <MoleculeDisplay :data="goalConstraints" />
    </CardContent>
  </Card>
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

## FQN Reference

| File Path                                           | FQN                                         | Purpose                        |
| --------------------------------------------------- | ------------------------------------------- | ------------------------------ |
| `Entity/Goal/Display/Card.vue`                      | `EntityGoalDisplayCard`                     | Goal card display              |
| `Domain/Objective/CargoDelivered/Input/Details.vue` | `DomainObjectiveCargoDeliveredInputDetails` | Cargo delivery objective input |
| `Template/Screen/Collection.vue`                    | `TemplateScreenCollection`                  | Collection screen layout       |
| `Molecule/Form/Group.vue`                           | `MoleculeFormGroup`                         | Form field group               |
| `Aggregate/Goals.vue`                               | `AggregateGoals`                            | Goals collection               |
