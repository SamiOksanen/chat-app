import { describe, it, expect, beforeEach } from '@jest/globals';
import { User } from '../db/schema.js';

describe('User Model', () => {
    let user: User;

    beforeEach(() => {
        user = Object.assign(new User(), {
            userid: 1,
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashed-password',
            token: 'test-token',
        });
    });

    describe('Static Properties', () => {
        it('should have correct table name', () => {
            expect(User.tableName).toBe('users');
        });

        it('should have correct id column', () => {
            expect(User.idColumn).toBe('userid');
        });

        it('should have valid JSON schema', () => {
            const schema = User.jsonSchema;
            expect(schema.type).toBe('object');
            expect(schema.required).toContain('username');
            expect(schema.required).toContain('email');
            expect(schema.properties).toBeDefined();
            expect(schema.properties!['username']).toEqual({
                type: 'string',
                minLength: 1,
                maxLength: 255,
            });
        });
    });

    describe('getUser method', () => {
        it('should return user data without password', () => {
            const userData = user.getUser();

            expect(userData).toEqual({
                userid: 1,
                username: 'testuser',
                email: 'test@example.com',
                token: 'test-token',
            });
            expect(userData).not.toHaveProperty('password');
        });
    });

    describe('$beforeInsert hook', () => {
        it('should hash password and generate token', async () => {
            const newUser = Object.assign(new User(), {
                username: 'newuser',
                email: 'new@example.com',
                password: 'plaintext-password',
            });

            await newUser.$beforeInsert();

            expect(newUser.password).toBe('hashed-password'); // mocked hash
            expect(newUser.token).toBeDefined(); // token was generated
            expect(typeof newUser.token).toBe('string');
            expect(newUser.token.length).toBeGreaterThan(0);
        });
    });

    describe('verifyPassword method', () => {
        it('should verify correct password', (done) => {
            user.verifyPassword('correct-password', (err, result) => {
                expect(err).toBeUndefined();
                expect(result).toBe(true);
                done();
            });
        });

        it('should reject incorrect password', (done) => {
            user.verifyPassword('wrong-password', (err, result) => {
                expect(err).toBeUndefined();
                expect(result).toBe(false);
                done();
            });
        });
    });
});
