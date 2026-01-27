#!/usr/bin/env bash
#
# Stop local Supabase
#
set -euo pipefail

cd "$(dirname "$0")/../apps/web"

echo "🛑 Stopping local Supabase..."
npx supabase stop

echo "✅ Local Supabase stopped"
