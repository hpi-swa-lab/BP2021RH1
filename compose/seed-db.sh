#!/bin/sh
# Runs once when the postgres volume is empty: loads the e2e test data as local dev data.
set -e
pg_restore --no-owner --no-acl -U "$POSTGRES_USER" -d "$POSTGRES_DB" /seed/data.sql

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /seed/dev-admin.sql

# The contact form only lists archives with an email address; Mailpit catches the mail
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "UPDATE archive_tags SET email = 'archiv@example.com' WHERE id = 1"
