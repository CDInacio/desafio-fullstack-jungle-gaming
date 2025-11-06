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

