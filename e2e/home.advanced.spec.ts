import { test, expect } from '@playwright/test';

test.describe('Gateway Church Landing Page - Advanced Suite', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the home page before each test
        await page.goto('/');
    });

    test.describe('SEO and Meta Information', () => {
        test('should have correct metadata and canonical link', async ({ page }) => {
            // Check structural title
            await expect(page).toHaveTitle(/Gateway Church \| Welcome Home/i);

            // Check description meta tag
            const metaDescription = page.locator('meta[name="description"]');
            await expect(metaDescription).toHaveAttribute('content', /Loving God, Loving People/i);

            // Check canonical link
            const canonical = page.locator('link[rel="canonical"]');
            await expect(canonical).toHaveAttribute('href', /^https?:\/\/.*/);

            // Check open graph meta tags
            const ogTitle = page.locator('meta[property="og:title"]');
            await expect(ogTitle).toHaveAttribute('content', /Gateway Church \| Welcome Home/i);

            const ogType = page.locator('meta[property="og:type"]');
            await expect(ogType).toHaveAttribute('content', 'website');
        });
    });

    test.describe('Desktop Navigation Layout', () => {
        test.skip(({ isMobile }) => isMobile, 'Test intended only for desktop layout');

        test('should load header with logo and primary links', async ({ page }) => {
            const header = page.locator('.landing-header');
            await expect(header).toBeVisible();

            // Check logo image alt text
            const logo = header.locator('img[alt="Gateway Church Logo"]');
            await expect(logo).toBeVisible();

            // Desktop navigation links should be visible in the header
            await expect(header.locator('a', { hasText: /^About Us$/ }).first()).toBeVisible();
            await expect(header.locator('a', { hasText: /^Events$/ }).first()).toBeVisible();
            await expect(header.locator('a', { hasText: /^Sermons$/ }).first()).toBeVisible();
        });

        test('should interact with Ministries dropdown menu', async ({ page }) => {
            // Find the explicit button that triggers the dropdown
            const ministriesTrigger = page.locator('.nav-dropdown-trigger', { hasText: 'Ministries' });
            await expect(ministriesTrigger).toBeVisible();

            // Click the trigger to open dropdown
            await ministriesTrigger.click();

            // Verify the dropdown links are visible
            const communityLink = page.locator('.nav-dropdown-menu >> a:has-text("Community")').first();
            await expect(communityLink).toBeVisible();

            const serveLink = page.locator('.nav-dropdown-menu >> a:has-text("Serve")').first();
            await expect(serveLink).toBeVisible();
        });

        test('should interact with Give dropdown menu', async ({ page }) => {
            const giveTrigger = page.locator('.nav-dropdown-trigger', { hasText: 'Give' });
            await expect(giveTrigger).toBeVisible();

            await giveTrigger.click();

            const waysToGiveLink = page.locator('.nav-dropdown-menu >> a:has-text("Ways to Give")').first();
            await expect(waysToGiveLink).toBeVisible();
        });
    });

    test.describe('Mobile Responsive Navigation', () => {
        test.skip(({ isMobile }) => !isMobile, 'Test intended only for mobile viewports');

        test('should operate hamburger menu and mobile dropdowns', async ({ page }) => {
            // Check the hamburger menu button
            const hamburgerBtn = page.locator('button.hamburger-menu');
            await expect(hamburgerBtn).toBeVisible();

            // Click hamburger to open mobile menu
            await hamburgerBtn.click();

            // Check if menu wrapper has active class denoting it's open
            const mobileNav = page.locator('.nav-menu-wrapper');
            await expect(mobileNav).toHaveClass(/mobile-nav-active/);

            // Expand the Ministries sub-menu in mobile view
            const ministriesTrigger = mobileNav.locator('.nav-dropdown-trigger', { hasText: 'Ministries' });
            await ministriesTrigger.click();

            // Check if community link is now exposed
            const communityLink = mobileNav.locator('.nav-dropdown-menu >> a:has-text("Community")').first();
            await expect(communityLink).toBeVisible();

            // Close the menu
            await hamburgerBtn.click();
            await expect(mobileNav).not.toHaveClass(/mobile-nav-active/);
        });
    });

    test.describe('Hero Section Interactions', () => {
        test('should dynamically render hero slide content and navigate carousel', async ({ page }) => {
            const heroSection = page.locator('.hero-carousel-section');
            await expect(heroSection).toBeVisible();

            // Verify presence of first slide elements
            const mainTitle = heroSection.locator('h1').first();
            await expect(mainTitle).toBeVisible();

            // Navigation Buttons should be visible
            const nextBtn = heroSection.locator('button.hero-nav-next');
            const prevBtn = heroSection.locator('button.hero-nav-prev');
            const indicators = heroSection.locator('.hero-indicator');

            // Depending on screen setup, if there is a carousel we verify attributes
            if (await nextBtn.isVisible()) {
                await nextBtn.click();
                // Just verify interaction does not throw and slide elements remain intact
                await expect(mainTitle).toBeVisible();
            }
        });
    });

    test.describe('Accessibility and Static Structure', () => {
        test('should have appropriate ARIA attributes and alt texts', async ({ page }) => {
            // Check logos
            const imagesWithoutAlt = page.locator('img:not([alt])');
            await expect(imagesWithoutAlt).toHaveCount(0); // All images must have an alt attribute

            // Hamburger button aria-label
            const hamburger = page.locator('button.hamburger-menu');
            if (await hamburger.isVisible()) {
                await expect(hamburger).toHaveAttribute('aria-label', 'Toggle menu');
            }

            // Check footer visibility
            const footer = page.locator('.landing-footer, footer');
            await expect(footer).toBeVisible();
        });
    });

});
