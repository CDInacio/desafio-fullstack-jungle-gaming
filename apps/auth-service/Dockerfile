FROM node:21-alpine AS base

RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

FROM base AS development

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/auth-service ./apps/auth-service

RUN npm ci

EXPOSE 3002

CMD ["npm", "run", "dev", "--workspace=auth-service"]

FROM base AS builder

COPY . .
RUN npm ci
RUN npm run build --workspace=auth-service

FROM base AS production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/auth-service/dist ./apps/auth-service/dist
COPY --from=builder /app/apps/auth-service/package.json ./apps/auth-service/

EXPOSE 3002

CMD ["node", "apps/auth-service/dist/main.js"]