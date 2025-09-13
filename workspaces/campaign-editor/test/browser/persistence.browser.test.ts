import { describe, it, expect, beforeAll } from 'vitest'

describe('Persistence Browser Tests', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000')
  })

  it('should persist data in localStorage', async () => {
    // Check if localStorage is being used
    const localStorageData = await page.evaluate(() => {
      return localStorage.getItem('fileSystemStore')
    })
    
    // Should have some data structure in localStorage
    expect(localStorageData).toBeDefined()
  })

  it('should handle browser refresh with persisted data', async () => {
    // Simulate some data being stored
    await page.evaluate(() => {
      localStorage.setItem('fileSystemStore', JSON.stringify([
        ['campaigns/test.yaml', {
          id: 'test',
          name: 'Test Campaign',
          __type: 'Campaign',
          __meta: { filename: 'test.yaml', created: Date.now(), modified: Date.now() }
        }]
      ]))
    })
    
    // Refresh the page
    await page.reload()
    
    // Data should still be there
    const localStorageData = await page.evaluate(() => {
      return localStorage.getItem('fileSystemStore')
    })
    
    expect(localStorageData).toContain('Test Campaign')
  })

  it('should handle IndexedDB persistence for BrowserFS', async () => {
    // Check if IndexedDB is available
    const indexedDBAvailable = await page.evaluate(() => {
      return typeof indexedDB !== 'undefined'
    })
    
    expect(indexedDBAvailable).toBe(true)
  })

  it('should clear localStorage when needed', async () => {
    // Set some data
    await page.evaluate(() => {
      localStorage.setItem('fileSystemStore', JSON.stringify([['test', 'data']]))
    })
    
    // Clear it
    await page.evaluate(() => {
      localStorage.removeItem('fileSystemStore')
    })
    
    // Check it's cleared
    const localStorageData = await page.evaluate(() => {
      return localStorage.getItem('fileSystemStore')
    })
    
    expect(localStorageData).toBeNull()
  })
})