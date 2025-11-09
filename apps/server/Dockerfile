# Use lightweight Node image
FROM node:20-alpine

WORKDIR /app

# Install global tools (pnpm for package management)
RUN npm install -g pnpm

# Copy package.json files first for caching dependencies
COPY package*.json ./
COPY ../../packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy backend source code
COPY . .

# Build TypeScript project
RUN pnpm build

# Expose backend port
EXPOSE 3000

# Run compiled backend (dist/src/index.js)
CMD ["node", "dist/src/index.js"]
