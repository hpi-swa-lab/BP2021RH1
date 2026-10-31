#!/bin/sh
# Runs the local stack on a copy of a server database, for example to try a Strapi upgrade or a
# migration on real data before deploying it:
#   compose/load-dump.sh <file from pg_dump -Fc> [schema]
# The schema is the one the dump holds: public for production, dev for staging. Each run starts from
# an empty database in the Compose project bp-dump. Stop the dev stack first; both use ports 3000 and 9000.
set -e
dump=$(realpath "$1")
schema=${2:-public}
cd "$(dirname "$0")/.."
# Compose names the dev stack after the checkout folder
dev_pnpm_volume=$(basename "$PWD" | tr '[:upper:]' '[:lower:]')_pnpm
compose() { DUMP_SCHEMA=$schema DEV_PNPM_VOLUME=$dev_pnpm_volume docker compose -p bp-dump -f docker-compose.yml -f docker-compose.dump.yml "$@"; }
psql() { compose exec -T postgres psql -h 127.0.0.1 -U postgres -d bpgallery -v ON_ERROR_STOP=1 -q "$@"; }

compose down -v
compose up -d --wait postgres
# Production's dump creates the public schema itself
psql -c 'DROP SCHEMA public CASCADE'
compose exec -T postgres pg_restore -h 127.0.0.1 -U postgres -d bpgallery --no-owner --no-acl < "$dump"
psql -c 'CREATE SCHEMA IF NOT EXISTS public'
compose exec -T -e PGOPTIONS="-c search_path=$schema" postgres \
  psql -h 127.0.0.1 -U postgres -d bpgallery -v ON_ERROR_STOP=1 -q < compose/dev-admin.sql

compose up -d --wait strapi gallery
echo "Gallery: http://localhost:3000, admin panel: http://localhost:9000/admin (dev@example.com / Dev12345)"
echo "Stop and delete the copy: docker compose -p bp-dump down -v"
