# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache libc6-compat

# ---- Development ----
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:dev"]

# ---- Build ----
FROM base AS build
RUN npm ci --include=dev
COPY . .
RUN npm run build
RUN npm prune --production

# ---- Production ----
FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache libc6-compat

# security: non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

USER nestjs
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "dist/main"]