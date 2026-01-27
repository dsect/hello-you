#!/usr/bin/env bash
#
# Local Supabase Development
# Starts local Supabase (Docker) and dev server
#
set -euo pipefail

cd "$(dirname "$0")/../apps/web"

echo "🚀 Starting local Supabase development..."

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker."
    exit 1
fi

# Start Supabase if not already running
if ! npx supabase status &> /dev/null; then
    echo "📦 Starting local Supabase..."
    npx supabase start
else
    echo "✅ Local Supabase already running"
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local..."
    ANON_KEY=$(npx supabase status --output json | grep -o '"anon_key": *"[^"]*"' | cut -d'"' -f4)
    
    cat > .env.local << EOF
# Local Supabase Development
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=$ANON_KEY
EOF
fi

echo ""
echo "✅ Local development ready!"
echo ""
echo "   Supabase Studio: http://127.0.0.1:54323"
echo "   API: http://127.0.0.1:54321"
echo ""
echo "Run 'npm run dev' to start the app"
