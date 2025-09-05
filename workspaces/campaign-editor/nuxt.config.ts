// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Enable Nuxt 4 compatibility mode
  future: {
    compatibilityVersion: 4
  },

  // Nuxt 4 directory structure
  srcDir: 'app/',

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

  // CSS framework - Tailwind CSS 4
  css: [
    '~/assets/css/main.css'
  ],

  // PostCSS configuration for Tailwind CSS 4
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  },

  // Modules
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/color-mode'
  ],

  // Color mode configuration for dark/light theme toggle
  colorMode: {
    classSuffix: ''
  },

  // Build configuration
  build: {
    transpile: ['reka-ui']
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