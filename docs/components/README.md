# Component Catalog

This directory contains the comprehensive component catalog for the Campaign Editor's atomic design system.

## Structure

- **[catalog.md](./catalog.md)** - Complete component listing with paths and purposes
- **[shadcn-components.md](./shadcn-components.md)** - shadcn-vue components we use
- **[implementation-guide.md](./implementation-guide.md)** - How to implement the component hierarchy

## Quick Reference

### Component Layers

- **Atoms**: What shadcn missed (minimal)
- **Molecules**: Opinionated arrangements of shadcn components
- **Domain**: Domain types that need specialization
- **Entity**: Entity types with visual intents
- **Aggregate**: Collections of entities
- **Template**: Layout primitives and screen patterns

### Visual Intent Pattern

Visual intents define **how** data is presented or interacted with, independent of the data type:

#### **Available Visual Intents**

- **Input**
  - **Details** - Comprehensive form for editing all properties of a type
  - **Choice** - Specialized selector/picker for choosing from options (only when standard Select isn't sufficient)
- **Display**
  - **Details** - Comprehensive read-only view showing all properties
  - **Item** - Compact display suitable for list items (shows key info only)
  - **Card** - Medium-detail display suitable for card layouts (shows important info)
  - **Summary** - Brief one-line or minimal display (shows essential info only)
  - **Badge** - Tiny indicator display suitable for badges/tags (shows type/status only)

**Important**: Only implement intent components as needed. Don't create every Entity/Type × Intent combination.

### FQN Examples

- `Entity/Goal/Display/Card.vue` → `EntityGoalDisplayCard`
- `Domain/Objective/CargoDelivered/Input/Details.vue` → `DomainObjectiveCargoDeliveredInputDetails`
- `Template/Screen/Collection.vue` → `TemplateScreenCollection`

## Architecture Decision

See [ADR-0016](../adrs/0016-atomic-design-component-hierarchy.md) for the architectural decisions and rationale behind this component system.
