# 1. Base stage - Setup pnpm and node
FROM node:22.12.0-alpine3.21 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm


# 2. Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# 3. Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Construir la aplicación TanStack Start
RUN pnpm run build

# 4. Production stage (Runner)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Añadir un usuario sin privilegios por seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 reactapp

COPY --from=builder --chown=reactapp:nodejs /app/package.json ./
# Copiamos la salida construida (cliente, servidor SSR y el server Express compilado)
COPY --from=builder --chown=reactapp:nodejs /app/dist ./dist
COPY --from=builder --chown=reactapp:nodejs /app/pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

RUN ls -la /app

# Cambiamos al usuario creado
USER reactapp

EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/server-entry.js"]
