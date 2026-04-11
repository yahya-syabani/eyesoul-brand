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
| images      | relationship  | hasMany → `media`                   |
| collection  | relationship  | → `product-collections`             |
| Draft/publish | versions    | `drafts: true` (replaces separate `status` field) |

## Stores (`stores`)

| Field      | Type     | Notes                |
| ---------- | -------- | -------------------- |
| name       | text     | Required             |
| slug       | text     | Unique               |
| address    | text     | Multi-line           |
| city       | text     | Optional             |
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

## Public read policy

Unauthenticated `read`: only documents with `_status === 'published'`. Authenticated admin/editor: full read.

## SEO plugin

Collections: `product-collections`, `products`, `stores`, `services`, `pages`. Uploads: `media`. Title/description/image fallbacks defined in plugin config (no duplicate manual meta fields).
