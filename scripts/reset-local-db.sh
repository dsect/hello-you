#!/usr/bin/env bash
#
# Reset local database (drop all data and rerun migrations)
#
set -euo pipefail

cd "$(dirname "$0")/../apps/web"

echo "⚠️  This will delete all local data and reset the database"
read -p "Continue? (y/N): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
fi

echo "🔄 Resetting local database..."
npx supabase db reset

echo "✅ Database reset complete"
