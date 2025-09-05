---
title: Data‑Driven Goals, File‑Based Authoring, and GSGoal Integration
date: 2025-09-02
status: accepted
---

## Context

Players need a clear, native way to discover and track objectives, while goal authors need a maintainable way to define and evolve goals without editing Squirrel code. The current implementation hard‑codes goal logic and displays progress primarily via StoryBook and News. The built‑in Goals window (GSGoal) is not currently populated, reducing discoverability and missing a familiar OpenTTD UX surface.

Constraints and principles:
- Use OpenTTD GS API v14+ (OpenTTD 1.4+) and validate usage against official docs.
- Prefer data‑driven configuration over hard‑coded logic.
- Favor native UX surfaces: Goals window (GSGoal), StoryBook (GSStoryPage), News (GSNews).
- Author experience should be simple: edit declarative files, run validation, and see results in‑game.
- Use `undefined` over `null` in authored data; reserve `null` only when semantically required by the engine.

## Decision

Adopt a file‑based, data‑driven goal authoring system compiled at build‑time to Squirrel tables, with runtime loaders and objective handlers that create and maintain GSGoal entries and StoryBook pages. News will be used for onboarding, milestones, and completion with careful rate‑limiting.

Key elements:
- Authoring format: YAML or JSON files defining Goals and Scenarios.
- Build tool: Node script compiles/validates authored files into a single Squirrel table artifact.
- Runtime loader: Initializes shared and personal goals from compiled data, evaluates constraints, and instantiates objectives.
- Objective handlers: Map declarative objective types to event‑driven progress tracking.
- UX outputs: 
  - GSGoal for the native Goals window (global and per‑company).
  - StoryBook pages for persistent summaries (shared and per‑company).
  - GSNews for onboarding, periodic nudges, milestones, and completion.

## Consequences

Pros:
- Clear separation between goal data and engine logic.
- Scalable authoring and review via files and schema validation.
- Restores native Goals window discoverability while retaining StoryBook depth.
- Easier experimentation with constraints and scenarios.

Cons:
- Additional build step and tooling to maintain.
- More runtime plumbing (loader, registry, handlers) to keep consistent with data.
- Need to carefully manage News volume and GSGoal churn.

## Alternatives Considered

1) Keep goals hard‑coded in Squirrel
- Pros: No new tooling; straightforward.
- Cons: Hard to author/review, brittle, poor scalability, mixes data and logic.

2) StoryBook‑only surface
- Pros: Simple to implement, flexible text.
- Cons: Players miss the familiar Goals window; less actionable; weaker discoverability.

3) Runtime parse YAML/JSON in GS
- Pros: No build step.
- Cons: Not feasible/practical in GS environment; complexity and performance concerns.

## Authoring Format

Top‑level fields for a Goal (YAML shown; JSON equivalent supported):

````yaml
id: goal.cargo.basic          # unique identifier <namespace>.<category>.<name>
title: Deliver Coal
description: Deliver 10,000 tonnes of coal to any industry.

constraints:
  players:
    min: 2
    max: 6
  start_year: 1950
  end_year: 2000

objectives:
  - type: cargo_delivered
    cargo: COAL
    amount: 10000
    target: any

shared: true                  # true = shared contribution; false = personal
repeatable: false             # if true, goal can be completed multiple times
reward: money:100000          # optional, symbolic or in‑game
````

Field reference:
- id: unique string `<namespace>.<category>.<name>`
- title/description: display strings (Goals window, StoryBook, News)
- constraints: all optional; undefined = PASS
  - players.min/max
  - start_year / end_year
  - future: map size, company age, cargo availability, etc.
- objectives: array of one or more entries; any can satisfy the goal unless specified otherwise (future: logic operators)
  - Supported types (initial set):
    - cargo_delivered: { cargo, amount, target:any|town:<id>|industry:<id> }
    - station_built: { cargo?:<label>, location?:town|industry|any, count }
    - company_value: { min_value }
    - town_growth: { town_id, target_population }
- shared: true (shared progress) vs false (per‑company instance)
- repeatable: whether a goal can recur after completion
- reward: e.g., `money:100000`; extensible to other reward types

### Goal & Scenario Authoring Model (Expanded)

Goal files can explicitly model personal vs shared goals, and declare shared infrastructure dependencies:

````yaml
# Example: Personal Goal
id: collect-10-apples
type: personal                # personal | shared
title: Apple Collector
objective: Collect 10 apples before time runs out
constraints:
  players:
    min: 1
    max: 4

# Example: Shared Goal with Infrastructure
id: defend-the-village
type: shared
title: Defend the Village
objective: Keep the village safe for 5 minutes
shared_infrastructure:
  - barricades
  - watchtower
constraints:
  players:
    min: 2
    max: 6
````

Notes:
- `type`: `personal` means per‑company instance; `shared` means one instance with pooled progress.
- `constraints.players.min/max`: goal activates only if player count within range.
- `shared_infrastructure`: symbolic names for resources that must be provided globally or by the scenario when the goal is active.

Scenarios compose goals and can mark them as required or optional:

````yaml
id: forest-defense
title: Forest Defense
description: Protect the forest while gathering supplies.
goals:
  - file: collect-10-apples.yaml
    required: true
  - file: defend-the-village.yaml
    required: true
  - file: optional-sidequest.yaml
    required: false
````

Infrastructure sharing levels:
1) Global (scenario‑wide):

````yaml
infrastructure:
  - campfire
  - supply-depot
````

2) Shared goal‑specific: as declared via `shared_infrastructure` (only loaded if that goal is active).

3) Personal goal‑specific: allowed but unusual; personal goals may also declare `shared_infrastructure` they depend on.

Runtime composition rules:
- Activate only goals whose constraints pass (e.g., player count bounds).
- Compose required and optional goals (optional may be skipped or substituted later).
- Merge infrastructure:
  - Scenario‑wide infra is always loaded.
  - Shared goals contribute infra only if active.

Scenarios aggregate goals:

````yaml
id: scenario.intro
title: Getting Started
description: Introductory set of goals for new players.

include:
  - file: goals/deliver_coal.yml
  - file: goals/build_station.yml
  - file: scenario/easy_start.yml
````

Scenario rules:
- Recursive include supported.
- Scenario‑level constraints apply to all contained goals unless overridden.

## Build & Tooling

- File locations:
  - `goals/**/*.yml|yaml|json` and `scenarios/**/*.yml|yaml|json`
- Compiler: `tools/goals-compile.mjs`
  - Validates schema (Ajv for JSON Schema; yaml parsing via `yaml` package)
  - Enforces IDs, field types, ranges, cargo labels, etc.
  - Outputs `dist/goals.compiled.nut` with a single Squirrel table containing:
    - `goals_by_id` and `scenarios_by_id`
    - Normalized constraints/objectives
  - Emits a summary and warnings for unused/unknown fields
- NPM scripts:
  - `npm run goals:build`
  - `npm run goals:watch`

## Runtime Design

- Loader (in `main.nut` / `dashboard.nut`):
  - Require `dist/goals.compiled.nut` and read selected scenario(s)
  - Evaluate constraints against live game state (players, year, etc.)
  - Create goal instances:
    - Shared: one GSGoal; progress accumulated across companies
    - Personal: per‑company GSGoal instance

- Objective handlers:
  - Event‑driven mapping (e.g., cargo delivery, station built, company value, town growth)
  - Maintain internal progress state; update GSGoal progress text/percent when changed
  - Close GSGoal on completion; trigger reward and News

- UX surfaces:
  - GSGoal: concise, actionable entries with progress
  - StoryBook: periodic summary pages (shared + per‑company) for at‑a‑glance dashboards
  - News: onboarding, periodic nudges (configurable cadence), milestone/completion toasts (rate‑limited)

## Settings

- `ui_use_goals_window` (0/1): publish entries to Goals window (default: 1)
- `ui_use_storybook` (0/1): persist pages (default: 1)
- `ui_use_signs` (0/1): shared cargo goal signposts (default: 1)
- `ui_reminders_enabled` (0/1) & `ui_reminder_days` (1..112)
- `scenario_id` (string): default scenario to load
- `author_debug` (0/1): stronger logging and validation in‑game

## API Usage Notes (GS API 14+)

- GSGoal: create, update text/progress, and close/remove entries (validate calls against docs during implementation)
- GSStoryPage: create pages and add text elements; pages auto‑visible when created
- GSNews: use 5‑argument signature; scope to company when appropriate

## Migration & Rollout

1) Introduce build tool and compiled artifact behind a feature flag.
2) Implement loader and a minimal set of objective handlers.
3) Publish to GSGoal and StoryBook in parallel; ensure News cadence sane.
4) Backward‑compatible: keep existing StoryBook text until parity is verified.
5) Author a small library of example goals/scenarios and validate in multiplayer.

## Testing & UX Considerations

- Unit tests for compiler/validators and handler mappings.
- In‑game tests for constraint evaluation and progress edge cases.
- UX: consistent titles, clear descriptions, progress bars/percentages, minimal noise in News.


