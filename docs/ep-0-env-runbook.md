# EP-0 Environment Variable Runbook

## Variables

| Variable | Scope | Environments | Owner | Secret | Purpose |
|---|---|---|---|---|---|
| `DATABASE_URI` | Server | local, staging, production | Platform/DevOps | Yes | PostgreSQL connection string used by Payload adapter |
| `PAYLOAD_SECRET` | Server | local, staging, production | Platform/DevOps | Yes | Signs auth/session tokens and protects Payload internals |
| `NEXT_PUBLIC_CMS_URL` | Public | local, staging, production | Frontend | No | Storefront base URL for CMS REST calls |
| `NEXT_PUBLIC_SERVER_URL` | Public | local, staging, production | Frontend | No | Canonical app origin used by front-end/public URLs |
| `NEXT_PUBLIC_STOREFRONT_URL` | Public | local, staging, production | Frontend | No | CMS-side canonical storefront origin used by SEO plugin |

## Local Baseline
- Local `DATABASE_URI` format:
  - `postgres://postgres:postgres@localhost:5432/eyesoul_brand`
- Use `.env.example` for storefront vars (`cp .env.example .env.local`).
- Use `apps/cms/.env.example` for CMS vars (`cp apps/cms/.env.example apps/cms/.env.local`).
- Never commit `.env.local` or production secrets.

## Provisioning Notes
- `local`: developer-provisioned local PostgreSQL instance
- `staging`: managed secret store
- `production`: managed secret store with restricted access

## Validation Steps
1. `npm install`
2. `cp .env.example .env.local`
3. `cp apps/cms/.env.example apps/cms/.env.local` and set a strong `PAYLOAD_SECRET`
4. Ensure local PostgreSQL is running and reachable from `DATABASE_URI`
5. `npm run payload:generate-types`
6. `npm run dev -w eyesoul-cms` and visit `http://localhost:3001/admin`
