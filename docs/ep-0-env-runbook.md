# EP-0 Environment Variable Runbook

## Variables

| Variable | Scope | Environments | Owner | Secret | Purpose |
|---|---|---|---|---|---|
| `DATABASE_URI` | Server | local, staging, production | Platform/DevOps | Yes | PostgreSQL connection string used by Payload adapter |
| `PAYLOAD_SECRET` | Server | local, staging, production | Platform/DevOps | Yes | Signs auth/session tokens and protects Payload internals |
| `NEXT_PUBLIC_SERVER_URL` | Public | local, staging, production | Frontend | No | Canonical app origin used by front-end/public URLs |

## Local Baseline
- Local `DATABASE_URI` format:
  - `postgres://postgres:postgres@localhost:5433/eyesoul_brand`
- Use `.env.example` as the source template and copy to `.env.local`.
- Never commit `.env.local` or production secrets.

## Provisioning Notes
- `local`: developer-provisioned (Docker compose in repository)
- `staging`: managed secret store
- `production`: managed secret store with restricted access

## Validation Steps
1. `npm install`
2. `cp .env.example .env.local` and set a strong `PAYLOAD_SECRET`
3. `docker compose up -d`
4. `npm run payload:generate-types`
5. `npm run dev` and visit `/admin`
