# Production deployment

Site: http://45.12.114.96. Application and secrets: `/opt/vetro`.

## CI/CD

The workflow follows the same approach as MagnatProfessional: sync source with `rsync`, then rebuild the application with Docker Compose on the server.

- Push to `dev` or a pull request to `main`: install dependencies, check TypeScript, build Nuxt.
- **Push to `main`** (including merging `dev` into `main`): after successful checks, sync source and run `deploy/deploy-production.sh`.
- Only the application is recreated. Supabase services and data are preserved; migrations are not applied automatically.
- The server checks the data volume names, waits for application health, verifies the commit SHA, and restores the previous app image if startup validation fails.
- Production runs are serialized. Environment files, backups, and runtime data are excluded from `rsync --delete`.

GitHub environment: `production`, limited to `main`. Secrets: `PRODUCTION_HOST`, `PRODUCTION_SSH_KEY`, `PRODUCTION_KNOWN_HOSTS`. SSH host keys are pinned. The dedicated deployment key has no PTY or forwarding; it can execute deployment commands on this server. No root password is stored in GitHub or the repository.

```sh
cd /opt/vetro
set -a
. ./.deployment.env
set +a
docker compose -f docker-compose.yml -f docker-compose.production.yml ps
docker compose -f docker-compose.yml -f docker-compose.production.yml logs --tail=100 app
curl --fail http://127.0.0.1:3002/api/health
```

To deploy manually, run `DEPLOY_REVISION=<40-character-commit> bash deploy/deploy-production.sh` after syncing the tracked source. To roll back to the preceding image, export `VETRO_APP_IMAGE=vetro-app:previous`, set `VETRO_REVISION` to its commit, then run `docker compose -f docker-compose.yml -f docker-compose.production.yml up -d --no-build --no-deps --wait app` and update `.deployment.env` accordingly.

## Server configuration and backups

Nginx uses `/etc/nginx/sites-available/vetro` from `deploy/nginx.conf` and forwards port 80 to localhost:3002. Nginx configuration changes are installed and reloaded separately. Supabase gateway and database ports bind only to localhost. Studio can be accessed using an SSH tunnel to port 8002 with credentials from `supabase/.env`.

Secrets in `.env` and `supabase/.env` have mode 600 and are excluded from Git. Public signup is disabled; existing admin accounts are preserved.

Daily backups run at 03:15 Moscow time and retain 7 days under `/opt/vetro-backups/daily`. Run `bash /opt/vetro/deploy/backup.sh` manually. Backups include both databases, roles, Storage files with extended attributes, PostgreSQL key configuration, and environment files. Restore Storage using GNU tar with `--xattrs --xattrs-include='*'`. Keep an additional copy outside this server.

When adding a domain, update Nginx `server_name`, configure HTTPS, and update `SITE_URL`, `ADDITIONAL_REDIRECT_URLS`, `SUPABASE_PUBLIC_URL`, and `API_EXTERNAL_URL` in `supabase/.env`. SMTP requires real provider settings for email invitations or password recovery.
