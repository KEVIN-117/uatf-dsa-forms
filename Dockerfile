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

# Recibir argumentos de construcción (Build Args)
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_AUTH_PARSE
ARG VITE_NODE_ENV
ARG VITE_SIDEBAR_COOKIE_NAME="sidebar_state"
ARG VITE_SIDEBAR_COOKIE_MAX_AGE="604800"
ARG VITE_SIDEBAR_WIDTH="16rem"
ARG VITE_SIDEBAR_WIDTH_MOBILE="18rem"
ARG VITE_SIDEBAR_WIDTH_ICON="3rem"
ARG VITE_SIDEBAR_KEYBOARD_SHORTCUT="b"

# Hacerlos disponibles como variables de entorno durante el build
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID
ENV VITE_AUTH_PARSE=$VITE_AUTH_PARSE
ENV VITE_NODE_ENV=$VITE_NODE_ENV
ENV VITE_SIDEBAR_COOKIE_NAME=$VITE_SIDEBAR_COOKIE_NAME
ENV VITE_SIDEBAR_COOKIE_MAX_AGE=$VITE_SIDEBAR_COOKIE_MAX_AGE
ENV VITE_SIDEBAR_WIDTH=$VITE_SIDEBAR_WIDTH
ENV VITE_SIDEBAR_WIDTH_MOBILE=$VITE_SIDEBAR_WIDTH_MOBILE
ENV VITE_SIDEBAR_WIDTH_ICON=$VITE_SIDEBAR_WIDTH_ICON
ENV VITE_SIDEBAR_KEYBOARD_SHORTCUT=$VITE_SIDEBAR_KEYBOARD_SHORTCUT

COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Construir la aplicación TanStack Start
RUN pnpm run build

# 4. Production stage (Runner)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Añadir un usuario sin privilegios por seguridad (Sintaxis Alpine compatible)
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S -G nodejs reactapp

COPY --from=builder --chown=reactapp:nodejs /app/package.json ./
# Copiamos la salida construida (cliente, servidor SSR y el server Express compilado)
COPY --from=builder --chown=reactapp:nodejs /app/dist ./dist
COPY --from=builder --chown=reactapp:nodejs /app/pnpm-lock.yaml ./
COPY --from=builder --chown=reactapp:nodejs /app/public ./public

RUN pnpm install --prod --frozen-lockfile && \
    chown -R reactapp:nodejs /app

RUN ls -la /app

# Cambiamos al usuario creado
USER reactapp

EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/server-entry.js"]
