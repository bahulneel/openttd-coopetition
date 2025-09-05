# ADR-0009: Migration to Nuxt 4, Tailwind CSS 4, and shadcn-vue

## Status
Accepted

## Context

The campaign authoring application was initially built with what were considered the latest versions of modern web technologies, but upon further research, it became clear that several major updates were available that would significantly improve the development experience and application performance:

### Technology Updates Available
1. **Nuxt 4**: While not officially released, Nuxt 4 compatibility mode is available in Nuxt 3, offering new directory structure, performance improvements, and modern development patterns
2. **Tailwind CSS 4**: Just released (January 22, 2025) with major performance improvements, CSS-first configuration, and modern CSS features
3. **shadcn-vue**: A better alternative to component libraries, providing copy-paste components built on Reka UI with full customization control

### Key Benefits of Migration
- **Performance**: Tailwind CSS 4 offers 5x faster full builds and 100x faster incremental builds
- **Modern CSS**: Leverage cascade layers, oklch colors, and other cutting-edge CSS features
- **Component Control**: shadcn-vue gives full ownership over components rather than third-party library dependency
- **Future-Proofing**: Aligns with the latest web platform standards and development practices

## Decision

We will migrate the campaign authoring application to use:

### 1. Nuxt 4 (Compatibility Mode)
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },
  srcDir: 'app/',
  // ... other config
})
```

**Directory Structure Changes**:
```
workspaces/campaign-editor/
├── app/                    # New Nuxt 4 source directory
│   ├── assets/            # Moved from root
│   ├── components/        # Moved from root
│   ├── pages/             # Moved from root
│   ├── layouts/           # Moved from root
│   ├── composables/       # Moved from root
│   ├── types/             # Moved from root
│   ├── utils/             # Moved from root
│   ├── plugins/           # Moved from root
│   └── app.vue            # Moved from root
├── server/                # Server-side code (stays at root)
├── nuxt.config.ts         # Config stays at root
└── package.json           # Package config stays at root
```

### 2. Tailwind CSS 4
```css
/* New CSS-first configuration */
@import "tailwindcss";

@theme {
  /* OpenTTD color scheme using modern OKLCH colors */
  --color-openttd-green: oklch(35% 0.12 130);
  --color-openttd-brown: oklch(65% 0.06 30);
  /* ... other theme variables */
}
```

**Key Changes**:
- **CSS-First Config**: No more `tailwind.config.js`, configuration in CSS using `@theme`
- **Modern Colors**: OKLCH color space for wider gamut and better color reproduction
- **Native Features**: Cascade layers, color-mix(), logical properties
- **Performance**: Dramatically faster builds and hot reload

### 3. shadcn-vue Components
```bash
# Component installation
npx shadcn-vue@latest add button card input
```

**Benefits**:
- **Full Control**: Copy-paste components that can be modified as needed
- **No Dependencies**: Components become part of the codebase, not external dependencies
- **Reka UI Foundation**: Built on modern, accessible Vue primitives
- **OpenTTD Integration**: Easy to style components with OpenTTD color scheme

## Implementation

### Phase 1: Project Structure Migration ✅
1. **Enable Nuxt 4 compatibility mode** in `nuxt.config.ts`
2. **Create new directory structure** by moving files to `app/` directory
3. **Update TypeScript configuration** for new paths and module resolution

### Phase 2: Tailwind CSS 4 Migration ✅
1. **Update dependencies** to Tailwind CSS 4 packages:
   - `tailwindcss@^4.0.0`
   - `@tailwindcss/postcss@^4.0.0`
   - `@tailwindcss/cli@^4.0.0`
2. **Convert CSS imports** from `@tailwind` directives to `@import "tailwindcss"`
3. **Migrate color scheme** to `@theme` block with OKLCH color values
4. **Remove old config** - delete `tailwind.config.ts` file
5. **Update PostCSS config** in `nuxt.config.ts`

### Phase 3: shadcn-vue Integration ✅
1. **Add shadcn-vue CLI** to devDependencies
2. **Create components.json** configuration file
3. **Install core components**: Button, Card, Input, Textarea, Select, Badge, Alert
4. **Create utility functions** in `app/lib/utils.ts`
5. **Update imports** in existing components

### Phase 4: Component Migration
1. **Replace @nuxt/ui components** with shadcn-vue equivalents
2. **Apply OpenTTD styling** to new components
3. **Update layout and page templates**
4. **Test all functionality** in both development and SPA modes

## Consequences

### Positive
- **Massive Performance Gains**: 5-100x faster builds dramatically improve development experience
- **Modern CSS Features**: Access to cutting-edge CSS features like cascade layers and OKLCH colors
- **Component Ownership**: Full control over UI components without external library constraints
- **Future-Proof Architecture**: Aligned with the latest web platform standards
- **Enhanced OpenTTD Theming**: Better color reproduction and authentic game-inspired styling
- **Improved Developer Experience**: Better tooling, faster feedback, and clearer separation of concerns

### Negative
- **Migration Effort**: Significant work to update existing components and templates
- **Learning Curve**: Team needs to understand new patterns and conventions
- **Potential Instability**: Using beta/compatibility versions may introduce unexpected issues
- **Documentation Gaps**: Some features may have limited documentation due to recent releases

### Risks
- **Breaking Changes**: Future updates might introduce compatibility issues
- **Ecosystem Maturity**: Some tools and integrations may not support latest versions
- **Component Migration**: Risk of visual regressions when converting components

### Mitigation Strategies
- **Progressive Migration**: Migrate components incrementally to minimize risk
- **Comprehensive Testing**: Test both development and SPA modes thoroughly
- **Fallback Options**: Keep ability to revert to older versions if needed
- **Documentation**: Document any workarounds or customizations made during migration

## Technical Details

### Nuxt 4 Features Enabled
```typescript
future: {
  compatibilityVersion: 4
}
```

This enables:
- New directory structure (`app/` as source directory)
- Shallow reactivity for better performance
- Normalized component names
- Enhanced file watching performance

### Tailwind CSS 4 Features Used
```css
@theme {
  /* Modern OKLCH colors for wider color gamut */
  --color-openttd-green: oklch(35% 0.12 130);
  
  /* Dynamic spacing scale */
  --spacing: 0.25rem;
  
  /* Custom design tokens */
  --font-display: "Inter", sans-serif;
}
```

**New Features Leveraged**:
- CSS cascade layers for better style organization
- OKLCH colors for improved color accuracy
- Dynamic utility values (e.g., `grid-cols-15` works out of the box)
- Container queries support
- Modern gradients with color interpolation

### shadcn-vue Integration
```json
{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "default",
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui"
  }
}
```

**Component Architecture**:
- Copy-paste components rather than npm dependencies
- Built on Reka UI for accessibility and modern patterns
- Full customization capabilities
- Compatible with OpenTTD theming system

## Testing Strategy

### Development Testing
- Test component rendering with OpenTTD theme
- Verify file system operations work correctly
- Test hot reload and development experience

### SPA Mode Testing  
- Ensure all functionality works without server
- Test localStorage persistence
- Verify ZIP import/export functionality

### Performance Testing
- Measure build time improvements
- Test incremental build speed
- Monitor bundle size changes

## Future Considerations

### When Nuxt 4 is Officially Released
- Migrate from compatibility mode to full Nuxt 4
- Review any breaking changes or new features
- Update documentation and deployment processes

### Tailwind CSS 4 Stabilization
- Monitor for any bug fixes or feature updates
- Consider additional modern CSS features as they become available
- Optimize theme configuration based on usage patterns

### Component Library Expansion
- Add more shadcn-vue components as needed
- Create custom OpenTTD-themed component variants
- Consider contributing back to the shadcn-vue ecosystem

## References

- [Nuxt 4 Migration Guide](https://nuxt.com/docs/getting-started/upgrade#nuxt-4)
- [Tailwind CSS 4.0 Release Notes](https://tailwindcss.com/blog/tailwindcss-v4)
- [shadcn-vue Documentation](https://www.shadcn-vue.com/)
- [OpenTTD GUI Style Guide](https://wiki.openttd.org/en/Development/GUI%20Style%20Guide)
- [ADR-0008: Campaign Authoring Architecture](./0008-campaign-authoring-architecture.md)