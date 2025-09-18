import { execSync } from 'child_process';

async function globalTeardown() {
  console.log('Starting global teardown...');

  try {
    // Stop the docker-compose test environment if running in CI
    if (process.env.CI) {
      console.log('Stopping test environment...');
      execSync('docker-compose -f docker-compose.test.yaml down -v', {
        stdio: 'inherit',
        timeout: 30000
      });
      console.log('Test environment stopped');
    }
  } catch (error) {
    console.warn('Error during teardown:', error);
  }
}

export default globalTeardown;