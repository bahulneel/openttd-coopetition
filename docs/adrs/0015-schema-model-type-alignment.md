# ADR-0015: Schema-Model Type Alignment

## Status

Accepted

## Context

The `schemas.ts` file was duplicating type definitions from `model.ts`, leading to several issues:

1. **Type Duplication**: All interfaces were redefined in Zod schemas instead of deriving from model types
2. **Maintenance Burden**: Changes to model types required manual updates to schemas
3. **Inconsistency Risk**: Schema validation could drift from actual model types
4. **Circular Reference Issue**: The `Constraints` type had a circular reference (`ConditionalConstraint` → `Constraints`) that was being worked around with `z.any()`
5. **Missing Entity Fields**: Main entity schemas were missing required `__id` and `__type` fields from the Entity interface

## Decision

Refactor the schema system to:

1. **Derive from Model Types**: Use `z.ZodType<T>` to ensure schemas match model types exactly
2. **Fix Circular References**: Use `z.lazy()` to handle the circular reference in `Constraints` → `ConditionalConstraint` → `Constraints`
3. **Import Model Types**: Import all necessary types from `~/types/model` instead of redefining them
4. **Handle Partial Types**: Properly implement `Partial<>` types in override schemas by making all fields optional
5. **Include Entity Fields**: Add required `__id` and `__type` fields to main entity schemas

## Implementation Details

### Before

```typescript
// Duplicated type definitions
const metaInfoSchema = z.object({
  author: z.string().optional(),
  // ... duplicated from model.ts
})

// Circular reference workaround
const constraintsSchema = z.object({
  // ...
  conditional: z.array(
    z.object({
      constraint: z.any(), // ❌ Using any to avoid circular reference
    }),
  ),
})
```

### After

```typescript
// Import from model types
import type { MetaInfo, Constraints, ConditionalConstraint } from '~/types/model'

// Derive from model types
const metaInfoSchema: z.ZodType<MetaInfo> = z.object({
  author: z.string().optional(),
  // ... matches model.ts exactly
})

// Fixed circular reference with lazy evaluation
const constraintsSchema: z.ZodType<Constraints> = z.lazy(() =>
  z.object({
    // ...
    conditional: z.array(conditionalConstraintSchema).optional(),
  }),
)

const conditionalConstraintSchema: z.ZodType<ConditionalConstraint> = z.object({
  condition: z.object({
    type: z.string(),
    operator: z.string().optional(),
    value: z.union([z.number(), z.string()]).optional(),
  }),
  constraint: constraintsSchema, // ✅ No circular reference issue
})
```

### Key Changes

1. **Type Safety**: All schemas now use `z.ZodType<T>` ensuring compile-time type checking
2. **No Duplication**: Schemas derive from model types, eliminating duplication
3. **Circular Reference Fixed**: Used `z.lazy()` to properly handle the Constraints → ConditionalConstraint cycle
4. **Entity Compliance**: Main schemas include required `__id` and `__type` fields
5. **Partial Types**: Override schemas properly implement `Partial<>` by making all fields optional

## Consequences

### Positive

- **Type Safety**: Compile-time guarantees that schemas match model types
- **Maintainability**: Single source of truth for type definitions
- **Consistency**: No risk of schema/model drift
- **Correctness**: Fixed circular reference issue properly
- **Completeness**: All required Entity fields included

### Negative

- **Initial Complexity**: More complex schema definitions due to type constraints
- **Import Dependencies**: Schemas now depend on model types (acceptable trade-off)

## Alternatives Considered

1. **Keep Duplication**: Rejected due to maintenance burden and inconsistency risk
2. **Use z.any() for Circular Reference**: Rejected as it removes type safety
3. **Separate Constraint Types**: Rejected as it would break the model's design

## References

- [Zod Lazy Evaluation Documentation](https://zod.dev/?id=lazy)
- [TypeScript Circular References](https://www.typescriptlang.org/docs/handbook/2/objects.html#circular-references)
