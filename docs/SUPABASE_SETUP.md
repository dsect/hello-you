# Supabase Setup & Deployment Guide

This guide walks through the complete setup for the Supabase deployment workflow.

## Architecture

```
Local Dev (Docker) → Feature Branch → Main Branch
                                        ↓
                              Release-Please creates release
                                        ↓
                              Migrations → hello-you-dev
                                        ↓
                              Test & verify
                                        ↓
                              Manual promotion → hello-you-prod
```

## Prerequisites

1. Two Supabase projects:
   - `hello-you-dev` (branching enabled)
   - `hello-you-prod` (no branching)
2. Docker Desktop installed
3. Node.js installed

## Initial Setup

### 1. Create Supabase Projects

Go to [supabase.com](https://supabase.com) and create:

1. **hello-you-dev**
   - Enable branching (Pro plan)
   - Note the project ref (e.g., `abcdefghijklmnop`)
   - Note the database password

2. **hello-you-prod**
   - Standard project (no branching needed)
   - Note the project ref
   - Note the database password

### 2. Get Supabase Access Token

1. Go to https://supabase.com/dashboard/account/tokens
2. Create a new access token
3. Copy and save securely

### 3. Configure GitHub Secrets

Add these secrets to your repository (Settings → Secrets and variables → Actions):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SUPABASE_ACCESS_TOKEN` | Your personal access token | `sbp_xxx...` |
| `SUPABASE_DEV_PROJECT_ID` | hello-you-dev project ref | `abcdefghijklmnop` |
| `SUPABASE_PROD_PROJECT_ID` | hello-you-prod project ref | `qrstuvwxyzabcdef` |
| `SUPABASE_DEV_DB_PASSWORD` | Database password for dev | `your-dev-password` |
| `SUPABASE_PROD_DB_PASSWORD` | Database password for prod | `your-prod-password` |
| `SUPABASE_DEV_URL` | Dev project URL | `https://xxx.supabase.co` |
| `SUPABASE_DEV_ANON_KEY` | Dev anon key (for CI tests) | `eyJ...` |

To find the URL and anon key:
1. Go to your project dashboard
2. Click "Project Settings" → "API"
3. Copy the URL and `anon` `public` key

### 4. Bootstrap Dev Project

Run these commands locally to set up your dev project with the existing migration:

```bash
cd apps/web

# Link to dev project
npx supabase link --project-ref YOUR_DEV_PROJECT_ID

# Push existing migrations
npx supabase db push
```

Verify in the Supabase Studio that the `us_states` table was created.

### 5. Bootstrap Prod Project (Optional)

You can wait until your first release, or bootstrap now:

```bash
cd apps/web

# Link to prod project
npx supabase link --project-ref YOUR_PROD_PROJECT_ID

# Push existing migrations
npx supabase db push
```

## Daily Workflow

### Local Development

```bash
# Start local Supabase
./scripts/local-dev.sh

# In another terminal, start the app
cd apps/web
npm run dev
```

Access Supabase Studio at http://127.0.0.1:54323

### Making Schema Changes

1. Make changes in Supabase Studio (local)
2. Create a migration:
   ```bash
   ./scripts/create-migration.sh add_users_table
   ```
3. Review the generated migration in `apps/web/supabase/migrations/`
4. Test locally
5. Commit to git

### Deployment Process

1. **Merge to main**: Code is stored but not deployed
2. **Release-Please creates PR**: Merges when ready
3. **Create release**: Tag and release created (e.g., v1.2.0)
4. **Auto-deploy to dev**: Workflow runs automatically
5. **Test in dev**: Verify everything works
6. **Promote to prod**: Go to Actions → "Promote Migrations to Production"
   - Select "Run workflow"
   - Enter the release tag (e.g., `v1.2.0`)
   - Type `PROMOTE` to confirm
   - Click "Run workflow"

## Workflows

### CI (Pull Requests)
- Runs on every PR
- Lints, builds, and tests against `hello-you-dev`
- Does NOT run local Supabase

### Deploy Migrations to Dev
- Triggers on release creation
- Deploys migrations to `hello-you-dev`
- Adds comment to release

### Promote to Production
- Manual workflow dispatch
- Requires release tag and confirmation
- Deploys to `hello-you-prod`
- Creates deployment tracking issue

## Troubleshooting

### Local Supabase won't start
```bash
# Check Docker is running
docker info

# Stop and restart
./scripts/stop-local.sh
./scripts/local-dev.sh
```

### Reset local database
```bash
./scripts/reset-local-db.sh
```

### Check Supabase status
```bash
cd apps/web
npx supabase status
```

## Project Structure

```
apps/web/
  supabase/
    migrations/     # SQL migration files (version controlled)
    seeds/          # Seed data for local dev
    config.toml     # Local Supabase configuration
scripts/
  local-dev.sh          # Start local development
  create-migration.sh   # Create new migration
  reset-local-db.sh     # Reset local database
  stop-local.sh         # Stop local Supabase
.github/workflows/
  ci.yml                      # PR validation
  deploy-migrations-dev.yml   # Deploy on release
  promote-to-prod.yml         # Manual prod promotion
```

## Important Notes

- **Never commit credentials** - All secrets are in GitHub Secrets
- **Migrations are immutable** - Once deployed, don't modify existing migrations
- **Test in dev first** - Always verify in hello-you-dev before promoting to prod
- **Local is isolated** - Local Supabase doesn't connect to remote projects
