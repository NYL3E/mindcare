# MindCare — image de production (Next.js 16, `next start`).
# Construire depuis la RACINE du dépôt :  docker build -f app/Dockerfile .
# ou via docker-compose (recommandé) :     docker compose up --build

# 1) Dépendances
FROM node:20-alpine AS deps
WORKDIR /app
COPY app/package.json app/package-lock.json ./
RUN npm ci

# 2) Build (les variables NEXT_PUBLIC_* sont inlinées au build → fournies en build args)
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY app/ ./
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
RUN npm run build

# 3) Exécution
FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]
