# Storefront roadmap: PDP, discovery, merchandising, trust, SEO, and loyalty

This document is a **planning-only** roadmap. No implementation work is described as completed here unless explicitly noted as already shipped.

**Goals**

- Reduce hesitation and returns on product detail pages through **fit and lens specification** content.
- Strengthen **online → offline** conversion via store discovery and appointment CTAs.
- Lower friction in **catalog discovery** (filter chips, shareable filter state).
- Enable **editor-controlled merchandising** (featured collections, seasonal modules, homepage slots) from the CMS.
- Increase persuasion with **rich media** and **CMS-backed reviews**.
- Surface **policy and FAQ** content near purchase intent.
- Maintain **SEO parity** and **performance discipline** appropriate for a headless Next.js + Payload stack.
- Defer **loyalty / referrals** until core commerce and data foundations are stable.

**Related references**

- Current baseline: `docs/storefront-page-groundbase.md`
- Architecture map: `docs/storefront-structure-deep-analysis.md`
- Schema contracts: `docs/ep-1-schema-contracts.md`, `docs/ep-2-data-access.md`

---

## 1) Fit & lens specs on the PDP

**Intent**  
Expose structured fields (e.g. bridge width, temple length, lens type, frame material, face-shape hints) so customers can self-qualify frames and support teams have fewer mismatched expectations.

**CMS work (Payload)**

- Extend `products` (or introduce a nested `specs` group / block) with validated fields:
  - Measurements (mm): bridge, temple, lens width/height where applicable.
  - Lens type / material / treatment (controlled vocabulary or select fields).
  - Frame material.
  - Optional “fit notes” or “face shape hints” (short text or curated tags).
- Editorial workflow: drafts/publish, validation ranges, optional “show on PDP” toggles per field.
- Media: optional dimension diagram image per product or per collection.

**Storefront work**

- Brand PDP (`/catalog/[slug]`): render specs in a consistent module (e.g. accordion or spec grid); mobile-first layout.
- Accessibility: units, clear labels, no reliance on color alone for “fit” hints.
- Empty states: hide module or show “Ask in store” when specs missing.

**Dependencies**  
Design system tokens; copy guidelines; possibly i18n later.

**Risks**  
Inconsistent data entry without admin validation; scope creep into full “fit quiz” — keep v1 structured and minimal.

**Success signals**  
Lower PDP bounce on spec-rich products; fewer “wrong size” support themes; internal QA checklist passes.

---

## 2) Strong store locator + “book appointment”

**Intent**  
Make **stores** and **services** the obvious next step: find a location, understand what happens in-store, and book an exam or fitting.

**CMS work**

- `stores`: ensure fields support map, hours, CTAs (phone, WhatsApp, maps URL) — largely present; validate completeness in content ops.
- `services`: explicit service types (exam, fitting, adjustments) with optional **booking URL** or **booking provider** field (Cal.com, Google Appointments, custom deep link).
- Optional new collection or page blocks: “promo strip” for campaigns (e.g. free eye test week).

**Storefront work**

- `/stores`: filters (city/region), sort by distance (future: geolocation), consistent CTA row per card.
- `/services`: per-service primary CTA (“Book fitting”) + secondary (“Call store”).
- Cross-link PDP and cart: “Try in store” / “Find a store near you” module (non-blocking).

**Dependencies**  
Chosen booking tool or policy for phone-only booking; legal copy for health-related services.

**Risks**  
Fragmented booking flows (every store different) — document a single primary pattern in the plan before build.

**Success signals**  
Increased clicks on maps/booking; measurable appointments attributed via UTM or booking analytics.

---

## 3) Filter chips + saved filter state (catalog)

**Intent**  
Make active filters visible, removable in one tap, and **shareable via URL** so marketing and support can link to a filtered catalog view.

**CMS / API**

- No schema change strictly required if filters map to existing query params (`collection`, `status`, price, `sort`, `q`).
- Optional: curated “preset” URLs owned by marketing (saved searches as CMS `pages` or redirect rules — decision later).

**Storefront work**

- UI: chips reflecting active filters; “Clear all” / “Reset”.
- URL contract: document and stabilize query param names and defaults; normalize invalid values server-side.
- Optional: persist last-used sort in session (privacy-conscious) — lower priority than URL shareability.

**Dependencies**  
`docs/storefront-page-groundbase.md` query contract; analytics events for filter usage.

**Risks**  
Over-complex chip rules — start with the filters already supported on `/catalog`.

**Success signals**  
Higher engagement with filters; fewer support questions about “how to find X”; campaign links with pre-applied filters work reliably.

---

## 4) Merchandising: featured collections, seasonal modules, homepage slots

**Intent**  
Move homepage and key landing zones from **static section composition** toward **editor-controlled slots** without deploys.

**CMS work**

- Options (pick one strategy after spike):
  - **Globals** or **singleton** “Homepage” document with repeatable “modules” (hero, collection spotlight, journal spotlight, promo banner).
  - Or extend `pages` blocks with new block types: `collectionSpotlight`, `productRow`, `seasonalBanner`, `journalFeature`.
- Relationships: `product-collections`, `products`, `posts`, `media`.
- Scheduling: optional `publishWindow` or rely on draft/publish and manual timing.

**Storefront work**

- Replace or augment static sections on `/` with `PageBlocks`-style renderer for homepage modules.
- Fallback: if module empty, hide or show default brand-safe placeholder.

**Dependencies**  
Design templates per module; performance budget (avoid too many above-the-fold requests).

**Risks**  
Layout explosion — constrain module types and max counts in admin.

**Success signals**  
Marketing can rotate campaigns weekly without code changes; homepage LCP remains within budget.

---

## 5) Short video + rich imagery (PDP)

**Intent**  
Support **video** and **multi-angle** storytelling on the PDP to match common e-commerce persuasion patterns.

**CMS work**

- `media` or product relationship: optional **video** field (upload or external URL policy — decide: Mux, YouTube unlisted, or direct file).
- Ordering: explicit **gallery order** for images + optional “poster” frame for video.

**Storefront work**

- Gallery: video slot with lazy load, reduced motion respect, poster image.
- Performance: defer non-critical video; prefer short clips; compress assets.

**Dependencies**  
Brand video guidelines; CDN/hosting choice.

**Risks**  
Heavy autoplay hurting CWV — default to user-initiated play on mobile.

**Success signals**  
Higher time-on-page on PDP; no regression in LCP/INP.

---

## 6) Reviews from CMS (replace static stubs)

**Intent**  
Replace placeholder reviews with **published review content** (and later aggregates) sourced from Payload.

**CMS work**

- New collection e.g. `product-reviews` (or nested docs) with:
  - Relationship to `products`, rating, title/body, author display name, date, publish status, optional verified flag.
- Optional: rollup fields on `products` (average rating, count) via hooks or periodic job — only if needed for performance.

**Storefront work**

- Brand PDP: list reviews, schema.org `Review` / aggregate where appropriate (coordinate with SEO section).
- Moderation workflow documented for editors.

**Dependencies**  
Legal: consent for displaying names; spam handling.

**Risks**  
Fake reviews — access control and editorial process.

**Success signals**  
Review content manageable in admin; structured data valid in Rich Results testing.

---

## 7) FAQ / policy clarity near the buy path

**Intent**  
Answer shipping, returns, warranty, and service questions **before** checkout anxiety — especially important when checkout goes live.

**CMS work**

- Reuse `pages` blocks or add **FAQ block** (question/answer list) with optional linking to policy pages.
- Optional `globals` “Commerce policies” for single source of truth snippets.

**Storefront work**

- PDP: compact FAQ strip or link to expanded modal/page.
- Cart/checkout (when real): repeat key policies and links.

**Dependencies**  
Final legal copy.

**Risks**  
Duplicate conflicting copy across pages — designate canonical policy URLs.

**Success signals**  
Fewer pre-purchase support tickets; lower checkout drop-off (when checkout is live).

---

## 8) Performance & SEO (headless-friendly)

**Intent**  
Preserve **SEO parity** (crawlable HTML, metadata, structured data, canonical URLs) and **Core Web Vitals** as features grow.

**Planned activities (no implementation here)**

- **Rendering**: Continue SSR/SSG/ISR patterns appropriate per route; avoid client-only critical content for primary catalog/PDP.
- **Structured data**: Extend JSON-LD where merited (`Product` with offers, `Review` when live, `FAQPage` if FAQ blocks warrant it).
- **Canonical & sitemap**: Align canonical URLs with Payload SEO plugin `generateURL` and storefront routes; keep `(shop)` legacy routes out of sitemap unless product decision changes.
- **Monitoring**: Define CWV budgets (LCP, INP, CLS); run periodic lab + field checks; track regressions on deploy.
- **Assets**: Enforce `next/image` usage, modern formats, responsive `sizes`, lazy below-the-fold.

**Dependencies**  
Staging environment with representative CMS content; Search Console / Bing Webmaster.

**Risks**  
Feature additions (video, third-party scripts) silently regress performance — gate merges on budget.

---

## 9) Loyalty & referrals (later phase)

**Intent**  
Introduce only after **stable identity**, **order history**, and **supportable fulfillment** exist (or as a lightweight marketing program without heavy engineering).

**Planning notes**

- Define program rules (points vs. referrals vs. tiered perks).
- Integrate with email/CRM and optionally a loyalty vendor.
- Privacy and terms of service updates.

**Explicitly out of scope for near-term build** unless product prioritizes.

---

## Suggested phasing

| Phase | Focus | Rough outcome |
| ----- | ----- | ------------- |
| **A — Foundation** | PDP specs schema + admin validation; FAQ/policy CMS blocks; CWV/SEO checklist | Trust and clarity without new commerce systems |
| **B — Discovery & merchandising** | Filter chips + URL stability; homepage merchandising modules | Better campaigns and less friction finding products |
| **C — Rich media & reviews** | Video/gallery ordering; reviews collection + PDP integration | Stronger persuasion and social proof |
| **D — O2O** | Store filters, booking CTAs, cross-links from PDP | Measurable store and appointment actions |
| **E — Loyalty** | Deferred program design | Only after metrics and ops readiness |

---

## Open decisions (to resolve before implementation)

1. **Booking**: single vendor vs. per-store links vs. phone-first.
2. **Video hosting**: self-hosted vs. third-party embed vs. Mux.
3. **Reviews**: full moderation in Payload vs. import from external platform.
4. **Merchandising model**: globals vs. `pages` blocks vs. dedicated `homepage` collection.
5. **Internationalization**: if specs and policies need locale variants.

---

## Document control

- **Status**: Planning draft  
- **Implementation**: None required to merge this document; engineering tickets should reference sections when work starts.
