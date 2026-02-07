# Use Debian-based image for locale support (avoids "no usable system locales" on Alpine)
FROM postgres:16-bookworm

# Init scripts run on first start (when data dir is empty), in alphabetical order
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY 02-default-user.sql /docker-entrypoint-initdb.d/02-default-user.sql

# Defaults (override in docker-compose)
ENV POSTGRES_USER=login_user
ENV POSTGRES_PASSWORD=login_pass
ENV POSTGRES_DB=login_db
