# Chat App
![image](https://img.shields.io/badge/GraphQl-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![image](https://img.shields.io/badge/Hasura-1EB4D4?style=for-the-badge&logo=hasura&logoColor=white)
![image](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![image](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![image](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![image](https://img.shields.io/badge/Ant%20Design-1890FF?style=for-the-badge&logo=antdesign&logoColor=white)
![image](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![image](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

Application for having conversations with other users individually and in groups. Uses React and Ant Design for the user interface, Postgres as the database, Node.js Passport for authentication and Hasura GraphQL engine for connecting everything together. Database migrations are handled with Hasura migrations. This is a hobby project I have used for trying out things like Hasura, Ant Design and developing with Claude Code. **This project is not meant for any real production use.**

🚧 In Progress 🚧

## Setup 🪄

### Install:
- Node.js
- Docker
- Hasura CLI

### Install dependencies in `chat-app-auth` and `chat-app-front` directories
```bash
cd <dir>
npm i
```

### Required environment variables
- Add a `.env.development.local` and `.env.production.local` file at the `chat-app-front` and `chat-app-graphql-engine` directories of the repo, by copying the `.env.development.example` and `.env.production.example` file.
- Add a `.env.local` file at the `chat-app-db` directory of the repo, by copying the `.env.example` file.
- Set values to the environment variables in the `.env` files.

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
