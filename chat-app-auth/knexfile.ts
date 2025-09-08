import type { Knex } from 'knex';

const databaseName = "postgres";

const connection_url = process.env['DATABASE_URL'] || `postgres://postgres:@localhost:5432/${databaseName}`;

const config: Knex.Config = {
    client: 'pg',
    connection: connection_url,
    migrations: {
        directory: './db/migrations'
    }
};

export default config;