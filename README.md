# Vetro

Локальная основа сайта на Nuxt 4 + Supabase. Структура и зависимости взяты из `saint_mmf`, self-hosted Supabase и данные — из `MagnatProfessional`. Дизайн и бизнес-API нового сайта ещё предстоит реализовать.

## Запуск Docker

```sh
docker compose up -d --build
docker compose ps
```

- Сайт: http://localhost:3002
- Проверка Nuxt и соединения с БД: http://localhost:3002/api/health
- Supabase Studio и API: http://localhost:8002
- PostgreSQL через pooler: localhost:5433
- Transaction pooler: localhost:6544

Studio запрашивает `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD` из `supabase/.env`. Пароль PostgreSQL находится там же. Сайт опубликован на всех интерфейсах (`0.0.0.0:3002`), Studio и PostgreSQL — только на `127.0.0.1`. Логин Studio — `supabase`; актуальный пароль находится в `DASHBOARD_PASSWORD` локального файла `supabase/.env`. Это HTTP Basic Auth панели, а не Supabase Auth пользователя сайта.

```sh
docker compose logs -f app
docker compose down
```

Данные находятся в независимых внешних томах `vetro_db-data`, `vetro_db-config`, `vetro_storage-data`. Обычный `down` и `down -v` их не удаляют. Исходный проект использует другие тома и имена контейнеров.

## Разработка

Требуется Node.js 24.15 или новее в ветке 24 (`.nvmrc`). Docker использует Node.js 24 независимо от версии на компьютере. Установленный на машине Node.js 23 для обновлённого стека не подходит. Если используете nvm, выберите `nvm install 24` / `nvm use`; для работы через Docker Node.js на хосте не требуется.

```sh
nvm use
npm ci
# Остановить production-приложение, чтобы освободить 3002:
docker compose stop app
npm run dev
```

Остальные контейнеры Supabase должны оставаться запущенными. После разработки остановить Nuxt и выполнить `docker compose up -d app`.

## Структура

- `app/pages`, `components`, `layouts`, `composables`, `stores`, `plugins`, `assets` — интерфейс Nuxt.
- `content` — Markdown-контент; коллекции Nuxt Content 3 описаны в `content.config.ts`, используется встроенный `node:sqlite`.
- `i18n/i18n.config.ts` — словари Nuxt i18n 10.
- `app/assets/css/main.css` — Tailwind CSS 4 через Vite, настройка через CSS.
- `server/api` — серверные обработчики Nitro, `server/utils` — серверные утилиты.
- `app/plugins/supabase.client.ts` — браузерный клиент с публичным anon key; URL `/supabase` разрешается относительно адреса сайта.
- `server/utils/supabase.ts` — клиент с service-role key, доступный только серверу. Перед использованием в API необходимы проверка пользователя и его прав.
- `supabase` — скопированный self-hosted стек с Kong, Auth, Storage, Realtime, Studio и PostgreSQL.

Nuxt уже включает Node.js-сервер Nitro: он обслуживает SSR и `/api/*`. Отдельный Express из Magnat для этой основы не нужен. При добавлении отправки почты и загрузки файлов обработчики можно реализовать в `server/api`.

## Конфигурация и копия данных

`.env` и `supabase/.env` локальные и исключены из Git и Docker build context. Не передавать service-role key в `runtimeConfig.public`. Примеры переменных лежат в `.env.example` и `supabase/.env.example`; во втором сохранены upstream-переменные и настроены локальные URL и порты Vetro.

Изначально PostgreSQL, конфигурационный том и Storage были скопированы из Magnat. 15.10.2026 в Vetro удалены все 15 прикладных таблиц схемы `public`, три бакета и содержимое Storage. Служебные таблицы Supabase и пользователь Auth сохранены. Локальные ключи и настройки остаются из исходной копии. Изменения Vetro не синхронизируются обратно. SMTP и внешние интеграции отдельно не настраивались.

Резервная копия перед очисткой: `backups/before-reset-20261015-115041/` (`postgres.sql`, `storage.tar.gz`). Она содержит прежние данные и секреты; каталог исключён из Git. Контрольные хеши томов Magnat до и после очистки сохраняются рядом с копией. Рабочие данные Vetro находятся только в томах `vetro_*`. Пересборка приложения не восстанавливает таблицы и бакеты Magnat.

Для переноса копии на другую машину нужен backup/restore базы **и** Storage: один Git checkout данных не содержит. На этой машине повторное первоначальное копирование выполняет:

```sh
python3 scripts/clone-local-supabase.py
```

Скрипт требует остановленных контейнеров обоих проектов и пустых целевых томов; существующие данные не перезаписывает. Он монтирует исходные тома только для чтения. Это локальная копия между одинаковыми версиями PostgreSQL, а не способ обновления PostgreSQL.

## Доступ с других устройств

На устройстве в той же сети откройте `http://<локальный-IP-компьютера>:3002/`. Текущий адрес при настройке: http://192.168.10.162:3002/ (он может измениться после переподключения к сети). `localhost` на телефоне указывает на телефон.

Nuxt принимает HTTP-запросы Supabase Auth, REST, Storage, Functions и GraphQL через `/supabase/*` и передаёт в закрытую Docker-сеть. Браузеру не нужно обращаться к `localhost:8002`. Прокси не добавляет service-role key, gateway проверяет ключ/JWT клиента и применяет RLS. Панель Studio через этот маршрут недоступна. Для Realtime WebSocket потребуется отдельная конфигурация проксирования при реализации этой функции.

Если соединение с другого устройства блокируется, проверьте, что устройства в одной сети без изоляции клиентов, а macOS разрешает входящие подключения Docker на TCP 3002.

## Библиотеки

Основной стек обновлён до Nuxt 4.6.1, Vue 3.5.44, Vue Router 5.4.0, Pinia 4.1.0, Nuxt Content 3.16.2, Nuxt i18n 10.6.0, nuxt-security 2.6.0, Tailwind CSS 4.3.3, Supabase JS 2.117.3 и Nodemailer 10.1.1. Удалены старые overrides Nuxt/Nitro и модуль Tailwind 3.

XLSX 0.20.3 устанавливается с официального CDN SheetJS: версия в npm устарела и содержит неисправленные уязвимости. URL и integrity зафиксированы в `package-lock.json`. Документация: https://docs.sheetjs.com/docs/getting-started/installation/nodejs/.

Проверка зависимостей: `npm audit`. Успешный audit относится к npm-зависимостям и не заменяет аудит образов self-hosted Supabase.
