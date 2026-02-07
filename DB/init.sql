-- Initialize login_db: create schema and grant to login_user.
-- 1. As postgres: create database and user (see README):
--    CREATE DATABASE login_db;
--    CREATE USER login_user WITH PASSWORD 'login_pass';
--    GRANT ALL PRIVILEGES ON DATABASE login_db TO login_user;
-- 2. Run: psql -U postgres -d login_db -f init.sql

CREATE TABLE IF NOT EXISTS users (
  id             SERIAL PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

GRANT ALL ON SCHEMA public TO login_user;
GRANT ALL PRIVILEGES ON users TO login_user;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO login_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO login_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO login_user;
