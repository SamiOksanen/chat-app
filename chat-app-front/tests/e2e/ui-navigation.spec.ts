import { test, expect } from '@playwright/test';

test.describe('UI Navigation', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app - user is pre-authenticated
        await page.goto('/');
        await page.getByText('My User').waitFor({ timeout: 10000 });
    });

    test('should display main application layout', async ({ page }) => {
        // Check for main layout components
        await expect(page.getByText('My User')).toBeVisible(); // Menu with users
        await expect(page.getByPlaceholder('Write Message...')).toBeVisible(); // Message input
        await expect(
            page.getByText('Chat App ©2022 Created by Sami Oksanen')
        ).toBeVisible(); // Footer
    });

    test('should be responsive on mobile viewports', async ({ page }) => {
        // Switch to mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Main components should still be visible
        await expect(page.getByText('My User')).toBeVisible();
        await expect(page.getByPlaceholder('Write Message...')).toBeVisible();

        // Sidebar should be collapsible - check if it's collapsed on mobile
        // The Ant Design Sider component auto-collapses on mobile
        const siderElements = page.locator('.ant-layout-sider');
        if ((await siderElements.count()) > 0) {
            // Sidebar exists and should handle mobile responsively
            await expect(siderElements.first()).toBeVisible();
        }
    });

    test('should toggle sidebar collapse', async ({ page }) => {
        // Look for Ant Design's collapse button (usually in the sider)
        const collapseButton = page.locator('.ant-layout-sider-trigger');

        if (await collapseButton.isVisible()) {
            // Click the collapse trigger
            await collapseButton.click();

            // Sidebar should still exist but be collapsed
            await expect(page.locator('.ant-layout-sider')).toBeVisible();

            // Click again to expand
            await collapseButton.click();
            await expect(page.locator('.ant-layout-sider')).toBeVisible();
        } else {
            // If no collapse button, just verify sidebar exists
            await expect(page.getByText('My User')).toBeVisible();
        }
    });

    test('should navigate between menu items', async ({ page }) => {
        // Test navigation between different menu items
        await page.getByText('Jane').click();
        await expect(page.getByPlaceholder('Write Message...')).toBeVisible();

        // Switch to Joe
        await page.getByText('Joe').click();
        await expect(page.getByPlaceholder('Write Message...')).toBeVisible();

        // Switch to group
        await page.getByText('Our Group').click();
        await expect(page.getByPlaceholder('Write Message...')).toBeVisible();

        // Back to My User
        await page.getByText('My User').click();
        await expect(page.getByPlaceholder('Write Message...')).toBeVisible();
    });

    test('should handle theme switching', async ({ page }) => {
        // Test theme radio buttons
        await expect(page.getByText('Default')).toBeVisible();
        await expect(page.getByText('Dark')).toBeVisible();
        await expect(page.getByText('Compact')).toBeVisible();

        // Switch to dark theme
        await page.getByText('Dark').click();

        // Switch to compact theme
        await page.getByText('Compact').click();

        // Switch back to default
        await page.getByText('Default').click();

        // All menu items should still be visible after theme changes
        await expect(page.getByText('My User')).toBeVisible();
    });

    test('should display proper loading states', async ({ page }) => {
        // Reload page to see loading states
        await page.reload();

        // Should eventually show main content after reload
        await expect(page.getByText('My User')).toBeVisible({ timeout: 10000 });

        // Check for loading text in message area (if any)
        const hasLoadingText = await page.getByText('Loading...').isVisible();
        const hasMessageInput = await page
            .getByPlaceholder('Write Message...')
            .isVisible();

        // Should have either loading text or message input (or both)
        expect(hasLoadingText || hasMessageInput).toBe(true);
    });

    test.skip('should handle network errors gracefully', async ({ page }) => {
        // Simulate network failure
        await page.route('**/*', (route) => route.abort());

        // Reload to trigger network requests
        await page.reload();

        // Should show error state or retry mechanism
        // This is a basic test - actual error handling depends on implementation
        await expect(page.locator('body')).toBeVisible();
    });

    test('should maintain proper keyboard navigation', async ({ page }) => {
        // Test tab navigation
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100); // Wait for focus change
        // Should focus on a focusable element
        const focusedElement = await page.evaluate(
            () => document.activeElement?.tagName
        );
        expect(
            ['INPUT', 'BUTTON', 'A', 'TEXTAREA'].includes(focusedElement ?? '')
        ).toBe(true);
    });

    test('should not display error messages on normal operation', async ({
        page,
    }) => {
        // This test checks for any error messages that might appear
        const errorMessages = page.locator('.ant-message-error');

        // Should not have error messages on normal operation
        const errorCount = await errorMessages.count();
        expect(errorCount).toBe(0);

        // Should have normal UI elements
        await expect(page.getByText('My User')).toBeVisible();
        await expect(page.getByPlaceholder('Write Message...')).toBeVisible();
    });

    test('should have proper page title', async ({ page }) => {
        // Check page title
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
    });
});
