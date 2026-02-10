# CRM Prospection LinkedIn (Vue 3)

MVP d'un CRM léger pour gérer des prospects B2B (LinkedIn en priorité) avec:

- Gestion complète des prospects
- Pipeline Kanban (drag & drop natif)
- Historique des interactions
- Rappels de relance
- Mini module IA (score, timing, suggestion de relance)

## Stack

- Frontend: Vue 3 + Composition API + Pinia + Vue Router + Tailwind CSS
- Build: Vite
- Base de données: Supabase (PostgreSQL) d'un projet existant

## Sauvegarde des données

L'application supporte désormais 2 modes:

1. **Supabase (recommandé)**
   - définir `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
2. **Local fallback**
   - si les variables Supabase sont absentes, l'app utilise `localStorage`

## Configuration Supabase

1. Copie `.env.example` vers `.env`
2. Renseigne:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

3. Crée les tables avec le script SQL:

- `supabase/schema.sql`

## Lancer le frontend

```bash
npm install
npm run dev
```

## Déploiement recommandé

- Frontend: Vercel / Netlify
- Backend: Supabase (DB + Auth + Policies)

> En environnement offline, l'installation des dépendances npm peut échouer.
