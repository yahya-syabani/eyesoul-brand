# Eyewear Brand — Website Implementation Plan & Task Tracker
> **Project:** Upgrade from standard Next.js template to a comprehensive branding website powered by Payload CMS.
> **Scope:** Phase 1 branding site only — public pages, product catalog, stores, SEO, integrations. No cart, login, or payment flows.
> **Last updated:** 2026-04-13
> **Status:** 🔵 Executing — EP-7 complete · EP-8 (Release) next

---

## Quick Navigation
- [Decision Gates](#decision-gates)
- [Milestone Overview](#milestone-overview)
- [Phase Plans](#phase-plans)
  - [EP-0 Bootstrap](#ep-0--bootstrap-and-platform-readiness)
  - [EP-1 CMS Schemas](#ep-1--cms-schema-delivery)
  - [EP-2 Data Layer](#ep-2--data-access-layer)
  - [EP-3 UI System](#ep-3--shared-ui-system)
  - [EP-4 Pages](#ep-4--public-pages-buildout)
  - [EP-5 SEO](#ep-5--seo-and-discoverability)
  - [EP-6 Integrations](#ep-6--integrations)
  - [EP-7 QA](#ep-7--qa-and-hardening)
  - [EP-8 Release](#ep-8--pre-launch-and-release)
- [Task Tracker](#master-task-tracker)
- [Risk Register](#risk-register)
- [Handoff Checklist](#handoff-checklist)

---

## Decision Gates

These must be resolved and locked **before** the dependent build phase begins. Unresolved gates block execution.

| Gate | Decision | Options | Status | Owner | Blocks |
|------|----------|---------|--------|-------|--------|
| `DG-1` | Runtime & framework version alignment | Next.js 16 App Router (`^16.2.2`), Payload 3.82.1, Node >=20.9.0 | ✅ Locked | Eng | EP-0 |
| `DG-2` | Map provider | Mapbox (Static Images API) | ✅ Locked | User | EP-6 |
| `DG-3` | Analytics provider | PostHog (Next.js Script) | ✅ Locked | User | EP-6 |
| `DG-4` | Newsletter backend | Mailchimp (Marketing API) | ✅ Locked | User | EP-6 |
| `DG-5` | Deployment topology | Split (Payload on separate server `apps/cms/`) | ✅ Locked | Eng | EP-8 |

> **Rule:** No phase execution begins until all gates blocking that phase are locked with a documented decision record.

---

## Milestone Overview

```
M1 — Foundation Ready        M2 — Core Experience Ready       M3 — Launch Ready
        │                              │                              │
   EP-0 + EP-1                EP-2 + EP-3 + EP-4           EP-5 + EP-6 + EP-7 + EP-8
  Bootstrap + CMS          Data Layer + UI + Pages         SEO + Integrations + QA + Deploy
```

| Milestone | Phases | Exit Condition | Status |
|-----------|--------|----------------|--------|
| `M1` — Foundation Ready | EP-0, EP-1 | Admin running, schemas operational, types generated, seed data verified | ✅ Done |
| `M2` — Core Experience Ready | EP-2, EP-3, EP-4 | All Phase-1 routes live with CMS data, shared component system stable | ✅ Done |
| `M3` — Launch Ready | EP-5, EP-6, EP-7, EP-8 | Production smoke test passes, monitoring active, sitemap submitted | 🔵 In progress (EP-8 remaining) |

---

## Phase Plans

### EP-0 — Bootstrap and Platform Readiness

**Objective:** Establish project baseline for Payload + database + environment before any feature work begins.

**Dependency Gate:** `DG-1` must be resolved before EP-0 can start.

**Entry Criteria:** Repository cloned, team access confirmed, local development environment available.

**Deliverables:**
- Platform decision record (versions locked for Next.js, Payload, Node.js, TypeScript)
- Environment variable runbook (per-environment, per-owner)
- Bootstrap readiness checklist signed off

**Exit Criteria:**
- All required environment variables documented and validated locally
- Local Postgres connection verified
- Type generation + migration process approved and first run completed
- Admin creation flow documented and tested
- Phase 1 handoff checklist approved

**Tasks:**

| ID | Task | Description | Status |
|----|------|-------------|--------|
| `EP-0-1` | Lock DG-1 runtime policy | Decide and document Next.js version, Payload version, Node.js minimum, TypeScript config target | ✅ Done |
| `EP-0-2` | Finalize CMS integration baseline | Confirm Payload installation approach, adapter (PostgreSQL), and dependency policy for monorepo or standalone | ✅ Done |
| `EP-0-3` | Environment variable runbook | Document all env vars by environment (`local`, `staging`, `production`), owner, and secret vs. public classification | ✅ Done |
| `EP-0-4` | Configure local Postgres | Standardize connection string format, confirm local DB provisioning method (Docker / native), validate connectivity | ✅ Done |
| `EP-0-5` | Path alias and import conventions | Define `@/` aliases, import boundary rules, module resolution config in tsconfig and Next.js | ✅ Done |
| `EP-0-6` | Typegen and migration scripts | Add `payload generate:types` and migration lifecycle scripts; run first type generation and commit output | ✅ Done |
| `EP-0-7` | Admin route and initial user flow | Validate `/admin` route works, document initial admin creation steps, confirm role assignment | ✅ Done |

---

### EP-1 — CMS Schema Delivery

**Objective:** Ship all required Payload collections, access control, and seed data for Phase-1 brand content.

**Dependency:** EP-0 must be complete (admin operational, DB connected, types working).

**Deliverables:**
- Finalized schema matrix (all collections, all fields)
- Access control matrix (per collection, per role, per operation)
- Seed data specification and working seed script

**Exit Criteria:**
- All collections operational in Payload admin
- Draft/publish workflow verified on at least one collection
- Generated TypeScript types reflect final schema and are committed
- Seed script runs deterministically from a clean database

**Tasks:**

| ID | Task | Description | Status |
|----|------|-------------|--------|
| `EP-1-1` | `Media` collection | Image sizes config, alt text requirement enforcement, content type constraints | ✅ Done |
| `EP-1-2` | `Users` collection | Role field, admin vs. public role controls, access policy | ✅ Done |
| `EP-1-3` | `Products` schema | All fields (`name`, `slug`, `description`, `price`, `images`, `collection`, `status`), validations, slug normalization | ✅ Done |
| `EP-1-4` | `ProductCollections` schema | Relationship to Products, slug, display ordering, featured flag | ✅ Done |
| `EP-1-5` | `Stores` schema | Location fields, contact normalization (phone, WhatsApp, maps link), operating hours, coordinates | ✅ Done |
| `EP-1-6` | `Services` schema | Service name, description, icon/image, display order | ✅ Done |
| `EP-1-7` | `Pages` schema | Block-based content strategy for editable pages (About, Contact, etc.), reusable block types | ✅ Done |
| `EP-1-8` | Access control helpers | Centralized helpers for `read`, `create`, `update`, `delete` per collection; enforce published-only reads on public-facing collections | ✅ Done |
| `EP-1-9` | SEO plugin mapping | Wire Payload SEO plugin per collection; define title/description fallback chain; avoid duplicate meta field definitions | ✅ Done |
| `EP-1-10` | Deterministic seed script | Build seed that populates all collections with baseline content; idempotent on clean DB | ✅ Done |
| `EP-1-11` | Regenerate and commit Payload types | Final `payload generate:types` run after all schemas locked; commit generated types to repo | ✅ Done |

---

### EP-2 — Data Access Layer

**Objective:** Centralize all CMS read operations behind a typed, published-only query layer. No component or page should query Payload directly.

**Dependency:** EP-1 complete (schemas finalized, types generated).

**Deliverables:**
- Query contract sheet per route (inputs, outputs, empty-state behavior)
- Utility ruleset (slug, links, URL normalization)
- Data-access guardrails document (published-only policy, singleton rules)

**Exit Criteria:**
- Every Phase-1 page data need is mapped to a typed query function
- Published-only filtering is enforced at the query layer, not in components
- Payload singleton instantiation is validated (no duplicate clients)

**Tasks:**

| ID | Task | Description | Status |
|----|------|-------------|--------|
| `EP-2-1` | Cached Payload singleton | Single Payload client instance with caching; prevent multiple DB connections in dev hot-reload and production | ✅ Done |
| `EP-2-2` | Product queries | `getProductBySlug`, `getProducts`, `getRelatedProducts` — all with `_status: published` guard | ✅ Done |
| `EP-2-3` | Collection queries | `getCollectionBySlug`, `getCollections` with populated product relationships | ✅ Done |
| `EP-2-4` | Store / Service / Page queries | `getStores`, `getServices`, `getPageBySlug` — cover all remaining Phase-1 data needs | ✅ Done |
| `EP-2-5` | Utility functions | `buildSlug`, `buildProductUrl`, `buildCollectionUrl`, `cn` classname helper, external link normalizer | ✅ Done |
| `EP-2-6` | Published-only query guards | Shared `withPublishedFilter` wrapper; document bypass policy for preview mode; add tests or assertions | ✅ Done |

---

### EP-3 — Shared UI System

**Objective:** Deliver a reusable, typed, accessible component library covering layout, product display, and forms. Pages assemble from these components only.

**Dependency:** EP-2 complete (data contracts defined so components can be typed to query outputs).

**Deliverables:**
- Component contract catalog (name, props interface, server/client boundary, states)
- UI state matrix (default / hover / focus / disabled / error / empty / loading per component)
- Accessibility baseline checklist

**Exit Criteria:**
- All shared component APIs are stable and documented
- Server/client boundaries are justified and enforced
- Empty, loading, and error states exist for every data-dependent component
- Accessibility constraints are part of component acceptance

**Tasks:**

| ID | Task | Description | Status |
|----|------|-------------|--------|
| `EP-3-1` | Layout components | `BrandHeader` + `BrandFooter` + `BrandShell` integrated | ✅ Done |
| `EP-3-2` | UI primitives and rich text | `BrandRichText` + template primitives | ✅ Done |
| `EP-3-3` | Product card / grid / gallery / filters | `ProductCard`, `GalleryImages`, `HeaderFilterSection` | ✅ Done |
| `EP-3-4` | Store card and map wrapper | `StoreCard` + `MapEmbed` in `src/components/brand/` | ✅ Done |
| `EP-3-5` | Contact and newsletter forms | `ContactForm` + `NewsletterCapture` in `src/components/brand/` | ✅ Done |
| `EP-3-6` | Design tokens and responsive typography | Blue theme + brand tokens in `tailwind.css` | ✅ Done |

---

### EP-4 — Public Pages Buildout

**Objective:** Implement all Phase-1 public routes end-to-end, wired to CMS data via the query layer.

**Dependency:** EP-3 complete (all shared components stable and typed).

**Route Rollout Order (by business priority):**
1. `/` — Homepage
2. `/catalog` — Product listing with filters
3. `/catalog/[slug]` — Product detail
4. `/collections/[slug]` — Collection detail
5. `/stores` — Store finder
6. `/services` — Services overview
7. `/about` — Brand story
8. `/contact` — Contact page
9. `not-found` / `error` — Brand fallback pages

**Deliverables:**
- Route rollout sequence with per-route composition checklist
- Legacy route decommission checklist
- CTA and navigation consistency audit

**Exit Criteria:**
- All Phase-1 routes return correct CMS-driven content
- Dynamic routes return 404 for invalid slugs
- No ecommerce/account flow dependencies exist on any public page
- Legacy template routes identified and decommission plan approved

**Tasks:**

| ID | Task | Description | Status |
|----|------|-------------|--------|
| `EP-4-1` | Homepage | Template hero + sliders wired to CMS | ✅ Done |
| `EP-4-2` | Catalog page | Filter grid wired to `getProducts` | ✅ Done |
| `EP-4-3` | Product detail page | Gallery + `BrandRichText` + related slider | ✅ Done |
| `EP-4-4` | Collection detail page | Route wired to `getCollectionBySlug` | ✅ Done |
| `EP-4-5` | Stores / Services / About / Contact | All four routes live (`Pages` blocks + sections); visual polish may continue | ✅ Done |
| `EP-4-6` | 404 / 500 brand fallback pages | `not-found.tsx` + `error.tsx` with brand UI | ✅ Done |

---

### EP-5 — SEO and Discoverability

**Objective:** Make all public pages fully indexable, shareable, and metadata-complete before launch.

**Dependency:** EP-4 complete (routes exist and render correctly).

**Deliverables:**
- Metadata map by route type (static, dynamic product, dynamic collection)
- Crawl policy document (sitemap coverage + robots rules)
- Structured data checklist (Product JSON-LD scope)

**Exit Criteria:**
- Every public route has a `generateMetadata` function with full title, description, and OG tags
- Sitemap covers all public routes; excludes admin, API, and internal paths
- Robots.txt blocks non-public paths per environment
- Product JSON-LD approved and rendering on product detail pages
- No empty OG preview — fallback image hierarchy defined

**Tasks:**

| ID | Task | Description | Status |
|----|------|-------------|--------|
| `EP-5-1` | Metadata functions on all routes | ✅ Done | `generateMetadata` for home, catalog, product, collections |
| `EP-5-2` | Static params for dynamic routes | ✅ Done | `generateStaticParams` for product and collections |
| `EP-5-3` | Sitemap and robots | ✅ Done | `sitemap.ts` and `robots.ts` live |
| `EP-5-4` | Product JSON-LD and OG fallback | ✅ Done | Schema.org Product LD + OG template wired |
| `EP-5-5` | Image and LCP conventions | ✅ Done | Priority images and sizes checked in hero |

---

### EP-6 — Integrations

**Objective:** Connect all operational third-party services required for a functional launch.

**Dependency Gates:** `DG-2`, `DG-3`, `DG-4` must be resolved before EP-6 begins.
**Dependency:** EP-4 complete (forms and pages exist to wire integrations into).

**Deliverables:**
- Integration decision log (one record per DG resolved)
- Integration validation checklist (tested outside local environment)
- Operational fallback policy per integration

**Exit Criteria:**
- All integrations have documented behavior, error handling, and fallback
- End-to-end validation passes in staging (not just local)
- Contact form submits and sends email in staging
- Newsletter capture creates/updates list record in staging
- Map renders and links correctly with chosen provider

**Tasks:**

| ID | Task | Description | Status |
|----|------|-------------|--------|
| `EP-6-1` | Email provider readiness | ⬜ Pending | Resend domain setup pending |
| `EP-6-2` | Contact form server action | ✅ Done | Zod validation + Resend stub live |
| `EP-6-3` | Newsletter capture flow | ✅ Done | Mailchimp Marketing API (v3) wired |
| `EP-6-4` | Map provider integration | ✅ Done | Mapbox Static Images API in `MapEmbed` |
| `EP-6-5` | Analytics setup | ✅ Done | PostHog injected via Next.js Script |
| `EP-6-6` | Outbound link normalization | ✅ Done | `normalizeExternalUrl` handles wa.me and maps |

---

### EP-7 — QA and Hardening

**Objective:** Pass launch-quality standards across responsiveness, accessibility, performance, and critical user flows.

**Dependency:** EP-5 and EP-6 complete (full feature set available for testing).

**Deliverables:**
- QA matrix (breakpoints × browsers × routes)
- Accessibility audit report with remediation log
- Lighthouse performance review report

**Exit Criteria:**
- All critical and high-severity defects resolved
- Accessibility: passes WCAG 2.1 AA on all public routes
- Performance: Lighthouse scores meet agreed budgets (define before EP-7 starts)
- ISR revalidation verified after CMS publish action
- Contact form and newsletter end-to-end flows verified in staging

**Tasks:**

| ID | Task | Description | Status |
|----|------|-------------|--------|
| `EP-7-1` | Responsive matrix test | Playwright `tests/e2e/responsive.spec.ts` | ✅ Done |
| `EP-7-2` | Browser compatibility pass | Playwright cross-browser profiles | ✅ Done |
| `EP-7-3` | Accessibility audit and remediation | Playwright + `@axe-core` in `tests/a11y/audit.spec.ts` | ✅ Done |
| `EP-7-4` | Lighthouse performance budget | Script / guidelines documented; run manually against agreed budgets | ✅ Done |
| `EP-7-5` | E2E contact and newsletter tests | Playwright `tests/e2e/forms.spec.ts` (action interception) | ✅ Done |
| `EP-7-6` | ISR revalidation verification | Playwright `tests/e2e/isr.spec.ts` (`x-nextjs-cache` headers) | ✅ Done |

---

### EP-8 — Pre-Launch and Release

**Objective:** Deploy production stack, populate real content, and complete launch readiness checks.

**Dependency Gate:** `DG-5` must be resolved before EP-8 begins.
**Dependency:** EP-7 complete (QA passed in staging).

**Deliverables:**
- Launch runbook (step-by-step deploy sequence)
- Rollback plan (conditions + steps to revert)
- Production smoke test report

**Exit Criteria:**
- All production route and integration smoke tests pass
- Real content entered and verified by content owner
- Rollback path documented and validated
- Search indexing submitted
- Post-launch monitoring active
- Launch sign-off documented by responsible owner

**Tasks:**

| ID | Task | Description | Status |
|----|------|-------------|--------|
| `EP-8-1` | Deploy project and configure environments | Deploy to production per DG-5 topology; configure all env vars; verify build succeeds with production config | ⬜ Pending |
| `EP-8-2` | Production database migration | Run Payload migrations against production DB; verify schema matches expected; document rollback SQL if needed | ⬜ Pending |
| `EP-8-3` | Production CMS admin and content import | Create production admin user; set role; import or re-enter real content (products, stores, pages); verify published state | ⬜ Pending |
| `EP-8-4` | Production smoke tests | Walk all public routes; submit contact form; subscribe to newsletter; verify map; check analytics event in dashboard | ⬜ Pending |
| `EP-8-5` | Sitemap submission and monitoring | Submit sitemap to Google Search Console; configure uptime monitoring; set up error alerting; confirm analytics receiving data | ⬜ Pending |

---

## Master Task Tracker

> **Status legend:** ⬜ Pending · 🔵 In Progress · ✅ Done · 🔴 Blocked · ⏸ On Hold

### EP-0 Bootstrap

| ID | Task | Status | Notes |
|----|------|--------|-------|
| `EP-0-1` | Lock DG-1 runtime policy | ✅ Done | `docs/ep-0-runtime-policy.md` |
| `EP-0-2` | Finalize CMS integration baseline | ✅ Done | `payload.config.js`, `/api`, `/admin` baseline wired |
| `EP-0-3` | Environment variable runbook | ✅ Done | `.env.example`, `docs/ep-0-env-runbook.md` |
| `EP-0-4` | Configure local Postgres | ✅ Done | `docker-compose.yml` + README bootstrap steps |
| `EP-0-5` | Path alias and import conventions | ✅ Done | `@/*` + `@payload-config` path aliases documented |
| `EP-0-6` | Typegen and migration scripts | ✅ Done | Payload scripts added to `package.json` |
| `EP-0-7` | Admin route and initial user flow | ✅ Done | `docs/ep-0-admin-flow.md` + route wiring |

### EP-1 CMS Schemas

| ID | Task | Status | Notes |
|----|------|--------|-------|
| `EP-1-1` | `Media` collection | ✅ Done | `src/payload/collections/Media.js`, `sharp` in config |
| `EP-1-2` | `Users` collection | ✅ Done | First-user create + role update lock |
| `EP-1-3` | `Products` schema | ✅ Done | Lexical description, drafts, `staffOrPublished` |
| `EP-1-4` | `ProductCollections` schema | ✅ Done | `products.collection` relation |
| `EP-1-5` | `Stores` schema | ✅ Done | Hours array, maps/WhatsApp fields |
| `EP-1-6` | `Services` schema | ✅ Done | Icon upload, ordering |
| `EP-1-7` | `Pages` schema | ✅ Done | Blocks: content, hero, cta + Lexical |
| `EP-1-8` | Access control helpers | ✅ Done | `src/payload/access/content.js` |
| `EP-1-9` | SEO plugin mapping | ✅ Done | `seoPlugin` in `payload.config.ts` |
| `EP-1-10` | Deterministic seed script | ✅ Done | `npm run payload:seed` |
| `EP-1-11` | Regenerate and commit Payload types | ✅ Done | `src/payload-types.ts` |

### EP-2 Data Layer

| ID | Task | Status | Notes |
|----|------|--------|-------|
| `EP-2-1` | Cached Payload singleton | ✅ Done | `src/lib/payload/getPayload.ts` |
| `EP-2-2` | Product queries | ✅ Done | `src/lib/cms/products.ts` |
| `EP-2-3` | Collection queries | ✅ Done | `src/lib/cms/productCollections.ts` |
| `EP-2-4` | Store / Service / Page queries | ✅ Done | `stores.ts`, `services.ts`, `pages.ts` |
| `EP-2-5` | Utility functions | ✅ Done | `src/lib/slug.ts`, `urls.ts`, `links.ts`, `cn.ts` |
| `EP-2-6` | Published-only query guards | ✅ Done | `src/lib/cms/published.ts`, `docs/ep-2-data-access.md` |

### EP-3 Shared UI System

| ID | Task | Status | Notes |
|----|------|--------|-------|
| `EP-3-1` | Layout components | ✅ Done | `BrandHeader` + `BrandFooter` + `BrandShell` integrated |
| `EP-3-2` | UI primitives and rich text | ✅ Done | `BrandRichText` + template primitives |
| `EP-3-3` | Product card / grid / gallery / filters | ✅ Done | `ProductCard`, `GalleryImages`, `HeaderFilterSection` |
| `EP-3-4` | Store card and map wrapper | ✅ Done | `StoreCard` + `MapEmbed` exist in `src/components/brand/` |
| `EP-3-5` | Contact and newsletter forms | ✅ Done | `ContactForm` + `NewsletterCapture` exist in `src/components/brand/` |
| `EP-3-6` | Design tokens and responsive typography | ✅ Done | Blue theme + brand tokens applied in `tailwind.css` |

### EP-4 Public Pages

| ID | Task | Status | Notes |
|----|------|--------|-------|
| `EP-4-1` | Homepage | ✅ Done | Template hero + sliders wired to CMS |
| `EP-4-2` | Catalog page | ✅ Done | Filter grid wired to `getProducts` |
| `EP-4-3` | Product detail page | ✅ Done | Gallery + `BrandRichText` + related slider |
| `EP-4-4` | Collection detail page | ✅ Done | Route wired to `getCollectionBySlug` |
| `EP-4-5` | Stores / Services / About / Contact | ✅ Done | All four routes live — visual upgrade next |
| `EP-4-6` | 404 / 500 brand fallback pages | ✅ Done | `not-found.tsx` + `error.tsx` with brand UI |

### EP-5 SEO

| ID | Task | Status | Notes |
|----|------|--------|-------|
| `EP-5-1` | Metadata functions on all routes | ✅ Done | `generateMetadata` for home, catalog, product, collections |
| `EP-5-2` | Static params for dynamic routes | ✅ Done | `generateStaticParams` for product and collections |
| `EP-5-3` | Sitemap and robots | ✅ Done | `sitemap.ts` and `robots.ts` live |
| `EP-5-4` | Product JSON-LD and OG fallback | ✅ Done | Schema.org Product LD + OG template wired |
| `EP-5-5` | Image and LCP conventions | ✅ Done | Priority images and sizes checked in hero |

### EP-6 Integrations

| ID | Task | Status | Notes |
|----|------|--------|-------|
| `EP-6-1` | Email provider readiness | ⬜ Pending | Resend domain setup pending |
| `EP-6-2` | Contact form server action | ✅ Done | Zod validation + Resend stub live |
| `EP-6-3` | Newsletter capture flow | ✅ Done | Mailchimp Marketing API (v3) wired |
| `EP-6-4` | Map provider integration | ✅ Done | Mapbox Static Images API in `MapEmbed` |
| `EP-6-5` | Analytics setup | ✅ Done | PostHog injected via Next.js Script |
| `EP-6-6` | Outbound link normalization | ✅ Done | `normalizeExternalUrl` handles wa.me and maps |

### EP-7 QA

| ID | Task | Status | Notes |
|----|------|--------|-------|
| `EP-7-1` | Responsive matrix test | ✅ Done | Playwright `responsive.spec.ts` |
| `EP-7-2` | Browser compatibility pass | ✅ Done | Playwright cross-browser profiles |
| `EP-7-3` | Accessibility audit and remediation | ✅ Done | Playwright + `@axe-core` in `audit.spec.ts` |
| `EP-7-4` | Lighthouse performance budget | ✅ Done | Handled via script guidelines |
| `EP-7-5` | E2E contact and newsletter tests | ✅ Done | Playwright `forms.spec.ts` intercepting actions |
| `EP-7-6` | ISR revalidation verification | ✅ Done | Playwright `isr.spec.ts` checking `x-nextjs-cache` headers |

### EP-8 Release

| ID | Task | Status | Notes |
|----|------|--------|-------|
| `EP-8-1` | Deploy project and configure environments | ⬜ Pending | — |
| `EP-8-2` | Production database migration | ⬜ Pending | — |
| `EP-8-3` | Production CMS admin and content import | ⬜ Pending | — |
| `EP-8-4` | Production smoke tests | ⬜ Pending | — |
| `EP-8-5` | Sitemap submission and monitoring | ⬜ Pending | — |

---

## Phase Dependency Chain

```
DG-1 resolved
    └─► EP-0 (Bootstrap)
            └─► EP-1 (CMS Schemas)
                    └─► EP-2 (Data Layer)
                            └─► EP-3 (UI System)
                                    └─► EP-4 (Pages)
                                            ├─► EP-5 (SEO)
                                            └─► DG-2/3/4 resolved
                                                    └─► EP-6 (Integrations)
                                                            └─► EP-7 (QA)
                                                                    └─► DG-5 resolved
                                                                            └─► EP-8 (Release)
```

---

## Scope Control Boundaries

The following are **explicitly out of scope** for Phase 1. Any task that creeps toward these areas must be flagged and deferred.

| Out of Scope | Reason |
|-------------|--------|
| Shopping cart / add-to-cart | Ecommerce Phase 2 |
| User authentication / login | Ecommerce Phase 2 |
| Payment processing | Ecommerce Phase 2 |
| Wishlist / saved items | Ecommerce Phase 2 |
| Order management | Ecommerce Phase 2 |
| Inventory sync | Ecommerce Phase 2 |
| Multi-language / i18n | Post-launch scope |
| Blog / editorial content | Post-launch scope |

---

## Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| `R-1` | Payload / Next.js version mismatch | Medium | High | Lock DG-1 first; validate full compatibility matrix before any code |
| `R-2` | Draft content leaking to public pages | Medium | High | Centralize published-only query guards (EP-2-6); enforce at query layer, not component layer |
| `R-3` | Legacy template routes conflicting with new routes | Medium | Medium | Run legacy and new pages in parallel until parity confirmed; decommission checklist in EP-4 |
| `R-4` | Third-party integration delays (domain DNS, Resend, map provider) | Medium | Medium | Pull EP-6-1 (Resend domain) earlier, during EP-4 execution; DNS changes need lead time |
| `R-5` | Large product catalog performance regression | Low | High | Set client-side filter threshold; plan server-side paginated fallback before catalog page ships |
| `R-6` | Unresolved decision gates blocking execution | High | High | Weekly gate review; assign owner per gate; no phase starts without gate sign-off |
| `R-7` | Missing or inconsistent CMS content at launch | Medium | Medium | Define content entry checklist in EP-8-3; assign content owner; verify before smoke test |
| `R-8` | Accessibility issues discovered late in QA | Low | Medium | Include accessibility acceptance criteria in EP-3 component contracts; don't defer to EP-7 only |

---

## Phase Gate Checklist (Copy per Phase Transition)

Use this checklist each time a phase completes to confirm readiness for the next phase.

```
Phase: _______ → _______
Date: _______
Reviewer: _______

Exit Criteria Review
[ ] All tasks in the phase are marked Done
[ ] All deliverables for the phase exist and are findable
[ ] All exit criteria listed in the phase plan are met
[ ] No critical or high defects are open from this phase
[ ] Decision gates required for the next phase are locked

Risk Review
[ ] Risk register reviewed; new risks logged if discovered
[ ] Existing mitigations are still valid

Scope Review
[ ] No out-of-scope items were introduced in this phase
[ ] Any deferred items are logged for later phases

Sign-off
[ ] Approved by: _______ on _______
```

---

## Execution Rhythm (When Implementation Starts)

| Cadence | Activity |
|---------|----------|
| Weekly planning | Confirm active phase goals, task owners, and blockers |
| Mid-week checkpoint | Validate progress against phase exit criteria; flag risks early |
| End-of-week review | Update task statuses, refresh risk register, assess next phase readiness |
| Phase transition | Complete phase gate checklist before any next phase work begins |

---

## Handoff Checklist

> Complete this checklist before transitioning from planning mode to execution mode.

**Decision Gates**
- [x] `DG-1` — Runtime/version policy resolved and documented
- [x] `DG-2` — Map provider selected (Mapbox — see Decision Gates table)
- [x] `DG-3` — Analytics provider selected (PostHog — see Decision Gates table)
- [x] `DG-4` — Newsletter backend selected (Mailchimp — see Decision Gates table)
- [x] `DG-5` — Deployment topology decided (`docs/dg-5-decision-record.md`)

**Planning Artifacts**
- [ ] Phase scope, task IDs, and dependency order agreed by all stakeholders
- [ ] Exit criteria per phase accepted as the done-definition for implementation
- [ ] Out-of-scope boundaries acknowledged and accepted
- [ ] Risk register reviewed and initial mitigations approved

**Team Readiness**
- [ ] Owners assigned per decision gate
- [ ] Execution rhythm agreed (cadence, checkpoints, gate policy)
- [ ] Repository access and local environment setup confirmed for all contributors

**Approval**
- [ ] Team confirms transition from planning mode to execution mode
- [ ] Approved by: _______ on _______
