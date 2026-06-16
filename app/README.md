# MindCare — application (Next.js)

Code de l'application MindCare. La **documentation complète** (présentation, stack, base de
données, tests, build et déploiement) se trouve dans le **[README à la racine du dépôt](../README.md)**.

## Commandes essentielles

```bash
npm ci            # installer les dépendances
npm run dev       # serveur de développement → http://localhost:3000
npm test          # tests unitaires (Vitest)
npm run lint      # ESLint
npm run build:cloudflare   # build de production (OpenNext / Cloudflare)
```

Variables d'environnement attendues (dans `app/.env.local`) :
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GROQ_API_KEY`.
