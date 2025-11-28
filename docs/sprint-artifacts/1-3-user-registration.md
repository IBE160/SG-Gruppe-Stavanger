# Story 1.3: User Registration

Status: ready-for-dev

## Story

As a new user,
I want to create an account with an email and password,
so that I can access the application.

## Acceptance Criteria

1.  **Given** I am on the registration page, **When** I submit the form with a valid email and a password that meets complexity requirements, **Then** an account creation process is initiated.
2.  **Given** the account creation is initiated, **Then** a verification email is dispatched to my email address.
3.  **Given** the account creation is initiated, **Then** a new entry for the user is created in the `auth.users` table in Supabase, initially in an unconfirmed state.
4.  **Given** I click the verification link in the email, **Then** my account is confirmed and I am automatically logged in.

## Tasks / Subtasks

- [ ] Task: Create Registration UI
  - [ ] Create a registration page at `app/(auth)/register/page.tsx`.
  - [ ] Implement a form with fields for email and password.
  - [ ] Add client-side validation for email format and password strength.
- [ ] Task: Implement Registration API Endpoint
  - [ ] Create a Next.js API Route Handler at `app/api/auth/register/route.ts`.
  - [ ] The endpoint should accept `email` and `password` in the request body.
  - [ ] Use the Supabase client (from `lib/supabaseClient.ts`) to call `supabase.auth.signUp()`.
  - [ ] Handle success and error responses from Supabase.
- [ ] Task: Set up Email Verification
  - [ ] Ensure Supabase project is configured to send verification emails. This may involve configuring a custom email provider like Resend if desired (as per `architecture.md`).
  - [ ] Configure the verification email template in Supabase if necessary.
- [ ] Task: Implement Post-Verification Logic
  - [ ] Configure NextAuth.js to handle the user session after they are redirected back from the verification link.
  - [ ] The user should be automatically logged in and redirected to the dashboard (`/dashboard`).

## Dev Notes

- **Relevant architecture patterns and constraints:**
  - Authentication: Use NextAuth.js with Supabase Auth.
  - API Pattern: Implement the registration logic in a Next.js API Route Handler.
  - Utilize the Supabase client created in Story 1.2.
  - Follow the User Registration Flow defined in `tech-spec-epic-1.md`.
- **Source tree components to touch:**
  - `app/(auth)/register/page.tsx` (new file)
  - `app/api/auth/register/route.ts` (new file)
  - Potentially `lib/auth.ts` for NextAuth.js configuration.
- **Testing standards summary:**
  - Unit Tests: Test the registration form component in isolation.
  - Integration Tests: Test the `/api/auth/register` endpoint to ensure it correctly calls Supabase and handles responses.
  - E2E Tests: Simulate the full user registration flow, including the email verification step if possible.

### Project Structure Notes

- **Alignment with unified project structure:** Place the registration page under `app/(auth)/register/` and the API route under `app/api/auth/register/`.

### Learnings from Previous Story

**From Story 1.2 (Database Setup)**

- **New Service Created**: A Supabase client is expected to be available at `lib/supabaseClient.ts`. This should be used for all database interactions.
- **Schema Changes**: The `public.profiles` table linked to `auth.users` was created. User registration will create an entry in `auth.users`, and a corresponding profile can be created.

[Source: docs/sprint-artifacts/1-2-database-setup.md]

### References

- [Source: docs/epics.md#Story-1.3:-User-Registration]
- [Source: docs/PRD.md#FR1.1---User-Registration]
- [Source: docs/architecture.md#Authentication]
- [Source: docs/architecture.md#API-Pattern]
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#User-Registration-Flow-(FR1.1)]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-3-user-registration.context.xml

### Agent Model Used

Gemini (in #yolo mode)

### Debug Log References

### Completion Notes List

### File List

## Change Log

- Initial Draft: 2025-11-28 (BIP)
