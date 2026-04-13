# EP-2 Data Access Guardrails

## Singleton

- Import **`getPayloadInstance`** only from [`src/lib/payload/getPayload.ts`](../src/lib/payload/getPayload.ts).
- Do not call `getPayload` from page components, hooks, or ad-hoc modules.
- **Development:** a shared promise on `globalThis` reduces duplicate Payload initialization during HMR.
- **Production:** each server invocation resolves through React **`cache()`** so one tree share-reuses the same client within a request.

## Published-only reads

- All catalog/content queries under [`src/lib/cms/`](../src/lib/cms/) merge **`_status: 'published'`** via [`mergePublishedWhere`](../src/lib/cms/published.ts).
- **Draft mode:** when Next.js [`draftMode`](https://nextjs.org/docs/app/building-your-application/configuring/draft-mode) is enabled, the `_status` filter is **omitted** so draft documents can be previewed. Securing preview behind authentication is a follow-up for EP-5/EP-6.

## Components and routes

- **EP-4 rule:** pages and server components import from **`@/lib/cms`** (or specific modules), not from `payload` directly.

## Caching beyond RSC

- This phase uses React `cache()` only. Cross-request **`unstable_cache`** / tag-based revalidation is deferred to EP-5 (ISR and publish hooks).

## Build-time CMS fallback

- `cmsFind` in [`src/lib/cms/client.ts`](../src/lib/cms/client.ts) includes a build-phase guard for `NEXT_PHASE === 'phase-production-build'`.
- During storefront production build, unreachable CMS host or `5xx` CMS responses return an empty typed list instead of throwing.
- This prevents build failures when CMS is temporarily offline while preserving strict runtime behavior in development/production requests.
