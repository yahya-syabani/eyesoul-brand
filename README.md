# eyesoul-brand

Phase 1 branding site built with Next.js and Payload CMS. **(Status: Phase 1 Completed / Launch Ready)**

This repo is an **npm workspace**: the **storefront** lives at the repo root (Next.js on port **3000**), and **Payload CMS** lives in `apps/cms` (workspace `eyesoul-cms`, Next.js on port **3001**).

## Prerequisites

- Node.js `>= 20.9.0`
- npm
- PostgreSQL the CMS can reach (local install or Docker; see below)

---

## 1. Setup (clone → dependencies → env)

Do this once per machine (or whenever you re-clone).

1. **Install dependencies** — single install at the repo root (includes `apps/cms` / `eyesoul-cms`):

   ```bash
   npm install
   ```

2. **Storefront environment** — copy the example and adjust if needed:

   ```bash
   cp .env.example .env.local
   ```

   For local development, keep **`NEXT_PUBLIC_CMS_URL=http://localhost:3001`** so the storefront calls Payload on port 3001.

3. **CMS environment** — copy and fill in secrets and database URL:

   ```bash
   cp apps/cms/.env.example apps/cms/.env.local
   ```

   - Set **`PAYLOAD_SECRET`** to a long random string (not the placeholder).
   - Set **`DATABASE_URI`** to your Postgres connection string.

   **Postgres via Docker:** `docker compose up -d` starts Postgres on host port **5433** (see `docker-compose.yml`). In that case use a URI like  
   `postgres://postgres:postgres@localhost:5433/eyesoul_brand`  
   The example file uses port **5432**, which matches a default local Postgres install, not the Compose mapping.

4. **More on variables:** `docs/ep-0-env-runbook.md`

---

## 2. Initialize (database + Payload artifacts)

Do this the **first time** you run the project, after Postgres is running and `apps/cms/.env.local` is correct. Repeat **migrations** and **`payload:sync-types`** / **`payload:generate-importmap`** when the schema or admin import map changes (see `docs/dg-5-types-sync.md`).

1. **Ensure Postgres is running** and the database in `DATABASE_URI` exists (create empty DB if needed).

2. **Apply database migrations:**

   ```bash
   npm run payload:migrate -w eyesoul-cms
   ```

3. **Generate types for the CMS and sync a copy for the storefront:**

   ```bash
   npm run payload:sync-types
   ```

4. **Generate the Payload admin import map:**

   ```bash
   npm run payload:generate-importmap -w eyesoul-cms
   ```

5. **(Optional)** Load minimal demo content:

   ```bash
   npm run payload:seed -w eyesoul-cms
   ```

---

## 3. Run locally

**Both storefront and CMS** (recommended for full-stack work):

```bash
npm run dev:all
```

**URLs**

| App        | URL                          |
| ---------- | ---------------------------- |
| Storefront | http://localhost:3000        |
| Payload admin | http://localhost:3001/admin |

**Run apps separately** (if you only need one):

```bash
npm run dev                 # storefront only (port 3000)
npm run dev -w eyesoul-cms  # CMS only (port 3001)
```

Start the **CMS before the storefront** if the storefront build or SSR must talk to a live CMS (see Build Behavior below).

---

## Build Behavior

- `npm run build` builds the storefront.
- `npm run build -w eyesoul-cms` builds the CMS app.
- Storefront build degrades gracefully when `NEXT_PUBLIC_CMS_URL` is temporarily unavailable (no hard failure during static generation).
- For full CMS-backed static output in development, run the CMS (`npm run dev -w eyesoul-cms`) before a storefront build.

## Payload Scripts

Run from the repo root with `npm run <script> -w eyesoul-cms`, or `cd apps/cms` first:

- `payload:sync-types` — runs `payload:generate-types` in the CMS app, then copies `apps/cms/src/payload-types.ts` to `src/payload-types.ts` (use after schema changes; see `docs/dg-5-types-sync.md`)
- `payload:generate-types` — writes `apps/cms/src/payload-types.ts` only (prefer `payload:sync-types` to update the storefront copy in one step)
- `payload:generate-importmap` — writes `apps/cms/src/app/(payload)/admin/importMap.js`
- `payload:migrate` — run pending database migrations
- `payload:migrate:create` — create a new migration
- `payload:migrate:status` — show migration status
- `payload:seed` — minimal deterministic seed (`apps/cms/src/payload/seed.js`)

## Docs

- Dual-app dev layout: `docs/dg-5-decision-record.md`
- Runtime policy: `docs/ep-0-runtime-policy.md`
- Env runbook: `docs/ep-0-env-runbook.md`
- Admin flow: `docs/ep-0-admin-flow.md`
- Master plan: `docs/eyewear-brand-implementation-plan.md`
- EP-1 schema contracts: `docs/ep-1-schema-contracts.md`
- EP-2 data access: `docs/ep-2-data-access.md`
- EP-2 query contracts: `docs/ep-2-query-contracts.md`
