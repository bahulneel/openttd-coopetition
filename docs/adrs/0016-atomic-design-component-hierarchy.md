# ADR-0016: Atomic Design Component Hierarchy

## Status

Accepted

## Context

The campaign editor's component architecture had grown organically without a clear design system, leading to:

1. **Monolithic Pages**: Large, complex page components mixing layout, forms, business logic, and presentation
2. **Poor Reusability**: Duplicated patterns across different pages without shared components
3. **Unclear Boundaries**: No clear separation between visual intents, domain logic, and layout concerns
4. **Maintenance Issues**: Changes required updating multiple files with similar patterns
5. **Type Safety Gaps**: Poor discriminated union support in goal objectives leading to invalid state combinations

The discriminated union issue was particularly problematic - the `Objective` interface allowed invalid combinations like setting `cargo` for a `profit` objective, creating runtime errors and confusing UX.

## Decision

We will implement a comprehensive atomic design system with proper domain separation and discriminated union type safety:

### **1. Discriminated Union Type System**

Replace the generic `Objective` interface with proper discriminated unions:

```typescript
// Before: All fields optional, allows invalid combinations
export interface Objective extends Commentable {
  type: ObjectiveType
  amount?: number
  cargo?: string
  cargo_types?: string[]
  // ... all optional fields
}

// After: Discriminated union with required fields per type
export type Objective =
  | CargoDeliveredObjective // requires: amount, cargo
  | NetworkLengthObjective // requires: amount
  | ProfitObjective // requires: amount
  | StationBuiltObjective // requires: count
  | CompanyValueObjective // requires: min_value
  | TownGrowthObjective // requires: target_population, town_id
```

### **2. Atomic Design Component Hierarchy Strategy**

We will organize components following atomic design principles with clear visual intent patterns:

#### **Component Layer Responsibilities**

- **Atoms**: Only create where shadcn doesn't provide coverage (minimal approach)
- **Molecules**: Opinionated arrangements that compose shadcn components
- **Domain**: Components for domain types from `model.ts` that need specialization
- **Entity**: Components for entities (Goal, Campaign, Scenario, Manifest) with visual intents
- **Aggregate**: Collections of entities
- **Template**: Layout primitives (Layout/) and higher-order screen patterns (Screen/)

#### **Visual Intent Pattern**

All visual components follow `PrimaryIntent/SpecificIntent`:

- **Input**: `Input/Details`, `Input/Choice` (when specialized selector needed)
- **Display**: `Display/Details`, `Display/Item`, `Display/Card`, `Display/Summary`, `Display/Badge`

#### **Domain Type Strategy**

Based on `model.ts` analysis:

- **Entities** (extend BaseItem): Goal, Campaign, Scenario, Manifest
- **Domain Types** (other interfaces): MetaInfo, Constraints, Objective, RewardSet, etc.
- **Only create components for types that need specialization**

#### **Discriminated Union Handling**

For types like `Objective` with discriminated unions:

- `Domain/Objective/Default/` - handles common cases
- `Domain/Objective/{SubType}/` - handles type-specific cases (CargoDelivered, NetworkLength, etc.)

### **3. Component Naming and FQN Strategy**

- **FQN Built from Path**: Component name derives from file path (e.g., `Entity/Goal/Display/Card.vue` → `EntityGoalDisplayCard`)
- **PascalCase Paths**: All atomic component paths use PascalCase
- **Most General → Most Specific**: Path hierarchy reflects specificity
- **defineOptions Name**: Each component uses FQN in `defineOptions({ name: 'FQN' })`
- **No Redundancy**: Avoid redundant path parts (e.g., `GoalCard/Header.vue` not `GoalCard/GoalCardHeader.vue`)

### **4. Minimalist Approach**

- **Leverage shadcn**: Only create atoms where shadcn doesn't provide coverage
- **Specialization Only**: Only create visual intent components where specialization is needed
- **Domain Separation**: Clear boundaries between visual, domain, and entity concerns
- **Fewest Components**: Aim for minimal components, not comprehensive coverage

## Implementation Strategy

### **Phase 1: Type System Migration** ✅

1. Implement discriminated union types for Objective
2. Update Zod schemas to use discriminated union validation
3. Fix form type safety issues

### **Phase 2: Component Architecture**

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

## Consequences

### Positive

- **Type Safety**: Discriminated unions prevent invalid objective combinations
- **Clear Separation**: Proper boundaries between atoms, molecules, organisms, templates
- **Minimal Components**: Only create components that need specialization
- **Reusability**: Proper composition enables component reuse
- **Maintainability**: Changes isolated to specific component types
- **Developer Experience**: Clear patterns for adding new features

### Negative

- **Initial Complexity**: More complex component structure initially
- **Migration Effort**: Significant work to migrate existing pages
- **Learning Curve**: Team needs to understand atomic design principles

### Risks

- **Over-Engineering**: Risk of creating too many small components
- **Inconsistent Adoption**: Risk of mixing old and new patterns
- **Type Complexity**: Complex discriminated union types may be hard to work with

### Mitigation Strategies

- **Minimal Approach**: Only create components that truly need specialization
- **Progressive Migration**: Migrate pages incrementally
- **Clear Documentation**: Document patterns and decision rationale
- **Type Utilities**: Create helper functions for working with discriminated unions

## Design Principles

1. **Leverage shadcn**: Only create atoms where shadcn doesn't provide coverage
2. **Specialization Only**: Only create visual intent components where specialization is needed
3. **Domain Separation**: Clear boundaries between visual, domain, and entity concerns
4. **Type Safety First**: Use discriminated unions and proper TypeScript patterns
5. **Minimal Components**: Aim for fewest components, not the most
6. **Visual Intent Clarity**: `PrimaryIntent/SpecificIntent` pattern for all visual components
7. **FQN from Path**: Component names derive from file path structure

## Validation Strategy

The component hierarchy should address current architectural issues:

- **Monolithic Pages** → Composed from atomic components
- **Duplicated Patterns** → Reusable molecules and domain components
- **Mixed Concerns** → Clear separation via component layers
- **Type Safety** → Discriminated unions with specialized domain components

See `docs/components/` for the detailed component catalog and implementation guide.

## References

- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [TypeScript Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [ADR-0015: Schema-Model Type Alignment](./0015-schema-model-type-alignment.md)
- [ADR-0009: Nuxt4 Tailwind4 shadcn-vue Migration](./0009-nuxt4-tailwind4-shadcn-vue-migration.md)
