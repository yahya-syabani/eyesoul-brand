# EP-0 Runtime Decision Record (DG-1)

## Decision
- Next.js: `16.x` baseline (`^16.2.2` minimum in this repository)
- Payload CMS: `3.82.1`
- Node.js: `>=20.9.0` (aligned with `@payloadcms/next` engine support)
- TypeScript: `5.4.x` (strict mode enabled)
- Router model: App Router only
- Node package type: `"type": "module"` in `package.json` (required for Lexical + Payload CLI without `ERR_REQUIRE_ASYNC_MODULE` on this stack)

## Compatibility Checkpoint (Mandatory)
- Validate Payload + Next support matrix before feature work:
  - `@payloadcms/next@3.82.1` peer range includes `next >=16.2.2 <17.0.0`
  - Repository baseline has been aligned to `next ^16.2.2`
- If a future dependency update changes the peer range, re-run this checkpoint before proceeding with EP-1+.

## Rationale
- Keeps the project on the requested Next.js 16 major while staying inside Payload's officially supported range.
- Avoids runtime incompatibility risk from using unsupported Next minor versions.

## Consequences
- Upgrading Next below `16.2.2` is disallowed unless Payload support is re-validated.
- Any major upgrade (Next 17 or Payload 4) requires a new decision record.
