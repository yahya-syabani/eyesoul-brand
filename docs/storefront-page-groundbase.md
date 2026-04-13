# Storefront Page Groundbase (Current Implementation)

This document is a page-by-page baseline of what is currently implemented in the storefront, what data each page uses, and what can be improved next.

Use this as the source of truth before making display/content/UX upgrades.

## Scope and Route Ownership

- Public storefront pages are implemented under `src/app/(brand)`.
- Shared brand layout and navigation are handled by `src/app/(brand)/layout.tsx` and `src/components/brand/BrandShell.tsx`.
- Current brand navigation items: Home, Catalog, Collections, Stores, Services, Journal, About, Contact.
- `src/app/(auth)` and `src/app/(accounts)` remain non-public/design-only for Phase 1.

## Cross-Page Architecture Notes

- Data layer entry points: `src/lib/cms/*` (products, collections, posts, pages, stores, services).
- CMS transport: REST via `cmsFind` in `src/lib/cms/client.ts`.
- Published-only read policy: enforced by `mergePublishedWhere` in `src/lib/cms/published.ts`.
- SEO index coverage: `src/app/sitemap.ts` includes static, product, collection, and journal detail pages.

## Page Documentation

---

## `/` Home

**Source:** `src/app/(brand)/page.tsx`

**Current purpose**
- Brand landing page showing hero + product and collection discovery highlights.

**Current sections**
- Hero: `SectionHero3`
- Product slider: "New Arrivals" (`SectionSliderProductCard`)
- Collection slider: "Product Collections" (`SectionCollectionSlider`)
- Product feature grid: `SectionGridFeatureItems`

**Current data dependencies**
- `getCollections({ depth: 2 })`
- `getProducts({ limit: 12, depth: 2 })`
- Adapted via `toTCollections` and `toTProductItems`

**Empty/error behavior**
- No dedicated page-level empty state; sections render with available arrays.

**SEO/meta**
- Static metadata defined in file (`title`, `description`).

**Improvement groundbase**
- Replace static hero copy with CMS-managed hero content.
- Add explicit empty placeholders when products/collections are empty.
- Add editorial/seasonal module slot between product and collection sections.
- Track clicks per module for merchandising decisions.

---

## `/catalog` Catalog Listing

**Source:** `src/app/(brand)/catalog/page.tsx`

**Current purpose**
- Unified search + filter + browse page for eyewear products.

**Current sections**
- Search bar (`q` via query params)
- Filter panel:
  - collection
  - availability status (`all`, `in-stock`, `available`)
  - min/max price
  - sort
- Product grid (`ProductCard`)
- Result count and empty state
- Pagination with centered page-window model + gaps
- Promo section (`SectionPromo1`)

**Current data dependencies**
- `getCollections({ depth: 1 })` for filter options
- `getCatalogProducts(...)` with `q`, `collectionId`, `status`, price range, sort, page

**URL/query contract**
- `q`
- `collection`
- `status`
- `minPrice`
- `maxPrice`
- `sort`
- `page`

**Empty/error behavior**
- Empty grid state: "No matching products"
- Query-driven reset link to `/catalog`

**SEO/meta**
- Static metadata defined in file.

**Improvement groundbase**
- Add active filter chips with single-click remove.
- Add persisted sort/filter state for shared links and campaigns.
- Add stronger search behavior (description matching/tokenization).
- Add "no products yet" state distinct from "no matches for filters."
- Add server-side validation/normalization for malformed query params.

---

## `/catalog/[slug]` Product Detail

**Source:** `src/app/(brand)/catalog/[slug]/page.tsx`

**Current purpose**
- Product detail with gallery, description, related products, and trust-building sections.

**Current sections**
- Left: image gallery (`GalleryImages`)
- Right: breadcrumb, title, price, rating summary, availability chip
- Rich description (`BrandRichText`)
- Policy block (`Policy`, responsive placement)
- Accordion info (`AccordionInfo`)
- Reviews presentation (`ProductReviews`) using static fallback review data
- Related products slider (`SectionSliderProductCard`)
- Product JSON-LD script

**Current data dependencies**
- `getProductBySlug(slug, { depth: 2 })`
- `getRelatedProducts({ productId, collectionId, limit: 8, depth: 2 })`
- Adapter: `toTProductItem`, `toTProductItems`

**Dynamic behavior**
- `generateStaticParams` prebuilds from `getProducts({ limit: 100 })`
- `generateMetadata` uses product data + OG/Twitter

**Empty/error behavior**
- Missing product => `notFound()`
- Missing related products => related section hidden

**SEO/meta**
- Dynamic metadata (title/description/OG/Twitter)
- Product JSON-LD embedded

**Improvement groundbase**
- Move review data from static fallback to CMS collection when ready.
- Use real rating/review aggregates from CMS instead of adapter defaults.
- Replace imported `(shop)` utility components with brand-local equivalents.
- Add structured specs from CMS (frame material, fit, lens type) into accordion.

---

## `/collections` Collections Index

**Source:** `src/app/(brand)/collections/page.tsx`

**Current purpose**
- Browse all product collections as entry points into filtered product sets.

**Current sections**
- Header (`BrandH1` + lead copy)
- Card grid of collections with cover image, title, optional description

**Current data dependencies**
- `getCollections({ depth: 2 })`
- `resolveBrandImage` for media fallback behavior

**Empty/error behavior**
- "No collections yet."

**SEO/meta**
- Inherits global defaults (no route-level custom metadata currently).

**Improvement groundbase**
- Add collection count badges ("N products").
- Add collection merchandising order controls in CMS UI preview.
- Add top-level filters (featured/all).
- Add explicit metadata for improved SERP quality.

---

## `/collections/[slug]` Collection Detail

**Source:** `src/app/(brand)/collections/[slug]/page.tsx`

**Current purpose**
- Show collection hero/details and all products in that collection.

**Current sections**
- Hero image (if available)
- Collection title + description
- Product grid (`ProductGrid`)

**Current data dependencies**
- `getCollectionBySlug(slug, { productDepth: 2 })`
- Static params via `getCollections()`

**Empty/error behavior**
- Missing collection => `notFound()`
- If collection exists with zero products, `ProductGrid` displays empty result set.

**SEO/meta**
- Dynamic metadata from collection title/description

**Improvement groundbase**
- Add sort and in-collection filtering controls.
- Add collection-specific promo/banner slot from CMS.
- Add recommended/sibling collections below grid.

---

## `/stores` Stores

**Source:** `src/app/(brand)/stores/page.tsx`

**Current purpose**
- Store finder and location detail listing.

**Current sections**
- Header copy
- Primary map block based on first store
- "All locations" cards (`StoreCard`)

**Current data dependencies**
- `getStores()`
- `MapEmbed` consumes `latitude`, `longitude`, `mapsUrl`

**Empty/error behavior**
- No stores => "No stores published yet."
- Map block hidden when no primary store.

**SEO/meta**
- Inherits defaults (no route-level metadata override currently).

**Improvement groundbase**
- Add city/region filter and nearest-store sorting.
- Add opening-hours state ("open now"/"closed").
- Add CTA buttons consistency across cards (Call, WhatsApp, Directions).

---

## `/services` Services

**Source:** `src/app/(brand)/services/page.tsx`

**Current purpose**
- Display vision/optical services with icon and short description.

**Current sections**
- Header copy
- Service list cards with optional icon image

**Current data dependencies**
- `getServices({ depth: 2 })`
- `resolveBrandImage` for icon media

**Empty/error behavior**
- "No services published yet."

**SEO/meta**
- Inherits defaults (no route-level metadata override currently).

**Improvement groundbase**
- Add grouping by service type (exam, fitting, lens care, after-sales).
- Add "Book appointment" CTA strategy per service.
- Add service detail route if content depth increases.

---

## `/about` About

**Source:** `src/app/(brand)/about/page.tsx`

**Current purpose**
- Brand story and content blocks driven by CMS page model.

**Current sections**
- Page title header
- Dynamic CMS blocks via `PageBlocks`

**Current data dependencies**
- `getPageBySlug('about', { depth: 3 })`

**Empty/error behavior**
- Missing page => `notFound()`

**SEO/meta**
- Currently relies on global defaults unless CMS/meta mapping is surfaced separately.

**Improvement groundbase**
- Add section anchors for long-form content.
- Add media-rich timeline block type in CMS.
- Add founder/team trust module if required by brand strategy.

---

## `/contact` Contact

**Source:** `src/app/(brand)/contact/page.tsx`

**Current purpose**
- Contact information and inbound message capture.

**Current sections**
- Header + lead copy
- CMS content blocks (`PageBlocks`)
- Contact form area (`ContactForm`)

**Current data dependencies**
- `getPageBySlug('contact', { depth: 3 })`
- Form action in `src/app/(brand)/actions.ts` (validation + current delivery behavior)

**Empty/error behavior**
- Missing page => `notFound()`
- Form returns validation/status message; success currently stub-compatible.

**SEO/meta**
- Inherits defaults unless separately set.

**Improvement groundbase**
- Add explicit inquiry categories (sales, support, partnership).
- Add SLA expectation text and fallback contact channels.
- Add success telemetry events + anti-spam observability.

---

## `/journal` Journal Index

**Source:** `src/app/(brand)/journal/page.tsx`

**Current purpose**
- Editorial feed for brand stories/guides/news.

**Current sections**
- Header + lead
- Featured + secondary layout (`SectionMagazine5`)
- Additional grid (`SectionGridPosts`)

**Current data dependencies**
- `getPosts({ limit: 24, depth: 2 })`
- Mapping `CmsPost -> BlogCardPost`

**Empty/error behavior**
- "No published articles yet."

**SEO/meta**
- Static metadata present.

**Improvement groundbase**
- Add category filters and pagination from query params.
- Add featured editorial tags and reading-time consistency.
- Add author profile linking strategy.

---

## `/journal/[slug]` Journal Detail

**Source:** `src/app/(brand)/journal/[slug]/page.tsx`

**Current purpose**
- Full article page with rich content and related articles.

**Current sections**
- Category label
- Title/excerpt/meta line
- Hero image
- Rich text body (`BrandRichText`)
- Related posts grid (`SectionGridPosts`)

**Current data dependencies**
- `getPostBySlug(slug, { depth: 2 })`
- Related list from `getPosts({ limit: 4, depth: 2 })`
- Static params from `getPosts({ limit: 200 })`

**Empty/error behavior**
- Missing post => `notFound()`

**SEO/meta**
- Dynamic metadata in `generateMetadata`

**Improvement groundbase**
- Add canonical + full OG image fallback chain for posts.
- Add article structured data (`Article` JSON-LD).
- Improve related-post relevance (category/tag based).

---

## Priority Improvement Backlog (Display-Focused)

### P1 (high impact, low-to-medium complexity)
- Catalog: filter chips + clearer empty-state messaging split
- PDP: move reviews/specs to CMS-backed data model
- Journal detail: SEO enhancements (canonical + Article JSON-LD + OG image fallback)

### P2 (high impact, medium complexity)
- Stores: city/nearest filtering + open/closed status
- Collections detail: sorting/filter controls and sibling collections
- Home: CMS-managed hero and editorial slot

### P3 (content maturity)
- About/Contact: richer block types and conversion copy testing
- Services: service categorization and booking CTA strategy

## Suggested Working Method

For each page update cycle:

1. Define **display objective** (what user should do/feel on this page).
2. Update **content model dependency** (which CMS fields/blocks power it).
3. Implement **UI section changes**.
4. Validate **empty/error/SEO states**.
5. Record deltas back into this document.
