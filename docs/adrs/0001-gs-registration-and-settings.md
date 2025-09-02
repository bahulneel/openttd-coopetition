---
title: Use RegisterGS and GSConfig flags in info.nut
date: 2025-09-02
status: accepted
---

# Context

The GameScript failed to compile with the error: "the index 'RegisterGSInfo' does not exist" when loading `info.nut`. Additionally, `GetAPIVersion` returned a string, and settings used `CONFIG_INGAME` which is not defined in the GS API.

# Decision

- Replace `RegisterGSInfo(Coopetition())` with `RegisterGS(Coopetition())`, which is the correct registration function for GameScripts.
- Make `GetAPIVersion` return a number (`14`) instead of a string to match expected type.
- Replace `CONFIG_INGAME` with `GSConfig.CF_INGAME` for settings flags.

# Consequences

- The script registers correctly and compiles.
- Settings are properly marked as changeable in-game using GS API constants.
- API version is provided with the correct type, improving compatibility checks.

# Alternatives Considered

- Keep `RegisterGSInfo`: rejected since it is not part of the GS API.
- Use string for API version: rejected; types should match API expectations.


