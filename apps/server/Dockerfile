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

# ✅ Build shared types first
RUN pnpm --filter @collabdraw/types build

# ✅ Build backend after
RUN pnpm --filter server build


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

# ✅ Copy built shared types (THIS WAS MISSING)
COPY --from=builder /app/packages/types/dist ./packages/types/dist

EXPOSE 3000

# ✅ FIXED runtime entry (no more /src)
CMD ["node", "apps/server/dist/index.js"]
