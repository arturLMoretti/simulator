-- Login app database schema
-- Run as a superuser (e.g. postgres) to create DB and user, then run the rest as login_user.

-- Create database (run as postgres, outside of login_db)
-- CREATE DATABASE login_db;

-- Create user and grant privileges (run as postgres)
-- CREATE USER login_user WITH PASSWORD 'login_pass';
-- GRANT ALL PRIVILEGES ON DATABASE login_db TO login_user;
-- \c login_db
-- GRANT ALL ON SCHEMA public TO login_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO login_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO login_user;

-- Tables (run inside login_db as login_user or postgres)
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

COMMENT ON TABLE users IS 'User accounts for login app';
COMMENT ON COLUMN users.password_hash IS 'Salt$SHA256(salt+password) hex';
