#!/usr/bin/env node
import { Client } from 'pg';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DATABASE_URL } from './db-config.js';
import { waitForDatabase } from './wait-for-db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createSeedsTable(client) {
    await client.query(`
    CREATE TABLE IF NOT EXISTS seed_migrations (
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`);
}

async function getAppliedSeeds(client) {
    try {
        const result = await client.query(
            'SELECT version FROM seed_migrations ORDER BY version'
        );
        return new Set(result.rows.map((row) => row.version));
    } catch (error) {
        console.log(
            'Seed migrations table does not exist yet, will be created'
        );
        return new Set();
    }
}

async function runSeeds() {
    // Wait for database to be ready
    await waitForDatabase();

    const client = new Client(DATABASE_URL);

    try {
        await client.connect();
        console.log('Connected to database for seeding');

        // Create seeds table if it doesn't exist
        await createSeedsTable(client);

        // Get applied seeds
        const appliedSeeds = await getAppliedSeeds(client);

        // Read seed files
        const seedsDir = join(__dirname, '..', 'seeds');
        const seedFiles = readdirSync(seedsDir)
            .filter((file) => file.endsWith('.sql'))
            .sort();

        console.log(`Found ${seedFiles.length} seed files`);

        let appliedCount = 0;

        for (const file of seedFiles) {
            const version = file.replace('.sql', '');

            if (appliedSeeds.has(version)) {
                console.log(`⏭️  Skipping ${file} (already applied)`);
                continue;
            }

            console.log(`🌱 Running seed: ${file}`);

            const seedPath = join(seedsDir, file);
            const seedSql = readFileSync(seedPath, 'utf-8');

            try {
                await client.query('BEGIN');
                await client.query(seedSql);
                await client.query(
                    'INSERT INTO seed_migrations (version) VALUES ($1)',
                    [version]
                );
                await client.query('COMMIT');

                console.log(`✅ Applied seed: ${file}`);
                appliedCount++;
            } catch (error) {
                await client.query('ROLLBACK');
                console.error(
                    `❌ Failed to apply seed ${file}:`,
                    error.message
                );
                process.exit(1);
            }
        }

        if (appliedCount === 0) {
            console.log('✅ All seeds already applied');
        } else {
            console.log(`✅ Successfully applied ${appliedCount} seed(s)`);
        }
    } catch (error) {
        console.error('Seeding failed:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

// Run seeds if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runSeeds();
}
