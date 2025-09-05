---
title: Goal Visibility UI via GSWindow with periodic updates
date: 2025-09-02
status: accepted
---

# Context

Players could not see active shared/personal goals or their progress except via sporadic GSNews items and the end-of-week summary. This created a usability gap: no persistent, glanceable UI for current objectives and progress.

We already depend on SuperLib and can lean on established GS best practices from the community (eg. SuperLib utilities and UI guidance discussed on the tt-forums thread about SuperLib).

References:
- SuperLib forum thread (background, utilities, Story/Log helpers): [SuperLib: Helper, Direction, Tile, ... libraries](https://www.tt-forums.net/viewtopic.php?f=65&t=47525)

# Decision

Introduce optional, lightweight in-game UI windows rendered with `GSWindow` to show:

- Shared goals: description, status, percent complete, current tier, and top contributors.
- Personal goals: per-company list with description, status, percent complete, and reward.

Windows are refreshed on a configurable cadence (in-game days). The feature can be toggled via script settings.

# Settings

- `ui_show_windows` (0/1): Enable periodic goal windows (default: enabled)
- `ui_window_update_days` (1..56): Days between window refreshes (default: 7)

# Implementation

- `dashboard.nut`
  - Add `RenderSharedGoalsWindow(shared_goals)` and `RenderPlayerGoalsWindows(player_goals)` using `GSWindow`.
  - Keep existing `Update*Window` methods as no-ops to avoid per-tick redraw churn.

- `main.nut`
  - Read settings (`ui_show_windows`, `ui_window_update_days`).
  - Schedule and trigger periodic rendering alongside the main loop without blocking.

- `info.nut`
  - Define new settings with in-game configurability.

# Consequences

Pros:
- Players get clear, persistent visibility into current goals and progress.
- Minimal overhead; redraw occurs on a coarse cadence (e.g., every 7 days).
- Works in multiplayer; windows are shown to all for shared goals and per-company for personal goals.

Cons/Risks:
- Too-frequent updates could be noisy; mitigated by adjustable cadence.
- UI scaling is limited to basic text labels (no progress bars), but sufficient for clarity.

# Alternatives Considered

- Rely only on GSNews and week summary windows: rejected due to poor discoverability during play.
- Implement GSStoryBook-based UI via SuperLib Story helpers: deferred; more complexity with limited added value right now. May revisit.

# Notes on SuperLib

We continue to leverage SuperLib for general utilities and logging conventions; while the new UI uses `GSWindow` directly, the approach aligns with practices discussed in the SuperLib forum thread and keeps the door open for future `GSStoryBook` integration. See: [tt-forums SuperLib thread](https://www.tt-forums.net/viewtopic.php?f=65&t=47525).


