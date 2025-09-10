import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import app from '../../index.js';
import { setupTestDatabase, teardownTestDatabase, cleanTestDatabase, createTestUser } from './setup.integration.js';

describe('Authentication Endpoints Integration Tests', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    afterAll(async () => {
        await teardownTestDatabase();
    });

    beforeEach(async () => {
        await cleanTestDatabase();
    });

    describe('POST /signup', () => {
        it('should create a new user successfully', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123'
            };

            const response = await request(app)
                .post('/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('userid');
            expect(response.body).toHaveProperty('username', 'testuser');
            expect(response.body).toHaveProperty('email', 'test@example.com');
            expect(response.body).toHaveProperty('token');
            expect(response.body).not.toHaveProperty('password');
        });

        it('should reject signup with invalid email', async () => {
            const userData = {
                username: 'testuser',
                email: 'invalid-email',
                password: 'password123',
                confirmPassword: 'password123'
            };

            const response = await request(app)
                .post('/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });

        it('should reject signup with short password', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: '123',
                confirmPassword: '123'
            };

            const response = await request(app)
                .post('/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });

        it('should reject signup with mismatched passwords', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'different123'
            };

            const response = await request(app)
                .post('/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });

        it('should reject signup with duplicate username', async () => {
            // Create first user
            await createTestUser({
                username: 'testuser',
                email: 'first@example.com',
                password: 'password123'
            });

            const userData = {
                username: 'testuser',
                email: 'second@example.com',
                password: 'password123',
                confirmPassword: 'password123'
            };

            const response = await request(app)
                .post('/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(409);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('POST /login', () => {
        beforeEach(async () => {
            // Create a test user for login tests
            await createTestUser({
                username: 'loginuser',
                email: 'login@example.com',
                password: 'password123'
            });
        });

        it('should login successfully with valid credentials', async () => {
            const loginData = {
                username: 'loginuser',
                password: 'password123'
            };

            const response = await request(app)
                .post('/login')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('userid');
            expect(response.body).toHaveProperty('username', 'loginuser');
            expect(response.body).toHaveProperty('email', 'login@example.com');
            expect(response.body).toHaveProperty('token');
            expect(response.body).not.toHaveProperty('password');
        });

        it('should reject login with invalid username', async () => {
            const loginData = {
                username: 'nonexistent',
                password: 'password123'
            };

            const response = await request(app)
                .post('/login')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('should reject login with invalid password', async () => {
            const loginData = {
                username: 'loginuser',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/login')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('should reject login with missing username', async () => {
            const loginData = {
                password: 'password123'
            };

            const response = await request(app)
                .post('/login')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });

        it('should reject login with missing password', async () => {
            const loginData = {
                username: 'loginuser'
            };

            const response = await request(app)
                .post('/login')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /webhook', () => {
        let userToken: string;

        beforeEach(async () => {
            // Create a test user and get their token
            const user = await createTestUser({
                username: 'webhookuser',
                email: 'webhook@example.com',
                password: 'password123'
            });
            userToken = user.token;
        });

        it('should return user role for valid bearer token', async () => {
            const response = await request(app)
                .get('/webhook')
                .set('Authorization', `Bearer ${userToken}`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('X-Hasura-Role', 'user');
            expect(response.body).toHaveProperty('X-Hasura-User-Id');
        });

        it('should return anonymous role for invalid bearer token', async () => {
            const response = await request(app)
                .get('/webhook')
                .set('Authorization', 'Bearer invalid-token')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('X-Hasura-Role', 'anonymous');
            expect(response.body).not.toHaveProperty('X-Hasura-User-Id');
        });

        it('should return anonymous role for missing authorization header', async () => {
            const response = await request(app)
                .get('/webhook')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('X-Hasura-Role', 'anonymous');
            expect(response.body).not.toHaveProperty('X-Hasura-User-Id');
        });

        it('should return anonymous role for malformed authorization header', async () => {
            const response = await request(app)
                .get('/webhook')
                .set('Authorization', 'InvalidFormat')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('X-Hasura-Role', 'anonymous');
            expect(response.body).not.toHaveProperty('X-Hasura-User-Id');
        });
    });
});