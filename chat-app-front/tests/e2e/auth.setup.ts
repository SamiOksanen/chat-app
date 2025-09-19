import { test as setup, expect } from '@playwright/test';

const authFile = './.auth/user.json';

setup('authenticate', async ({ page }) => {
    // Perform authentication steps
    await page.goto('/');

    // Use test data from seeds
    await page.fill('input[type="text"]', 'testuser1');
    await page.fill('input[type="password"]', 'testpassword');

    await page.click('button[type="submit"]');

    // Wait for redirect to main app
    await page.getByText('My User').waitFor({ timeout: 10000 });

    // Verify we're logged in
    await expect(page.locator('[data-testid="chat-container"]')).toBeVisible({
        timeout: 5000,
    });

    // Save signed-in state to 'authFile'
    await page.context().storageState({ path: authFile });
});
