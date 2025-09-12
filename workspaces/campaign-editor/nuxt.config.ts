// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // TypeScript configuration
  typescript: {
    typeCheck: true,
  },

  // SSR enabled by default, can be disabled for static generation
  ssr: process.env.NUXT_SPA_MODE !== 'true',

  // Configure for GitHub Pages deployment
  nitro: {
    preset: process.env.NUXT_SPA_MODE === 'true' ? 'github-pages' : undefined,
  },

  app: {
    // Base URL for GitHub Pages deployment
    baseURL: process.env.NUXT_BASE_URL || '/',
    head: {
      title: 'OpenTTD Coopetition Campaign Editor',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Campaign authoring tool for OpenTTD Coopetition' },
      ],
    },
  },

  // CSS framework - Tailwind CSS 4
  css: ['~/assets/css/main.css'],

  // PostCSS configuration for Tailwind CSS 4
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  // Modules
  modules: ['@vueuse/nuxt', '@nuxtjs/color-mode', '@nuxt/eslint', 'shadcn-nuxt', '@pinia/nuxt'],

  // Color mode configuration for dark/light theme toggle
  colorMode: {
    classSuffix: '',
  },

  // shadcn-vue configuration for auto-importing components
  shadcn: {
    /**
     * Prefix for all the imported components
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui',
  },

  // Build configuration
  build: {
    transpile: ['reka-ui'],
  },

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_BASE_URL || '/',
      forceInMemoryFileSystem: process.env.NUXT_FORCE_IN_MEMORY_FS === 'true',
    },
  },

  // Development configuration
  devServer: {
    port: 3000,
    host: '0.0.0.0',
  },

  // Auto-imports configuration
  imports: {
    dirs: ['stores/**'],
  },
})
