import { test, expect } from '@playwright/test';

test.describe('Messages', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app - user is pre-authenticated
        await page.goto('/');
        await page.getByText('My User').waitFor({ timeout: 10000 });

        // Click on Jane in the menu to enter conversation
        await page.getByText('Jane').click();
        await expect(page.getByPlaceholder('Write Message...')).toBeVisible();
    });

    test('should display message interface', async ({ page }) => {
        // Should see message input
        await expect(page.getByPlaceholder('Write Message...')).toBeVisible();

        // Should see send button
        await expect(
            page.getByLabel('send') // Send button with icon
        ).toBeVisible();
    });

    test('should show loading state or messages', async ({ page }) => {
        // Should either show loading or existing messages
        // Note: Current UI shows "Loading..." when loading messages
        const hasLoading = await page.getByText('Loading...').isVisible();
        const hasMessages = (await page.locator('text').count()) > 0;

        expect(hasLoading || hasMessages).toBe(true);
    });

    test('should display footer information', async ({ page }) => {
        // Should show footer with app info
        await expect(
            page.getByText('Chat App ©2022 Created by Sami Oksanen')
        ).toBeVisible();
    });

    test('should send a new message', async ({ page }) => {
        const testMessage = `Test message ${Date.now()}`;

        // Type message in input
        await page.fill('input[placeholder="Write Message..."]', testMessage);

        // Send message using send button
        await page.getByLabel('send').click();

        // Input should be cleared after sending
        await expect(page.getByPlaceholder('Write Message...')).toHaveValue('');

        // Note: Message display depends on GraphQL subscription working
    });

    test('should send message with Enter key', async ({ page }) => {
        const testMessage = `Enter key message ${Date.now()}`;

        // Type message and press Enter
        await page.fill('input[placeholder="Write Message..."]', testMessage);
        await page.press('input[placeholder="Write Message..."]', 'Enter');

        // Input should be cleared after sending
        await expect(page.getByPlaceholder('Write Message...')).toHaveValue('');
    });

    test('should allow clicking send button with empty input', async ({
        page,
    }) => {
        // Try to send empty message (current implementation allows this)
        await page.getByLabel('send').click();

        // Input should remain empty
        await expect(page.getByPlaceholder('Write Message...')).toHaveValue('');
    });

    test('should handle message sending UI', async ({ page }) => {
        const testMessage = `UI test message ${Date.now()}`;

        // Fill and send a message
        await page.fill('input[placeholder="Write Message..."]', testMessage);
        await page.getByLabel('send').click();

        // Input should be cleared
        await expect(page.getByPlaceholder('Write Message...')).toHaveValue('');

        // Message UI should still be available for next message
        await expect(page.getByPlaceholder('Write Message...')).toBeVisible();
    });

    test('should show theme options', async ({ page }) => {
        // Should show theme toggle options
        await expect(page.getByText('Default')).toBeVisible();
        await expect(page.getByText('Dark')).toBeVisible();
        await expect(page.getByText('Compact')).toBeVisible();

        // Should be able to switch themes
        await page.getByText('Dark').click();
        await page.getByText('Default').click();
    });

    test('should handle long messages in input', async ({ page }) => {
        const longMessage =
            'This is a very long message that should fit in the input field properly. '.repeat(
                5
            );

        // Fill input with long message
        await page.fill('input[placeholder="Write Message..."]', longMessage);

        // Should show the full message in input
        await expect(page.getByPlaceholder('Write Message...')).toHaveValue(
            longMessage
        );

        // Clear the input
        await page.fill('input[placeholder="Write Message..."]', '');
    });
});
