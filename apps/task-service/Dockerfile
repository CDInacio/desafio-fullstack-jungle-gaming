FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

FROM base AS development

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/task-service ./apps/task-service

RUN npm ci

EXPOSE 3003

CMD ["npm", "run", "dev", "--workspace=task-service"]

FROM base AS builder

COPY . .
RUN npm ci
RUN npm run build --workspace=task-service

FROM base AS production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/task-service/dist ./apps/task-service/dist
COPY --from=builder /app/apps/task-service/package.json ./apps/task-service/

EXPOSE 3003

CMD ["node", "apps/task-service/dist/main.js"]