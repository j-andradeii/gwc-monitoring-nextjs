import { test, expect } from '@playwright/test';

const NARROW_WIDTHS = [600, 768, 900, 1023];

async function getReaderGridColumns(page: import('@playwright/test').Page) {
  return page.locator('.sermon-reader-grid').evaluate((el) =>
    getComputedStyle(el).gridTemplateColumns,
  );
}

test.describe('Sermon Detail — client-side navigation CSS', () => {
  for (const width of NARROW_WIDTHS) {
    test(`responsive 1-col layout at ${width}px after sermon-card click`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/sermon-notes');
      await page.waitForLoadState('networkidle');

      const firstCard = page.locator('a[href^="/sermon-notes/"]').first();
      await expect(firstCard).toBeVisible();
      await firstCard.click();
      await page.waitForURL(/\/sermon-notes\/.+/);
      await page.waitForSelector('.sermon-reader-grid');

      const cols = await getReaderGridColumns(page);
      await page.screenshot({ path: `test-results/click-${width}.png`, fullPage: true });

      const trackCount = cols.trim().split(/\s+/).length;
      expect(trackCount, `Grid at ${width}px: "${cols}"`).toBe(1);
    });

    test(`responsive 1-col layout at ${width}px after back-nav`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/sermon-notes');
      await page.waitForLoadState('networkidle');

      await page.locator('a[href^="/sermon-notes/"]').first().click();
      await page.waitForURL(/\/sermon-notes\/.+/);
      await page.waitForSelector('.sermon-reader-grid');

      await page.goBack();
      await page.waitForURL('**/sermon-notes');
      await page.waitForLoadState('networkidle');

      await page.locator('a[href^="/sermon-notes/"]').first().click();
      await page.waitForURL(/\/sermon-notes\/.+/);
      await page.waitForSelector('.sermon-reader-grid');

      const cols = await getReaderGridColumns(page);
      await page.screenshot({ path: `test-results/back-${width}.png`, fullPage: true });

      const trackCount = cols.trim().split(/\s+/).length;
      expect(trackCount, `Grid at ${width}px after back-nav: "${cols}"`).toBe(1);
    });
  }

  test('desktop 2-column layout applies at 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/sermon-notes');
    await page.locator('a[href^="/sermon-notes/"]').first().click();
    await page.waitForURL(/\/sermon-notes\/.+/);
    await page.waitForSelector('.sermon-reader-grid');

    const cols = await getReaderGridColumns(page);
    await page.screenshot({ path: 'test-results/desktop-1280.png', fullPage: true });

    const trackCount = cols.trim().split(/\s+/).length;
    expect(trackCount, `Grid at 1280px: "${cols}"`).toBe(2);
  });
});
