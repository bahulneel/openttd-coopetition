## Component Decomposition – A Practical Guide

This guide explains how to decompose page templates into reusable, opinionated components. It focuses on how to make decisions (props vs slots, screen vs layout), how to keep APIs small, and how to apply Vue attribute fallthrough effectively.

Use this document to continue or repeat the refactor in other areas; examples for each phase should live alongside code (e.g., `docs/components/phases/<phase-name>/`) to serve as working references.

### Core Principles

- Favor minimal APIs and strong defaults.
- Push choices into data (props) when they are stable; use slots only where variation is genuine.
- Keep single-root nodes to enable attribute fallthrough; avoid unnecessary wrappers. See Vue’s fallthrough attributes [vue docs](https://vuejs.org/guide/components/attrs).
- Compose screens from layouts; it’s fine for a screen to use a screen if it improves clarity.
- Prefer shadcn primitives for atoms; add molecules/screens for our opinions.

### Decomposition Workflow (Catalog‑driven)

This workflow explains how to decide what to extract, which component tier to choose, and when to create a new component – independent of any single page.

Refer to the catalog for names and examples: see `docs/components/catalog.md`.

1. Discover and label the UI regions

- Walk the page visually (not by file) and annotate distinct regions by responsibility: persistent chrome, page shell, data summaries, collections, entity details, domain‑specific inputs/displays, and isolated UI atoms.
- Note repeated patterns, conditional regions, and layout relationships (stacking, grids, groups).

2. Map each region to a catalog tier

- Template/Layout: spatial arrangement only (e.g., Stacked, Grid, Sequential, Section headers). No domain, no data logic.
- Template/Screen: a page pattern made from layouts (e.g., Dashboard, Article, Collection). Only create/choose a Screen if the page has a recurring pattern.
- Aggregate/Entity/Domain: domain‑shaped blocks (collections, entity displays/inputs, domain variants/specializations).
- Molecule: small, opinionated UI units built from shadcn atoms (e.g., Header, Navigation/Bar, Footer, Card/Stat, Action).
- Atom: shadcn or basic HTML (use existing atoms wherever possible).

3. Choose from the catalog first

- Pick the smallest existing component that expresses the region’s responsibility. Favor layouts for containers, molecules for repeated UI fragments, and screens only for recognized page patterns.
- If two choices seem plausible, pick the more opinionated one when the pattern repeats across pages; otherwise keep it at the layout/molecule level and defer a Screen.

4. Decide props vs slots for each chosen component

- Use props when:
  - Structure is stable (e.g., Section `title`, `subtitle`).
  - You want to reduce options (fixed placement, fixed variant, minimal configuration).
- Use slots when:
  - Structure varies significantly (e.g., `actions` area; arbitrary card contents).
  - You need composition but must keep the component’s responsibilities intact.
- Combine both thoughtfully: prefer “props for the left, slot for the right” header patterns; avoid speculative toggles.

5. Prefer attribute fallthrough to forwarding

- Keep a single root in screens/layouts so attributes (including `class`, listeners, and undeclared props) fall through to the child’s root and/or props are picked up by the child automatically. Reference: [Vue fallthrough attributes](https://vuejs.org/guide/components/attrs).
- Avoid extra wrappers that block fallthrough; if you must control where attrs land, use `inheritAttrs: false` and `v-bind="$attrs"` explicitly.

6. Convert markup to data

- When a pattern repeats (cards, badges, list rows), model it as data and render with `v-for` + `v-bind` to the molecule. Keep local view types (e.g., `DashboardStat`) near the page.
- Prefer typed data and narrow props over ad‑hoc slots to move decisions from markup to data.

7. Be responsive by default

- Give layouts strong defaults (e.g., Grid sets breakpoints and gaps). Allow refinement via class passthrough instead of prop knobs. Only add layout props when they encode a real, repeated need.

8. Introduce new components only when the catalog lacks a fit

- Name by FQN aligned to the catalog (e.g., `TemplateLayoutSection`, `MoleculeDashboardCard`).
- New components must reduce options; don’t expose everything shadcn offers—codify our opinion.
- Place domain specializations under `Domain/…`, entity renderers under `Entity/…`, etc., to keep concerns clear and reusable.

9. Iterate in passes

- Extraction pass: pull outer layout into Template/Layout; relocate persistent chrome to molecules.
- Pattern pass: if a page matches a catalog Screen, adopt it; otherwise keep composing layouts.
- Normalization pass: factor recurring UI into molecules and render from data.
- Specialization pass: add Domain/Entity components as the domain semantics appear.

10. Validate with a checklist

- Single root per component for fallthrough? Yes.
- Responsibilities match tier (Layout vs Molecule vs Domain)? Yes.
- Props minimal, slots only where needed? Yes.
- Strong responsive defaults, refined via class? Yes.
- Names follow catalog; FQN set via `defineOptions`? Yes.

### Decision Guides

- Props vs Slots
  - Use props when content is fixed in structure (e.g., Section `title`, `subtitle`). Props are how we “cement” our opinion in the component’s API.
  - Use slots when variability is high or structure isn’t stable (e.g., header `actions`). Slots are how we leave a decision open to the template.
  - Slot fallbacks: support a prop‑or‑slot pattern by rendering from props when no slot content is provided. Example: an `actions?: Action[]` prop rendered inside `<slot name="actions">` fallback.

- Screen vs Layout
  - Layouts define spatial rules (stacked, grid, sequential) and carry opinions about spacing/responsiveness.
  - Screens combine layouts for a specific page pattern (e.g., dashboard). If a “screen” is just a container, prefer a layout.

- Forwarding vs Fallthrough
  - Prefer fallthrough when wrapping a single child and you don’t need to change data or events.
  - Prefer forwarding when you must intercept/transform data or listeners (validation, mapping, batching, logging), or apply `$attrs` to a specific internal element.

- Grid options
  - Use strong responsive defaults inside the Grid component. Allow refinement via `class` only; avoid prop-driven column counts unless a real need emerges.

### Directory and Naming Conventions

- SFC ordering: `<script setup>` first, then `<template>`.
- Name every component: `defineOptions({ name: 'FQN' })` using catalog-based FQN (e.g., `TemplateLayoutSection`).
- Do not use `Component/index.vue`. Structure as `Category/Type/Subtype/Component.vue` or `Category/Component.vue`.

#### Path & Naming Taxonomy

- Treat the component tree as a taxonomy.
  - Category sits at the top of the path; specialization sits at the bottom.
  - Each path segment is a noun or noun phrase that conveys a single aspect (typically a narrowing of the use cases).
- Avoid redundancy across path parts.
  - Nuxt composes the FQN by concatenating path parts. If a concept appears in one segment, don’t repeat it in another.
- Reverse readability test.
  - The reversed path parts should form a sensible plain‑English name.
  - If the plain name reads poorly, restructure the path rather than the code name.

Examples:

- `Template/Layout/Stacked`
  - FQN: `TemplateLayoutStacked`
  - Plain (reversed): “Stacked Layout Template” → good; both path and plain read well.
- `Molecule/Dashboard/Card`
  - FQN: `MoleculeDashboardCard`
  - Plain (reversed): “Card Dashboard Molecule” → poor; Card Dashoard doesn;t flow off the tounge as well as Dashboard Card (also the directiion os specialisation looks off).

### Implementation Phases (by example)

- Phase 1 – Layout extraction
  - Introduce `TemplateLayoutStacked` and move persistent UI to header/footer slots.

- Phase 2 – Molecules for persistent UI
  - Add `MoleculeHeader`, `Molecule/Navigation/Bar`, `MoleculeFooter`. Remove header/footer markup from the layout.

- Phase 3 – Screen composition
  - Create `TemplateLayoutSection`, `TemplateLayoutGrid`, `TemplateLayoutSequential`.
  - Compose `TemplateScreenDashboard` from these.

- Phase 4 – Card and action molecules
  - Introduce `MoleculeDashboardCard` and `MoleculeAction` (+ per-type variants).
  - Convert inline stats to `DashboardStat[]` and render via `v-bind`.

### Common Pitfalls and How to Avoid Them

- Over-slotting: default to props; add slots only for truly variable areas.
- Over-propping: avoid speculative flags (e.g., `showHeader`). Prefer conditional rendering based on presence of content.
- Wrapper bloat: keep single-root nodes; rely on fallthrough to avoid manual prop forwarding [vue docs](https://vuejs.org/guide/components/attrs).
- Inconsistent names: always use FQNs aligned with the catalog.

### Quick Checklist

- Single root? Yes.
- Attribute fallthrough used instead of manual forwarding? Yes.
- Props small, slots only where needed? Yes.
- Uses shadcn atoms; opinions layered as molecules/screens? Yes.
- Names and directories follow the catalog? Yes.

### Current Building Blocks

- Template/Layout
  - `TemplateLayoutStacked`, `TemplateLayoutSection`, `TemplateLayoutGrid`, `TemplateLayoutSequential`.
- Template/Screen
  - `TemplateScreenDashboard` (composes the above).
- Molecule
  - `MoleculeHeader`, `Molecule/Navigation/Bar`, `MoleculeFooter`, `MoleculeDashboardCard`, `MoleculeAction` (+ `Button`, `Link`).

### Why This Works

- Attribute fallthrough keeps templates lean and avoids boilerplate forwarding [vue docs](https://vuejs.org/guide/components/attrs).
- Opinionated molecules/screens reduce markup variance and shift decisions from markup to data/props.
- Layouts enforce consistent spacing and responsive behavior by default.

### Worked Example – Replicable Analysis (Dashboard)

Use this as a template for your own decomposition.

1. Visual region discovery (not by file)

- Persistent chrome: header (logo/title, nav, tools); footer.
- Page shell: title + subtitle + actions (page‑local, not site‑wide).
- Summaries: four stats tiles with optional right‑side action.
- Body: recent campaigns list (main) + quick actions (secondary panel).

2. Map regions to catalog tiers (choose existing first)

- Header/footer → Molecules (`MoleculeHeader`, `MoleculeFooter`).
- Nav → `Molecule/Navigation/Bar` (opinionated): no slots.
- Page shell → Template/Layout (`TemplateLayoutSection`).
- Page pattern → Template/Screen (`TemplateScreenDashboard`) because these regions repeat in other dashboards.
- Stats tiles → Molecule (`Molecule/Dashboard/Card`).
- Body layout → Template/Layout (`TemplateLayoutSequential`, `TemplateLayoutGrid`).

3. Decide prop vs slot per region

- Section header: props `title`, `subtitle`; slot `#actions` with slot fallback to `actions?: Action[]` (data first, escape hatch second).
- Stats tiles: props `{ label, value, tone, action? }`; card body stays closed (no slot) to reduce choices.
- Grid/Sequential: no prop knobs; strong responsive defaults; refine with class.

4. Prefer fallthrough, avoid forwarding unless intercepting

- `TemplateScreenDashboard` uses a single root of `TemplateLayoutSection`, so `title`/`subtitle` fall through to Section. No forwarding.
- If you ever need to transform or validate input before a child sees it, declare props and forward intentionally; otherwise rely on fallthrough.

5. Convert markup to data

- Define a local UI type for the pattern:
  - `type StatTone = 'brown'|'green'|'purple'|'blue'`
  - `interface DashboardStat { label: string; value: string|number; tone: StatTone; action?: Action }`
- Build `const stats = computed<DashboardStat[]>(...)` and render: `<MoleculeDashboardCard v-for="stat in stats" :key="stat.label" v-bind="stat" />`.

6. Naming and taxonomy check

- Paths: nouns/noun phrases; each path segment narrows the concept.
- FQN is the concatenation of path parts; no redundant terms.
- Reverse readability: the reversed parts form a sensible English phrase (e.g., `Template/Layout/Stacked` → “Stacked Layout Template”). Adjust path parts if the plain name reads poorly.

7. Validate with the checklist

- Single root per component; fallthrough works; props minimal; slots only where needed; responsive defaults in layouts; names follow catalog with FQNs.

Repeat this analysis for other pages: first identify regions, then select from the catalog or introduce the smallest new component that reduces options and clarifies responsibility.
