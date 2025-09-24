#!/usr/bin/env node
import { Client } from 'pg';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DATABASE_URL } from './db-config.js';
import { waitForDatabase } from './wait-for-db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createMigrationsTable(client) {
    await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`);
}

async function getAppliedMigrations(client) {
    try {
        const result = await client.query(
            'SELECT version FROM schema_migrations ORDER BY version'
        );
        return new Set(result.rows.map((row) => row.version));
    } catch (error) {
        console.log('Migrations table does not exist yet, will be created');
        return new Set();
    }
}

async function runMigrations() {
    // Wait for database to be ready
    await waitForDatabase();

    const client = new Client(DATABASE_URL);

    try {
        await client.connect();
        console.log('Connected to database');

        // Create migrations table if it doesn't exist
        await createMigrationsTable(client);

        // Get applied migrations
        const appliedMigrations = await getAppliedMigrations(client);

        // Read migration files
        const migrationsDir = join(__dirname, '..', 'migrations', 'schema');
        const migrationFiles = readdirSync(migrationsDir)
            .filter((file) => file.endsWith('.sql'))
            .sort();

        console.log(`Found ${migrationFiles.length} migration files`);

        let appliedCount = 0;

        for (const file of migrationFiles) {
            const version = file.replace('.sql', '');

            if (appliedMigrations.has(version)) {
                console.log(`⏭️  Skipping ${file} (already applied)`);
                continue;
            }

            console.log(`🔄 Applying migration: ${file}`);

            const migrationPath = join(migrationsDir, file);
            const migrationSql = readFileSync(migrationPath, 'utf-8');

            try {
                await client.query('BEGIN');
                await client.query(migrationSql);
                await client.query(
                    'INSERT INTO schema_migrations (version) VALUES ($1)',
                    [version]
                );
                await client.query('COMMIT');

                console.log(`✅ Applied migration: ${file}`);
                appliedCount++;
            } catch (error) {
                await client.query('ROLLBACK');
                console.error(
                    `❌ Failed to apply migration ${file}:`,
                    error.message
                );
                process.exit(1);
            }
        }

        if (appliedCount === 0) {
            console.log(
                '✅ Database is up to date (no new migrations to apply)'
            );
        } else {
            console.log(`✅ Successfully applied ${appliedCount} migration(s)`);
        }
    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

// Run migrations if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigrations();
}
