#!/usr/bin/env node
import { Client } from 'pg';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DATABASE_URL } from './db-config.js';
import { waitForDatabase } from './wait-for-db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getAppliedMigrations(client) {
  try {
    const result = await client.query('SELECT version, applied_at FROM schema_migrations ORDER BY version');
    return new Map(result.rows.map(row => [row.version, row.applied_at]));
  } catch (error) {
    return new Map();
  }
}

async function getAppliedSeeds(client) {
  try {
    const result = await client.query('SELECT version, applied_at FROM seed_migrations ORDER BY version');
    return new Map(result.rows.map(row => [row.version, row.applied_at]));
  } catch (error) {
    return new Map();
  }
}


async function showStatus() {
  // Wait for database to be ready
  await waitForDatabase();

  const client = new Client(DATABASE_URL);

  try {
    await client.connect();
    console.log('Database Migration Status');
    console.log('========================');

    // Check migrations
    const appliedMigrations = await getAppliedMigrations(client);
    const migrationsDir = join(__dirname, '..', 'migrations', 'schema');
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log('\nMigrations:');
    for (const file of migrationFiles) {
      const version = file.replace('.sql', '');
      const applied = appliedMigrations.get(version);
      const status = applied ? `✅ Applied (${applied.toISOString()})` : '❌ Pending';
      console.log(`  ${file}: ${status}`);
    }

    // Check seeds
    const appliedSeeds = await getAppliedSeeds(client);
    const seedsDir = join(__dirname, '..', 'seeds');
    const seedFiles = readdirSync(seedsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log('\nSeeds:');
    for (const file of seedFiles) {
      const version = file.replace('.sql', '');
      const applied = appliedSeeds.get(version);
      const status = applied ? `✅ Applied (${applied.toISOString()})` : '❌ Pending';
      console.log(`  ${file}: ${status}`);
    }

    console.log('\nSummary:');
    console.log(`  Total migrations: ${migrationFiles.length}`);
    console.log(`  Applied migrations: ${appliedMigrations.size}`);
    console.log(`  Pending migrations: ${migrationFiles.length - appliedMigrations.size}`);
    console.log(`  Total seeds: ${seedFiles.length}`);
    console.log(`  Applied seeds: ${appliedSeeds.size}`);
    console.log(`  Pending seeds: ${seedFiles.length - appliedSeeds.size}`);

  } catch (error) {
    console.error('Failed to check status:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run status check if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  showStatus();
}