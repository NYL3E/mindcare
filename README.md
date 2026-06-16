# MindCare

**MindCare** est une application web de prévention du bien-être mental pour les **18–24 ans** : une « safe place » mobile-first, anonyme et bienveillante, qui transforme une auto-évaluation rapide en lien social réel. Outil **préventif et médiateur**, jamais de diagnostic.

> Projet fil rouge — Titre RNCP **Chef de projets digitaux (RNCP 35541)**, option Web Development (EEMI).

## Les 4 piliers

| Pilier | Rôle | Table(s) |
| --- | --- | --- |
| **1 · Check-in d'humeur** | Auto-évaluation 30 s sur 4 indicateurs (énergie, humeur, stress, social) | `mood_entries` |
| **2 · Luna, l'IA bienveillante** | Chat conversationnel personnalisable, contextualisé par l'humeur | `chat_messages`, `ai_settings` |
| **3 · Activités** | Découverte / création de rencontres réelles encadrées | `activities` |
| **4 · Cercle social** | Gestion d'amis et de demandes (« rencontre d'abord ») | `friends`, `friend_requests` |

## Stack technique

- **Next.js 16.2.1** (App Router) · **React 19.2.4** · **TypeScript**
- **Tailwind CSS 4** · **framer-motion** · **lucide-react**
- **Supabase** (PostgreSQL + Auth + API REST PostgREST, 10 tables, RLS) — backend-as-a-service
- **Groq** (`llama-3.3-70b-versatile`) pour Luna, appelée via une route serveur (clé jamais exposée au client)
- **Cloudflare Workers** via **@opennextjs/cloudflare** + **wrangler** — déploiement edge
- **Vitest** pour les tests · **ESLint** + **TypeScript** pour la qualité
- **CI/CD** : GitHub Actions (tests → build → déploiement sur push `main`)

## Prérequis

- **Node.js 20+**
- Un projet **Supabase** (URL + clé `anon`) et une clé **Groq**

## Démarrage rapide

```bash
cd app
npm ci
# créer app/.env.local avec les 3 variables ci-dessous (cf. .env.example à la racine)
npm run dev                         # http://localhost:3000
```

Un script de confort est aussi disponible à la racine : `./start.sh`.

## Variables d'environnement

| Variable | Rôle | Exposée au client |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Oui (préfixe `NEXT_PUBLIC_`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique `anon` (la sécurité repose sur la RLS) | Oui |
| `GROQ_API_KEY` | Clé d'API Groq pour Luna | **Non** (serveur uniquement, route `/api/chat`) |

Voir `.env.example` (racine) pour le format.

## Base de données

Le schéma complet (10 tables + politiques **Row Level Security**) est versionné dans
[`supabase/schema.sql`](supabase/schema.sql). À exécuter dans l'éditeur SQL Supabase pour
provisionner une nouvelle instance.

## Tests

```bash
cd app
npm test          # vitest run — suite unitaire des règles métier (lib/rules.ts)
npm run test:watch
```

Les règles métier des 4 piliers sont isolées dans [`app/src/lib/rules.ts`](app/src/lib/rules.ts)
(importées par le contexte applicatif) et couvertes par
[`app/src/lib/__tests__/`](app/src/lib/__tests__/). La suite est **rejouée en CI** à chaque push,
de façon **bloquante** avant tout déploiement.

## Build & déploiement

### Cloudflare (production)

```bash
cd app
npm run build:cloudflare   # build OpenNext
npm run preview            # aperçu local via wrangler
```

Le déploiement est **automatisé** par GitHub Actions
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) : à chaque push sur `main`,
la CI installe les dépendances, **exécute les tests**, build l'application et la déploie sur
Cloudflare Workers.

### Docker (environnement vierge)

Pour lancer l'application sur n'importe quelle machine disposant de Docker :

```bash
cp .env.example .env        # renseigner les 3 variables
docker compose up --build   # → http://localhost:3000
```

## Structure du projet

```
.
├── app/                      # application Next.js
│   ├── src/
│   │   ├── app/              # pages (App Router) + route API /api/chat
│   │   ├── components/       # composants UI (AppShell, MoodGauge, ChatBubble…)
│   │   ├── context/          # MindCareContext — source de vérité unique
│   │   ├── hooks/            # useGrok — chat Luna
│   │   └── lib/              # supabase, rules (règles métier), aiColors, __tests__
│   ├── Dockerfile
│   └── vitest.config.ts
├── supabase/schema.sql       # 10 tables + RLS
├── docker-compose.yml
└── .github/workflows/        # CI/CD
```

## Licence

Projet pédagogique — usage académique (EEMI, 2025-26).
