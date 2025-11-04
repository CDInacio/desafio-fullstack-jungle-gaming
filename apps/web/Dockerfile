FROM node:18-alpine AS base

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

FROM base AS builder

COPY . .
RUN npm ci
RUN npm run build --workspace=web

FROM base AS production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/next.config.js ./apps/web/
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "start", "--workspace=web"]