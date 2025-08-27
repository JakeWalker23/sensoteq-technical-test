#!/usr/bin/env bash

set -euo pipefail
cd "$(dirname "$0")/.."

PROJECT="sensoteq-svc-tests"

pnpm install
pnpm build

docker compose -p "$PROJECT" -f docker-compose.test.yml up -d --build

sleep 3

SERVICE_BASE=http://localhost:5000 pnpm vitest run test/service/*.test.ts --run

docker compose -p "$PROJECT" -f docker-compose.test.yml down -v --remove-orphans
