-- Optional: seed a default user (same password format as backend: salt$sha256(salt+password) hex).
-- Default credentials: admin@example.com / admin123
-- Requires pgcrypto for digest().

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (email, password_hash)
SELECT
  'admin@example.com',
  '00000000000000000000000000000000' || '$' || encode(
    digest('00000000000000000000000000000000' || 'admin123', 'sha256'),
    'hex'
  )
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');
