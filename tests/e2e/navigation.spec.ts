import { expect, test } from '@playwright/test'

test.describe('Navigation smoke', () => {
  test('desktop primary nav links navigate', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop-only smoke path')

    await page.goto('/')

    const desktopNav = page.getByRole('navigation', { name: 'Primary' })
    await expect(desktopNav).toBeVisible()

    await desktopNav.getByRole('link', { name: 'Catalog' }).click()
    await expect(page).toHaveURL(/\/catalog$/)
    await expect(desktopNav.getByRole('link', { name: 'Catalog' })).toHaveAttribute('aria-current', 'page')
  })

  test('mobile menu opens and navigates', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only smoke path')

    await page.goto('/')

    const menuButton = page.getByRole('button', { name: 'Menu' })
    await expect(menuButton).toBeVisible()

    await menuButton.click()
    const mobileNav = page.getByRole('navigation', { name: 'Mobile primary' })
    await expect(mobileNav).toBeVisible()

    await mobileNav.getByRole('link', { name: 'Collections' }).click()
    await expect(page).toHaveURL(/\/collections$/)
  })
})
