# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a full-stack chat application with a microservices architecture:

- **chat-app-front**: React + Vite frontend with TypeScript, Ant Design UI components, Apollo GraphQL client
- **chat-app-auth**: Node.js authentication service with Express, Passport, PostgreSQL via Knex/Objection ORM
- **chat-app-graphql-engine**: Hasura GraphQL engine for data layer and real-time subscriptions
- **chat-app-db**: PostgreSQL database
- **chat-app-proxy**: Nginx reverse proxy

The application uses Docker Compose for orchestration with separate development and production configurations.

## Development Commands

### Backend (chat-app-auth)
```bash
cd chat-app-auth
npm run dev:watch    # Development with auto-reload
npm run build        # TypeScript compilation
npm start            # Run built application
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier formatting
npm run format:check # Check formatting
```

### Frontend (chat-app-front)
```bash
cd chat-app-front
npm start            # Development server on port 3000
npm run build        # Production build
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier formatting
npm run format:check # Check formatting
npm test             # Vitest tests
npm run test:ui      # Vitest UI
npm run test:coverage # Test coverage
```

### Code Quality & Formatting (Unified)
```bash
# Run from project root - applies to all services
npm run lint         # ESLint all TypeScript/JavaScript files
npm run lint:fix     # ESLint with auto-fix
npm run format       # Format all source files with Prettier
npm run format:check # Check formatting without changes

# Service-specific linting (uses shared config)
cd chat-app-front && npm run lint    # Frontend only
cd chat-app-auth && npm run lint     # Backend only
```

### Full Stack Development
```bash
# Start all services in development mode
docker-compose up -d --build

# Stop all services
docker-compose down

# Production mode
docker-compose -f docker-compose.prod.yaml up -d --build
docker-compose -f docker-compose.prod.yaml down
```

## Database & Migrations

### Hasura Console
```bash
# Open Hasura console (auto-generates migration files)
hasura console --endpoint <endpoint> --admin-secret <admin-secret>

# Apply migrations manually
hasura migrate apply --database-name default --endpoint <endpoint> --admin-secret <admin-secret> && hasura metadata apply --endpoint <endpoint> --admin-secret <admin-secret>

# Export metadata changes
hasura metadata export --endpoint <endpoint> --admin-secret <admin-secret>
```

### Database Setup
- PostgreSQL runs on port 5433 (host) / 5432 (container)
- Hasura GraphQL engine on port 8081 (host) / 8080 (container)
- Auth service on port 8085 (host) / 8084 (container)
- Frontend on port 81 (host) / 3000 (container)

## Key Technologies & Patterns

### Frontend Architecture
- React with TypeScript and ESM modules
- Ant Design for UI components with custom theming
- Apollo Client for GraphQL with real-time subscriptions
- Context-based state management (UserContext, AlertContext)
- Vite for build tooling
- Vitest for testing

### Backend Architecture
- Express.js with TypeScript and ESM modules
- Passport.js for authentication (local + bearer strategies)
- Knex.js for database queries with Objection.js ORM
- Database connection and schema management in `src/db/`
- Controllers in `src/controllers/` for route handlers

### Authentication Flow
- Custom authentication webhooks for Hasura integration
- JWT token-based authentication
- User session management with Express sessions
- CORS configured for cross-origin requests

## Environment Configuration

Each service requires environment files:
- `chat-app-front/.env.development.local` (copy from `.env.development.example`)
- `chat-app-graphql-engine/.env.development.local` (copy from `.env.development.example`)
- `chat-app-db/.env.local` (copy from `.env.example`)

Production equivalents use `.env.production.local` files.

## Testing Strategy
- Frontend: Vitest with @testing-library/react
- Test files in `chat-app-front/src/tests/`
- Coverage reporting available via `npm run test:coverage`

## Development Notes
- Both frontend and backend use ES modules (`"type": "module"`)
- TypeScript strict mode enabled
- **Unified ESLint + Prettier configuration** managed from project root
  - Shared `eslint.config.js` with service-specific rules
  - Shared `.prettierrc.json` for consistent formatting
  - Dependencies centralized in root `package.json`
  - Service configs inherit from root automatically
- Database migrations managed through Hasura CLI
- Real-time features implemented via GraphQL subscriptions

# Workflow
- Use Playwright MCP server after making UI code changes to chat-app-front. Follow these steps: 1. Navigate to http://localhost:81 2. see and analyse that the UX desing and styling of the code changes looks good and modern 3. Make adjustments to the code.
