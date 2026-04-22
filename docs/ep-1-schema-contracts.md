# EP-1 Schema Contracts

## Source of truth

- **Canonical field definitions** live in [`apps/cms/src/payload/collections/`](../apps/cms/src/payload/collections/) and [`apps/cms/src/payload/globals/`](../apps/cms/src/payload/globals/), registered by [`apps/cms/payload.config.ts`](../apps/cms/payload.config.ts).
- **TypeScript types** are generated to [`apps/cms/src/payload-types.ts`](../apps/cms/src/payload-types.ts); do not hand-edit that file for documentation.
- **This document** is the human-readable contract for onboarding and product review. If it ever disagrees with the collection/global configs, **the `.js` configs win** until this file is updated.

Slug rules: lowercase, `[a-z0-9-]+`, auto-normalized from `name` or `title` when slug is empty (see `apps/cms/src/payload/utils/slug.js`).

---

## Media (`media`)

| Field        | Type    | Notes                                      |
| ------------ | ------- | ------------------------------------------ |
| alt          | text    | Required                                   |
| (upload)     | upload  | MIME allowlist: image/jpeg, png, webp, gif |
| sizes        | derived | `thumbnail`, `card`, `hero` via `imageSizes` |

Access: public read; create/update/delete admin-only.

---

## Users (`users`)

| Field | Type   | Notes                          |
| ----- | ------ | ------------------------------ |
| role  | select | `admin` \| `editor` (required) |
| auth  | —      | Payload auth                   |

Access: admin UI requires a signed-in user; first user may be created when collection is empty; otherwise admin-gated CRUD. **Seed does not create users** (use bootstrap or admin).

---

## Product collections (`product-collections`)

| Field           | Type     | Notes              |
| --------------- | -------- | ------------------ |
| title           | text     | Required           |
| slug            | text     | Unique, normalized |
| description     | textarea | Optional           |
| displayOrder    | number   | Default 0          |
| featured        | checkbox | Default false      |
| coverImage      | upload   | Optional → `media` |
| Draft/publish   | versions | `drafts: true`    |

---

## Products (`products`)

| Field                | Type           | Notes                                                                 |
| -------------------- | -------------- | --------------------------------------------------------------------- |
| productType          | select         | Required: `optical-frame`, `sunglasses`, `contact-soft`, `contact-care`, `accessory` |
| name                 | text           | Required                                                              |
| slug                 | text           | Unique, normalized                                                    |
| description          | richText       | Lexical                                                               |
| brand                | text           | Optional                                                              |
| gtin                 | text           | Optional (product-level)                                              |
| price                | number         | Required, min 0                                                       |
| availabilityStatus   | select         | Required: `in-stock` \| `available`                                   |
| images               | relationship   | hasMany → `media`                                                     |
| collections          | relationship   | hasMany → `product-collections` (editorial groupings)                 |
| featured             | checkbox       | Default false (merchandising)                                         |
| badges               | json           | Optional string array, e.g. `["new","bestseller"]`                    |
| frame                | group          | Shown when `productType` is `optical-frame` or `sunglasses` — see below |
| specs                | group          | Same condition as `frame` — fit & lens specs, optional `dimensionDiagram` → `media` |
| contactLens          | group          | Shown when `productType` is `contact-soft` — see below              |
| careProduct          | group          | Shown when `productType` is `contact-care` — see below              |
| accessory            | group          | Shown when `productType` is `accessory` — see below                 |
| videoUrl             | text           | Optional; YouTube/Vimeo http(s) only (validated)                      |
| videoPoster          | upload         | Optional → `media`                                                    |
| Draft/publish        | versions       | `drafts: true`                                                        |

### `frame` group (frames / sunglasses)

| Field        | Type     | Notes |
| ------------ | -------- | ----- |
| frameShape   | select   | round, rectangle, square, aviator, cat-eye, browline, other |
| rimType      | select   | full-rim, semi-rimless, rimless, other |
| frameColor   | text     | Optional |
| rxAble       | checkbox | Default true |
| lensColor    | text     | Sunglasses only |
| polarized    | checkbox | Sunglasses only |
| uv400        | checkbox | Sunglasses only |
| lensCategory | number   | Sunglasses only, 0–4 |

### `specs` group (frames / sunglasses)

Includes `showSpecsOnPdp`, bridge/temple/lens mm fields, `lensType`, `lensMaterial`, `lensTreatment`, `frameMaterial`, `fitNotes`, `faceShapeHints`, `dimensionDiagram` → `media`. See [`Products.js`](../apps/cms/src/payload/collections/Products.js) for enums and min/max.

### `contactLens` group (`contact-soft`)

Replacement schedule, units per box, JSON arrays for base curve / diameter options, `spherePowerRange` (min/max/step), optional `hasCylinder` + `cylinderPowerRange` + `axisStep`, optional `hasAdd` + `addPowerRange`, material, water %, Dk/t, wearing modality.

### `careProduct` group (`contact-care`)

Unit of measure, optional `unitVolumeMl` (bottle), `unitsPerPack`, compatibility select.

### `accessory` group (`accessory`)

`accessoryType`, `unitsPerPack`, `compatibilityNotes`.

---

## Product variants (`product-variants`)

| Field         | Type          | Notes                               |
| ------------- | ------------- | ----------------------------------- |
| product       | relationship  | Required → `products`               |
| title         | text          | Required                            |
| sku           | text          | Optional; unique when set           |
| gtin          | text          | Optional                            |
| images        | relationship  | hasMany → `media`                   |
| attributes    | group         | colorName, colorCode, lensWidthMm, bridgeMm, templeMm |
| Draft/publish | versions      | `drafts: true`                      |

Access: same draft/public read pattern as other content (`staffOrPublished` in `apps/cms/src/payload/access/content.js`).

---

## Product reviews (`product-reviews`)

| Field         | Type          | Notes                 |
| ------------- | ------------- | --------------------- |
| product       | relationship  | Required → `products` |
| rating        | number        | Required, 1–5         |
| title         | text          | Required              |
| body          | richText      | Lexical               |
| authorName    | text          | Required              |
| verified      | checkbox      | Default false         |
| Draft/publish | versions      | `drafts: true`        |

---

## Stores (`stores`)

| Field         | Type     | Notes                          |
| ------------- | -------- | ------------------------------ |
| name          | text     | Required                       |
| slug          | text     | Unique, normalized             |
| address       | textarea | **Required**, multi-line       |
| city          | text     | Optional                       |
| region        | text     | Optional (filtering)           |
| phone         | text     | Optional                       |
| whatsApp      | text     | Optional (e.g. wa.me URL)      |
| email         | email    | Optional                       |
| mapsUrl       | text     | Optional                       |
| latitude      | number   | Optional                       |
| longitude     | number   | Optional                       |
| hours         | array    | `day` (select) + `open` + `close` text |
| Draft/publish | versions | `drafts: true`                 |

---

## Services (`services`)

| Field           | Type     | Notes                                              |
| --------------- | -------- | -------------------------------------------------- |
| name            | text     | Required                                           |
| slug            | text     | Unique, normalized                                 |
| description     | textarea | Optional                                           |
| icon            | upload   | Optional → `media`                                 |
| displayOrder    | number   | Default 0                                          |
| serviceType     | select   | Required: `exam`, `fitting`, `adjustments`, `other` (default `other`) |
| bookingUrl      | text     | Optional                                           |
| bookingPhone    | text     | Optional                                           |
| primaryCtaLabel | text     | Default “Book appointment”                         |
| Draft/publish   | versions | `drafts: true`                                     |

---

## Pages (`pages`)

| Field         | Type    | Notes                            |
| ------------- | ------- | -------------------------------- |
| title         | text    | Required                         |
| slug          | text    | Unique, normalized               |
| blocks        | blocks  | Min 1 row; see block types below |
| Draft/publish | versions | `drafts: true`                  |

### Page block types

| Block slug | Fields |
| ---------- | ------ |
| content    | `body` richText (Lexical), required |
| hero       | `heading` (required), `subheading`, optional `image` → `media` |
| cta        | `label`, `href` (required) |
| faq        | optional `heading`; `items[]` with `question`, `answer` (required per item), min 1 row |

---

## Posts (`posts`)

| Field         | Type     | Notes                    |
| ------------- | -------- | ------------------------ |
| title         | text     | Required                 |
| slug          | text     | Unique, normalized       |
| excerpt       | textarea | Required, max 240      |
| content       | richText | Lexical, required        |
| featuredImage | upload   | Optional → `media`       |
| category      | text     | Optional                 |
| authorName    | text     | Required                 |
| authorBio     | textarea | Optional, max 300        |
| authorAvatar  | upload   | Optional → `media`       |
| timeToRead    | text     | Optional (e.g. “3 min read”) |
| Draft/publish | versions | `drafts: true`           |

---

## Homepage global (`homepage`)

Single global; field `modules` is a blocks array (min 0 rows).

| Block slug            | Fields |
| --------------------- | ------ |
| heroModule            | `eyebrow`, `heading` (required), `subheading`, `image` → `media`, `ctaLabel`, `ctaHref` |
| collectionSpotlight   | `heading` (required), `subHeading`, `collections` relationship hasMany → `product-collections`, min 1 |
| productRow            | `heading` (required), `subHeading`, `products` hasMany → `products`, min 1 |
| journalFeature        | `heading` (required), `subHeading`, `posts` hasMany → `posts`, min 1 |
| seasonalBanner        | `heading` (required), `body`, `backgroundImage` → `media`, `linkLabel`, `linkHref` |

Access: global read open to all; update staff-only (`isStaff`).

---

## Public read policy

For collections using `staffOrPublished` ([`content.js`](../apps/cms/src/payload/access/content.js)): unauthenticated reads only match `_status === 'published'`. Admin/editor users get full read. `media` uses public read; `homepage` read is open; `users` is admin-restricted.

---

## SEO plugin

Configured in [`payload.config.ts`](../apps/cms/payload.config.ts) for collections: `product-collections`, `products`, `stores`, `services`, `pages`, `posts`. Uploads collection: `media`. Title/description/image/URL fallbacks are defined in plugin config (no duplicate manual meta fields on those collections).
