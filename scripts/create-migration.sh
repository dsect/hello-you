#!/usr/bin/env bash
#
# Create a new migration from local schema changes
# Usage: ./scripts/create-migration.sh my_migration_name
#
set -euo pipefail

cd "$(dirname "$0")/../apps/web"

if [ $# -eq 0 ]; then
    echo "❌ Please provide a migration name"
    echo "Usage: $0 migration_name"
    exit 1
fi

MIGRATION_NAME="$1"

echo "📝 Creating migration: $MIGRATION_NAME"
echo ""

# Check if local Supabase is running
if ! npx supabase status &> /dev/null; then
    echo "❌ Local Supabase is not running"
    echo "Run './scripts/local-dev.sh' first"
    exit 1
fi

# Create migration from local changes
npx supabase db diff -f "$MIGRATION_NAME"

echo ""
echo "✅ Migration created in supabase/migrations/"
echo ""
echo "Next steps:"
echo "  1. Review the migration file"
echo "  2. Test it locally"
echo "  3. Commit to git"
echo "  4. Merge to main"
echo "  5. Create a release (migrations auto-deploy to dev)"
