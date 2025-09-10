import type { Config } from 'jest';

const jestConfig: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [ 'ts-jest', { useESM: true } ],
  },
  testMatch: [
    '**/src/__tests__/integration/**/*.integration.test.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/__tests__/**/*',
    '!src/index.ts'
  ],
  coverageDirectory: 'coverage-integration',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 30000, // Longer timeout for integration tests
  maxWorkers: 1, // Run integration tests sequentially to avoid database conflicts
  forceExit: true, // Ensure Jest exits after tests complete
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/integration/setup.integration.ts'],
  // Load test environment variables
  setupFiles: ['<rootDir>/jest.integration.setup.js']
};

export default jestConfig;