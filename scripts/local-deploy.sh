#!/bin/bash
# Local deploy script — pulls latest code and rebuilds changed services
set -e
cd "$(dirname "$0")/.."

echo "[deploy] Pulling latest from main..."
git pull origin main

echo "[deploy] Detecting changed services..."
CHANGED=$(git diff HEAD~1 --name-only 2>/dev/null || echo "")

REBUILD=""
if echo "$CHANGED" | grep -q "server/"; then
  REBUILD="$REBUILD server"
fi
if echo "$CHANGED" | grep -q "client/"; then
  REBUILD="$REBUILD client"
fi
if echo "$CHANGED" | grep -q "nginx.conf"; then
  REBUILD="$REBUILD nginx"
fi
if echo "$CHANGED" | grep -q "cloudflared/"; then
  REBUILD="$REBUILD cloudflared"
fi

if [ -z "$REBUILD" ]; then
  echo "[deploy] No service changes detected. Restarting server only."
  docker compose -f docker-compose.prod.yml restart server
else
  echo "[deploy] Rebuilding:$REBUILD"
  docker compose -f docker-compose.prod.yml up -d --build $REBUILD
fi

echo "[deploy] Done!"
