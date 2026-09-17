# vtp-backend

REST API for **VTP** (Video Tracking and Planning) — it stores the games queued for
recording, the posts published for them, their rank history and the channel view
counters, and it ingests the CSV exports those numbers come from.

Node.js + Express 5 + Prisma 7 on PostgreSQL, written in TypeScript and run directly
through `tsx` (there is no compile step).

Part of a three repository set:

| Repo | Role |
| --- | --- |
| [vtp-common](https://github.com/Noodles-Coders-Team/vtp-common) | zod schemas and DTOs shared by the API and the client |
| **vtp-backend** | this repo, the REST API |
| [vtp-front](https://github.com/Noodles-Coders-Team/vtp-front) | the web client |

## Getting started

Prerequisites: Node.js 20+ and a reachable PostgreSQL instance.

```bash
npm install          # install dependencies
npx prisma generate  # generate the typed client into src/generated/
npm run dev          # start the API on http://localhost:8080
```

Create a `.env` in the repository root before the first run — it is git ignored, so it
never arrives with a clone:

```ini
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_DB=...
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
```

`DATABASE_URL` is the only variable the application itself reads; the three `POSTGRES_*`
ones are there for whatever provisions the database. Startup fails fast if it is missing.

> **If `@nct/vtp-common` cannot be resolved**, the sibling package has not been built.
> It is linked with `"@nct/vtp-common": "file:../vtp-common"`, so it must sit next to this
> repo on disk. Clone [vtp-common](https://github.com/Noodles-Coders-Team/vtp-common),
> follow its `README.md`, then re-run `npm install` here.

### After pulling new commits

* `npm install` — if `package.json` changed
* `npx prisma migrate dev` — if there are new migrations
* `npx prisma generate` — if `prisma/schema.prisma` changed

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the server on port 8080 via `tsx` |
| `npm run build` | Runs `prisma generate` — it does **not** emit JavaScript |
| `npm test` | Runs the ad-hoc scratch script `src/test.ts`, not a test suite |

## API docs

Swagger UI is served by the running app at **http://localhost:8080/docs**.

The spec is assembled at startup by `swagger-jsdoc`: the shared pieces (schemas, tag list,
reusable error responses) live in [src/config/swagger.ts](src/config/swagger.ts), and each
operation is documented in an `@swagger` JSDoc block directly above its handler in
`src/routes/*.ts`. Adding a route means adding its block in the same file — nothing else
needs registering. The `apis` glob is relative, so start the server from the repo root.

The component schemas mirror the zod schemas in `@nct/vtp-common`; when a DTO changes
there, update the matching entry in `src/config/swagger.ts`.

### Endpoints at a glance

| Prefix | Purpose |
| --- | --- |
| `/users` | User records and their permission level |
| `/games` | Games, their info rows and the scored `with-info` listing |
| `/post`, `/post/information` | Published posts and their versioned statistic snapshots |
| `/rank` | Rank history per game |
| `/channel-data` | Per-date channel view counters |
| `/drop-down-data` | Tag and genre dictionary values, with the scores used to rank games |
| `/settings` | Key/value application settings |
| `/import` | CSV upload endpoints |

Two details worth knowing before calling them:

* `POST /games/with-info` is a read. It uses POST only so the `can_record` / `discussed`
  filters can travel in a body. It returns each game flattened together with its info row
  plus a computed `game_score` — the sum of its tag and genre scores from
  `/drop-down-data`, adjusted by the game's latest rank — sorted by that score descending.
* `PUT /settings` and `PUT /games/info` take the target's identifier in the body rather
  than in the path.

### CSV import

Three endpoints accept a `multipart/form-data` upload under the field name `file`:

| Endpoint | Source export |
| --- | --- |
| `POST /import/games` | The game queue sheet — upserts Game + GameInformation, records a Rank, and splits genre/tag cells into drop down values |
| `POST /import/channel-data` | Channel view totals, one row per date |
| `POST /import/table-data` | The YouTube Studio table export — creates missing posts and appends a new versioned PostInformation snapshot |

Each responds with `{ rows, data }`, where `data` echoes the parsed rows. Uploads land in
`uploads/` and are deleted once parsed. Sample files that match the expected column
layouts are kept in [migration/](migration/).

## Database

PostgreSQL through Prisma, using the `@prisma/adapter-pg` driver adapter. The client is
generated into `src/generated/` (git ignored) and handed out as a singleton by
[src/lib/prisma.ts](src/lib/prisma.ts). The schema lives in
[prisma/schema.prisma](prisma/schema.prisma); [DB.md](DB.md) holds the same model in DBML
for [dbdiagram.io](https://dbdiagram.io).

```bash
npx prisma migrate dev --name NAME  # create and apply a migration
npx prisma migrate reset            # drop and rebuild the database — destroys all data
npx prisma generate                 # regenerate the typed client
npx prisma studio                   # browse the data in a local UI
```

Main tables: `game` and `game_info`, `rank`, `post` and `post_info`, `channel_data`,
`users`, `drop_down_data`, `settings`.

## Project layout

```
src/
  server.ts          entry point, binds port 8080
  app.ts             express app, CORS, router mounting, /docs
  config/swagger.ts  OpenAPI definition, shared schemas and responses
  routes/            one router per resource, each carrying its @swagger blocks
  services/          Prisma access and business logic
  middleware/        validateRequest, a zod body guard
  lib/               Prisma singleton and the CSV row types
  generated/         Prisma client output, git ignored
```

Routes stay thin: they read the request, call a service and send the result. The services
validate through the zod schemas from `@nct/vtp-common` on the way in *and* on the way
out, so a response that does not match its DTO fails loudly instead of reaching the
client.

## Conventions and current limitations

* **No authentication.** Every endpoint is open, and CORS is `origin: '*'`. Do not expose
  this beyond a trusted network as it stands.
* **No central error handler.** A rejected promise in a handler surfaces as the Express 5
  default 500; the error shapes documented in Swagger describe the intent, not a
  guaranteed body.