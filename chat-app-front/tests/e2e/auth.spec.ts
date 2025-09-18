import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should show login form when not authenticated', async ({ page }) => {
        // Check for login form elements
        await expect(page.locator('input[type="text"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should login with valid credentials', async ({ page }) => {
        // Use test data from seeds
        await page.fill('input[type="text"]', 'testuser1');
        await page.fill('input[type="password"]', 'testpassword');

        await page.click('button[type="submit"]');

        // Wait for redirect to main app
        await page.waitForURL(/\/chat/, { timeout: 10000 });

        // Check that we're logged in (should see chat interface)
        await expect(
            page.locator('[data-testid="chat-container"]')
        ).toBeVisible({ timeout: 5000 });
    });

    test('should show error with invalid credentials', async ({ page }) => {
        await page.fill('input[type="text"]', 'invaliduser');
        await page.fill('input[type="password"]', 'invalidpassword');

        await page.click('button[type="submit"]');

        // Should show error message
        await expect(page.locator('.ant-message-error')).toBeVisible({
            timeout: 5000,
        });
    });

    test('should logout successfully', async ({ page }) => {
        // Login first
        await page.fill('input[type="text"]', 'testuser1');
        await page.fill('input[type="password"]', 'testpassword');
        await page.click('button[type="submit"]');

        await page.waitForURL(/\/chat/, { timeout: 10000 });

        // Find and click logout button
        await page.click('[data-testid="logout-button"]');

        // Should redirect to login page
        await page.waitForURL(/\/login/, { timeout: 5000 });
        await expect(page.locator('input[type="text"]')).toBeVisible();
    });

    test('should maintain session on page refresh', async ({ page }) => {
        // Login first
        await page.fill('input[type="text"]', 'testuser1');
        await page.fill('input[type="password"]', 'testpassword');
        await page.click('button[type="submit"]');

        await page.waitForURL(/\/chat/, { timeout: 10000 });

        // Refresh the page
        await page.reload();

        // Should still be logged in
        await expect(
            page.locator('[data-testid="chat-container"]')
        ).toBeVisible({ timeout: 5000 });
    });
});
