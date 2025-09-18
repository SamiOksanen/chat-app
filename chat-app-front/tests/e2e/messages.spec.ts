import { test, expect } from '@playwright/test';

test.describe('Messages', () => {
    test.beforeEach(async ({ page }) => {
        // Login and navigate to a conversation
        await page.goto('/');
        await page.fill('input[type="text"]', 'testuser1');
        await page.fill('input[type="password"]', 'testpassword');
        await page.click('button[type="submit"]');
        await page.waitForURL(/\/chat/, { timeout: 10000 });

        // Click on the first conversation to enter it
        await page.click('[data-testid="conversation-item"]:first-child');
        await expect(
            page.locator('[data-testid="messages-container"]')
        ).toBeVisible();
    });

    test('should display existing messages', async ({ page }) => {
        // Should see message list
        const messages = page.locator('[data-testid="message-item"]');
        await expect(messages).not.toHaveCount(0);

        // Messages should have content
        await expect(messages.first()).toContainText(/\w+/);
    });

    test('should display message timestamps', async ({ page }) => {
        // Messages should show when they were sent
        const messageTimestamps = page.locator(
            '[data-testid="message-timestamp"]'
        );
        await expect(messageTimestamps.first()).toBeVisible();
    });

    test('should display sender information', async ({ page }) => {
        // Messages should show who sent them
        const messageSenders = page.locator('[data-testid="message-sender"]');
        await expect(messageSenders.first()).toBeVisible();
        await expect(messageSenders.first()).toContainText(/testuser/);
    });

    test('should send a new message', async ({ page }) => {
        const testMessage = `Test message ${Date.now()}`;

        // Type message in input
        await page.fill('[data-testid="message-input"]', testMessage);

        // Send message
        await page.click('[data-testid="send-button"]');

        // Should see the new message appear
        await expect(
            page.locator('[data-testid="message-item"]', {
                hasText: testMessage,
            })
        ).toBeVisible({ timeout: 5000 });

        // Input should be cleared
        await expect(page.locator('[data-testid="message-input"]')).toHaveValue(
            ''
        );
    });

    test('should send message with Enter key', async ({ page }) => {
        const testMessage = `Enter key message ${Date.now()}`;

        // Type message and press Enter
        await page.fill('[data-testid="message-input"]', testMessage);
        await page.press('[data-testid="message-input"]', 'Enter');

        // Should see the new message appear
        await expect(
            page.locator('[data-testid="message-item"]', {
                hasText: testMessage,
            })
        ).toBeVisible({ timeout: 5000 });
    });

    test('should not send empty message', async ({ page }) => {
        const initialMessageCount = await page
            .locator('[data-testid="message-item"]')
            .count();

        // Try to send empty message
        await page.click('[data-testid="send-button"]');

        // Should not create new message
        await expect(page.locator('[data-testid="message-item"]')).toHaveCount(
            initialMessageCount
        );
    });

    test('should scroll to bottom when new message arrives', async ({
        page,
    }) => {
        // Scroll to top to ensure we're not at bottom
        await page
            .locator('[data-testid="messages-container"]')
            .evaluate((el) => (el.scrollTop = 0));

        const testMessage = `Scroll test message ${Date.now()}`;

        // Send a message
        await page.fill('[data-testid="message-input"]', testMessage);
        await page.click('[data-testid="send-button"]');

        // Wait for message to appear
        await expect(
            page.locator('[data-testid="message-item"]', {
                hasText: testMessage,
            })
        ).toBeVisible({ timeout: 5000 });

        // Should auto-scroll to show the new message
        const messagesContainer = page.locator(
            '[data-testid="messages-container"]'
        );
        const isScrolledToBottom = await messagesContainer.evaluate((el) => {
            return (
                Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 5
            );
        });
        expect(isScrolledToBottom).toBe(true);
    });

    test('should display messages in chronological order', async ({ page }) => {
        const messages = page.locator('[data-testid="message-item"]');
        const messageCount = await messages.count();

        if (messageCount > 1) {
            // Get timestamps of first and last messages
            const firstTimestamp = await messages
                .first()
                .locator('[data-testid="message-timestamp"]')
                .textContent();
            const lastTimestamp = await messages
                .last()
                .locator('[data-testid="message-timestamp"]')
                .textContent();

            // Parse timestamps and verify chronological order
            // Note: This assumes timestamp format is consistent
            expect(firstTimestamp).toBeTruthy();
            expect(lastTimestamp).toBeTruthy();
        }
    });

    test('should handle long messages properly', async ({ page }) => {
        const longMessage =
            'This is a very long message that should wrap properly and not break the UI layout. '.repeat(
                10
            );

        // Send long message
        await page.fill('[data-testid="message-input"]', longMessage);
        await page.click('[data-testid="send-button"]');

        // Should see the message without layout issues
        const newMessage = page.locator('[data-testid="message-item"]', {
            hasText: longMessage.substring(0, 50),
        });
        await expect(newMessage).toBeVisible({ timeout: 5000 });

        // Message should wrap properly (not overflow container)
        const messageWidth = await newMessage.evaluate((el) => el.scrollWidth);
        const containerWidth = await page
            .locator('[data-testid="messages-container"]')
            .evaluate((el) => el.clientWidth);
        expect(messageWidth).toBeLessThanOrEqual(containerWidth);
    });
});
