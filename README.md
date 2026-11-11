# vtp-backend

REST API for **VTP** (Video Tracking and Planning) — it mirrors the Steam app catalogue
into PostgreSQL, enriches it with store metadata and user tags, and ranks those apps
against a per-user scoring config so the channel can pick what to record next.

Node.js + Express 5 + Prisma 7 on PostgreSQL, authentication by better-auth, Steam
ingestion on `node-schedule` jobs. Written in TypeScript and run directly through `tsx`
(there is no compile step).

Part of a three repository set:

| Repo | Role |
| --- | --- |
| [vtp-common](https://github.com/Noodles-Coders-Team/vtp-common) | zod schemas and DTOs shared by the API and the client |
| **vtp-backend** | this repo, the REST API |
| [vtp-front](https://github.com/Noodles-Coders-Team/vtp-front) | the web client |


## Getting started

Prerequisites: Node.js 20+, a reachable PostgreSQL instance, and a Steam Web API key.

```bash
npm install          # install dependencies
npx prisma generate  # generate the typed client into src/generated/
npm run dev          # start the API on http://localhost:8080
```

A local database is easiest through the `docker-compose.yaml` in the parent directory
(`docker compose up -d postgres`), which brings up postgres 15 on port 5432 and keeps its
data in `../postgresql/`.

Create a `.env` in the repository root before the first run — it is git ignored, so it
never arrives with a clone:

```ini
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DB=...
POSTGRES_ADDRESS=...
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE

# Better Auth
BETTER_AUTH_SECRET=...            # any long random string
BETTER_AUTH_URL=http://localhost:8080

STEAM_API_KEY=...                 # https://steamcommunity.com/dev/apikey
```

Only three of these are read by the application: `DATABASE_URL`, `STEAM_API_KEY`, and
`BETTER_AUTH_SECRET`/`BETTER_AUTH_URL` by better-auth itself. The `POSTGRES_*` ones are
there for whatever provisions the database. A missing `STEAM_API_KEY` throws at import
time, so it fails fast and loudly; `DATABASE_URL` is interpolated into a string before it
is checked, so its own guard never fires and a missing value surfaces later as a
connection error instead.

> **If `@nct/vtp-common` cannot be resolved**, the sibling package has not been built.
> It is linked with `"@nct/vtp-common": "file:../vtp-common"`, so it must sit next to this
> repo on disk. Clone [vtp-common](https://github.com/Noodles-Coders-Team/vtp-common),
> run `npm install && npm run build` there, then re-run `npm install` here. Re-run its
> build after any schema change — the `file:` link serves `dist/`, not `src/`.

### After pulling new commits

* `npm install` — if `package.json` changed
* `npx prisma migrate dev` — if there are new migrations
* `npx prisma generate` — if `prisma/schema.prisma` changed

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the server on port 8080 via `tsx` |
| `npm run build` | `tsc --noEmit`, i.e. a typecheck only — the app is always run through `tsx` |
| `npm test` | Runs `src/test.ts`, which is an empty file. Not a test suite |


### Getting an account

There is no seed user. Register through the client's sign-up form, or post straight to
better-auth:

```bash
curl -X POST http://localhost:8080/api/auth/sign-up/email \
  -H 'Content-Type: application/json' \
  -d '{"email":"me@example.com","password":"at-least-8-chars","name":"Me"}'
```

New users get the `user` role. `/settings` and `/docs` are admin-only, and the admin plugin in
[src/lib/auth.ts](src/lib/auth.ts) grants `admin` through a hardcoded `adminUserIds`
list — a user id from someone else's database will never match, so promote your own user
by adding its id there or by setting `user.role = 'admin'` in the database directly.

## Authentication

better-auth with the email/password provider and the admin plugin, mounted ahead of
`express.json()`:

```
app.all("/api/auth/{*any}", toNodeHandler(auth))
```

Everything under `/api/auth/` — sign-up, sign-in, sign-out, session — is handled by
better-auth, which owns the `user`, `session`, `account` and `verification` tables. Session
state travels in a cookie, which is why the client sends `credentials: 'include'` and why
CORS has to allow credentials.

Two middlewares guard the application routes:

| Middleware | What it does |
| --- | --- |
| [validateAuth](src/middleware/validateAuth.ts) | Resolves the session from the request headers, answers `401 { error }` without one, and parks it on `res.locals.session` |
| [requireRole](src/middleware/requireRole.ts) | Reads `res.locals.session.user.role` and answers `403 { error }` unless it is in the allowed list |

Every application route sits behind `validateAuth`; `/settings` and `/docs` additionally
require `UserRoles.Admin`. `requireRole` assumes a session is already on `res.locals`, so
it only works mounted after `validateAuth` — on its own it throws on `session.user`.

> **CORS is currently misconfigured.** `src/app.ts` sets
> `origin: ' http://localhost:5173'` — note the leading space, which stops it matching the
> client's origin, so no `Access-Control-Allow-Origin` header is sent and the browser
> blocks the responses. Dropping the space fixes it.

## API docs

Swagger UI is served by the running app at **http://localhost:8080/docs**. It sits behind
`validateAuth` and `requireRole([Admin])`, so sign in as an admin first — the session
cookie is set on `localhost:8080`, so a browser that has signed in will carry it there.
Without one, `/docs` answers `401`.

**The documentation is an endpoint index, not a contract.** Each operation carries a tag
and a one-line summary and nothing else: no parameters, no request bodies, no response
schemas. The payload shapes live in `@nct/vtp-common` as zod schemas, and duplicating them
in OpenAPI by hand is what let the old spec drift until it described a domain the API no
longer served. Swagger UI is for *what endpoints exist*; the schemas are for *what they
take*.

### Where the documentation lives

Nothing is documented in the route files. The spec has two pieces:

| File | Holds |
| --- | --- |
| [src/config/swagger.ts](src/config/swagger.ts) | `info`, `servers`, and the ordered `tags` list that Swagger UI groups by — the table of contents |
| `src/docs/*.yaml` | One file per router, holding only that router's `paths` |

`swagger-jsdoc` is still the assembler, but it is no longer scanning comments: a `.yaml`
path in its `apis` array is parsed whole as an OpenAPI fragment, so the files are plain
documentation with no code and no JSDoc wrapper. Each router points at its file with a
one-line comment and carries nothing else.

```
src/docs/
  steam_apps.yaml                 → routes/steam_apps.ts
  steam_app_reference_data.yaml   → routes/steam_app_reference_data.ts
  user_game_score.yaml            → routes/user_game_score.ts
  settings.yaml                   → routes/settings.ts
```

An entry is as small as this:

```yaml
paths:
  /settings:
    get:
      tags: [Settings]
      summary: List all settings
```

**To document a new endpoint**, add the path to the YAML file of the router that serves it.
**To add a new router**, add a file here and a tag to the `tags` list in `swagger.ts` —
tags are deduplicated by name, so declaring one in both places silently drops the
description in the YAML, which is why they live centrally. The `apis` glob is relative to
the working directory, so start the server from the repo root.

Two consequences of keeping the operations this thin are worth knowing. Swagger UI's
*Try it out* has no inputs to offer, so it can only fire the parameterless `GET`s —
templated paths like `/settings/{key}` need a `parameters` block before that button is
useful. And an operation object without `responses` is technically invalid OpenAPI; nothing
in this stack validates, and Swagger UI renders it, but a stricter linter would complain.

### Endpoints at a glance

All of these require a session cookie.

| Method and path | Purpose |
| --- | --- |
| `GET /steam-apps/imported-apps?page=N` | Enriched apps that have tags, 50 per page, oldest appid first |
| `GET /steam-apps/apps-filtered?tags=&tag_weights=` | Top 25 apps scored against two parallel comma-separated lists |
| `POST /steam-apps/apps-filtered-with-user-config` | Top 25 apps scored against a `UserSteamAppRefDataConfigDto[]` body |
| `GET /steam-apps/trigger-all-games-scheduler` | Toggles the catalogue job, answers `202 { isActive }` |
| `GET /steam-apps/trigger-all-data-scheduler` | Toggles the store-details job |
| `GET /steam-apps/trigger-all-tags-scheduler` | Toggles the tags job |
| `GET /steam-apps/all-{games,data,tags}-scheduler-status` | `200 { isActive }` for the matching job |
| `GET /steam-app-ref-data` | Every distinct genre, category and tag with its id and type |
| `GET /steam-app-ref-data/update` | Rebuilds that dictionary from the apps table, answers `200` with an empty body |
| `GET /user-game-score` | Saved scoring configs for a user |
| `POST /user-game-score` | Saves a scoring config |
| `GET /settings`, `GET /settings/{key}` | Key/value application settings (admin) |
| `POST /settings`, `PUT /settings`, `DELETE /settings/{key}` | Create, update, delete a setting (admin) |

Details worth knowing before calling them:

* **The `trigger-*` endpoints are `GET` requests that change server state**, and they
  *toggle*: calling one while its job is scheduled cancels it. The response reports the
  state after the switch.
* **`POST /settings`, `PUT /settings` and `POST /user-game-score` always fail with an
  empty `400`.** [validateRequestSchema](src/middleware/validateRequestSchema.ts) guards
  itself with `typeof schema != typeof z.ZodType`, but a zod schema instance is an
  `object` while the `z.ZodType` class is a `function`, so the comparison is true for
  every schema and the middleware returns before parsing anything. The three routes it is
  mounted on are unreachable until that check is fixed; `GET` and `DELETE` are unaffected.
* **`PUT /settings` takes the target `key` in the body**, not in the path.
* **`GET /user-game-score` ignores the session** and loads configs for the hardcoded user
  id `'hk'`. `POST` stores whatever `user_id` and `id` the body carries — the id is not
  generated server-side, and a repeat id raises a unique constraint violation.
* `GET /steam-app-ref-data/update` does the rebuild inline rather than on a job, and it
  does not await the individual upserts, so it answers (and logs `Updated all Ref Data`)
  while writes are still in flight. With a full catalogue it is a slow call.
* `POST /steam-apps/apps-filtered-with-user-config` validates its body with
  `ValidateSchema`, which throws rather than answering `400` — see
  [Error handling](#error-handling).
* `apps-filtered` needs `tags` and `tag_weights` to be the same length or it returns `[]`.
  A non-numeric weight is dropped, which trips that length check.

### Error handling

**The global error handler is commented out** at the bottom of [src/app.ts](src/app.ts).
Nothing replaces it, so a rejected handler promise falls through to Express 5's default
handler and comes back as an HTML `500` with a stack trace in development, rather than the
JSON `{ success, message }` body the Swagger definition still advertises. Routes do not
try/catch, and the services validate through zod on the way out, so these all surface the
same way:

* a lookup that finds nothing, whose `null` then fails `ValidateSchema`;
* a Prisma `update`/`delete` against a missing row (`P2025`);
* a unique constraint violation on create.

A `404 { error: 'Not found' }` comes from the catch-all in `app.ts` for a path that matches
no route. `401` and `403` come from the auth middlewares, and the only other `400` is the
one `validateRequestSchema` returns unconditionally.

## Steam ingestion

Three scheduled jobs fill the catalogue in stages, each toggled by its `trigger-*`
endpoint and tracked in [jobsService.ts](src/services/jobsService.ts) — an in-memory
`Record<string, Job | null>`, so every job is off again after a restart and nothing runs
until someone switches it on.

| Job | Schedule | What it does |
| --- | --- | --- |
| `AllSteamApps` | every 30 s | `IStoreService/GetAppList` from the highest appid already stored, up to 50 000 at a time, games only. Inserts id and name with `skipDuplicates` |
| `AllSteamAppsData` | every 15 min | Takes 50 apps with `is_data_imported = false`, newest appid first, and fetches `store.steampowered.com/api/appdetails` for each — name, genres, categories, metacritic, review count, release date |
| `AllSteamAppsTags` | at :00 and :45 | Takes 50 apps that were enriched but ended up with no tags and retries the tag lookup alone |

Both enrichment jobs pause 500 ms between apps. A `429` from Steam raises
`SteamRequestLimitExceeded`, which is caught, logged as a warning and ends that batch —
the next tick starts over, so rate limiting costs a cycle rather than the run.

Tags come from two sources, in order: **SteamSpy** (`api.php?request=appdetails`) first,
because it has no age gate and so covers adult-only titles, then a **scrape of the store
page** with `cheerio` for `a.app_tag`, sending a `birthtime` cookie to clear the age check.
A store page that redirects is treated as gated or delisted and yields no tags.

[SteamWrapper](src/classes/SteamWrapper.ts) owns every outbound Steam call and the release
date parsing — Steam returns `1 Jan, 2020` or `Jan 1, 2020` depending on locale, and
anything else (`Coming soon`, `Q1 2027`) becomes `null`.

`steamAppReferenceDataService` also declares its own `UpdateSteamAppsReferenceData` job
and status helper, but no route reaches them — the dictionary is only rebuilt through
`GET /steam-app-ref-data/update`.

## Scoring

Scoring is a weighted overlap between an app's `genres`, `categories` and `tags` arrays and
a user-supplied score per reference value, computed in PostgreSQL rather than in Node:
`unnest(values, weights)` is joined laterally against each array column with `= ANY`, the
weights are summed per app, and the three sums are added together.

```sql
SELECT a.*, coalesce(r_tags.rating,0) + coalesce(r_genres.rating,0)
          + coalesce(r_categories.rating,0) AS rating
FROM steam_app a LEFT JOIN LATERAL (...) ...
WHERE a.release_date IS NOT NULL AND a.release_date < NOW()
ORDER BY rating DESC LIMIT 25;
```

Both scoring endpoints return at most 25 rows and only consider apps with a release date —
`apps-filtered-with-user-config` additionally excludes unreleased ones. The returned rows
carry a `rating` field that is not part of `SteamAppSchema`; the client validates responses
against that schema, which strips it.

A saved config (`user_game_score_config.score_config`) is a `Json` column holding a
`UserSteamAppRefDataConfigDto[]`. `SCHEMA.md`, alongside the three repos in the parent
directory, explains how that column is kept honest against zod.

## Settings

`settingsStartup()` runs before the port is bound and upserts four system settings, each
defaulting to `"false"`:

`steam_app_table_imported`, `steam_apps_imported`, `steam_app_data_imported`,
`steam_app_tags_imported`

They are seeded, served by `/settings` and editable from the client's configuration page,
but nothing in the ingestion path reads them yet — the jobs decide what to fetch from the
`is_data_imported` / `is_tags_imported` flags on each row instead. The upsert leaves an
existing value alone, so a restart will not reset one you changed.

## Database

PostgreSQL through Prisma, using the `@prisma/adapter-pg` driver adapter. The client is
generated into `src/generated/prisma/` (git ignored) and handed out as a singleton by
[src/lib/prisma.ts](src/lib/prisma.ts). The schema lives in
[prisma/schema.prisma](prisma/schema.prisma); the connection URL is supplied by
[prisma.config.ts](prisma.config.ts) from `DATABASE_URL`, not by the `datasource` block.

```bash
npx prisma migrate dev --name NAME  # create and apply a migration
npx prisma migrate reset            # drop and rebuild the database — destroys all data
npx prisma generate                 # regenerate the typed client
npx prisma studio                   # browse the data in a local UI
```

| Table | Holds |
| --- | --- |
| `steam_app` | The catalogue: appid, name, genres, categories, tags, metacritic score, review count, release date, and the `is_data_imported` / `is_tags_imported` progress flags |
| `steam_app_reference_data` | Every distinct genre, category and tag, keyed `value-TYPE`, typed by the `SteamAppReferenceDataType` enum |
| `user_game_score_config` | A named scoring config per user, weights in a `Json` column |
| `settings` | Key/value application settings, with an `is_system` flag |
| `user`, `session`, `account`, `verification` | Owned by better-auth; `user` carries the `role`, `banned`, `banReason` and `banExpires` columns the admin plugin adds |


## Project layout

```
src/
  server.ts          entry point: seeds settings, then binds port 8080
  app.ts             express app, CORS, better-auth handler, guards, router mounting, /docs
  config/swagger.ts  OpenAPI info, servers and tag list
  docs/              one YAML file per router, holding its paths — the whole of the API docs
  routes/            one router per resource
  services/          Prisma access, Steam ingestion, job registry
  middleware/        validateAuth, requireRole, validateRequestSchema
  classes/           SteamWrapper (every outbound Steam call), Errors
  lib/               Prisma singleton, better-auth instance, Steam response interfaces
  enums/             SystemSettingName
  startup/           settings_startup, run before the server listens
  generated/prisma/  Prisma client output, git ignored
```

Routes stay thin: they read the request, call a service and send the result.