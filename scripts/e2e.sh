#!/bin/zsh
# Reset the dev DB, seed content, start the app, run the HTTP acceptance script, stop the app.
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd); LOG=$ROOT/.dev/server.log; mkdir -p $ROOT/.dev
pkill -f "vite dev --port 5173" 2>/dev/null || true
$ROOT/scripts/dev-db.sh reset >/dev/null
(cd $ROOT/apps/web && pnpm seed >/dev/null)
(cd $ROOT/apps/web && ALLOW_DRAFT_DEVOTIONS=1 nohup npx vite dev --port 5173 > $LOG 2>&1 &)
for i in {1..30}; do curl -s -o /dev/null localhost:5173/login && break; sleep 1; done
set +e; DEV_LOG=$LOG node $ROOT/scripts/smoke.mjs; rc=$?
pkill -f "vite dev --port 5173"; exit $rc
