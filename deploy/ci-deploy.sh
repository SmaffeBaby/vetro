#!/usr/bin/env bash
# Install as /usr/local/sbin/vetro-ci-deploy, root-owned mode 700.
# The CI SSH key can invoke only this command and cannot open a shell or tunnel.
set -euo pipefail
umask 077
if [[ ! ${SSH_ORIGINAL_COMMAND:-} =~ ^deploy\ ([a-f0-9]{40})$ ]]; then
  echo 'Expected: deploy <40-character commit SHA>' >&2
  exit 64
fi
revision="${BASH_REMATCH[1]}"
exec 9>/run/lock/vetro-deploy.lock
flock -w 900 9
release_dir="/opt/vetro-releases/$revision"
mkdir -p /opt/vetro-releases
if [[ -e "$release_dir" ]]; then
  echo 'This revision already has a release directory; refusing to overwrite it.' >&2
  exit 65
fi
mkdir -p "$release_dir/source" "$release_dir/bundle"
cat > "$release_dir/release.tar"
# Reject links and paths escaping either extraction directory.
python3 - "$release_dir" <<'PY'
import sys, tarfile
from pathlib import Path
root = Path(sys.argv[1])
for archive, target, allowed in [(root/'release.tar', root/'bundle', {'source.tar', 'app-image.tar.gz'}),
                                  (root/'bundle/source.tar', root/'source', None)]:
    with tarfile.open(archive) as tar:
        members = tar.getmembers()
        for member in members:
            path = Path(member.name)
            if path.is_absolute() or '..' in path.parts or not (member.isfile() or member.isdir()):
                raise ValueError('Unsafe archive entry: ' + member.name)
            if allowed is not None and member.name not in allowed:
                raise ValueError('Unexpected bundle entry: ' + member.name)
        tar.extractall(target, members=members, filter='data')
PY
gzip -dc "$release_dir/bundle/app-image.tar.gz" | docker load
image="vetro-app:$revision"
actual_revision="$(docker image inspect "$image" --format '{{index .Config.Labels "org.opencontainers.image.revision"}}')"
[[ "$actual_revision" == "$revision" ]]
ln -s /opt/vetro/.env "$release_dir/source/.env"
ln -s /opt/vetro/supabase/.env "$release_dir/source/supabase/.env"
printf 'VETRO_APP_IMAGE=%s\nVETRO_REVISION=%s\n' "$image" "$revision" > "$release_dir/source/.release.env"
export VETRO_APP_IMAGE="$image" VETRO_REVISION="$revision"
compose=(docker compose --project-name vetro --project-directory "$release_dir/source" -f "$release_dir/source/docker-compose.yml" -f "$release_dir/source/docker-compose.production.yml")
"${compose[@]}" config --quiet
previous_image="$(docker inspect vetro-app-1 --format '{{.Config.Image}}')"
previous_revision="$(docker inspect vetro-app-1 --format '{{range .Config.Env}}{{println .}}{{end}}' | sed -n 's/^APP_REVISION=//p')"
previous_dir="$(readlink -f /opt/vetro-current 2>/dev/null || true)"
rollback() {
  echo 'Deployment failed; restoring the previous application.' >&2
  export VETRO_APP_IMAGE="$previous_image" VETRO_REVISION="${previous_revision:-manual}"
  if [[ -n "$previous_dir" && -d "$previous_dir" ]]; then
    docker compose --project-name vetro --project-directory "$previous_dir" -f "$previous_dir/docker-compose.yml" -f "$previous_dir/docker-compose.production.yml" up -d --no-build --no-deps --wait --wait-timeout 150 app
  else
    docker compose --project-name vetro --project-directory /opt/vetro -f /opt/vetro/docker-compose.yml -f "$release_dir/source/docker-compose.production.yml" up -d --no-build --no-deps --wait --wait-timeout 150 app
  fi
}
trap 'rollback' ERR
"${compose[@]}" up -d --no-build --no-deps --wait --wait-timeout 150 app
curl --fail --silent --show-error http://127.0.0.1:3002/api/health > "$release_dir/health.json"
python3 - "$release_dir/health.json" "$revision" <<'PY'
import json, sys
health = json.load(open(sys.argv[1]))
assert health['ok'] and health['database'] == 'reachable' and health['revision'] == sys.argv[2], health
PY
# Validate the new proxy configuration before replacing the active file.
cp /etc/nginx/sites-available/vetro "$release_dir/nginx.previous"
install -m 644 "$release_dir/source/deploy/nginx.conf" /etc/nginx/sites-available/vetro
if ! nginx -t; then
  cp "$release_dir/nginx.previous" /etc/nginx/sites-available/vetro
  false
fi
systemctl reload nginx
install -m 700 "$release_dir/source/deploy/backup.sh" /opt/vetro/deploy/backup.sh
install -m 644 "$release_dir/source/deploy/README.md" /opt/vetro/deploy/README.md
ln -sfn "$release_dir/source" /opt/vetro-current
trap - ERR
# The image is loaded and no longer needs a duplicate archive on disk.
rm -f "$release_dir/release.tar" "$release_dir/bundle/app-image.tar.gz"
echo "DEPLOYED $revision"
