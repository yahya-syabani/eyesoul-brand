# Storefront Structure Deep Analysis

This document maps the current storefront structure in depth, focusing on route ownership, page composition, data sources, SEO/empty-state behavior, and duplicated components/sections.

## 1) Route Ownership and Topology

## Canonical public storefront

- Route group: `src/app/(brand)`
- Shared wrapper: `src/app/(brand)/layout.tsx` -> `BrandShell`
- Brand shell composition:
  - Header + footer nav are centralized in `src/components/brand/BrandShell.tsx`
  - Main nav items: Home, Catalog, Collections, Stores, Services, Journal, About, Contact

## Secondary template/demo routes

- Route group: `src/app/(shop)`
- Contains generic ecommerce template pages (`products`, `blog`, `cart`, `checkout`, etc.)
- These pages are still present but are not the canonical brand IA

## High-level route tree

```text
/
|- (brand) [public storefront]
|  |- /
|  |- /catalog
|  |- /catalog/[slug]
|  |- /collections
|  |- /collections/[slug]
|  |- /stores
|  |- /services
|  |- /journal
|  |- /journal/[slug]
|  |- /about
|  \- /contact
|
\- (shop) [template/legacy pages]
   |- /coming-soon
   |- /home-2/home-2
   |- /search
   |- /products/[handle]
   |- /products/page-style-2/[handle]
   |- /blog
   |- /blog/[handle]
   |- /cart
   |- /checkout
   |- /subscription
   \- /order-successful
```

## 2) Deep Page Structure Analysis (Canonical `(brand)` Pages)

## `/` Home

- File: `src/app/(brand)/page.tsx`
- Data:
  - `getCollections({ depth: 2 })`
  - `getProducts({ limit: 12, depth: 2 })`
  - adapters: `toTCollections`, `toTProductItems`
- Sections:
  - `SectionHero3`
  - `SectionSliderProductCard` (New Arrivals)
  - `SectionCollectionSlider`
  - `SectionGridFeatureItems`
- Notes:
  - dead local `featuredProducts` has been removed (cleanup completed)
  - static metadata is present

## `/catalog`

- File: `src/app/(brand)/catalog/page.tsx`
- Data:
  - `getCollections({ depth: 1 })`
  - `getCatalogProducts(...)`
- Query contract:
  - `q`, `collection`, `status`, `minPrice`, `maxPrice`, `sort`, `page`
- Sections:
  - Search bar
  - Filter form (collection/status/price/sort)
  - Product grid (`ProductCard`)
  - Empty state
  - Pagination (custom centered model)
  - `SectionPromo1`
- Notes:
  - best-developed listing UX among brand pages
  - static metadata is present

## `/catalog/[slug]` (Product Detail)

- File: `src/app/(brand)/catalog/[slug]/page.tsx`
- Data:
  - `getProductBySlug(slug, { depth: 2 })`
  - `getRelatedProducts(...)` (only when product has collection relation)
- Sections:
  - Gallery (`GalleryImages`)
  - PDP summary (price, rating, status, breadcrumbs)
  - Rich description (`BrandRichText`)
  - `Policy`
  - `AccordionInfo`
  - `ProductReviews`
  - Related products (`SectionSliderProductCard`, conditional)
- SEO:
  - `generateMetadata` with OG/Twitter
  - Product JSON-LD script
  - static params from `getProducts({ limit: 100 })`
- Notes:
  - currently imports multiple UI pieces from `(shop)` path (migration artifact)
  - reviews are static fallback stubs

## `/collections`

- File: `src/app/(brand)/collections/page.tsx`
- Data: `getCollections({ depth: 2 })`
- Sections:
  - Header (`BrandH1`, `BrandLead`)
  - Card grid with image/title/description
- Notes:
  - clean browse-only index
  - explicit empty-state text exists

## `/collections/[slug]`

- File: `src/app/(brand)/collections/[slug]/page.tsx`
- Data:
  - `getCollectionBySlug(slug, { productDepth: 2 })`
  - static params via `getCollections()`
- Sections:
  - Hero image
  - Title + description
  - `ProductGrid`
- SEO:
  - dynamic metadata present
- Notes:
  - no in-page sort/filter yet

## `/stores`

- File: `src/app/(brand)/stores/page.tsx`
- Data: `getStores()`
- Sections:
  - Heading + lead
  - Primary map block (`MapEmbed`) using first store
  - `StoreCard` grid (all locations)
- Notes:
  - map section hidden when there is no primary store

## `/services`

- File: `src/app/(brand)/services/page.tsx`
- Data: `getServices({ depth: 2 })`
- Sections:
  - Heading + lead
  - service card list with optional icon
- Notes:
  - straightforward list page with explicit empty state

## `/about`

- File: `src/app/(brand)/about/page.tsx`
- Data: `getPageBySlug('about', { depth: 3 })`
- Sections:
  - Top header strip
  - `PageBlocks` dynamic body
- Notes:
  - hard 404 if page is not found (`notFound()`)

## `/contact`

- File: `src/app/(brand)/contact/page.tsx`
- Data: `getPageBySlug('contact', { depth: 3 })`
- Sections:
  - Top header strip + lead
  - `PageBlocks`
  - `ContactForm`
- Notes:
  - combines CMS-managed content + fixed form section

## `/journal`

- File: `src/app/(brand)/journal/page.tsx`
- Data: `getPosts({ limit: 24, depth: 2 })`
- Sections:
  - Header + intro
  - `SectionMagazine5` (featured layout)
  - `SectionGridPosts` (remaining posts)
- Notes:
  - static metadata present
  - shared post adapter helpers now come from `src/lib/cms/postMappers.ts`

## `/journal/[slug]`

- File: `src/app/(brand)/journal/[slug]/page.tsx`
- Data:
  - `getPostBySlug(slug, { depth: 2 })`
  - related from `getPosts({ limit: 4, depth: 2 })` excluding current slug
- Sections:
  - Category label + title + excerpt + meta
  - optional hero image
  - rich body (`BrandRichText`)
  - `SectionGridPosts` (related posts)
- SEO:
  - dynamic metadata present
  - static params from `getPosts({ limit: 200 })`
- Notes:
  - date and card mapping now reuse `src/lib/cms/postMappers.ts`

## 3) CMS vs Static Composition

## Strong CMS-driven pages

- `/catalog`, `/catalog/[slug]`, `/collections`, `/collections/[slug]`, `/stores`, `/services`, `/journal`, `/journal/[slug]`, `/about`, `/contact`

## Mixed CMS + static section pages

- `/` home: data is CMS-driven, but hero/content modules are static component composition
- `/contact`: CMS blocks plus static local form block

## Template/demo data still in repository

- Several `(shop)` pages use `@/data/data` mock/demo sources instead of CMS contracts

## 4) Duplication Audit (Components/Sections)

This section highlights duplicated logic and duplicated page-section patterns that can cause maintenance drift.

## A. Duplicated helper logic in brand journal pages (resolved)

- Previous duplicate functions:
  - `formatDate(value: string)`
  - `toBlogPost(post: CmsPost): BlogCardPost`
- Previously found in:
  - `src/app/(brand)/journal/page.tsx`
  - `src/app/(brand)/journal/[slug]/page.tsx`
- Implemented fix:
  - extracted shared mappers to `src/lib/cms/postMappers.ts`
  - both journal routes now import `formatCmsPostDate` / `toBlogCardPost`
- Outcome:
  - removed mapping drift risk and reduced maintenance overhead

## B. Near-duplicate product detail flows across route groups (high confidence)

- Similar/overlapping PDP implementations:
  - `src/app/(brand)/catalog/[slug]/page.tsx`
  - `src/app/(shop)/(other-pages)/products/[handle]/page.tsx`
  - `src/app/(shop)/(other-pages)/products/page-style-2/[handle]/page.tsx`
- Shared structure:
  - gallery
  - review summary
  - policy/spec blocks
  - related products
- Risk:
  - parallel PDP code paths with different contracts (`slug` vs `handle`, CMS vs mock data)
  - design and behavior inconsistency
- Suggested direction:
  - keep one canonical PDP architecture (brand/CMS)
  - mark `(shop)` PDP routes as legacy and isolate or remove from production nav/sitemap

## C. Near-duplicate blog index/detail flows across route groups (high confidence)

- Overlapping blog implementations:
  - Canonical brand:
    - `src/app/(brand)/journal/page.tsx`
    - `src/app/(brand)/journal/[slug]/page.tsx`
  - Template shop:
    - `src/app/(shop)/(other-pages)/blog/page.tsx`
    - `src/app/(shop)/(other-pages)/blog/[handle]/page.tsx`
- Risk:
  - editorial features split across two systems
  - content and component drift over time
- Suggested direction:
  - treat journal as canonical
  - deprecate template blog routes or clearly gate them to demo-only usage
 - Implementation status:
   - `(shop)` blog routes now set `robots: { index: false, follow: false }` to reinforce legacy boundary in search indexing

## D. Multiple component variants for same concept (medium confidence; intentional but should be governed)

- Collection sliders:
  - `src/components/SectionCollectionSlider.tsx`
  - `src/components/SectionCollectionSlider2.tsx`
- Product cards:
  - `src/components/ProductCard.tsx` (template-oriented `TProductItem`)
  - `src/components/brand/ProductCard.tsx` (brand + Payload `Product`)
- Risk:
  - different props/models and UI behavior for same semantic component
  - onboarding overhead and accidental wrong import
- Suggested direction:
  - document naming convention by context:
    - `brand/*` = canonical CMS storefront
    - root components = template/legacy
  - optionally enforce import boundaries with lint rule/path alias discipline

## E. Repeated header section pattern in content pages (low risk)

- Similar top hero-strip pattern appears in:
  - `src/app/(brand)/about/page.tsx`
  - `src/app/(brand)/contact/page.tsx`
  - also similar heading structures in `stores`, `services`, `collections`
- This duplication is mostly stylistic and acceptable, but could be extracted into a tiny section shell component if repeated further.

## 5) SEO and Discoverability Coverage

- Route index generation in `src/app/sitemap.ts` includes:
  - static brand routes (`/catalog`, `/stores`, `/services`, `/journal`, `/about`, `/contact`)
  - dynamic product/collection/journal detail pages
- No canonical references found to `(shop)` routes in sitemap (good for public IA control).

## 6) Practical Consolidation Priorities

## Priority 1 (quick wins)

- [done] Extract duplicated journal helpers into `src/lib/cms/postMappers.ts`.
- [done] Remove dead local `featuredProducts` in home page.

## Priority 2 (structural clarity)

- Define and document canonical storefront boundary:
  - keep `(brand)` as production routes
  - label `(shop)` as demo/legacy templates in docs and route ownership notes
  - [done, partial] `(shop)` blog routes are explicitly noindexed to reduce canonical ambiguity

## Priority 3 (component governance)

- Introduce a short component taxonomy doc:
  - brand components (CMS production)
  - template components (demo/legacy)
- Prevent accidental cross-import by convention or linting rule.

## 7) Recent Implementation Updates

- Shared journal metadata helper added:
  - `src/lib/cms/journalMetadata.ts`
  - centralizes index metadata constant and detail metadata mapping
- Shared journal header component added:
  - `src/components/brand/JournalPageHeader.tsx`
  - reused by:
    - `src/app/(brand)/journal/page.tsx`
    - `src/app/(brand)/journal/[slug]/page.tsx`
- Result:
  - less duplicated header/meta rendering logic across journal index/detail
  - clearer separation between canonical `journal/*` and legacy `(shop)/blog/*` in search indexing behavior

- Legacy `(shop)` pages are now CMS-backed through a compatibility layer:
  - `src/lib/cms/shopLegacy.ts`
  - Migrated routes:
    - `/search`
    - `/products/[handle]`
    - `/products/page-style-2/[handle]`
    - `/blog`
    - `/blog/[handle]`
    - `/cart`
    - `/checkout`
    - `/order-successful`
    - `/home-2/home-2`
  - Note:
    - cart/checkout/order-successful are connected to CMS-derived product data with fallback order/cart shaping (not a full transactional checkout backend).

---

Generated from current codebase snapshot by inspecting `src/app/(brand)`, `src/app/(shop)`, relevant shared components, and storefront docs.
