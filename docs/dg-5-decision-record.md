# DG-5 Decision Record — Deployment Topology

**Gate:** DG-5  
**Status:** ✅ Locked  
**Date:** 2026-04-12  
**Decision:** Split topology — Payload CMS on a dedicated server, Next.js storefront on a separate server  

---

## Decision

**Payload CMS server** (`apps/cms/`) runs independently at its own hostname (e.g. `cms.eyesoul.id`).  
**Next.js storefront** (repo root) runs at the public hostname (e.g. `eyesoul.id`) with zero Payload runtime dependencies.

## Rejected Alternative

**Single app (co-located):** Next.js and Payload in one process. Simpler to deploy initially, but:
- Storefront cold starts carry the full Payload boot cost (DB pool, Sharp, etc.)
- Any Payload crash or migration takes down the entire public site
- Scaling the storefront independently of the CMS is impossible

## Consequences

| Impact Area | Result |
|-------------|--------|
| Data access | Storefront uses Payload REST API over HTTP — no direct DB connection |
| Types | `payload-types.ts` must be manually synced on schema changes (see `dg-5-types-sync.md`) |
| Local development | Run `apps/cms` on port 3001 + storefront on port 3000 concurrently |
| Media | Uploaded media is served from the CMS host; storefront proxies via `next/image` |
| Deployment | Two separate deploy pipelines required |
| EP-6-1 | Resend domain must be configured in the storefront's env — CMS does not send email |

## Environment Variables

### Storefront (repo root)
```
NEXT_PUBLIC_CMS_URL=https://cms.eyesoul.id     # where REST calls go
NEXT_PUBLIC_SERVER_URL=https://eyesoul.id       # storefront canonical URL
```

### CMS app (apps/cms/)
```
DATABASE_URI=…
PAYLOAD_SECRET=…
NEXT_PUBLIC_SERVER_URL=https://cms.eyesoul.id   # CMS own URL
NEXT_PUBLIC_STOREFRONT_URL=https://eyesoul.id   # used by SEO plugin for canonicals
```
