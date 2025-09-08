# Component Implementation Guide

Guide for implementing the atomic design component hierarchy in the Campaign Editor.

## Implementation Phases

### **Phase 1: Type System Migration** ✅

1. Implement discriminated union types for Objective
2. Update Zod schemas to use discriminated union validation
3. Fix form type safety issues

### **Phase 2: Component Architecture** (Next)

1. Create atomic component structure
2. Implement minimal set of needed components
3. Migrate existing pages to use new components

### **Phase 3: Domain Specialization**

1. Implement Domain/ components for specialized types
2. Create Entity/ components with proper visual intents
3. Build Template/ system for layout composition

### **Phase 4: Page Migration**

1. Migrate goal pages to new architecture
2. Migrate scenario pages to new architecture
3. Migrate campaign pages to new architecture

## Component Creation Guidelines

### **1. Component File Structure**

```
components/
├── Atoms/                    # What shadcn missed (likely empty)
├── Molecules/               # Opinionated shadcn arrangements
├── Domain/                  # Domain type specializations
├── Entity/                  # Entity visual intents
├── Aggregate/              # Entity collections
└── Template/               # Layout and screen patterns
```

### **2. Component Template**

Every component should follow this structure:

```vue
<template>
  <!-- Component content -->
</template>

<script setup lang="ts">
// Component name from FQN
defineOptions({
  name: 'ComponentFQN', // e.g., 'EntityGoalDisplayCard'
})

// Props, emits, logic
</script>
```

### **3. FQN Generation**

File path determines the FQN:

| File Path                                           | FQN                                         |
| --------------------------------------------------- | ------------------------------------------- |
| `Entity/Goal/Display/Card.vue`                      | `EntityGoalDisplayCard`                     |
| `Domain/Objective/CargoDelivered/Input/Details.vue` | `DomainObjectiveCargoDeliveredInputDetails` |
| `Molecule/Form/Group.vue`                           | `MoleculeFormGroup`                         |
| `Template/Screen/Collection.vue`                    | `TemplateScreenCollection`                  |

### **4. Visual Intent Implementation**

#### **Input Components**

```vue
<!-- Domain/Objective/CargoDelivered/Input/Details.vue -->
<template>
  <MoleculeFormGroup>
    <FormField name="amount">
      <FormItem>
        <FormLabel>Amount</FormLabel>
        <FormControl>
          <Input type="number" placeholder="e.g., 1000" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="cargo">
      <FormItem>
        <FormLabel>Cargo Type</FormLabel>
        <FormControl>
          <Input placeholder="e.g., COAL" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </MoleculeFormGroup>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DomainObjectiveCargoDeliveredInputDetails',
})

// Props for cargo delivered objective
interface Props {
  modelValue?: CargoDeliveredObjective
}
</script>
```

#### **Display Components**

```vue
<!-- Entity/Goal/Display/Card.vue -->
<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ goal.name }}</CardTitle>
      <EntityGoalDisplayBadge :goal="goal" />
    </CardHeader>
    <CardContent>
      <p>{{ goal.meta?.description }}</p>
      <DomainObjectiveDefaultDisplaySummary :objective="goal.objective" />
      <MoleculeDisplay :data="constraintData" />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
defineOptions({
  name: 'EntityGoalDisplayCard',
})

interface Props {
  goal: Goal
}
</script>
```

### **5. Component Dependencies**

Components should compose lower-level components:

- **Entity** components compose **Domain** components
- **Domain** components compose **Molecule** components
- **Molecule** components compose **shadcn** components
- **Aggregate** components compose **Entity** components
- **Template** components provide layout structure

### **6. Specialization Decision Tree**

Only create components when:

1. **Specialization Needed**: The component handles domain-specific logic
2. **Reusability**: The component will be used in multiple places
3. **Complexity**: The component is complex enough to warrant extraction
4. **shadcn Gap**: shadcn doesn't provide the needed functionality

### **7. Implementation Order**

1. **Start with Molecules**: Create the basic building blocks first
2. **Add Domain Components**: Implement specialized domain type handling
3. **Build Entity Components**: Create entity-specific visual intents
4. **Create Templates**: Add layout and screen components
5. **Migrate Pages**: Replace monolithic pages with composed components

## Testing Strategy

### **Component Testing**

- Each component should be testable in isolation
- Use Vue Test Utils for component testing
- Mock dependencies and props appropriately

### **Integration Testing**

- Test component composition works correctly
- Verify FQN naming is consistent
- Test visual intent patterns function properly

### **Type Testing**

- Verify discriminated union types work correctly
- Test form validation with new schemas
- Ensure TypeScript compilation passes

## Migration Guidelines

### **Progressive Migration**

- Migrate one page at a time
- Start with simplest pages (list views)
- Move to complex pages (form views) last

### **Backward Compatibility**

- Keep old components until migration is complete
- Use feature flags if needed during transition
- Ensure existing functionality continues to work

### **Quality Gates**

- All new components must have proper FQN
- All new components must follow visual intent patterns
- All new components must be properly typed
- All new components must be tested

## Common Patterns

### **Conditional Rendering**

```vue
<!-- Use MoleculeFormConditional for complex conditions -->
<MoleculeFormConditional :condition="objective?.type === 'cargo_delivered'">
  <DomainObjectiveCargoDeliveredInputDetails />
</MoleculeFormConditional>
```

### **Form Composition**

```vue
<!-- Entity components compose Domain components -->
<template>
  <form @submit.prevent="onSubmit">
    <DomainMetaInfoInputDetails v-model="form.meta" />
    <DomainObjectiveDefaultInputDetails v-model="form.objective" />
    <DomainConstraintsInputDetails v-model="form.constraints" />
  </form>
</template>
```

### **Collection Display**

```vue
<!-- Aggregate components use Template layouts -->
<template>
  <TemplateLayoutList>
    <EntityGoalDisplayItem v-for="goal in goals" :key="entityId(goal)" :goal="goal" />
  </TemplateLayoutList>
</template>
```
