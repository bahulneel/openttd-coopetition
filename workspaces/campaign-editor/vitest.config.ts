import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['test/unit/**/*.{test,spec}.{js,ts,vue}'],
    exclude: ['test/browser/**/*', 'test/e2e/**/*'],
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
      '@': resolve(__dirname, './app'),
    },
  },
  esbuild: {
    target: 'node14'
  }
})