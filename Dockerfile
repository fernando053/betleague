# Build stage: install deps and build both apps
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY turbo.json ./
COPY tsconfig.base.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY apps/api apps/api
COPY apps/web apps/web

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Build both apps
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/
COPY turbo.json ./

RUN npm install --omit=dev

# Copy built API
COPY --from=builder /app/apps/api/dist apps/api/dist
COPY --from=builder /app/apps/api/node_modules/.prisma apps/api/node_modules/.prisma
COPY --from=builder /app/apps/api/node_modules/@prisma apps/api/node_modules/@prisma
COPY --from=builder /app/apps/api/prisma apps/api/prisma

# Copy built Web (static files)
COPY --from=builder /app/apps/web/dist apps/web/dist

# Copy Prisma schema and seed (needed for migrations)
COPY apps/api/prisma/schema.prisma apps/api/prisma/schema.prisma
COPY apps/api/prisma/seed.ts apps/api/prisma/seed.ts

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push --skip-generate && npx prisma db seed && node dist/index.js"]
