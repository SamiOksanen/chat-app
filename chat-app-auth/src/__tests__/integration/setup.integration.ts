import knex, { Knex } from 'knex';
import { Model } from 'objection';
import { User } from '../../db/schema.js';

// Test database configuration
const testDatabaseConfig: Knex.Config = {
    client: 'pg',
    connection:
        process.env['DATABASE_URL'] ||
        'postgres://chatapp_test:chatapp_test@localhost:5434/chatapp_test',
    migrations: {
        directory: './db/migrations',
    },
};

let testKnex: Knex;

export const setupTestDatabase = async (): Promise<void> => {
    testKnex = knex(testDatabaseConfig);
    Model.knex(testKnex);

    // Create tables for testing
    await createTestTables();
};

export const teardownTestDatabase = async (): Promise<void> => {
    if (testKnex) {
        await testKnex.destroy();
    }
};

export const cleanTestDatabase = async (): Promise<void> => {
    if (testKnex) {
        // Clean all test data between tests
        await testKnex('messages').del();
        await testKnex('conversationusers').del();
        await testKnex('conversations').del();
        await testKnex('users').del();
    }
};

const createTestTables = async (): Promise<void> => {
    // Check if tables exist, if not create them
    const hasUsersTable = await testKnex.schema.hasTable('users');

    if (!hasUsersTable) {
        await testKnex.raw(`
            CREATE TABLE users(
                userid serial PRIMARY KEY,
                username VARCHAR (255) UNIQUE NOT NULL,
                password VARCHAR (255) NOT NULL,
                token VARCHAR (255) UNIQUE NOT NULL,
                email VARCHAR (255) UNIQUE NOT NULL,
                theme VARCHAR (20),
                avatarimage BYTEA,
                createdt TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);
    }

    const hasConversationsTable =
        await testKnex.schema.hasTable('conversations');

    if (!hasConversationsTable) {
        await testKnex.raw(`
            CREATE TABLE conversations(
                conversationid serial PRIMARY KEY,
                groupflag VARCHAR (1) NOT NULL,
                groupname VARCHAR (255),
                avatarimage BYTEA,
                adminid INT,
                createdt TIMESTAMP NOT NULL DEFAULT NOW(),
                FOREIGN KEY (adminid) REFERENCES users (userid)
            );
        `);
    }

    const hasConversationUsersTable =
        await testKnex.schema.hasTable('conversationusers');

    if (!hasConversationUsersTable) {
        await testKnex.raw(`
            CREATE TABLE conversationusers(
                conversationuserid serial PRIMARY KEY,
                conversationid INT NOT NULL,
                userid INT NOT NULL,
                createdt TIMESTAMP NOT NULL DEFAULT NOW(),
                FOREIGN KEY (conversationid) REFERENCES conversations (conversationid),
                FOREIGN KEY (userid) REFERENCES users (userid)
            );
        `);
    }

    const hasMessagesTable = await testKnex.schema.hasTable('messages');

    if (!hasMessagesTable) {
        await testKnex.raw(`
            CREATE TABLE messages(
                messageid serial PRIMARY KEY,
                conversationid INT NOT NULL,
                userid INT NOT NULL,
                message TEXT,
                createdt TIMESTAMP NOT NULL DEFAULT NOW(),
                FOREIGN KEY (conversationid) REFERENCES conversations (conversationid),
                FOREIGN KEY (userid) REFERENCES users (userid)
            );
        `);

        await testKnex.raw(`
            CREATE INDEX idx_messages_conversations
            ON messages (conversationid);
        `);
    }
};

export const createTestUser = async (userData: {
    username: string;
    email: string;
    password: string;
}): Promise<User> => {
    return await User.query().insert(userData);
};

export const getTestKnex = (): Knex => {
    return testKnex;
};
