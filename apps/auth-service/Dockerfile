
# # ===== BASE:  Imagem base reutilizável para todos os outros stages. =====
# FROM node:20-alpine AS base
# # The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# # Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

# # ===== BUILDER: Preparação do Monorepo =====
# FROM base AS builder
# RUN apk update
# RUN apk add --no-cache libc6-compat
# # Set working directory
# WORKDIR /app
# RUN npm install -g turbo
# COPY . .
# RUN turbo prune auth-service --docker

# # ===== INSTALLER: Instalação de Dependências =====
# FROM base AS installer
# RUN apk update
# RUN apk add --no-cache libc6-compat
# WORKDIR /app

# # First install dependencies (as they change less often)
# COPY .gitignore .gitignore
# COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/package-lock.json ./package-lock.json
# RUN npm i
# # Build the project and its dependencies
# COPY --from=builder /app/out/full/ .
# RUN npx turbo run build --filter=auth-service...

# # ===== DEVELOPMENT: Ambiente de Desenvolvimento (com Hot Reload) =====
# FROM base AS development
# WORKDIR /app
# RUN npm install -g @nestjs/cli turbo
# COPY package*.json turbo.json ./
# COPY apps/auth-service/package*.json ./apps/auth-service/
# COPY packages/ ./packages/
# RUN npm install
# COPY . .
# WORKDIR /app/apps/auth-service

# CMD ["npm", "run", "start:dev"]

# # Uncomment and use build args to enable remote caching
# # ARG TURBO_TEAM
# # ENV TURBO_TEAM=$TURBO_TEAM

# # ARG TURBO_TOKEN
# # ENV TURBO_TOKEN=$TURBO_TOKEN

# # ===== PRODUCTION =====
# FROM base AS runner
# WORKDIR /app
# # Don't run production as root
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nestjs
# USER nestjs
# COPY --from=installer /app .
# CMD node apps/auth-service/dist/main.js
# # ===== BASE:  Imagem base reutilizável para todos os outros stages. =====
# FROM node:20-alpine AS base
# # The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# # Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

# # ===== BUILDER: Preparação do Monorepo =====
# FROM base AS builder
# RUN apk update
# RUN apk add --no-cache libc6-compat
# # Set working directory
# WORKDIR /app
# RUN npm install -g turbo
# COPY . .
# RUN turbo prune auth-service --docker

# # ===== INSTALLER: Instalação de Dependências =====
# FROM base AS installer
# RUN apk update
# RUN apk add --no-cache libc6-compat
# WORKDIR /app

# # First install dependencies (as they change less often)
# COPY .gitignore .gitignore
# COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/package-lock.json ./package-lock.json
# RUN npm i
# # Build the project and its dependencies
# COPY --from=builder /app/out/full/ .
# RUN npx turbo run build --filter=auth-service...

# # ===== DEVELOPMENT: Ambiente de Desenvolvimento (com Hot Reload) =====
# FROM base AS development
# WORKDIR /app
# RUN npm install -g @nestjs/cli turbo
# COPY package*.json turbo.json ./
# COPY apps/auth-service/package*.json ./apps/auth-service/
# COPY packages/ ./packages/
# RUN npm install
# COPY . .
# WORKDIR /app/apps/auth-service

# CMD ["npm", "run", "start:dev"]

# # Uncomment and use build args to enable remote caching
# # ARG TURBO_TEAM
# # ENV TURBO_TEAM=$TURBO_TEAM

# # ARG TURBO_TOKEN
# # ENV TURBO_TOKEN=$TURBO_TOKEN

# # ===== PRODUCTION =====
# FROM base AS runner
# WORKDIR /app
# # Don't run production as root
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nestjs
# USER nestjs
# COPY --from=installer /app .
# CMD node apps/auth-service/dist/main.js