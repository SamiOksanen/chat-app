# chat-app-db

Database migration and seeding service for the chat application.

## Overview

This service manages database schema migrations and data seeding for the chat application. It provides a Node.js-based migration system that replaces Hasura migrations for better control and consistency.

## Structure

```
chat-app-db/
├── migrations/
│   └── schema/          # Database schema migrations
│       └── 001_init.sql # Initial schema
├── seeds/
│   └── 001_test_data.sql # Test data for development
├── scripts/
│   ├── db-config.js     # Database configuration
│   ├── migrate.js       # Migration runner
│   ├── seed.js          # Seeding runner
│   └── status.js        # Migration status checker
├── package.json         # Dependencies and scripts
├── Dockerfile          # Container definition
└── README.md           # This file
```

## Scripts

- `npm run migrate` - Run pending migrations
- `npm run seed` - Run pending seeds
- `npm run reset` - Run migrations and seeds
- `npm run status` - Show migration and seed status

## Usage

### Development with Docker Compose

The migrations and seeds run automatically when using Docker Compose:

```bash
# Start all services (migrations run automatically)
docker-compose up -d --build

# View migration logs
docker-compose logs chat-app-db-migrator
```

### Manual Execution

You can also run migrations manually:

```bash
cd chat-app-db
npm install
npm run migrate
npm run seed
```

## Environment Configuration

The service reads configuration from `.env.local`:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=chatapp
POSTGRES_USER=chatapp
POSTGRES_PASSWORD=chatapp
```

## Migration Files

Migration files should be placed in `migrations/schema/` and follow the naming convention:
- `001_init.sql` - Initial schema
- `002_add_feature.sql` - Add new feature
- etc.

## Seed Files

Seed files should be placed in `seeds/` and follow the naming convention:
- `001_test_data.sql` - Test data
- `002_production_data.sql` - Production data
- etc.

Seeds include environment checks to prevent running test data in production.

## Docker Integration

The service integrates with Docker Compose through:
- `chat-app-db-migrator` - Runs migrations and seeds in development
- `chat-app-prod-db-migrator` - Runs only migrations in production