# ── Base ──────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

# ── Dependencies ──────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ── Dev ───────────────────────────────────────────
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ./node_modules/.bin/prisma generate
EXPOSE 3000
CMD ["sh", "-c", "./node_modules/.bin/prisma db push --skip-generate && ./node_modules/.bin/next dev --hostname 0.0.0.0"]

# ── Build ─────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ./node_modules/.bin/prisma generate && ./node_modules/.bin/next build

# ── Production ────────────────────────────────────
FROM base AS prod
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
EXPOSE 3000
CMD ["node", "server.js"]
