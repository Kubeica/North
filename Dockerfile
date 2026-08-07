# Production multi-stage image for Northern Meteor Construction
# Build: docker build -t northern-meteor .
# Requires DATABASE_URL / AUTH_* at runtime (see .env.example).

FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Prisma client for build-time typegen / Next compile
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/i18n ./i18n
COPY --from=builder /app/messages ./messages

# Persistent uploads volume target (local storage provider)
RUN mkdir -p /app/public/uploads \
  && chown -R nextjs:nodejs /app/public/uploads

USER nextjs
EXPOSE 3000

# Apply migrations then start. Override CMD if migrate is handled externally.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
