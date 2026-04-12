import { test, expect } from '@playwright/test';

test.describe('Responsive Matrix Integration', () => {
  const pagesToTest = [
    { name: 'Homepage', url: '/' },
    { name: 'Catalog', url: '/catalog' }
  ];

  for (const { name, url } of pagesToTest) {
    test(`Layout sanity check for ${name}`, async ({ page, isMobile }) => {
      await page.goto(url);
      
      // Basic sanity check: no horizontal scrolling
      const boundingBox = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        };
      });

      // Allow a small pixel variance for scrollbars
      expect(boundingBox.scrollWidth).toBeLessThanOrEqual(boundingBox.clientWidth + 15);
      
      // Ensure the mobile menu exists when on mobile
      if (isMobile) {
        const menuButton = page.locator('button:has(svg:not([aria-hidden="true"]))').first();
        // Just verify it's there
        await expect(menuButton).toBeAttached();
      }
    });
  }
});
