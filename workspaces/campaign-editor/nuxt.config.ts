// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Enable TypeScript
  typescript: {
    typeCheck: true
  },

  // SPA mode for GitHub Pages deployment
  ssr: process.env.NUXT_SPA_MODE === 'true' ? false : true,
  
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
        { name: 'description', content: 'Campaign authoring tool for OpenTTD Coopetition' }
      ]
    }
  },

  // CSS framework
  css: [
    '~/assets/css/main.css'
  ],

  // Modules
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/eslint',
  ],

  // UI configuration for Nuxt UI (includes Tailwind)
  ui: {
    global: true,
    icons: ['heroicons', 'lucide']
  },

  // Tailwind CSS configuration
  tailwindcss: {
    configPath: '~/tailwind.config.ts'
  },

  // Build configuration
  build: {
    transpile: ['vue-toastification']
  },

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      spaMode: process.env.NUXT_SPA_MODE === 'true',
      baseUrl: process.env.NUXT_BASE_URL || '/'
    }
  },

  // Development configuration
  devServer: {
    port: 3000,
    host: '0.0.0.0'
  },

  // Compatibility
  compatibilityDate: '2024-01-01'
})