import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audit', () => {
  const pagesToAudit = [
    { name: 'Homepage', url: '/' },
    { name: 'Catalog', url: '/catalog' },
    { name: 'Contact', url: '/contact' },
    { name: 'Stores', url: '/stores' }
  ];

  for (const { name, url } of pagesToAudit) {
    test(`Should not have any automatically detectable accessibility issues on ${name}`, async ({ page }) => {
      await page.goto(url);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
