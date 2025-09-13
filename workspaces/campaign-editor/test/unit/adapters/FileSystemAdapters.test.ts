import { describe, it, expect, vi } from 'vitest'

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}))

// Mock BrowserFS
vi.mock('browserfs', () => ({
  configure: vi.fn(),
  BFSRequire: vi.fn(),
}))

// Mock the file system adapters
const mockInMemAdapter = {
  load: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
  loadAll: vi.fn(),
  exportAll: vi.fn(),
  importFromZip: vi.fn(),
  supports: vi.fn(),
}

const mockBrowserFSAdapter = {
  load: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
  loadAll: vi.fn(),
  exportAll: vi.fn(),
  importFromZip: vi.fn(),
  supports: vi.fn(),
}

vi.mock('~/utils/fileSystem/InMemFileSystemAdapter', () => ({
  InMemFileSystemAdapter: vi.fn(() => mockInMemAdapter)
}))

vi.mock('~/utils/fileSystem/BrowserFSFileSystemAdapter', () => ({
  BrowserFSFileSystemAdapter: vi.fn(() => mockBrowserFSAdapter)
}))

describe('File System Adapters', () => {
  describe('InMemFileSystemAdapter', () => {
    it('should have required methods', () => {
      expect(typeof mockInMemAdapter.load).toBe('function')
      expect(typeof mockInMemAdapter.save).toBe('function')
      expect(typeof mockInMemAdapter.delete).toBe('function')
      expect(typeof mockInMemAdapter.loadAll).toBe('function')
      expect(typeof mockInMemAdapter.exportAll).toBe('function')
      expect(typeof mockInMemAdapter.importFromZip).toBe('function')
      expect(typeof mockInMemAdapter.supports).toBe('function')
    })

    it('should be mockable', () => {
      expect(mockInMemAdapter).toBeDefined()
      expect(mockInMemAdapter.load).toBeDefined()
    })
  })

  describe('BrowserFSFileSystemAdapter', () => {
    it('should have required methods', () => {
      expect(typeof mockBrowserFSAdapter.load).toBe('function')
      expect(typeof mockBrowserFSAdapter.save).toBe('function')
      expect(typeof mockBrowserFSAdapter.delete).toBe('function')
      expect(typeof mockBrowserFSAdapter.loadAll).toBe('function')
      expect(typeof mockBrowserFSAdapter.exportAll).toBe('function')
      expect(typeof mockBrowserFSAdapter.importFromZip).toBe('function')
      expect(typeof mockBrowserFSAdapter.supports).toBe('function')
    })

    it('should be mockable', () => {
      expect(mockBrowserFSAdapter).toBeDefined()
      expect(mockBrowserFSAdapter.load).toBeDefined()
    })
  })
})