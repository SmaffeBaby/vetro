#!/usr/bin/env bash
set -euo pipefail
umask 077
exec 9>/run/lock/vetro-backup.lock
flock -n 9 || exit 0
backup_dir="/opt/vetro-backups/daily/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$backup_dir"
docker exec vetro-supabase-db pg_dump -U postgres -d postgres -Fc > "$backup_dir/postgres.dump"
docker exec vetro-supabase-db pg_dump -U postgres -d _supabase -Fc > "$backup_dir/supabase.dump"
docker exec vetro-supabase-db pg_dumpall -U postgres --roles-only | gzip > "$backup_dir/roles.sql.gz"
storage_dir="$(docker volume inspect vetro_storage-data --format '{{.Mountpoint}}')"
tar --xattrs --xattrs-include='*' -czf "$backup_dir/storage.tar.gz" -C "$storage_dir" .
config_dir="$(docker volume inspect vetro_db-config --format '{{.Mountpoint}}')"
tar --xattrs --xattrs-include='*' -czf "$backup_dir/db-config.tar.gz" -C "$config_dir" .
tar czf "$backup_dir/config.tar.gz" -C /opt/vetro .env supabase/.env docker-compose.yml docker-compose.production.yml
sha256sum "$backup_dir"/* > "$backup_dir/SHA256SUMS"
touch "$backup_dir/COMPLETE"
find /opt/vetro-backups/daily -mindepth 1 -maxdepth 1 -type d -mtime +7 -exec rm -rf -- {} +
