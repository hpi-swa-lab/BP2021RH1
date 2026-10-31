-- Strapi admin panel login dev@example.com / Dev12345 (super admin), used by seed-db.sh and load-dump.sh
WITH admin AS (
  INSERT INTO admin_users (firstname, lastname, email, password, is_active, blocked, created_at, updated_at)
  VALUES ('Dev', 'Local', 'dev@example.com',
          '$2a$10$ItNGu7j3L2UoflSqqTbVW.7tDJygtAW5nylYvQ3nk0vnGRK6dZsYe', true, false, now(), now())
  RETURNING id
)
INSERT INTO admin_users_roles_links (user_id, role_id)
SELECT admin.id, admin_roles.id FROM admin, admin_roles WHERE admin_roles.code = 'strapi-super-admin';
