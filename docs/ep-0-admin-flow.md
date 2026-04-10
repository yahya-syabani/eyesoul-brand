# EP-0 Admin Route and Initial User Flow

## Route Baseline
- Payload admin is mounted at `/admin`.
- Payload API is mounted at `/api`.
- GraphQL endpoints are mounted at `/api/graphql` and `/api/graphql-playground`.

## First Admin Creation
1. Start local services and app (`docker compose up -d`, then `npm run dev`).
2. Open `http://localhost:3000/admin`.
3. On first boot, Payload shows the create-first-user screen.
4. Create the initial admin account (email + password).
5. Confirm access to the admin dashboard after login.

## Role Assignment Rule
- Initial user receives admin-level access because there are no existing users.
- Additional user management and refined role controls continue in EP-1 (`Users` schema hardening).

## Verification Checklist
- `/admin` resolves without runtime errors.
- First user creation screen appears on clean DB.
- Login redirects into dashboard.
- Users and Media collections are visible in admin navigation.
