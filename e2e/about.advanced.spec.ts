import { test, expect } from '@playwright/test';

test.describe('Gateway Church - About Us Page', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the about page before each test
        await page.goto('/about');
    });

    test.describe('SEO and Page Metadata', () => {
        test('should have correct title, canonical link, and OpenGraph tags', async ({ page }) => {
            // Check title
            await expect(page).toHaveTitle(/About Us \| Gateway Church/i);

            // Check canonical link
            const canonical = page.locator('link[rel="canonical"]');
            await expect(canonical).toHaveAttribute('href', /^https?:\/\/.*\/about$/);

            // Check OpenGraph title
            const ogTitle = page.locator('meta[property="og:title"]');
            await expect(ogTitle).toHaveAttribute('content', /About Us \| Gateway Church/i);

            // Check OpenGraph description
            const ogDesc = page.locator('meta[property="og:description"]');
            await expect(ogDesc).toHaveAttribute('content', /Learn about Gateway Church - our vision, mission, values/i);
        });
    });

    test.describe('Dynamic Page Sections', () => {
        test('should load the About Hero section with accurate text', async ({ page }) => {
            const heroSection = page.locator('#about-top');
            await expect(heroSection).toBeVisible();

            // Check main heading in the hero
            const heroTitle = heroSection.locator('h1', { hasText: 'Welcome to Gateway Church' });
            await expect(heroTitle).toBeVisible();

            // Check subtitle
            const subtitle = heroSection.locator('p', { hasText: 'Loving God, Loving People' });
            await expect(subtitle).toBeVisible();
        });

        test('should load Vision and Mission sections', async ({ page }) => {
            const visionMissionSection = page.locator('#vision-mission');
            await expect(visionMissionSection).toBeVisible();

            // Check section header
            const headerTitle = visionMissionSection.locator('h2', { hasText: 'Why We Exist' });
            await expect(headerTitle).toBeVisible();

            // Check individual cards
            const visionCardTitle = visionMissionSection.locator('h3', { hasText: 'Our Vision' });
            await expect(visionCardTitle).toBeVisible();

            const missionCardTitle = visionMissionSection.locator('h3', { hasText: 'Our Mission' });
            await expect(missionCardTitle).toBeVisible();
        });

        test('should present Senior Pastoral information correctly', async ({ page }) => {
            const pastorsSection = page.locator('#our-pastors');
            await expect(pastorsSection).toBeVisible();

            // Complex title match (span combination "Meet Our Pastors")
            const titleWrapper = pastorsSection.locator('h2.pastors-title');
            await expect(titleWrapper).toContainText('Meet Our');
            await expect(titleWrapper).toContainText('Pastors');

            // Verify explicit names mentioned in the text body
            const description = pastorsSection.locator('p.pastors-description');
            await expect(description).toContainText('Ptr. Jim and Ptra. Anna Marie Baloran');
            await expect(description).toContainText('Senior Pastors');

            // Check that the image attributes correctly identify the pastors
            const pastorImg = pastorsSection.locator('img[alt="Pastors Jim and Anna Marie Baloran"]');
            await expect(pastorImg).toBeVisible();
        });
    });

});
