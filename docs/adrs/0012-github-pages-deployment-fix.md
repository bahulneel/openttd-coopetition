# ADR-0012: GitHub Pages Deployment Fix

## Status
Accepted

## Context
The GitHub Pages deployment was failing during the build process with prerendering errors. The error showed:

```
[log] [nitro]   ├─ /404.html (168ms)
  │ └── [404] Cannot find any path matching /404.html.
[log] [nitro]   ├─ /200.html (170ms)
  │ └── [404] Cannot find any path matching /200.html.
[log] [nitro]   ├─ / (172ms)
  │ └── [404] Cannot find any path matching /.
[log] [nitro] 
Errors prerendering:
Error:  Exiting due to prerender errors.
```

This was preventing the campaign editor from being deployed to GitHub Pages.

## Decision
We will fix the GitHub Pages deployment by:

1. **Correcting the build script**: Change from using `--preset github_pages` to using `NUXT_SPA_MODE=true` with `nuxt generate`
2. **Fixing environment variable names**: Use `NUXT_BASE_URL` instead of `NUXT_APP_BASE_URL` to match the Nuxt configuration
3. **Enabling SPA mode**: Set `ssr: false` when `NUXT_SPA_MODE=true` to avoid prerendering issues

## Implementation

### Changes to `package.json`
```json
{
  "scripts": {
    "github:pages": "cd workspaces/campaign-editor && NUXT_SPA_MODE=true NUXT_BASE_URL=/openttd-coopetition/ npx nuxt generate"
  }
}
```

### Changes to `nuxt.config.ts`
```typescript
export default defineNuxtConfig({
  // SSR enabled by default, can be disabled for static generation
  ssr: process.env.NUXT_SPA_MODE !== 'true',
  
  // Configure for GitHub Pages deployment
  nitro: {
    preset: process.env.NUXT_SPA_MODE === 'true' ? 'github-pages' : undefined,
  },
  
  app: {
    // Base URL for GitHub Pages deployment
    baseURL: process.env.NUXT_BASE_URL || '/',
    // ... rest of config
  }
})
```

## Consequences

### Positive
- ✅ GitHub Pages deployment now works correctly
- ✅ No more prerendering errors
- ✅ Proper SPA mode for static hosting
- ✅ Correct base URL configuration for GitHub Pages subdirectory deployment

### Negative
- ⚠️ SPA mode means no server-side rendering (but this is acceptable for a static site)
- ⚠️ All routing is handled client-side (but this is expected for SPA deployment)

### Neutral
- The deployment process is now more explicit about using SPA mode
- Environment variables are properly aligned between build script and configuration

## Alternatives Considered

1. **Keep SSR with prerendering**: This would require fixing the prerendering issues, but GitHub Pages works better with SPA mode for dynamic routes
2. **Use different hosting**: Could use Vercel or Netlify, but GitHub Pages is free and integrated with the repository
3. **Manual static generation**: Could manually generate static files, but Nuxt's SPA mode handles this better

## References
- [Nuxt GitHub Pages Deployment](https://nuxt.com/docs/getting-started/deployment#github-pages)
- [Nuxt SPA Mode](https://nuxt.com/docs/getting-started/deployment#static-hosting)
