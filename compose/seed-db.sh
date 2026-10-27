#!/bin/sh
# Runs once when the postgres volume is empty: loads the e2e test data as local dev data.
set -e
pg_restore --no-owner --no-acl -U "$POSTGRES_USER" -d "$POSTGRES_DB" /seed/data.sql

# Strapi admin panel login dev@example.com / Dev12345 (super admin)
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<'SQL'
WITH admin AS (
  INSERT INTO admin_users (firstname, lastname, email, password, is_active, blocked, created_at, updated_at)
  VALUES ('Dev', 'Local', 'dev@example.com',
          '$2a$10$ItNGu7j3L2UoflSqqTbVW.7tDJygtAW5nylYvQ3nk0vnGRK6dZsYe', true, false, now(), now())
  RETURNING id
)
INSERT INTO admin_users_roles_links (user_id, role_id)
SELECT admin.id, admin_roles.id FROM admin, admin_roles WHERE admin_roles.code = 'strapi-super-admin';
SQL

# The contact form only lists archives with an email address; Mailpit catches the mail
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "UPDATE archive_tags SET email = 'archiv@example.com' WHERE id = 1"
