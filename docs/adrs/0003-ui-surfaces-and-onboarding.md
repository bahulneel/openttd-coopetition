---
title: Player Guidance via StoryBook, Goals Window, Signs and News
date: 2025-09-02
status: accepted
---

# Context

New players lacked immediate guidance on what to do when the Game Script starts. Custom UI windows are not available in the GameScript API, so we must use native, supported UI surfaces.

# Decision

Adopt a layered player-guidance approach using native GS API features:

- StoryBook pages (GSStoryPage) for persistent shared/personal goals.
- Goals window entries (GSGoal) for actionable objectives.
- Map signs (GSSign) to mark locations for shared goals.
- News messages (GSNews) for onboarding and periodic reminders.

Defaults:

- StoryBook enabled by default.
- Goals window publishing enabled by default.
- Signs enabled by default.
- Reminders enabled; 14 in-game day cadence (configurable).

# Settings

- `ui_use_storybook` (0/1): Enable StoryBook pages (default: 1)
- `ui_use_goals_window` (0/1): Publish entries to Goals window (default: 1)
- `ui_use_signs` (0/1): Place signs for shared cargo goals (default: 1)
- `ui_reminders_enabled` (0/1): Send periodic goal reminder news (default: 1)
- `ui_reminder_days` (1..112): Days between reminders (default: 14)

# Implementation

- `info.nut`: Added above settings; StoryBook default toggled on.
- `dashboard.nut`:
  - Added GSGoal publishing (global and per-company).
  - Added sign management for shared cargo goals.
  - Kept StoryBook pages for persistent dashboards.
- `main.nut`:
  - Reads new settings and wires periodic/on-demand updates for StoryBook, Goals window, and Signs.
  - Sends onboarding news on company creation and periodic reminders.
  - Persists reminder schedule across saves.

# Consequences

Pros:

- Clear onboarding and persistent visibility of goals without custom UI.
- Works across multiplayer; per-company goals scoped correctly.
- All features are toggleable at runtime via settings.

Cons:

- Goals/signs are refreshed on cadence; not frame-accurate.
- Additional text surfaces can be noisy if reminders are too frequent (tunable).

# Alternatives Considered

- GSWindow-based custom UI: Not available in GS API.
- News-only: High visibility but lacks persistence and structure.

# References

- OpenTTD GameScript API: https://docs.openttd.org/gs-api/


