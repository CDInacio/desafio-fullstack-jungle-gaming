FROM node:21-alpine AS base

RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

FROM base AS development

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/notification-service ./apps/notification-service

RUN npm ci

EXPOSE 3004

CMD ["npm", "run", "dev", "--workspace=notification-service"]

FROM base AS builder

COPY . .
RUN npm ci
RUN npm run build --workspace=notification-service

FROM base AS production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/notification-service/dist ./apps/notification-service/dist
COPY --from=builder /app/apps/notification-service/package.json ./apps/notification-service/

EXPOSE 3004

CMD ["node", "apps/notification-service/dist/main.js"]