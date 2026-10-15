# Vetro

## Медиа

Файлы хранятся в публичном Supabase Storage bucket `Media`, внутри папок компонентов:
`Media/Header/logo-<uuid>.svg`, `Media/Gallery/photo-<uuid>.jpg`.
Уникальный суффикс предотвращает перезапись опубликованного файла и проблемы с кешированием.
Загрузка и удаление доступны только администраторам через серверные API; service role key не попадает в браузер.

```ts
const media = useMedia('Gallery')
const image = await media.upload(file) // { path, filename, url }
// Сохраните image.path в настройках компонента.
// После успешного сохранения замены / удаления:
await media.remove(previousPath)
// URL для отображения:
media.url(image.path)
```

Поддерживаются SVG (до 200 КБ), PNG, JPEG, WebP, GIF и AVIF (до 5 МБ).
SVG проверяется сервером на скрипты и внешние ресурсы.
В хедере загрузка и удаление отложены до «Сохранить», поэтому «Отменить» не затрагивает Storage.
Удаление опубликованных файлов `Header` выполняется через сохранение хедера, а не через общий DELETE API.
При сбое удаления путь сохраняется в настройках, админка предлагает повторить сохранение.

## Обновление существующей установки

После основной миграции настроек хедера примените:

```sh
docker compose exec -T db psql -U postgres -d postgres -v ON_ERROR_STOP=1 -f - < supabase/migrations/202610150002_media.sql
node scripts/migrate-header-media.mjs
docker compose up -d --build --no-deps app
```

Скрипт переноса использует серверные переменные из `.env`. Повторный запуск безопасен:
уже перенесённый или пустой логотип пропускается.
Другие файлы из `public/` не перемещаются автоматически: новые загрузки нужно подключать через `useMedia`.

## Проверки

```sh
npm test
npm run typecheck
npm run build
```
