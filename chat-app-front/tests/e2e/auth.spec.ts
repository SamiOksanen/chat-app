import { test, expect } from '@playwright/test';

// Tests that run with pre-authenticated state
// For login/logout flows, see auth-flows.spec.ts
test.describe('Authenticated User State', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app - user should already be authenticated
        await page.goto('/');
        // Should automatically redirect to chat since we're authenticated
        await page.getByText('My User').waitFor({ timeout: 10000 });
    });

    test('should be logged in and show chat interface', async ({ page }) => {
        // Check that we're logged in (should see username in menu)
        await expect(page.getByText('My User')).toBeVisible({ timeout: 5000 });
    });

    test('should show user profile information when authenticated', async ({
        page,
    }) => {
        // Should show logged in user info (username in menu)
        await expect(page.getByText('My User')).toBeVisible();
        // Note: testuser1 maps to 'My User' in the menu based on the UI
    });

    test('should maintain authentication across page reloads', async ({
        page,
    }) => {
        // Refresh the page
        await page.reload();

        // Should still be logged in and redirect to chat
        await page.getByText('My User').waitFor({ timeout: 10000 });
        await expect(page.getByText('My User')).toBeVisible({ timeout: 5000 });
    });
});
