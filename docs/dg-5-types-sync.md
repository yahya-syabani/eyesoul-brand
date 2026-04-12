# DG-5 Types Sync Process

The storefront imports types from `src/payload-types.ts`. This file is generated
by the Payload CLI and lives in the CMS app (`apps/cms/src/payload-types.ts`).
Since the storefront has no Payload dependency, it cannot run the generator itself.

**The canonical source of types is `apps/cms/src/payload-types.ts`.**

---

## When to Sync

Sync types any time you:

- Add, rename, or remove a field in a collection
- Add or remove a collection
- Change a relationship target

You do NOT need to sync for access control changes, hook changes, or config-only changes that don't alter the schema shape.

---

## Sync Process

**From the repo root (recommended):** generate in the CMS app and copy to the storefront in one step:

```bash
npm run payload:sync-types
```

**Manual equivalent:**

```bash
# 1. Make your schema change in apps/cms/src/payload/collections/

# 2. Run type generation from inside the CMS app
cd apps/cms
npm run payload:generate-types

# 3. Copy the generated file to the storefront
cp src/payload-types.ts ../../src/payload-types.ts

# 4. Commit both files together
cd ../..
git add apps/cms/src/payload-types.ts src/payload-types.ts
git commit -m "chore: sync payload types after [describe schema change]"
```

---

## Why Not a Shared Package?

A shared npm workspace package (e.g. `packages/cms-types`) would automate this,
but it adds tooling overhead (Turborepo or npm workspaces config, build step for
the types package, version management). For Phase 1 with infrequent schema changes,
the manual copy process is faster to operate and easier to debug.

This can be revisited post-launch if schema changes become frequent.

---

## Verification

After copying, confirm the storefront still builds:

```bash
npm run build
```

TypeScript will surface any type mismatches introduced by the schema change.
