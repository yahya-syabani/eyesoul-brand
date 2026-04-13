# EP-2 Query Contracts (Phase-1 routes)

Maps planned public routes (EP-4) to data-layer functions and empty-state behavior. URLs for products/collections match [`payload.config.ts`](../payload.config.ts) SEO `generateURL` (`/catalog/…`, `/collections/…`).

| Route | Query function(s) | Empty / missing behavior |
|-------|-------------------|---------------------------|
| `/` (home) | `getCollections`, `getProducts`, `getServices` (composition TBD in EP-4) | Show sections without CMS blocks or hide blocks when arrays empty |
| `/catalog` | `getProducts`, optionally `getCollections` for filters | Empty grid message; filters disabled or hidden |
| `/catalog/[slug]` | `getProductBySlug`, `getRelatedProducts` | **404** when product is null |
| `/collections/[slug]` | `getCollectionBySlug` | **404** when `collection` is null |
| `/stores` | `getStores` | Empty state: “No stores” |
| `/services` | `getServices` | Empty state: “No services” |
| `/about` | `getPageBySlug('about')` | **404** or fallback copy when null |
| `/contact` | `getPageBySlug('contact')` | **404** or fallback when null |
| `/journal` | `getPosts` | Empty state: “No published articles yet” |
| `/journal/[slug]` | `getPostBySlug` | **404** when post is null |
| `not-found` / `error` | None (static / brand UI) | N/A |

## Phase-1 Route Guardrails

- `src/app/(auth)` and `src/app/(accounts)` remain **design references only** in Phase 1.
- These route groups are intentionally excluded from public nav and sitemap until real auth/account backends are implemented.

## Utilities

| Need | Module |
|------|--------|
| Slug normalization (client or server) | [`src/lib/slug.ts`](../src/lib/slug.ts) `buildSlug` |
| Canonical product/collection/page URLs | [`src/lib/urls.ts`](../src/lib/urls.ts) |
| WhatsApp / Maps links | [`src/lib/links.ts`](../src/lib/links.ts) `normalizeExternalUrl` |
| Class names | [`src/lib/cn.ts`](../src/lib/cn.ts) |

## Related products

- **`getRelatedProducts`** requires a **`collectionId`** (numeric id). If the product has no collection, returns `[]`.
