import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('Starting global setup...');

  // Wait for the application to be ready
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Try to access the application to ensure it's running
    await page.goto('http://localhost:82', { waitUntil: 'networkidle', timeout: 60000 });
    console.log('Application is ready for testing');
  } catch (error) {
    console.error('Application not ready:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;