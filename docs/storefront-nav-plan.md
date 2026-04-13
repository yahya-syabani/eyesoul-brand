# Storefront Navigation Plan

> Project: Eyesoul brand storefront
> Date: 2026-04-13
> Status: Draft for execution

## 1) Purpose

Define a practical, phased plan to stabilize, simplify, and improve storefront navigation across the current hybrid architecture (brand + legacy template) while keeping launch readiness and Phase-1 scope intact.

## 2) Scope

### In scope

- Header, footer, mobile, and sidebar navigation systems
- Route-to-link integrity and navigation correctness
- Information architecture (IA), UX consistency, and accessibility for navigation
- Navigation testing and release governance

### Out of scope

- Ecommerce checkout redesign
- Authentication/account product redesign
- CMS model redesign beyond nav-readiness preparation

## 3) Current Architecture Snapshot

## Active systems

- Brand navigation stack:
  - `src/components/brand/BrandShell.tsx`
  - `src/components/brand/BrandHeader.tsx`
  - `src/components/brand/BrandFooter.tsx`
  - Active route group: `src/app/(brand)/`
- Legacy template navigation stack:
  - `src/components/Header/Header.tsx`
  - `src/components/Header/Header2.tsx`
  - `src/components/Header/Navigation/Navigation.tsx`
  - `src/components/Header/Navigation/SidebarNavigation.tsx`
  - Nav data source: `src/data/navigation.ts`
  - Active route groups: `src/app/(shop)/`, `src/app/(accounts)/`

## Known structural reality

- The codebase intentionally runs both nav systems during transition.
- Brand nav is aligned to Phase-1 brand routes.
- Legacy nav still contains stale or non-Phase-1 link targets.

## 4) Gap Analysis

## Correctness gaps (Fix)

- Stale links in legacy nav data (examples observed):
  - `/collections/all`
  - `/collections/page-style-2/all`
  - `/forgot-pass`
- Legacy menu includes flows that conflict with current Phase-1 scope focus.
- Parent-link active states are not standardized for nested/dynamic routes.

## Product/UX gaps (Add)

- No documented navigation ownership and approval workflow.
- No formal route-to-nav contract to prevent drift.
- No explicit IA policy for primary vs secondary vs utility links.

## Quality gaps (Enhance)

- Mixed component patterns between brand and legacy nav systems.
- Incomplete navigation-specific analytics taxonomy.
- Missing repeatable navigation QA matrix across breakpoints and layouts.

## 5) Target Navigation Principles

- Single source of truth per active navigation system.
- Every user-facing nav link must map to a valid route or valid external URL.
- Brand storefront routes are primary; legacy routes are compatibility-only until decommission.
- Navigation behavior must be consistent across desktop and mobile.
- Accessibility and keyboard behavior are non-negotiable acceptance criteria.

## 6) Workstreams and Backlog

## Workstream A: Fix (P0)

### SF-NAV-001 Link integrity audit and cleanup

- Type: Fix
- Problem: Legacy nav data includes stale/non-existing routes.
- Proposed change: Audit all nav links, replace or remove invalid paths, and document final mapping.
- Definition of done:
  - 100 percent of nav links resolve to valid route or valid external URL.
  - No broken links in desktop, mobile, and sidebar navigation.

### SF-NAV-002 Scope alignment cleanup

- Type: Fix
- Problem: Navigation exposes routes not aligned with current brand phase intent.
- Proposed change: Mark nav entries as `active`, `legacy`, or `remove`.
- Definition of done:
  - Approved list of allowed user-facing nav entries by route group.
  - Deprecated entries documented with migration path or removal date.

### SF-NAV-003 Active-state behavior standard

- Type: Fix
- Problem: Active states are inconsistent for nested paths.
- Proposed change: Define exact-match and section-match rules.
- Definition of done:
  - Active states correctly represent section context for dynamic pages.
  - Documented exceptions (if any).

## Workstream B: Add (P1)

### SF-NAV-004 Navigation governance

- Type: Add
- Problem: No formal control for nav changes.
- Proposed change: Define owners, approval process, and release checklist for nav updates.
- Definition of done:
  - Owner and reviewer roles assigned.
  - Nav change checklist used in PR reviews.

### SF-NAV-005 Route-to-navigation contract

- Type: Add
- Problem: No canonical mapping between routes and nav entries.
- Proposed change: Maintain a table for all nav surfaces.
- Definition of done:
  - Contract table includes label, href, route existence, surface, status, owner.
  - Contract reviewed every release cycle.

### SF-NAV-006 IA spec for storefront

- Type: Add
- Problem: Information architecture is implicit, not documented.
- Proposed change: Document primary nav, secondary nav, utility links, and footer intent.
- Definition of done:
  - IA spec published with rationale and max-depth rules.
  - Mobile hierarchy mirrors approved IA.

## Workstream C: Enhance (P1/P2)

### SF-NAV-007 Nav analytics taxonomy

- Type: Enhance
- Problem: No consistent event naming for nav interactions.
- Proposed change: Add taxonomy for click events by surface and depth.
- Definition of done:
  - Event schema approved.
  - Tracking validation checklist exists for staging.

### SF-NAV-008 Accessibility hardening

- Type: Enhance
- Problem: Accessibility criteria are not centrally documented at nav level.
- Proposed change: Define keyboard, focus, aria, and touch-target standards.
- Definition of done:
  - Navigation a11y checklist passes across all nav surfaces.
  - Known exceptions logged and approved.

### SF-NAV-009 Legacy nav decommission strategy

- Type: Enhance
- Problem: Dual systems increase maintenance and risk.
- Proposed change: Establish phased retirement criteria for legacy nav stack.
- Definition of done:
  - Exit criteria defined (traffic, route parity, QA parity).
  - Decommission plan accepted with milestone/date.

## 7) Route-to-Nav Contract Template

Use this structure for the living contract table:

| Surface | Label | Href | Type | Route Exists | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| brand-header | Catalog | `/catalog` | internal | yes | active | Web | Phase-1 primary |
| legacy-sidebar | Forgot Password | `/forgot-pass` | internal | no | remove | Web | Replace with `/forgot-password` if retained |

Status values:

- `active`: user-facing and supported
- `legacy`: temporary compatibility
- `remove`: scheduled for deletion/replacement

## 7.1) Baseline Route-to-Nav Contract (Current Codebase)

This baseline is generated from:

- Brand nav source: `src/components/brand/BrandShell.tsx`
- Legacy nav source: `src/data/navigation.ts`
- Existing pages under: `src/app/(brand)`, `src/app/(shop)`, and `src/app/(accounts)`

### Brand navigation inventory

| Surface | Label | Href | Type | Route Exists | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| brand-header | Home | `/` | internal | yes | active | Web | Primary brand entry |
| brand-header | Catalog | `/catalog` | internal | yes | active | Web | Catalog landing |
| brand-header | Collections | `/collections` | internal | yes | active | Web | Collection listing |
| brand-header | Stores | `/stores` | internal | yes | active | Web | Store finder |
| brand-header | Services | `/services` | internal | yes | active | Web | Services page |
| brand-header | About | `/about` | internal | yes | active | Web | Brand story |
| brand-header | Contact | `/contact` | internal | yes | active | Web | Contact page |
| brand-footer | Home | `/` | internal | yes | active | Web | Mirrors header |
| brand-footer | Catalog | `/catalog` | internal | yes | active | Web | Mirrors header |
| brand-footer | Collections | `/collections` | internal | yes | active | Web | Mirrors header |
| brand-footer | Stores | `/stores` | internal | yes | active | Web | Mirrors header |
| brand-footer | Services | `/services` | internal | yes | active | Web | Mirrors header |
| brand-footer | About | `/about` | internal | yes | active | Web | Mirrors header |
| brand-footer | Contact | `/contact` | internal | yes | active | Web | Mirrors header |

### Legacy navigation inventory (unique href baseline)

| Surface | Label (example) | Href | Type | Route Exists | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| legacy-desktop/mobile | Home | `/` | internal | yes | legacy | Web | Keep only while legacy routes remain |
| legacy-desktop/mobile | Collections | `/collections` | internal | yes | legacy | Web | Normalized from legacy collection links |
| legacy-desktop/mobile | Product 1 | `/products/leather-tote-bag` | internal | pattern only | legacy | Web | Works only if slug exists in CMS |
| legacy-desktop/mobile | Catalog | `/catalog` | internal | yes | legacy | Web | Added for transition to brand IA |
| legacy-desktop/mobile | Stores | `/stores` | internal | yes | legacy | Web | Added for transition to brand IA |
| legacy-desktop/mobile | Services | `/services` | internal | yes | legacy | Web | Added for transition to brand IA |
| legacy-desktop/mobile | Search | `/search` | internal | yes | legacy | Web | Route exists under shop group |
| legacy-desktop/mobile | Cart | `/cart` | internal | yes | legacy | Web | Legacy ecommerce surface |
| legacy-desktop/mobile | Checkout | `/checkout` | internal | yes | legacy | Web | Legacy ecommerce surface |
| legacy-desktop/mobile | Orders | `/orders` | internal | yes | legacy | Web | Legacy/account surface |
| legacy-desktop/mobile | Account | `/account` | internal | yes | legacy | Web | Legacy/account surface |
| legacy-desktop/mobile | Blog | `/blog` | internal | yes | legacy | Web | Legacy content surface |
| legacy-desktop/mobile | About | `/about` | internal | yes | legacy | Web | Duplicate with brand route |
| legacy-desktop/mobile | Contact | `/contact` | internal | yes | legacy | Web | Duplicate with brand route |
| legacy-desktop/mobile | Login | `/login` | internal | yes | legacy | Web | Legacy/auth surface |
| legacy-desktop/mobile | Signup | `/signup` | internal | yes | legacy | Web | Legacy/auth surface |
| legacy-desktop/mobile | Forgot Password | `/forgot-password` | internal | yes | legacy | Web | Valid auth route |
| legacy-desktop/mobile | Subscription | `/subscription` | internal | yes | legacy | Web | Legacy flow |
| legacy-desktop/mobile | Support | `/contact` | internal | yes | legacy | Web | Support menu now points to real routes |

## 7.2) Active-State Rules (Approved Standard)

Apply these rules consistently across brand and legacy nav:

1. `exact` rule: mark active when `pathname === href`.
2. `section` rule: mark active when `pathname` starts with `href + '/'` for section roots (example: `/catalog` should be active on `/catalog/[slug]`).
3. Root exception: `/` only matches exact `/`, never all paths.
4. Ignore anchors/placeholders (`#`, `/#`, `/#something`) for active states.
5. For dynamic detail pages, primary section tab should be active (catalog, collections, products, blog).

Reference surfaces:

- Brand: `src/components/brand/BrandHeader.tsx`
- Legacy desktop: `src/components/Header/Navigation/Navigation.tsx`
- Legacy sidebar/mobile: `src/components/Header/Navigation/SidebarNavigation.tsx`

## 7.3) IA Policy (Primary / Secondary / Utility)

- Primary navigation (brand): `Home`, `Catalog`, `Collections`, `Stores`, `Services`, `About`, `Contact`.
- Secondary navigation: section-level filters/sorting/tabs within a page, not in global header.
- Utility navigation: auth/account/cart/search links remain legacy-only until Phase-2 ecommerce scope.
- Footer navigation mirrors primary brand links unless a business/legal utility link is explicitly approved.
- Maximum depth:
  - Brand primary: one level (no dropdown nesting).
  - Legacy: up to 3 levels while in compatibility mode; no new deep links allowed.

## 8) Acceptance Criteria

## Correctness

- No broken internal nav links.
- External URLs are normalized and valid.
- No orphaned primary navigation items.

## UX consistency

- Same conceptual IA across desktop/mobile for each active system.
- Active-state behavior is predictable and documented.

## Accessibility

- Keyboard-only navigation works for all menus.
- Focus-visible states are present and pass contrast requirements.
- Mobile menu controls expose correct ARIA states.

## Release quality

- Navigation checks included in smoke tests.
- Route-to-nav contract updated in every nav-related PR.

## 8.1) Governance and Change Control

### Owners

- Product owner: approves labels, ordering, and IA changes.
- Engineering owner: validates route integrity and implementation behavior.
- QA owner: validates regression matrix and accessibility checks.

### Required PR checklist for nav changes

- Contract table updated in this document.
- Every changed href is route-validated.
- Active-state behavior verified for desktop and mobile.
- Keyboard/focus behavior checked for affected nav surfaces.
- Analytics event mappings updated (if interaction points changed).

### Release cadence

- Weekly review: backlog, stale links, decommission readiness.
- Per-release gate: nav smoke checks + contract verification required.

## 8.2) Navigation QA Matrix and Smoke Checklist

### QA matrix dimensions

- Breakpoints: mobile, tablet, desktop.
- Themes: light and dark.
- Nav surfaces: brand header, brand footer, legacy desktop nav, legacy sidebar nav.
- Input modes: mouse, touch, keyboard-only.

### Smoke checklist (minimum)

- Primary brand links navigate correctly.
- Legacy menu opens/closes without trapping focus.
- Sidebar menu closes after link click.
- No placeholder links remain user-facing.
- No 404 from user-facing nav clicks.

## 8.3) Navigation Accessibility Checklist

- All menu toggles expose correct `aria-expanded` and `aria-controls`.
- Focus-visible is visible on all interactive nav elements.
- Escape and click-out behaviors are predictable for overlays/popovers.
- Tab order is logical and returns to trigger after close.
- Touch targets meet minimum size guidance.
- Skip link remains functional to main content.

## 8.4) Navigation Analytics Taxonomy

Standardize events as:

- `nav_click_primary`
- `nav_click_footer`
- `nav_click_legacy_desktop`
- `nav_click_legacy_sidebar`
- `nav_toggle_mobile_menu`
- `nav_open_dropdown`

Required event properties:

- `label`
- `href`
- `surface` (`brand-header`, `brand-footer`, `legacy-desktop`, `legacy-sidebar`)
- `depth` (0, 1, 2+)
- `status` (`active`, `legacy`)
- `pathname`

## 9) Execution Plan

### Phase 1 (Week 1): Stabilize

- Complete link audit and classify all entries.
- Remove/replace invalid links.
- Freeze nav changes until contract table is baselined.

### Phase 2 (Week 2): Standardize

- Implement governance process and IA specification.
- Finalize active-state rules and publish examples.

### Phase 3 (Week 3): Harden

- Add analytics taxonomy and validation checklist.
- Complete nav accessibility hardening checks.

### Phase 4 (Week 4+): Simplify

- Decide and execute legacy nav decommission milestones.
- Keep compatibility layers only where traffic or dependencies require.

## 9.1) Legacy Nav Decommission Gates and Rollout

### Entry gates (must all pass)

1. Route parity confirmed for all required user journeys on brand nav.
2. No required traffic dependency on legacy-only links for two consecutive release cycles.
3. Navigation QA matrix passes on brand-only path.
4. Rollback path documented and tested.

### Decommission sequence

1. Remove `remove` status links from `src/data/navigation.ts`.
2. Hide legacy-only flows from desktop and sidebar menus.
3. Keep compatibility routes without nav exposure for one stabilization cycle.
4. Retire legacy nav components from active layouts:
   - `src/components/Header/Header.tsx`
   - `src/components/Header/Header2.tsx`
   - `src/components/Header/Navigation/Navigation.tsx`
   - `src/components/Header/Navigation/SidebarNavigation.tsx`
5. Final cleanup: remove dead code paths and update docs/contracts.

### Rollback policy

- If nav-related conversion or critical route KPIs regress beyond threshold, re-enable the previous menu config from the last tagged release and re-run smoke tests before reattempt.

## 10) Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Legacy links regress after updates | High | Enforce route-to-nav contract in review |
| Brand/legacy parity confusion | Medium | Explicit status tags (`active`, `legacy`, `remove`) |
| Accessibility regressions in mobile menus | Medium | Add nav-specific keyboard/a11y smoke checks |
| Delayed decommission due to hidden dependencies | Medium | Track dependency owners and traffic before removal |

## 11) Ownership and Cadence

- Product owner: approves IA and user-facing label changes.
- Engineering owner: maintains nav contract and enforces link validity.
- QA owner: validates navigation matrix before release.
- Review cadence:
  - Weekly: backlog progress and risk review
  - Per release: contract verification + smoke results

## 12) Immediate Next Actions

- Run nav smoke tests in a DB-ready environment and record pass/fail evidence.
- Expand E2E coverage to include legacy desktop + sidebar deep-link flows.
- Sync this contract table with any future `src/data/navigation.ts` updates in the same PR.
- Start decommission gate tracking with owners and target milestone.
