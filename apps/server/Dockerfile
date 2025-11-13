# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Global tools
RUN npm install -g pnpm

# Copy lockfiles & workspace config
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./   
COPY package*.json ./

# Copy monorepo packages & apps
COPY packages ./packages
COPY apps/server ./apps/server

# Install ALL dependencies
RUN pnpm install --frozen-lockfile

# Build
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g pnpm

# Copy package files
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./
COPY package*.json ./
COPY packages ./packages
COPY apps/server/package.json ./apps/server/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/apps/server/dist ./apps/server/dist

EXPOSE 3000

# Run from /app root so node_modules are accessible
CMD ["node", "apps/server/dist/src/index.js"]