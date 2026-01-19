---
name: clean-start
description: Reset a project to a zero state, removing all untracked and ignored files, and preparing for a fresh setup. Use when onboarding, troubleshooting, or preparing for CI.
---

# Clean Start Skill

## Step 1: Wipe all files not checked into git

From the repository root, remove all files and directories that are not tracked by git (i.e., all files ignored by .gitignore and not committed). This ensures a truly clean state for onboarding, troubleshooting, or CI.

**Recommended command (run from the repo root):**

```sh
git clean -fdX
```

This will delete all ignored and untracked files and folders. Use with caution.

## Step 2: Reinstall all dependencies from scratch

After cleaning, reinstall all dependencies for each project or workspace. For a monorepo, run the appropriate install command in each app directory (e.g., `npm install` in apps/web).

**Recommended command (from each app directory):**

```sh
cd apps/web && npm install
```

## Step 3: Reset Supabase to a true zero state

To ensure your local Supabase environment is completely fresh (no leftover data or config), you must stop all running services and delete all local database and storage volumes. The Supabase CLI does not provide a single command to fully wipe all data, so you must use Docker commands to remove the volumes after stopping Supabase.

**Recommended commands (from the repo root):**

```sh
npx supabase stop
docker volume ls --filter label=com.supabase.cli.project=web
docker volume rm supabase_db_web supabase_storage_web
npx supabase start
```

This sequence stops Supabase, lists the Docker volumes used for your project, deletes them to remove all data, and then starts Supabase again with a brand new, empty environment. If the CLI adds a `db reset` command in the future, prefer that for simplicity.

## Step 4: Run end-to-end Playwright tests

To verify that your app works after a clean start, run your Playwright end-to-end tests. This ensures the frontend can connect to Supabase and the full stack is operational from zero.

**Recommended commands (from apps/web):**

```sh
npx playwright install --with-deps
npm run dev &
npx playwright test
```

This will install Playwright browsers and dependencies, start the app server, and run all Playwright tests headlessly. Review the test results to confirm everything is working as expected.
