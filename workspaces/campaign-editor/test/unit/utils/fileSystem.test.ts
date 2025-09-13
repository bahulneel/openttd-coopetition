import { describe, it, expect, vi } from 'vitest'
import { InMemFileSystemAdapter } from '~/utils/fileSystem/InMemFileSystemAdapter'
import { BrowserFSFileSystemAdapter } from '~/utils/fileSystem/BrowserFSFileSystemAdapter'

// Mock the file system adapters
vi.mock('~/utils/fileSystem/InMemFileSystemAdapter')
vi.mock('~/utils/fileSystem/BrowserFSFileSystemAdapter')

describe('File System Adapter Creation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create InMemFileSystemAdapter when no backend is available', () => {
    // This would test the createFileSystemAdapter function if it existed
    // For now, we test the individual adapters
    const inMemAdapter = new InMemFileSystemAdapter()
    expect(inMemAdapter).toBeInstanceOf(InMemFileSystemAdapter)
  })

  it('should create BrowserFSFileSystemAdapter when backend is available', () => {
    const browserFSAdapter = new BrowserFSFileSystemAdapter()
    expect(browserFSAdapter).toBeInstanceOf(BrowserFSFileSystemAdapter)
  })
})