FROM node:21-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS development

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN npm ci

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "dev", "--workspace=web"]
