# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a full-stack chat application with a microservices architecture:

- **chat-app-front**: React + Vite frontend with TypeScript, Ant Design UI components, Apollo GraphQL client
- **chat-app-auth**: Node.js authentication service with Express, Passport, PostgreSQL via Knex/Objection ORM
- **chat-app-graphql-engine**: Hasura GraphQL engine for data layer and real-time subscriptions
- **chat-app-db**: PostgreSQL database with integrated migration and seeding service
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
npm test             # Jest unit tests
npm run test:watch   # Jest unit tests in watch mode
npm run test:coverage # Jest unit tests with coverage
npm run test:integration # Jest integration tests (with Docker)
npm run test:integration:watch # Integration tests in watch mode
npm run test:integration:coverage # Integration tests with coverage
npm run test:all     # Run both unit and integration tests
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
npm run test:e2e      # Playwright e2e tests
npm run test:e2e:ui   # Playwright e2e tests with UI
npm run test:e2e:headed # Playwright e2e tests in headed mode
npm run test:e2e:debug # Playwright e2e tests in debug mode
npm run test:e2e:setup # Start test environment only
npm run test:e2e:cleanup # Stop test environment
npm run test:e2e:complete # Full e2e test cycle with setup/cleanup
```

### Database (chat-app-db)
```bash
cd chat-app-db
npm run migrate      # Run pending migrations
npm run seed         # Run pending seeds
npm run reset        # Run migrations and seeds
npm run status       # Show migration and seed status
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

### Database Migrations
Database schema migrations are managed by the chat-app-db service using Node.js scripts:

```bash
# Migrations run automatically with Docker Compose
docker-compose up -d --build

# Manual migration management
cd chat-app-db
npm run migrate      # Apply pending migrations
npm run seed         # Apply pending seeds (development only)
npm run status       # Check migration status
```

### Hasura Metadata Management
While schema migrations are handled by chat-app-db, Hasura metadata is still managed through Hasura CLI:

```bash
# Export metadata changes
hasura metadata export --endpoint <endpoint> --admin-secret <admin-secret>

# Apply metadata changes
hasura metadata apply --endpoint <endpoint> --admin-secret <admin-secret>
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
- **Frontend Unit Tests**: Vitest with @testing-library/react
  - Test files in `chat-app-front/src/tests/`
  - Coverage reporting available via `npm run test:coverage`
- **Frontend E2E Tests**: Playwright with full application stack
  - Test files in `chat-app-front/tests/e2e/`
  - Uses dedicated test environment with Docker Compose
  - Automated authentication setup with shared state
  - Tests run against http://localhost:81 (full stack)
  - Configuration in `chat-app-front/playwright.config.ts`
- **Backend Unit Tests**: Jest with TypeScript and ESM support
  - Test files in `chat-app-auth/src/__tests__/`
  - 61 unit tests across 7 test suites
  - Mocked dependencies for fast execution
  - Configuration in `chat-app-auth/jest.config.ts`
- **Backend Integration Tests**: Jest with SuperTest and real database
  - Test files in `chat-app-auth/src/__tests__/integration/`
  - 23 integration tests across 2 test suites
  - Uses Docker Compose for PostgreSQL and Hasura
  - Real HTTP requests and database operations
  - Configuration in `chat-app-auth/jest.integration.config.ts`

### E2E Test Environment
The e2e tests use a separate Docker Compose stack (`docker-compose.test.yaml`) that includes:
- **chat-app-db-test**: PostgreSQL test database on port 5434
- **chat-app-db-test-migrator**: Runs migrations and seeds test data
- **chat-app-auth-test**: Auth service on port 8086
- **chat-app-graphql-engine-test**: Hasura GraphQL engine on port 8082
- **chat-app-front-test**: Frontend served on port 81

### E2E Test Commands
```bash
cd chat-app-front
npm run test:e2e          # Run tests (auto-starts test environment)
npm run test:e2e:ui       # Run with Playwright UI
npm run test:e2e:headed   # Run in headed browser mode
npm run test:e2e:debug    # Run in debug mode
npm run test:e2e:setup    # Start test environment only
npm run test:e2e:cleanup  # Stop test environment
npm run test:e2e:complete # Full cycle: setup → test → cleanup
```

### Backend Test Commands
```bash
cd chat-app-auth
npm test                          # Unit tests only (fast, no Docker)
npm run test:watch                # Unit tests in watch mode
npm run test:coverage             # Unit tests with coverage report
npm run test:integration          # Integration tests (with Docker setup/cleanup)
npm run test:integration:watch    # Integration tests in watch mode
npm run test:integration:coverage # Integration tests with coverage
npm run test:all                  # Run both unit and integration tests
```

### Backend Test Coverage
**Unit Tests (61 tests across 7 suites):**
- Core functionality and framework verification
- User model validation (password hashing, token generation)
- Controller function structure validation
- Passport authentication strategy patterns
- Error handling and response formatting
- Integration patterns and business logic workflows

**Integration Tests (23 tests across 2 suites):**
- Complete HTTP API endpoint testing with SuperTest
- Real PostgreSQL database operations
- Authentication flow testing (registration, login, webhooks)
- Database constraint validation
- Error handling in real scenarios

### Frontend Test Coverage
- **Authentication flows**: Login, logout, session management
- **Navigation**: UI navigation between different views
- **Conversations**: Creating, viewing, managing conversations
- **Messages**: Sending, receiving, displaying messages
- **Real-time features**: WebSocket connections via GraphQL subscriptions

## Development Notes
- Both frontend and backend use ES modules (`"type": "module"`)
- TypeScript strict mode enabled
- **Unified ESLint + Prettier configuration** managed from project root
  - Shared `eslint.config.js` with service-specific rules
  - Shared `.prettierrc.json` for consistent formatting
  - Dependencies centralized in root `package.json`
  - Service configs inherit from root automatically
- Database schema migrations managed through chat-app-db service with Node.js scripts
- Hasura metadata managed through Hasura CLI
- Real-time features implemented via GraphQL subscriptions

# Workflow
- Use Playwright MCP server after making UI code changes to chat-app-front. Follow these steps: 1. Navigate to http://localhost:81 2. see and analyse that the UX desing and styling of the code changes looks good and modern 3. Make adjustments to the code.
