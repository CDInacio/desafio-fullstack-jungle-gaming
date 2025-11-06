FROM node:21-alpine AS base

RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Stage de desenvolvimento
FROM base AS development

# Copiar arquivos de dependências
COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/api-gateway ./apps/api-gateway

# Instalar dependências
RUN npm ci

EXPOSE 3001

CMD ["npm", "run", "dev", "--workspace=api-gateway"]

# Stage de build
FROM base AS builder

# Copiar tudo
COPY . .

# Instalar dependências
RUN npm ci

# Build do projeto
RUN npm run build --workspace=api-gateway

# Stage de produção
FROM base AS production

# Copiar apenas o necessário
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-gateway/dist ./apps/api-gateway/dist
COPY --from=builder /app/apps/api-gateway/package.json ./apps/api-gateway/

EXPOSE 3001

CMD ["node", "apps/api-gateway/dist/main.js"]