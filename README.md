# eyesoul-brand

Phase 1 branding site built with Next.js and Payload CMS. **(Status: Phase 1 Completed / Launch Ready)**

## Prerequisites
- Node.js `>=20.9.0`
- PostgreSQL (local running instance)
- npm

## Local Setup (EP-0 baseline)
1. Install dependencies (single install at the repo root; includes the `eyesoul-cms` workspace under `apps/cms`):
   - `npm install`
2. Create local environment file:
   - `cp .env.example .env.local`
3. Configure CMS database environment:
   - `cp apps/cms/.env.example apps/cms/.env.local`
   - Update `DATABASE_URI` in `apps/cms/.env.local` if your local Postgres credentials differ
4. Generate Payload artifacts (from `apps/cms/`, where the Payload CLI runs):
   - `npm run payload:sync-types` (generates types and copies them to `src/payload-types.ts` for the storefront)
   - `npm run payload:generate-importmap -w eyesoul-cms`
5. (Optional) Load minimal EP-1 demo content:
   - `npm run payload:seed -w eyesoul-cms`
6. Run both servers (storefront + CMS; see `docs/dg-5-decision-record.md`):
   - `npm run dev:all`

Open `http://localhost:3000` for the storefront and `http://localhost:3001/admin` for Payload admin (`NEXT_PUBLIC_CMS_URL` should point at `http://localhost:3001`).

## Payload Scripts

Run these from the repo root with `npm run <script> -w eyesoul-cms`, or `cd apps/cms` first:

- `payload:sync-types` — runs `payload:generate-types` in the CMS app, then copies `apps/cms/src/payload-types.ts` to `src/payload-types.ts` (use after schema changes; see `docs/dg-5-types-sync.md`)
- `payload:generate-types` — writes `apps/cms/src/payload-types.ts` only (use `payload:sync-types` to update the storefront copy in one step)
- `payload:generate-importmap` — writes `apps/cms/src/app/(payload)/admin/importMap.js`
- `payload:migrate` — run pending database migrations
- `payload:migrate:create` — create a new migration
- `payload:migrate:status` — show migration status
- `payload:seed` — minimal deterministic seed (`apps/cms/src/payload/seed.js`)

## Docs
- Runtime policy: `docs/ep-0-runtime-policy.md`
- Env runbook: `docs/ep-0-env-runbook.md`
- Admin flow: `docs/ep-0-admin-flow.md`
- Master plan: `docs/eyewear-brand-implementation-plan.md`
- EP-1 schema contracts: `docs/ep-1-schema-contracts.md`
- EP-2 data access: `docs/ep-2-data-access.md`
- EP-2 query contracts: `docs/ep-2-query-contracts.md`
