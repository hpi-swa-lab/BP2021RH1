-- Gallery login testCurator / 1234abc, as in the test data, used by load-dump.sh. A super user may
-- run every operation, since the copy holds no permissions for a new user.
WITH curator AS (
  INSERT INTO up_users (username, email, provider, password, confirmed, blocked, is_super_user,
                        created_at, updated_at)
  VALUES ('testCurator', 'test-curator@example.com', 'local',
          '$2a$10$qGOoAH5hv1/Iv5T8NfFHFuMdhy4l/iqjdfLg0rz8U1RW/gjLE1rz2', true, false, true,
          now(), now())
  RETURNING id
)
INSERT INTO up_users_role_links (user_id, role_id)
SELECT curator.id, up_roles.id FROM curator, up_roles WHERE up_roles.type = 'curator';
