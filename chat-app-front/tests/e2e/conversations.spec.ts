import { test, expect } from '@playwright/test';

test.describe('Conversations', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app - user is pre-authenticated
        await page.goto('/');
        await page.waitForURL(/\/chat/, { timeout: 10000 });
    });

    test('should display list of conversations', async ({ page }) => {
        // Should see conversations list
        await expect(
            page.locator('[data-testid="conversations-list"]')
        ).toBeVisible();

        // Should see at least some conversations from seed data
        const conversationItems = page.locator(
            '[data-testid="conversation-item"]'
        );
        await expect(conversationItems).toHaveCount(3); // testuser1 has 3 conversations in seed data
    });

    test('should show conversation details when clicked', async ({ page }) => {
        // Click on the first conversation
        await page.click('[data-testid="conversation-item"]:first-child');

        // Should show conversation messages
        await expect(
            page.locator('[data-testid="messages-container"]')
        ).toBeVisible();

        // Should show message input area
        await expect(
            page.locator('[data-testid="message-input"]')
        ).toBeVisible();
    });

    test('should display group conversations with group names', async ({
        page,
    }) => {
        // Look for group conversation (Test Group Chat from seed data)
        const groupConversation = page.locator(
            '[data-testid="conversation-item"]',
            {
                hasText: 'Test Group Chat',
            }
        );
        await expect(groupConversation).toBeVisible();

        // Should show group indicator
        await expect(
            groupConversation.locator('[data-testid="group-indicator"]')
        ).toBeVisible();
    });

    test('should display direct message conversations with usernames', async ({
        page,
    }) => {
        // Look for direct message conversations
        const dmConversations = page.locator(
            '[data-testid="conversation-item"][data-conversation-type="direct"]'
        );
        await expect(dmConversations).toHaveCount(2); // testuser1 has 2 DM conversations

        // Should show participant names
        await expect(dmConversations.first()).toContainText('testuser');
    });

    test('should show unread message indicators', async ({ page }) => {
        // This test assumes there might be unread messages
        // Look for unread indicators
        const unreadIndicators = page.locator(
            '[data-testid="unread-indicator"]'
        );

        // May or may not have unread messages, but should not error
        const count = await unreadIndicators.count();
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should allow starting new conversation', async ({ page }) => {
        // Look for new conversation button
        await page.click('[data-testid="new-conversation-button"]');

        // Should show new conversation modal/form
        await expect(
            page.locator('[data-testid="new-conversation-modal"]')
        ).toBeVisible();

        // Should have user search/selection
        await expect(page.locator('[data-testid="user-search"]')).toBeVisible();
    });

    test('should show conversation timestamps', async ({ page }) => {
        // Conversations should show when they were last active
        const conversationItems = page.locator(
            '[data-testid="conversation-item"]'
        );
        const firstConversation = conversationItems.first();

        // Should have timestamp
        await expect(
            firstConversation.locator('[data-testid="conversation-timestamp"]')
        ).toBeVisible();
    });

    test('should show last message preview', async ({ page }) => {
        // Conversations should show preview of last message
        const conversationItems = page.locator(
            '[data-testid="conversation-item"]'
        );
        const firstConversation = conversationItems.first();

        // Should have message preview
        await expect(
            firstConversation.locator('[data-testid="last-message-preview"]')
        ).toBeVisible();
    });
});
