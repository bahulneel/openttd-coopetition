# ADR-0013: UI Editor Implementation

## Status
Accepted

## Context
The campaign editor needed to replace "Coming Soon" placeholder pages with actual functional editors for goals and scenarios. The existing store already had full CRUD operations implemented, but the UI pages were not utilizing this functionality.

## Decision
We implemented comprehensive UI editors for both goals and scenarios that leverage the existing store functionality:

### Goal Editor Implementation
- **List View**: Replaced placeholder with a functional goals list showing:
  - Goal metadata (title, description, difficulty)
  - Objective details (type, amount, cargo type)
  - Reward information (cash, score, reputation)
  - Constraint information (players, date range)
  - Action buttons (edit, duplicate, delete)

- **Create/Edit Forms**: Implemented comprehensive forms with:
  - Basic information (ID, type, title, description, difficulty)
  - Objective configuration (type, amount, cargo-specific fields)
  - Constraints (player count, date range)
  - Rewards (cash, score, reputation, unlocks, achievements)
  - Form validation and error handling

### Scenario Editor Implementation
- **List View**: Replaced placeholder with a functional scenarios list showing:
  - Scenario metadata (title, description, difficulty)
  - Goal count and constraint information
  - Game settings summary
  - Action buttons (edit, duplicate, delete)

- **Create/Edit Forms**: Implemented comprehensive forms with:
  - Basic information (ID, title, description, difficulty)
  - Goal selection (checkbox list with goal details)
  - Constraints (player count, date range)
  - Game settings (economy, disasters, breakdowns, inflation, seasons)
  - Form validation and error handling

### Technical Implementation Details
- **Reused Existing Store**: Leveraged the existing `useCampaignStore` composable
- **Type Safety**: Used TypeScript interfaces for type safety
- **Error Handling**: Implemented toast notifications for user feedback
- **Navigation**: Used Nuxt's `navigateTo` for routing
- **Form Management**: Used reactive forms with proper validation
- **UI Components**: Utilized existing shadcn-vue components with OpenTTD theming

## Consequences

### Positive
- **Complete Functionality**: Users can now fully manage goals and scenarios through the UI
- **Consistent UX**: Maintains the established OpenTTD theming and design patterns
- **Type Safety**: TypeScript ensures data integrity and better developer experience
- **Reusable Code**: Leverages existing store functionality without duplication
- **User Feedback**: Toast notifications provide clear feedback for all operations

### Negative
- **Code Duplication**: Some form logic is duplicated between create and edit pages
- **No Advanced Validation**: Business rule validation beyond schema is not yet implemented
- **No Preview System**: Real-time preview of changes is not yet available

### Risks
- **Form Complexity**: The forms are quite complex and may need refactoring as requirements grow
- **Validation Gaps**: Missing advanced validation could lead to invalid data being saved

## Implementation Notes
- All forms use the existing store methods (`saveGoal`, `deleteGoal`, `duplicateGoal`, etc.)
- Error handling is consistent across all operations
- The UI maintains the established OpenTTD visual theme
- Forms are fully reactive and provide immediate feedback
- Navigation is handled consistently using Nuxt's routing

## Future Considerations
- **Form Refactoring**: Consider extracting common form logic into composables
- **Advanced Validation**: Implement business rule validation beyond schema
- **Preview System**: Add real-time preview of campaign changes
- **Bulk Operations**: Add support for bulk editing of goals and scenarios
- **Form Wizards**: Consider multi-step wizards for complex scenarios

## Related ADRs
- ADR-0009: Nuxt4 Tailwind4 shadcn-vue migration (established the UI framework)
- ADR-0008: Campaign authoring architecture (established the data structures)