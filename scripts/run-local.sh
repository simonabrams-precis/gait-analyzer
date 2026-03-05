#!/usr/bin/env bash
# Start Phase 3 stack for local testing (Postgres, Redis, API, worker use Docker; frontend runs on host).
# Requires: Docker, Python with backend deps (pip install -r backend/requirements.txt)
set -e
cd "$(dirname "$0")/.."

DOCKER_CMD="docker compose"
if ! command -v docker &>/dev/null; then
  echo "Docker is not installed or not in PATH. Install Docker and try again."
  exit 1
fi
if ! docker compose version &>/dev/null 2>&1; then
  DOCKER_CMD="docker-compose"
fi

echo "== Starting Postgres and Redis..."
$DOCKER_CMD up -d postgres redis

echo "== Waiting for Postgres..."
sleep 5
for i in $(seq 1 30); do
  if $DOCKER_CMD exec -T postgres pg_isready -U postgres -q 2>/dev/null; then
    break
  fi
  sleep 1
done

echo "== Running migrations..."
cd backend && alembic upgrade head && cd ..

echo "== Starting API and worker..."
$DOCKER_CMD up -d api worker

echo "== Done. Backend: http://localhost:8000 (docs: http://localhost:8000/docs)"
echo ""
echo "Start the frontend in another terminal:"
echo "  cd frontend && npm install && npm run dev"
echo "Then open http://localhost:3000"
echo ""
echo "Uploads use local disk (no R2 needed). To use R2, set R2_* in the API/worker env and remove LOCAL_STORAGE_PATH."
