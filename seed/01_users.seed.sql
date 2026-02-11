-- Seed default USER for E2E test
-- username: user test
-- password: password

INSERT INTO users (id, username, password, role)
VALUES
(
  gen_random_uuid(),
  'user test',
  '$2b$10$frYFyqzlFc7n7jvniFLnZ.WpH0df4uKsCOLQx8t42r3P11xiyi94C',
  'user'
),
(
  gen_random_uuid(),
  'admin test',
  '$2b$10$frYFyqzlFc7n7jvniFLnZ.WpH0df4uKsCOLQx8t42r3P11xiyi94C',
  'admin'
);
