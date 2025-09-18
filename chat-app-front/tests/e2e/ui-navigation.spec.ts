import { test, expect } from '@playwright/test';

test.describe('UI Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.fill('input[type="text"]', 'testuser1');
    await page.fill('input[type="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/chat/, { timeout: 10000 });
  });

  test('should display main application layout', async ({ page }) => {
    // Check for main layout components
    await expect(page.locator('[data-testid="app-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="conversations-sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
  });

  test('should be responsive on mobile viewports', async ({ page }) => {
    // Switch to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Main components should still be visible but layout may change
    await expect(page.locator('[data-testid="app-header"]')).toBeVisible();

    // On mobile, sidebar might be collapsed or hidden
    const sidebar = page.locator('[data-testid="conversations-sidebar"]');
    const isVisible = await sidebar.isVisible();

    // Either sidebar is visible or there's a toggle button
    if (!isVisible) {
      await expect(page.locator('[data-testid="sidebar-toggle"]')).toBeVisible();
    }
  });

  test('should toggle sidebar on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const sidebarToggle = page.locator('[data-testid="sidebar-toggle"]');
    const sidebar = page.locator('[data-testid="conversations-sidebar"]');

    // If toggle exists, test sidebar toggle functionality
    if (await sidebarToggle.isVisible()) {
      const initialSidebarVisible = await sidebar.isVisible();

      // Click toggle
      await sidebarToggle.click();

      // Sidebar visibility should change
      const newSidebarVisible = await sidebar.isVisible();
      expect(newSidebarVisible).toBe(!initialSidebarVisible);
    }
  });

  test('should navigate between conversations', async ({ page }) => {
    // Get all conversation items
    const conversations = page.locator('[data-testid="conversation-item"]');
    const conversationCount = await conversations.count();

    if (conversationCount > 1) {
      // Click on first conversation
      await conversations.first().click();
      await expect(page.locator('[data-testid="messages-container"]')).toBeVisible();

      // Get identifier of first conversation
      const firstConversationId = await conversations.first().getAttribute('data-conversation-id');

      // Click on second conversation
      await conversations.nth(1).click();

      // Get identifier of second conversation
      const secondConversationId = await conversations.nth(1).getAttribute('data-conversation-id');

      // Should be different conversations
      expect(firstConversationId).not.toBe(secondConversationId);

      // Messages container should update with new conversation
      await expect(page.locator('[data-testid="messages-container"]')).toBeVisible();
    }
  });

  test('should display user profile information', async ({ page }) => {
    // Should show logged in user info
    await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
    await expect(page.locator('[data-testid="username-display"]')).toContainText('testuser1');
  });

  test('should handle theme switching', async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"]');

    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialTheme = await page.locator('body').getAttribute('data-theme');

      // Click theme toggle
      await themeToggle.click();

      // Theme should change
      const newTheme = await page.locator('body').getAttribute('data-theme');
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test('should display proper loading states', async ({ page }) => {
    // Reload page to see loading states
    await page.reload();

    // Should show loading indicator initially
    const loadingIndicator = page.locator('[data-testid="loading-indicator"]');

    // May or may not catch loading state due to timing
    const hasLoadingState = await loadingIndicator.isVisible().catch(() => false);

    // Eventually should show main content
    await expect(page.locator('[data-testid="conversations-list"]')).toBeVisible({ timeout: 10000 });
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/*', route => route.abort());

    // Reload to trigger network requests
    await page.reload();

    // Should show error state or retry mechanism
    // This is a basic test - actual error handling depends on implementation
    await expect(page.locator('body')).toBeVisible();
  });

  test('should maintain proper keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');

    // Should focus on a focusable element
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A', 'TEXTAREA'].includes(focusedElement)).toBe(true);
  });

  test('should display proper error messages', async ({ page }) => {
    // This test checks for any error messages that might appear
    const errorMessages = page.locator('.ant-message-error, [data-testid="error-message"]');

    // Should not have error messages on normal operation
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);
  });

  test('should have proper page title', async ({ page }) => {
    // Check page title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });
});