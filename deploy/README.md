# Production deployment

Server: `45.12.114.96`. Bootstrap configuration and secrets: `/opt/vetro`. Current deployed sources: `/opt/vetro-current`.

```sh
cd /opt/vetro-current
set -a
. ./.release.env
set +a
docker compose -f docker-compose.yml -f docker-compose.production.yml up -d --no-build --no-deps --wait app
docker compose -f docker-compose.yml -f docker-compose.production.yml ps
docker compose -f docker-compose.yml -f docker-compose.production.yml logs --tail=100 app
curl --fail http://127.0.0.1:3002/api/health
```

Nginx uses `deploy/nginx.conf` and forwards port 80 to the app on localhost:3002.
Supabase gateway and PostgreSQL ports bind only to localhost; Studio is reachable through an SSH tunnel to port 8002 using its dashboard credentials from `supabase/.env`.

Secrets are stored in `.env` and `supabase/.env`, mode 600, excluded from Git.
The production Supabase URL is `/supabase` on the site's origin. Public registration is disabled; existing administrator accounts are preserved.

Initial migration archives: `/opt/vetro-backups`. Daily backups run at 03:15 server time and retain 7 days under `/opt/vetro-backups/daily`. Run manually with `bash /opt/vetro/deploy/backup.sh`. Storage archives preserve extended attributes (MIME type and cache settings); restore using GNU tar with `--xattrs --xattrs-include='*'`. Backups include both databases, roles, Storage files, PostgreSQL key configuration and environment files. Backups contain secrets and remain accessible only to root. Keep an additional copy outside this server for disaster recovery.

When adding a domain, update Nginx `server_name`, configure HTTPS, and update `SITE_URL`, `ADDITIONAL_REDIRECT_URLS`, `SUPABASE_PUBLIC_URL`, and `API_EXTERNAL_URL` in `supabase/.env`, then recreate the containers. SMTP requires real provider settings if email invitations or password recovery are needed.


## GitHub Actions

Pushes to `dev` and pull requests to `main` build the application and run TypeScript checks. **Only a push to `main` deploys production**, including a merge into `main` or a direct push. No manual dispatch or deployment from `dev` is configured.

Workflow: `.github/workflows/ci-cd.yml`. The production environment allows only the `main` branch. Environment secrets: `DEPLOY_SSH_KEY` (a dedicated Ed25519 private key) and `DEPLOY_KNOWN_HOSTS` (the server's pinned host key). The key has a forced command and cannot open an interactive shell, forward ports, or run arbitrary SSH commands.

CI transfers a prebuilt Docker image and the tracked source archive. Releases live under `/opt/vetro-releases/<commit>`. The receiver checks archive paths and the image revision, starts only the app, checks database connectivity and the exact revision, and rolls back to the previous image if validation fails. Deployments use a lock and production runs are not canceled mid-deployment. `/api/health` exposes the deployed commit under `revision`.

Supabase data, credentials, and running services are preserved. SQL migrations and Supabase version changes need a separate planned deployment; the application pipeline does not apply migrations automatically. Old images and source releases are retained for rollback. `/opt/vetro-current` points to the last successful release. The production receiver is installed at `/usr/local/sbin/vetro-ci-deploy`; changes to `deploy/ci-deploy.sh` must be installed there by a server administrator.

To roll back manually, change to the previous source directory, load its `.release.env` as above, then run the app-only compose command. Keep `/opt/vetro-current` aligned with the chosen release afterward.
