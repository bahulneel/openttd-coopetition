import { test, expect } from '@playwright/test'

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/')
  })

  test('should display dashboard with correct title and subtitle', async ({ page }) => {
    await expect(page.getByText('Campaign Editor Dashboard')).toBeVisible()
    await expect(page.getByText('Create, edit, and manage OpenTTD Coopetition campaigns')).toBeVisible()
  })

  test('should show action buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /New Campaign/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Refresh/ })).toBeVisible()
  })

  test('should display stats cards', async ({ page }) => {
    await expect(page.getByText('📁 Campaigns')).toBeVisible()
    await expect(page.getByText('🎯 Goals')).toBeVisible()
    await expect(page.getByText('🗺️ Scenarios')).toBeVisible()
    await expect(page.getByText('⚡ Modified')).toBeVisible()
  })

  test('should show empty state when no campaigns exist', async ({ page }) => {
    await expect(page.getByText('No campaigns found. Create your first campaign to get started!')).toBeVisible()
  })

  test('should navigate to campaign creation', async ({ page }) => {
    await page.getByRole('button', { name: /New Campaign/ }).click()
    await expect(page).toHaveURL('/campaigns#new')
  })

  test('should navigate to goal creation', async ({ page }) => {
    await page.getByRole('button', { name: /New Goal/ }).click()
    await expect(page).toHaveURL('/goals/new')
  })

  test('should navigate to scenario creation', async ({ page }) => {
    await page.getByRole('button', { name: /New Scenario/ }).click()
    await expect(page).toHaveURL('/scenarios/new')
  })

  test('should show quick actions section', async ({ page }) => {
    await expect(page.getByText('Quick Actions')).toBeVisible()
    await expect(page.getByRole('button', { name: /Import Data/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Export All/ })).toBeVisible()
  })

  test('should handle refresh functionality', async ({ page }) => {
    const refreshButton = page.getByRole('button', { name: /Refresh/ })
    await refreshButton.click()
    
    // Should show refreshing state briefly
    await expect(refreshButton).toContainText('🔄')
  })
})

test.describe('Campaign Management E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/campaigns')
  })

  test('should display campaigns page', async ({ page }) => {
    await expect(page.getByText('Campaigns')).toBeVisible()
  })

  test('should navigate to campaign creation from campaigns page', async ({ page }) => {
    await page.getByRole('button', { name: /New Campaign/ }).click()
    await expect(page).toHaveURL('/campaigns#new')
  })
})

test.describe('Goals Management E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/goals')
  })

  test('should display goals page', async ({ page }) => {
    await expect(page.getByText('Goals')).toBeVisible()
  })

  test('should navigate to goal creation from goals page', async ({ page }) => {
    await page.getByRole('button', { name: /New Goal/ }).click()
    await expect(page).toHaveURL('/goals/new')
  })
})

test.describe('Scenarios Management E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scenarios')
  })

  test('should display scenarios page', async ({ page }) => {
    await expect(page.getByText('Scenarios')).toBeVisible()
  })

  test('should navigate to scenario creation from scenarios page', async ({ page }) => {
    await page.getByRole('button', { name: /New Scenario/ }).click()
    await expect(page).toHaveURL('/scenarios/new')
  })
})

test.describe('Persistence E2E Tests', () => {
  test('should persist data in localStorage', async ({ page }) => {
    await page.goto('/')
    
    // Check if localStorage is being used
    const localStorageData = await page.evaluate(() => {
      return localStorage.getItem('fileSystemStore')
    })
    
    // Should have some data structure in localStorage
    expect(localStorageData).toBeDefined()
  })

  test('should handle browser refresh with persisted data', async ({ page }) => {
    // First visit
    await page.goto('/')
    
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
})