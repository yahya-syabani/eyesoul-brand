# EP-1 Schema Contracts (Locked)

Slug rules: lowercase, `[a-z0-9-]+`, auto-normalized from `name` or `title` when slug empty.

## Media (`media`)

| Field        | Type    | Notes                                      |
| ------------ | ------- | ------------------------------------------ |
| alt          | text    | Required                                   |
| (upload)     | upload  | MIME allowlist: image/jpeg, png, webp, gif |
| sizes        | derived | Admin thumbnails via `imageSizes`          |

## Users (`users`)

| Field | Type   | Notes                          |
| ----- | ------ | ------------------------------ |
| role  | select | `admin` \| `editor`            |
| auth  | —      | Payload auth; admin-only CRUD |

## Product collections (`product-collections`)

| Field         | Type     | Notes                    |
| ------------- | -------- | ------------------------ |
| title         | text     | Required                 |
| slug          | text     | Unique, normalized       |
| description   | textarea | Optional                 |
| displayOrder  | number   | Default 0                |
| featured      | checkbox | Default false            |
| coverImage    | upload   | Optional → `media`       |
| Draft/publish | versions | `drafts: true`           |

## Products (`products`)

| Field       | Type          | Notes                               |
| ----------- | ------------- | ----------------------------------- |
| name        | text          | Required                            |
| slug        | text          | Unique, normalized                  |
| description | richText      | Lexical                             |
| price       | number        | Min 0                               |
| availabilityStatus | select | `in-stock` \| `available` (catalog filter) |
| images      | relationship  | hasMany → `media`                   |
| collection  | relationship  | → `product-collections`             |
| specs       | group         | Optional fit/lens measurements, materials, `dimensionDiagram` → `media`, `showSpecsOnPdp` |
| videoUrl    | text          | Optional YouTube/Vimeo URL (validated in admin) |
| videoPoster | upload        | Optional → `media`                  |
| Draft/publish | versions    | `drafts: true` (replaces separate `status` field) |

## Product reviews (`product-reviews`)

| Field       | Type          | Notes                               |
| ----------- | ------------- | ----------------------------------- |
| product     | relationship  | Required → `products`               |
| rating      | number        | 1–5                                  |
| title       | text          | Required                             |
| body        | richText      | Lexical                              |
| authorName  | text          | Required                             |
| verified    | checkbox      | Default false                        |
| Draft/publish | versions    | `drafts: true`                      |

## Homepage global (`homepage`)

| Field    | Type   | Notes                                      |
| -------- | ------ | ------------------------------------------ |
| modules  | blocks | `heroModule`, `collectionSpotlight`, `productRow`, `journalFeature`, `seasonalBanner` |

## Stores (`stores`)

| Field      | Type     | Notes                |
| ---------- | -------- | -------------------- |
| name       | text     | Required             |
| slug       | text     | Unique               |
| address    | text     | Multi-line           |
| city       | text     | Optional             |
| region     | text     | Optional (filtering) |
| phone      | text     | Optional             |
| whatsApp   | text     | Optional (wa.me URL) |
| email      | email    | Optional             |
| mapsUrl    | text     | Optional             |
| latitude   | number   | Optional             |
| longitude  | number   | Optional             |
| hours      | array    | day + open + close   |
| Draft/publish | versions | `drafts: true`    |

## Services (`services`)

| Field         | Type     | Notes              |
| ------------- | -------- | ------------------ |
| name          | text     | Required           |
| slug          | text     | Unique             |
| description   | textarea | Optional           |
| icon          | upload   | Optional → `media` |
| displayOrder  | number   | Default 0          |
| serviceType   | select   | `exam` \| `fitting` \| `adjustments` \| `other` |
| bookingUrl    | text     | Optional external booking link |
| bookingPhone  | text     | Optional when no URL          |
| primaryCtaLabel | text   | Default “Book appointment”     |
| Draft/publish | versions | `drafts: true`   |

## Pages (`pages`)

| Field   | Type    | Notes                              |
| ------- | ------- | ---------------------------------- |
| title   | text    | Required                           |
| slug    | text    | Unique (e.g. `about`, `contact`)   |
| blocks  | blocks  | See block types below              |
| Draft/publish | versions | `drafts: true`               |

### Page block types

| Block slug       | Fields                                      |
| ---------------- | ------------------------------------------- |
| content          | `body` richText (Lexical)                   |
| hero             | `heading`, `subheading`, optional `image`   |
| cta              | `label`, `href`                             |
| faq              | optional `heading`, `items[]` with `question`, `answer` |

## Public read policy

Unauthenticated `read`: only documents with `_status === 'published'`. Authenticated admin/editor: full read.

## SEO plugin

Collections: `product-collections`, `products`, `stores`, `services`, `pages`, `posts`. Uploads: `media`. Title/description/image fallbacks defined in plugin config (no duplicate manual meta fields).
