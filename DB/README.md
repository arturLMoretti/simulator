# Database (PostgreSQL)

Setup for the login app.

## Prerequisites

- PostgreSQL server (e.g. `sudo apt install postgresql postgresql-contrib` on Debian/Ubuntu)

## One-time setup

Run as `postgres` (or a superuser):

```bash
sudo -u postgres psql
```

In psql:

```sql
CREATE DATABASE login_db;
CREATE USER login_user WITH PASSWORD 'login_pass';
GRANT ALL PRIVILEGES ON DATABASE login_db TO login_user;
\c login_db
\i init.sql
```

Or from shell:

```bash
sudo -u postgres createuser -P login_user   # enter password: login_pass
sudo -u postgres createdb login_db
sudo -u postgres psql -d login_db -f /path/to/simulator/DB/init.sql
```

Then grant schema/table access (if needed):

```bash
sudo -u postgres psql -d login_db -c "GRANT ALL ON SCHEMA public TO login_user; GRANT ALL ON ALL TABLES IN SCHEMA public TO login_user; GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO login_user;"
```

## Schema only (if DB/user already exist)

```bash
psql -U login_user -d login_db -f schema.sql
```

## Connection string (used by backend)

- Host: `localhost`, Port: `5432`
- Database: `login_db`
- User: `login_user`
- Password: `login_pass`
