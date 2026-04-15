import { expect, test } from '@playwright/test'

test.describe('Catalog filter URL state', () => {
  test('catalog page loads and supports query params', async ({ page }) => {
    const res = await page.goto('/catalog?sort=name-a-z&status=in-stock')
    expect(res?.ok()).toBeTruthy()
    await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible()
  })

  test('active filter chips appear when sort is non-default', async ({ page }) => {
    await page.goto('/catalog?sort=oldest')
    await expect(page.getByText('Active filters:')).toBeVisible()
    await expect(page.getByText(/Sort: Oldest/)).toBeVisible()
  })
})
