# Supabase Development Scripts

Simple scripts for local Supabase development.

## Prerequisites

- Docker Desktop running
- Node.js installed
- Supabase CLI (auto-installed via npx)

## Local Development

### Start Local Supabase

```bash
./scripts/local-dev.sh
```

This will:
- Start local Supabase (Docker containers)
- Create `.env.local` with local credentials
- Display Supabase Studio URL

Then start your app:
```bash
cd apps/web
npm run dev
```

### Create a Migration

After making schema changes in Supabase Studio:

```bash
./scripts/create-migration.sh my_feature_name
```

This creates a migration file in `apps/web/supabase/migrations/`

### Reset Local Database

If you want to start fresh:

```bash
./scripts/reset-local-db.sh
```

### Stop Local Supabase

```bash
./scripts/stop-local.sh
```

## Deployment Flow

1. **Develop locally** → Work against local Supabase
2. **Create migration** → `./scripts/create-migration.sh`
3. **Commit & merge** → Push to main
4. **Create release** → Use release-please
5. **Auto-deploy to dev** → Workflow runs on release
6. **Test in dev** → Verify in hello-you-dev
7. **Promote to prod** → Manual workflow dispatch

## Remote Projects

- **hello-you-dev**: Testing/staging (branching enabled)
- **hello-you-prod**: Production (no branching)

Deployments are handled by GitHub Actions workflows.
