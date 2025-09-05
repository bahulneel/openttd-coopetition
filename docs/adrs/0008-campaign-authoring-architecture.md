# ADR-0008: Campaign Authoring Architecture and Tooling

## Status
Accepted

## Context

The OpenTTD Coopetition project requires a user-friendly way to create, edit, and manage campaigns without requiring users to manually edit YAML files or understand the underlying file structure. The existing system uses YAML files stored in the `campaigns/` directory, but lacks tooling for non-technical users to create and modify campaigns.

Key requirements:
- **Accessibility**: Non-technical users should be able to create campaigns
- **Dual Mode Operation**: Support both local development (with file system access) and browser-only operation (SPA mode)
- **Modern UX**: Provide a contemporary web interface with good usability
- **Data Integrity**: Maintain compatibility with existing YAML-based campaign system
- **Deployment Flexibility**: Support GitHub Pages deployment and personal Docker deployment

## Decision

We will create a comprehensive campaign authoring tool as a separate workspace using modern web technologies:

### Technology Stack
- **Frontend Framework**: Nuxt 4 with Vue 3 and TypeScript
- **UI Framework**: Tailwind CSS 4 with shadcn-vue components
- **State Management**: Vue composables with reactive state
- **File Operations**: Dual-mode file system adapter pattern

### Architecture Components

#### 1. Dual-Mode File System Architecture

```typescript
interface FileSystemAdapter {
  loadCampaigns(): Promise<Campaign[]>
  saveCampaign(campaign: Campaign): Promise<void>
  exportAll(): Promise<Blob>
  // ... other operations
}
```

**Local Mode (Development)**:
- Uses Nuxt server API routes to interact with the actual `campaigns/` directory
- Provides real-time file system access for development workflows
- Supports hot-reloading of campaign changes

**SPA Mode (Browser-Only)**:
- Stores data in browser localStorage for persistence
- Provides import/export functionality via ZIP files
- Enables deployment to static hosting (GitHub Pages)
- Uses JSZip for file operations

#### 2. Component Architecture

```
workspaces/campaign-editor/
├── pages/                    # Route-based pages
│   ├── index.vue            # Dashboard
│   ├── campaigns/           # Campaign management
│   ├── goals/               # Goal management
│   └── scenarios/           # Scenario management
├── components/              # Reusable UI components
├── composables/             # State management and business logic
├── utils/                   # Utility functions and file system adapters
├── server/api/              # Server-side API for local mode
└── types/                   # TypeScript type definitions
```

#### 3. Data Flow Architecture

1. **Loading**: File system adapter loads data from appropriate source
2. **State Management**: Composables manage reactive state and provide CRUD operations
3. **UI Binding**: Vue components reactively display and edit data
4. **Persistence**: Changes are automatically saved through the file system adapter
5. **Export**: Data can be exported as ZIP files for distribution

### Deployment Strategies

#### 1. Development Mode
```bash
cd workspaces/campaign-editor
npm run dev
```
- Full file system access
- Live reload of campaign files
- Server-side API endpoints

#### 2. SPA Mode (GitHub Pages)
```yaml
# GitHub Actions workflow
- name: Build SPA
  env:
    NUXT_SPA_MODE: true
  run: npm run generate
```
- Browser-only operation
- No server required
- Deployed as static site

#### 3. Docker Deployment
```dockerfile
FROM node:20-alpine
# ... build and deployment configuration
```
- Self-contained deployment
- Can run with or without file system access
- Includes health checks and proper signal handling

### User Experience Design

#### 1. Progressive Enhancement
- **Basic**: Form-based editing with validation
- **Enhanced**: Real-time preview and validation
- **Advanced**: Clone/copy operations, bulk editing

#### 2. Data Validation
- **Schema Validation**: Ensure YAML structure compliance
- **Business Rule Validation**: Check logical consistency (e.g., goal references)
- **Real-time Feedback**: Immediate validation as users type

#### 3. Import/Export Workflows
- **Import**: Drag-and-drop ZIP file import
- **Export**: One-click export to ZIP
- **Clone/Copy**: Easy duplication with automatic ID generation

## Consequences

### Positive
- **Accessibility**: Non-technical users can create campaigns through a GUI
- **Flexibility**: Supports both development and production workflows
- **Modern UX**: Contemporary interface with good usability patterns
- **Deployment Options**: Multiple deployment strategies for different use cases
- **Data Integrity**: Maintains compatibility with existing YAML system
- **Extensibility**: Easy to add new campaign features and validation rules

### Negative
- **Complexity**: Adds significant complexity to the project
- **Maintenance**: Requires ongoing maintenance of web application
- **Dependencies**: Introduces many new JavaScript dependencies
- **Dual Codepath**: Two different file system implementations to maintain

### Risks
- **Data Loss**: Potential for data corruption if file operations fail
- **Browser Limitations**: localStorage limits in SPA mode
- **Deployment Complexity**: Multiple deployment modes increase operational complexity
- **Version Drift**: Web interface might lag behind YAML schema changes

### Mitigation Strategies
- **Comprehensive Testing**: Unit and integration tests for both file system modes
- **Backup Systems**: Automatic backup before destructive operations
- **Schema Validation**: Strong validation to prevent invalid data
- **Documentation**: Clear documentation for all deployment modes
- **Gradual Migration**: Maintain YAML editing alongside web interface

## Implementation Plan

### Phase 1: Core Infrastructure ✅
- Workspace setup with Nuxt 4, Tailwind 4, shadcn-vue
- TypeScript interfaces for campaign data structures
- Dual-mode file system adapter implementation
- Basic CRUD operations and state management

### Phase 2: User Interface
- Campaign list and detail views
- Goal and scenario management interfaces
- Form validation and user feedback
- Import/export functionality

### Phase 3: Advanced Features
- Clone/copy operations
- Bulk editing capabilities
- Advanced validation rules
- Preview and testing features

### Phase 4: Deployment and CI/CD
- GitHub Pages deployment pipeline
- Docker deployment configuration
- Documentation and user guides
- Integration with existing build system

## References
- [ADR-0006: NPM Workspaces Structure](./0006-npm-workspaces-structure.md)
- [ADR-0004: Data-Driven Goals and Authoring](./0004-data-driven-goals-and-authoring.md)
- [Nuxt 4 Documentation](https://nuxt.com/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn-vue](https://www.shadcn-vue.com/)
- [OpenTTD GameScript API](https://docs.openttd.org/gs-api/)