#!/bin/sh
# Runs once when the postgres volume is empty: loads the e2e test data as local dev data, into the schema
# DATABASE_SCHEMA (default public).
set -e
schema=${DATABASE_SCHEMA:-public}
pg_restore --no-owner --no-acl -U "$POSTGRES_USER" -d "$POSTGRES_DB" /seed/data.sql

if [ "$schema" != public ]; then
  # As on the server, where staging's schema dev shares its database with production's public. Here public
  # keeps the tables but no rows, so SQL that names no schema finds no data and makes the tests fail
  psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -q \
    -c "ALTER SCHEMA public RENAME TO \"$schema\"" -c 'CREATE SCHEMA public'
  pg_restore --no-owner --no-acl --schema-only -U "$POSTGRES_USER" -d "$POSTGRES_DB" /seed/data.sql
fi

export PGOPTIONS="-c search_path=$schema"
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /seed/dev-admin.sql

# The contact form only lists archives with an email address; Mailpit catches the mail
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "UPDATE archive_tags SET email = 'archiv@example.com' WHERE id = 1"
