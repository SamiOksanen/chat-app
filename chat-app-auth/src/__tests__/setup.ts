import { jest } from '@jest/globals';

// Global test setup
beforeAll(() => {
    // Set test environment variables
    process.env['NODE_ENV'] = 'test';
    process.env['SESSION_SECRET'] = 'test-secret';
    process.env['DATABASE_URL'] = ':memory:';
});

afterAll(() => {
    // Clean up any global state
});

// Mock bcrypt for performance in tests
jest.mock('bcrypt', () => ({
    genSaltSync: jest.fn(() => 'mocked-salt'),
    hash: jest.fn(() => Promise.resolve('hashed-password')),
    compare: jest.fn(
        (
            password: string,
            _hash: string,
            callback: (err: Error | undefined, result: boolean) => void
        ) => {
            // Simple mock: password matches if it's 'correct-password'
            const isMatch = password === 'correct-password';
            callback(undefined, isMatch);
        }
    ),
}));

// Mock crypto for consistent token generation in tests
jest.mock('crypto', () => ({
    randomBytes: jest.fn(() => ({
        toString: () => 'mocked-token',
    })),
}));
