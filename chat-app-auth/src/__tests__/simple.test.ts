import { describe, it, expect } from '@jest/globals';

describe('Simple Test', () => {
    it('should run a basic test', () => {
        expect(2 + 2).toBe(4);
    });

    it('should test string operations', () => {
        const greeting = 'Hello';
        expect(greeting).toBe('Hello');
        expect(greeting.length).toBe(5);
    });

    it('should test array operations', () => {
        const numbers = [1, 2, 3];
        expect(numbers).toHaveLength(3);
        expect(numbers[0]).toBe(1);
    });
});
