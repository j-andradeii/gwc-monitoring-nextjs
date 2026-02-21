import { test, expect } from '@playwright/test';

test.describe('Gateway Church Landing Page', () => {
    test('should load the home page and verify main elements', async ({ page }) => {
        // Navigate to the home page (baseURL is configured to http://localhost:3100 in playwright.config.ts)
        await page.goto('/');

        // Verify the page title matches site metadata
        await expect(page).toHaveTitle(/Gateway Church \| Welcome Home/i);

        // Verify basic structural elements from LandingPage layout
        const header = page.locator('.landing-header, header').first();
        await expect(header).toBeVisible();

        const main = page.locator('main.landing-main');
        await expect(main).toBeVisible();

        // Verify the slogan "Loving God, Loving People" is visible
        // This is defined in site-metadata.ts and is typically in the hero section
        await expect(page.getByText('Loving God, Loving People').first()).toBeVisible();

        const footer = page.locator('.landing-footer, footer').first();
        await expect(footer).toBeVisible();
    });
});
