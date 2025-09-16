# Chat App
![image](https://img.shields.io/badge/GraphQl-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![image](https://img.shields.io/badge/Hasura-1EB4D4?style=for-the-badge&logo=hasura&logoColor=white)
![image](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![image](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![image](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![image](https://img.shields.io/badge/Ant%20Design-1890FF?style=for-the-badge&logo=antdesign&logoColor=white)
![image](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![image](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![image](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![image](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)

Application for having conversations with other users individually and in groups. Uses React and Ant Design for the user interface, Postgres as the database, Node.js Passport for authentication and Hasura GraphQL engine for connecting everything together. Database migrations are handled with Hasura migrations. This is a hobby project I have used for trying out things like Hasura, Ant Design and developing with Claude Code. **This project is not meant for any real production use.**

🚧 In Progress 🚧

## Setup 🪄

### Install:
- Node.js
- Docker
- Hasura CLI

### Install dependencies
Install root dependencies (ESLint, Prettier, shared tooling) and service-specific dependencies
```bash
npm i
```

### Required environment variables
- Add a `.env.development.local` and `.env.production.local` files at the `chat-app-front` and `chat-app-graphql-engine` directories of the repo, by copying the `.env.development.example` and `.env.production.example` files.
- Add a `.env.development.local`, `.env.test.local` and `.env.production.local` files at the `chat-app-auth` directory of the repo, by copying the `.env.development.example`, `.env.test.example` and `.env.production.example` files.
- Add a `.env.local` file at the `chat-app-db` directory of the repo, by copying the `.env.example` file.
- Set values to the environment variables in the `.env` files.

## Code Quality & Development 🔧

### Unified Linting & Formatting
The project uses centralized ESLint and Prettier configurations for consistent code quality across all services.

```bash
# Run from project root (applies to all services)
npm run lint         # Check code quality with ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format all files with Prettier
npm run format:check # Check formatting without changes

# Service-specific commands (uses shared config)
cd chat-app-front
npm run lint         # Frontend linting only
npm run format       # Frontend formatting only

cd chat-app-auth  
npm run lint         # Backend linting only
npm run format       # Backend formatting only
```

## Run the app in development mode
```bash
docker-compose up -d --build
```

### Cleanup in development mode 🧹
```bash
docker-compose down
```

## Run the app in production mode
```bash
docker-compose -f docker-compose.prod.yaml up -d --build
```

### Cleanup in production mode 🧹
```bash
docker-compose -f docker-compose.prod.yaml down
```

## Hasura migrations
Open console from CLI with `hasura console --endpoint <endpoint> --admin-secret <admin-secret>` and it should handle creating the migration files automatically.

### Manual operations
- Initialise the migration from ground up (use only when you know what you are doing)
    - `hasura migrate create init --from-server --endpoint <endpoint> --admin-secret <admin-secret>`
- pull new changes to metadata
    - `hasura metadata export --endpoint <endpoint> --admin-secret <admin-secret>`
- apply migrations
    - https://hasura.io/docs/latest/hasura-cli/commands/hasura_migrate_apply/
    - `hasura migrate apply --endpoint <endpoint> --admin-secret <admin-secret> --version <version> --up --skip-execution`
- apply migrations manually 
    - `hasura migrate apply --database-name default --endpoint <endpoint> --admin-secret <admin-secret> && hasura metadata apply --endpoint <endpoint> --admin-secret <admin-secret>`
- squash the migration files
    - `hasura migrate squash --from <version>`
- reset migrations on server
    - `hasura migrate delete --all --server --database-name <database-name> --endpoint <endpoint> --admin-secret <admin-secret>`
