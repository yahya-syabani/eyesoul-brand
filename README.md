# eyesoul-brand

Phase-1 branding site built with Next.js and Payload CMS.

## Prerequisites
- Node.js `>=20.9.0`
- Docker Desktop (for local Postgres)
- npm

## Local Setup (EP-0 baseline)
1. Install dependencies:
   - `npm install`
2. Create local environment file:
   - `cp .env.example .env.local`
3. Start local PostgreSQL:
   - `docker compose up -d`
4. Generate Payload artifacts:
   - `npm run payload:generate-types`
   - `npm run payload:generate-importmap`
5. (Optional) Load minimal EP-1 demo content:
   - `npm run payload:seed`
6. Run development server:
   - `npm run dev`

Open `http://localhost:3000` for the site and `http://localhost:3000/admin` for Payload admin.

## Payload Scripts
- `npm run payload:generate-types` - generate `src/payload-types.ts`
- `npm run payload:generate-importmap` - generate admin import map
- `npm run payload:migrate` - run pending database migrations
- `npm run payload:migrate:create` - create a new migration
- `npm run payload:migrate:status` - show migration status
- `npm run payload:seed` - minimal deterministic seed (`src/payload/seed.js`)

## Docs
- Runtime policy: `docs/ep-0-runtime-policy.md`
- Env runbook: `docs/ep-0-env-runbook.md`
- Admin flow: `docs/ep-0-admin-flow.md`
- Master plan: `docs/eyewear-brand-implementation-plan.md`
- EP-1 schema contracts: `docs/ep-1-schema-contracts.md`
