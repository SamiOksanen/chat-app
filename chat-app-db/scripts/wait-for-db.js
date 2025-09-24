#!/usr/bin/env node
import { Client } from 'pg';
import { DATABASE_URL } from './db-config.js';

const MAX_RETRIES = 30;
const RETRY_DELAY = 2000; // 2 seconds

export async function waitForDatabase() {
    console.log('Waiting for database to be ready...');

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const client = new Client(DATABASE_URL);
            await client.connect();
            await client.query('SELECT 1');
            await client.end();

            console.log(`✅ Database is ready after ${attempt} attempt(s)`);
            return true;
        } catch (error) {
            console.log(
                `⏳ Attempt ${attempt}/${MAX_RETRIES}: Database not ready yet (${error.message})`
            );

            if (attempt === MAX_RETRIES) {
                console.error(
                    `❌ Database failed to become ready after ${MAX_RETRIES} attempts`
                );
                process.exit(1);
            }

            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
    }
}

// Run wait check if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    await waitForDatabase();
}
