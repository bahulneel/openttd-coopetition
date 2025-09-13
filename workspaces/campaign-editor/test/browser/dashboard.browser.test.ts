import { describe, it, expect, beforeAll } from 'vitest'

describe('Dashboard Browser Tests', () => {
  beforeAll(async () => {
    // Navigate to the dashboard
    await page.goto('http://localhost:3000')
  })

  it('should display dashboard with correct title and subtitle', async () => {
    await expect(page.getByText('Campaign Editor Dashboard')).toBeVisible()
    await expect(page.getByText('Create, edit, and manage OpenTTD Coopetition campaigns')).toBeVisible()
  })

  it('should show action buttons', async () => {
    await expect(page.getByRole('button', { name: /New Campaign/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Refresh/ })).toBeVisible()
  })

  it('should display stats cards', async () => {
    await expect(page.getByText('📁 Campaigns')).toBeVisible()
    await expect(page.getByText('🎯 Goals')).toBeVisible()
    await expect(page.getByText('🗺️ Scenarios')).toBeVisible()
    await expect(page.getByText('⚡ Modified')).toBeVisible()
  })

  it('should show empty state when no campaigns exist', async () => {
    await expect(page.getByText('No campaigns found. Create your first campaign to get started!')).toBeVisible()
  })

  it('should navigate to campaign creation', async () => {
    await page.getByRole('button', { name: /New Campaign/ }).click()
    await expect(page).toHaveURL('/campaigns#new')
  })

  it('should navigate to goal creation', async () => {
    await page.getByRole('button', { name: /New Goal/ }).click()
    await expect(page).toHaveURL('/goals/new')
  })

  it('should navigate to scenario creation', async () => {
    await page.getByRole('button', { name: /New Scenario/ }).click()
    await expect(page).toHaveURL('/scenarios/new')
  })

  it('should show quick actions section', async () => {
    await expect(page.getByText('Quick Actions')).toBeVisible()
    await expect(page.getByRole('button', { name: /Import Data/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Export All/ })).toBeVisible()
  })

  it('should handle refresh functionality', async () => {
    const refreshButton = page.getByRole('button', { name: /Refresh/ })
    await refreshButton.click()
    
    // Should show refreshing state briefly
    await expect(refreshButton).toContainText('🔄')
  })
})