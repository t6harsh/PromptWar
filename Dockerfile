# ============================================================
# Chronos Paradox — Multi-service Dockerfile
# Runs Next.js frontend + Flask backend in a single container
# ============================================================

# ─── Stage 1: Install Node dependencies ─────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ─── Stage 2: Build Next.js ─────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ─── Stage 3: Production runner ─────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install Python 3 + pip for Flask backend
RUN apk add --no-cache python3 py3-pip

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy Next.js standalone build
COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Flask backend
COPY --chown=nextjs:nodejs backend/ ./backend/

# Install Python dependencies in a venv (avoids system-packages conflicts)
RUN python3 -m venv /app/backend/venv && \
    /app/backend/venv/bin/pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy startup script
COPY --chown=nextjs:nodejs start.sh ./start.sh
RUN chmod +x ./start.sh

USER nextjs

EXPOSE 3000 5000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./start.sh"]
