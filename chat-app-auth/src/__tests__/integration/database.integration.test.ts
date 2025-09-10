import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { User } from '../../db/schema.js';
import { setupTestDatabase, teardownTestDatabase, cleanTestDatabase, getTestKnex } from './setup.integration.js';

describe('Database Integration Tests', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    afterAll(async () => {
        await teardownTestDatabase();
    });

    beforeEach(async () => {
        await cleanTestDatabase();
    });

    describe('User Model', () => {
        it('should create a user with hashed password and token', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'plainpassword'
            };

            const user = await User.query().insert(userData);

            expect(user.userid).toBeDefined();
            expect(user.username).toBe('testuser');
            expect(user.email).toBe('test@example.com');
            expect(user.password).not.toBe('plainpassword'); // Should be hashed
            expect(user.token).toBeDefined();
            expect(user.token).toMatch(/^[a-f0-9]{32}$/); // Should be 32-char hex string
        });

        it('should verify password correctly', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'plainpassword'
            };

            const user = await User.query().insert(userData);

            return new Promise<void>((resolve, reject) => {
                user.verifyPassword('plainpassword', (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    expect(result).toBe(true);
                    resolve();
                });
            });
        });

        it('should reject incorrect password', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'plainpassword'
            };

            const user = await User.query().insert(userData);

            return new Promise<void>((resolve, reject) => {
                user.verifyPassword('wrongpassword', (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    expect(result).toBe(false);
                    resolve();
                });
            });
        });

        it('should return user data without password', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'plainpassword'
            };

            const user = await User.query().insert(userData);
            const publicUserData = user.getUser();

            expect(publicUserData).toHaveProperty('userid');
            expect(publicUserData).toHaveProperty('username', 'testuser');
            expect(publicUserData).toHaveProperty('email', 'test@example.com');
            expect(publicUserData).toHaveProperty('token');
            expect(publicUserData).not.toHaveProperty('password');
        });

        it('should enforce unique username constraint', async () => {
            const userData1 = {
                username: 'testuser',
                email: 'test1@example.com',
                password: 'password1'
            };

            const userData2 = {
                username: 'testuser',
                email: 'test2@example.com',
                password: 'password2'
            };

            await User.query().insert(userData1);

            await expect(User.query().insert(userData2)).rejects.toThrow();
        });

        it('should enforce unique email constraint', async () => {
            const userData1 = {
                username: 'testuser1',
                email: 'test@example.com',
                password: 'password1'
            };

            const userData2 = {
                username: 'testuser2',
                email: 'test@example.com',
                password: 'password2'
            };

            await User.query().insert(userData1);

            await expect(User.query().insert(userData2)).rejects.toThrow();
        });

        it('should enforce unique token constraint', async () => {
            const knex = getTestKnex();
            
            // Create first user normally
            const user1 = await User.query().insert({
                username: 'testuser1',
                email: 'test1@example.com',
                password: 'password1'
            });

            // Try to create another user with the same token (this would be an artificial scenario)
            // We'll test this by directly inserting into database bypassing the model
            await expect(
                knex('users').insert({
                    username: 'testuser2',
                    email: 'test2@example.com',
                    password: 'hashedpassword',
                    token: user1.token
                })
            ).rejects.toThrow();
        });

        it('should find user by username or email', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'plainpassword'
            };

            const createdUser = await User.query().insert(userData);

            // Find by username
            const userByUsername = await User.query()
                .where('username', 'testuser')
                .orWhere('email', 'testuser')
                .first();

            expect(userByUsername).toBeDefined();
            expect(userByUsername?.userid).toBe(createdUser.userid);

            // Find by email
            const userByEmail = await User.query()
                .where('username', 'test@example.com')
                .orWhere('email', 'test@example.com')
                .first();

            expect(userByEmail).toBeDefined();
            expect(userByEmail?.userid).toBe(createdUser.userid);
        });

        it('should find user by token', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'plainpassword'
            };

            const createdUser = await User.query().insert(userData);

            const userByToken = await User.query()
                .where('token', createdUser.token)
                .first();

            expect(userByToken).toBeDefined();
            expect(userByToken?.userid).toBe(createdUser.userid);
        });
    });
});