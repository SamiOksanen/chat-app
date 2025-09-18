import { test, expect } from '@playwright/test';

// Tests that run with pre-authenticated state
// For login/logout flows, see auth-flows.spec.ts
test.describe('Authenticated User State', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app - user should already be authenticated
        await page.goto('/');
        // Should automatically redirect to chat since we're authenticated
        await page.waitForURL(/\/chat/, { timeout: 10000 });
    });

    test('should be logged in and show chat interface', async ({ page }) => {
        // Check that we're logged in (should see chat interface)
        await expect(
            page.locator('[data-testid="chat-container"]')
        ).toBeVisible({ timeout: 5000 });
    });

    test('should show user profile information when authenticated', async ({
        page,
    }) => {
        // Should show logged in user info
        await expect(
            page.locator('[data-testid="user-profile"]')
        ).toBeVisible();
        await expect(
            page.locator('[data-testid="username-display"]')
        ).toContainText('testuser1');
    });

    test('should maintain authentication across page reloads', async ({
        page,
    }) => {
        // Refresh the page
        await page.reload();

        // Should still be logged in and redirect to chat
        await page.waitForURL(/\/chat/, { timeout: 10000 });
        await expect(
            page.locator('[data-testid="chat-container"]')
        ).toBeVisible({ timeout: 5000 });
    });
});
