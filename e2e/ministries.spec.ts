import { test, expect } from '@playwright/test';
import { ministries } from '../src/data/ministries';

test.describe('Ministries Community Page', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the ministries page before each test
        await page.goto('/ministries/community');
    });

    test('should load the page and verify all ministry titles are displayed', async ({ page }) => {
        // Verify structural elements
        const header = page.locator('.landing-header');
        await expect(header).toBeVisible();

        const mainTitle = page.locator('h1', { hasText: 'Community' });
        await expect(mainTitle).toBeVisible();

        // Verify all ministry titles from the static data list are rendered correctly
        for (const ministry of ministries) {
            const ministryTitle = page.locator(`h2.ministry-feature-title:has-text("${ministry.title}")`).first();
            await expect(ministryTitle).toBeVisible();
        }
    });

    test('should verify Gateway Kids description is specifically displayed', async ({ page }) => {
        // We specifically updated the 'Gateway Kids' content recently, let's verify that text shows up
        const kidsMinistry = ministries.find(m => m.id === '4');
        expect(kidsMinistry).toBeDefined();

        if (kidsMinistry) {
            // Find the specific section for Gateway Kids
            const kidsSection = page.locator('section').filter({ hasText: 'Gateway Kids' }).first();
            await expect(kidsSection).toBeVisible();

            // Check for a snippet of the new description
            const snippet = "ready and happy to serve everyone who visits with their precious ones";
            const descriptionLocator = kidsSection.locator('div').filter({ hasText: new RegExp(snippet, 'i') }).last();
            await expect(descriptionLocator).toBeVisible();
        }
    });

    test('should verify Gateway Couples title is exactly displayed', async ({ page }) => {
        // Find the section for Gateway Couples
        const couplesSection = page.locator('section').filter({ hasText: 'Gateway Couples' }).first();
        await expect(couplesSection).toBeVisible();
    });
});
