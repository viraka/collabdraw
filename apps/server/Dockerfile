# Lightweight Node image
FROM node:20-alpine

WORKDIR /app

# Global tools
RUN npm install -g pnpm typescript tsc-alias

# Copy lockfiles & workspace config
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./   

# Copy monorepo packages & apps
COPY packages ./packages
COPY apps/server ./apps/server
# Copy root package.json files
COPY package*.json ./

# Install dependencies (including devDeps)
RUN pnpm install 

# Build backend
RUN pnpm build


# Expose backend port
EXPOSE 3000

# Start backend
CMD ["node", "apps/server/dist/src/index.js"]
