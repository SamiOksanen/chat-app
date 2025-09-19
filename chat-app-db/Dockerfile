FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy scripts and SQL files
COPY scripts/ ./scripts/
COPY migrations/ ./migrations/
COPY seeds/ ./seeds/
COPY .env.local .env.local

# Make scripts executable
RUN chmod +x scripts/*.js

# Default command (can be overridden)
CMD ["npm", "run", "status"]