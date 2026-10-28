#!/usr/bin/env bash
set -Eeuo pipefail
cd /opt/vetro
: "${DEPLOY_REVISION:?Set DEPLOY_REVISION to the commit SHA}"
[[ "$DEPLOY_REVISION" =~ ^[a-f0-9]{40}$ ]]
exec 9>/run/lock/vetro-deploy.lock
flock -w 900 9
for required in .env supabase/.env docker-compose.yml docker-compose.production.yml; do
  test -f "$required" || { echo "Missing $required" >&2; exit 1; }
done
# Deployment must keep using the existing Supabase volumes.
for spec in 'vetro-supabase-db /var/lib/postgresql/data vetro_db-data' 'vetro-supabase-storage /var/lib/storage vetro_storage-data'; do
  read -r container destination expected <<< "$spec"
  actual="$(docker inspect "$container" --format "{{range .Mounts}}{{if eq .Destination \"$destination\"}}{{.Name}}{{end}}{{end}}")"
  [[ "$actual" == "$expected" ]] || { echo "Unexpected data volume for $container: $actual" >&2; exit 1; }
done
compose() { docker compose -f docker-compose.yml -f docker-compose.production.yml "$@"; }
previous_revision="$(docker inspect vetro-app-1 --format '{{range .Config.Env}}{{println .}}{{end}}' | sed -n 's/^APP_REVISION=//p')"
previous_image="$(docker inspect vetro-app-1 --format '{{.Image}}')"
docker image tag "$previous_image" vetro-app:previous
export VETRO_APP_IMAGE=vetro-app:latest VETRO_REVISION="$DEPLOY_REVISION"
compose config --quiet
# Build while the currently running application continues serving requests.
compose build app
rollback() {
  echo 'Application validation failed; restoring the previous image.' >&2
  export VETRO_APP_IMAGE=vetro-app:previous VETRO_REVISION="${previous_revision:-manual}"
  compose up -d --no-build --no-deps --wait --wait-timeout 150 app
}
trap rollback ERR
compose up -d --no-build --no-deps --wait --wait-timeout 150 app
curl --fail --silent --show-error http://127.0.0.1:3002/api/health | python3 -c 'import json,os,sys; h=json.load(sys.stdin); assert h["ok"] and h["database"]=="reachable" and h["revision"]==os.environ["DEPLOY_REVISION"], h'
trap - ERR
printf 'VETRO_APP_IMAGE=vetro-app:latest\nVETRO_REVISION=%s\n' "$DEPLOY_REVISION" > .deployment.env
chmod 600 .deployment.env
# Nginx configuration is managed separately from application releases.
echo "DEPLOYED $DEPLOY_REVISION"
