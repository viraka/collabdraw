# Lightweight Node image
FROM node:20-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy lockfile & workspace config for caching
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy package.json files
COPY package*.json ./

# Copy packages folder (monorepo)
COPY packages ./packages

# Copy turbo.json for Turborepo
COPY turbo.json ./ 

# Install dependencies
RUN pnpm install --frozen-lockfile --workspace-root

# Copy backend source code
COPY apps/server ./apps/server

# Build TypeScript project
RUN pnpm build

# Expose backend port
EXPOSE 3000

# Start backend
CMD ["node", "dist/src/index.js"]
