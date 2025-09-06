# ADR-0014: Goal Progress Tracking Implementation

## Status
Accepted

## Context
The GameScript implementation had syntax errors and incomplete goal progress tracking functionality. The status page indicated that UpdateProgress() methods were not fully implemented, and there were missing event listeners for cargo delivery, station building, and vehicle creation.

## Decision
We implemented comprehensive goal progress tracking by fixing syntax errors and completing the missing functionality:

### Syntax Error Fixes
- **Main Controller**: Fixed missing `break` statements in event handling switch cases
- **Event Handlers**: Corrected variable declarations and method calls
- **Player Goals**: Fixed indentation and missing function declarations
- **Dashboard**: Corrected method calls and variable references
- **Campaign**: Fixed syntax errors in goal creation and progression logic

### Goal Progress Tracking Implementation
- **Event-Driven Updates**: Implemented proper event handling for:
  - `GSEvent.ET_COMPANY_DELIVERED_CARGO`: Updates cargo delivery goals
  - `GSEvent.ET_COMPANY_PERFORMANCE_RATING`: Updates performance goals
  - `GSEvent.ET_COMPANY_NEW`: Initializes goals for new companies
  - `GSEvent.ET_COMPANY_BANKRUPT`: Cleans up goals for bankrupt companies

- **Progress Update Methods**: Completed implementation of:
  - `UpdateProgress(amount)`: Incremental progress updates
  - `SetProgress(value)`: Absolute progress updates
  - `Update()`: Regular progress recalculation based on goal type

- **Goal Type Support**: Implemented progress tracking for:
  - **Cargo Delivery**: Tracks cargo amounts delivered by company
  - **Profit**: Uses `GSCompanyEconomy.GetQuarterlyIncome()`
  - **Performance**: Uses `GSCompany.GetQuarterlyPerformanceRating()`
  - **Station Count**: Counts stations (with API limitations noted)
  - **Vehicle Count**: Counts vehicles by type and owner
  - **Town Service**: Tracks towns served (simplified due to API limitations)
  - **Route Efficiency**: Placeholder for future implementation

### Shared Goal Progress Tracking
- **Contribution Tracking**: Maintains individual company contributions
- **Real-time Updates**: Updates progress as events occur
- **Tier System**: Implements bronze/silver/gold tier thresholds
- **Reward Distribution**: Proportional reward distribution based on contributions

### Player Goal Progress Tracking
- **Company-Specific**: Each company has independent goal progress
- **Automatic Updates**: Progress updates automatically based on game events
- **Manual Updates**: Support for manual progress updates where needed
- **Completion Detection**: Automatic detection of goal completion

## Consequences

### Positive
- **Complete Functionality**: All goal types now have proper progress tracking
- **Real-time Updates**: Progress updates immediately as players perform actions
- **Event-Driven**: Efficient event-driven architecture reduces CPU usage
- **Flexible**: Supports both incremental and absolute progress updates
- **Robust**: Proper error handling and API limitations awareness

### Negative
- **API Limitations**: Some functionality is simplified due to OpenTTD GS API limitations
- **Complexity**: The progress tracking system is quite complex and may be hard to debug
- **Performance**: Frequent updates could impact performance in large multiplayer games

### Risks
- **API Changes**: OpenTTD GS API changes could break progress tracking
- **Memory Usage**: Storing progress data for all companies could use significant memory
- **Synchronization**: Progress updates need to be synchronized across all clients

## Implementation Notes
- **Event Handling**: All progress updates are triggered by game events
- **Data Persistence**: Progress is saved/loaded with the game state
- **Error Handling**: Graceful handling of API limitations and errors
- **Logging**: Comprehensive logging for debugging and monitoring
- **Performance**: Optimized to minimize impact on game performance

## API Limitations Addressed
- **Station Ownership**: Cannot directly check station ownership, so station counting is simplified
- **Town Service**: Cannot directly check which towns are served, so implementation is simplified
- **Route Efficiency**: Complex to implement without detailed route tracking

## Future Considerations
- **Advanced Tracking**: Implement more sophisticated progress tracking algorithms
- **Performance Optimization**: Optimize for large multiplayer games
- **API Extensions**: Add support for new OpenTTD GS API features as they become available
- **Custom Goals**: Support for user-defined goal types
- **Analytics**: Add detailed progress analytics and reporting

## Related ADRs
- ADR-0001: GS registration and settings (established the GameScript framework)
- ADR-0002: Goal visibility UI (established the UI framework)
- ADR-0003: UI surfaces and onboarding (established the user experience)