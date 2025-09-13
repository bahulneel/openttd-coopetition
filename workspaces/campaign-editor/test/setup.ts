import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock Vue and Pinia
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    defineStore: vi.fn(),
    ref: vi.fn((value) => ({ value })),
    computed: vi.fn((fn) => ({ value: fn() })),
    onMounted: vi.fn(),
  }
})

vi.mock('pinia', () => ({
  defineStore: vi.fn(),
  createPinia: vi.fn(),
  setActivePinia: vi.fn(),
}))

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      forceInMemoryFileSystem: false,
    },
  }),
  navigateTo: vi.fn(),
  createSharedComposable: (fn: any) => fn,
}))

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock IndexedDB for BrowserFS
const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
  cmp: vi.fn(),
}

Object.defineProperty(window, 'indexedDB', {
  value: mockIndexedDB,
  writable: true,
})

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}))

// Mock BrowserFS
vi.mock('browserfs', () => ({
  configure: vi.fn(),
  BFSRequire: vi.fn(),
}))

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Configure Vue Test Utils
config.global.stubs = {
  NuxtLink: true,
  NuxtPage: true,
}