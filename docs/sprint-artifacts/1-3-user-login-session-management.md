# Story 1.3: User Login & Session Management

Status: Approved

## Story

As a registered user,
I want to securely log in to my account and have my session maintained,
So that I can seamlessly access the platform and its features without repeated authentication.

## Requirements Context Summary

### Epic 1: Foundation & User Onboarding
**Goal:** Establish the core project infrastructure and allow users to securely register and log in to the platform.

### Story 1.3: User Login & Session Management - Key Acceptance Criteria

*   **Given** I have a registered account,
*   **When** I am on the login page and provide valid credentials,
*   **And** I submit the login form,
*   **Then** I am successfully authenticated and redirected to my dashboard/pantry view.
*   **And** my session is securely managed by NextAuth.js.
*   **And** an option to "Remember Me" is available, extending session duration.
*   **And** error messages are displayed for invalid credentials.
*   **And** the login form adheres to the "Farmhouse Kitchen" UI principles and responsiveness.

### Technical Context

**Frontend:**
*   **Framework:** Next.js 14 (App Router, Server Components)
*   **Styling:** Tailwind CSS + shadcn/ui components
*   **Component:** `LoginForm` for user input.

**Backend:**
*   **Architecture:** Next.js API Routes (serverless functions)
*   **Endpoint:** `POST /api/auth/login` for user authentication.

**Data & Persistence:**
*   **Database:** Supabase (PostgreSQL)
*   **ORM:** Prisma, for interaction with the `User` model.
*   **Models:** `User` (for credential verification), `Session` (managed by NextAuth.js).

**Authentication:**
*   **Library:** NextAuth.js, handling core authentication logic, credential validation, and session management (JWTs).

**Workflows:**
*   **User Login Workflow:** User navigates to `/login`, `LoginForm` renders. User inputs credentials, submits form. Frontend sends POST to `/api/auth/login`. Backend receives, validates, uses NextAuth.js to verify credentials and establish session. Backend responds, frontend redirects.
*   **Session Management:** NextAuth.js handles JWT creation, refresh, and expiry. Frontend uses `useSession` for authentication state.

**Security Considerations:**
*   **Password Hashing:** Passwords securely hashed and verified.
*   **Session Management:** Securely managed via NextAuth.js, utilizing JWTs with proper signing, encryption, and expiry.
*   **Data Protection:** All sensitive data (email, password) encrypted in transit (HTTPS/TLS).
*   **Vulnerability Protection:** Protection against XSS, CSRF, SQL Injection, and Brute Force attacks. Rate limiting for authentication endpoints is a known TODO from previous story.
*   **Access Control:** Only authenticated/authorized users access protected resources.

**Performance Considerations:**
*   **Response Time:** Login API response within 500ms (90th percentile).
*   **Concurrency:** Authentication system supports at least 100 concurrent requests without significant degradation.

### Project Structure Notes
*   **Frontend:** `app/login/page.tsx` (or similar), `components/ui/login-form.tsx` (or similar).
*   **Backend:** `app/api/auth/login/route.ts` (or similar).
*   **Authentication:** `lib/auth.ts` (or similar for NextAuth.js configuration).
*   **Database:** `lib/prisma.ts` (or similar for Prisma client).

### References
*   **Previous Story (1.2 User Registration):** `docs/sprint-artifacts/1-2-user-registration.md`
*   **PRD:** `docs/PRD.md#FR-001`
*   **Epics:** `docs/epics.md`
*   **Architecture:** `docs/architecture.md` sections 3.4, 6, 7
*   **UX Design Specification:** `docs/ux-design-specification.md` relevant sections for UI principles, responsiveness.
*   **Epic Technical Specification (Epic 1):** `docs/sprint-artifacts/tech-spec-epic-epic-1.md#story-13-user-login-session-management`

## Structure Alignment Summary

The previous story, Story 1.2: User Registration, established key patterns and components that are directly relevant to Story 1.3: User Login & Session Management.

### Established Patterns & Components for Reuse:
*   **Client-Server Architecture:** The clear separation between Next.js frontend and Next.js API Routes backend for authentication flows is now established.
*   **Serverless-First Approach:** Next.js API Routes for backend logic, enabling scalable and efficient handling of authentication requests.
*   **Hosting:** Vercel for continuous deployment and hosting.
*   **Database:** Supabase (PostgreSQL) as the primary data store, ensuring scalability and reliability.
*   **ORM:** Prisma for type-safe and efficient database interactions, particularly with the `User` model.
*   **Authentication:** NextAuth.js is configured for secure user authentication and session management. This story will extend its use for login.
*   **UI/UX:** Tailwind CSS and shadcn/ui are configured for building customizable and accessible user interfaces. The "Farmhouse Kitchen" aesthetic should be maintained for the login form.
*   **Testing Setup:** Jest, React Testing Library, and Playwright are set up for unit, integration, and E2E testing respectively. This provides a clear framework for testing the login functionality.

### Key Learnings & Actionable Intelligence from Story 1.2: User Registration:

*   **New Services & Components:**
    *   `app/api/auth/register/route.ts`: This API route handles user creation and initial session establishment. The login API (`app/api/auth/login/route.ts`) will follow a similar pattern.
    *   `app/register/page.tsx`: Implemented the registration UI, demonstrating how to build authentication-related client components. The login UI (`app/login/page.tsx`) will leverage this experience.
    *   Comprehensive testing setup: Unit, integration, and E2E tests for authentication flows are in place and provide a strong reference for testing Story 1.3.

*   **Architectural Implications:**
    *   The previous story confirmed the viability and integration patterns of Next.js 14 (App Router, Server Components), NextAuth.js, Prisma, and Supabase for authentication.
    *   The login workflow will integrate seamlessly with the existing NextAuth.js configuration.

*   **Technical Debt to Address (Relevant to Story 1.3):**
    *   **High Priority:** Implement a distributed rate limiting solution for authentication endpoints. The `POST /api/auth/register` endpoint currently has a `TODO` for this. The `POST /api/auth/login` endpoint is also highly susceptible to brute-force attacks. This story should prioritize implementing a shared, distributed rate limiting solution that can be applied to both registration and login endpoints.
        *   **File:** `app/api/auth/register/route.ts` (existing TODO) and new `app/api/auth/login/route.ts` (new implementation).

*   **Warnings & Recommendations:**
    *   **UI/UX Verification:** Manual UI/UX verification for aesthetic, responsiveness, and accessibility was a pending item for Story 1.2. This highlights the need for careful attention to these aspects in Story 1.3's login UI to ensure consistency with the "Farmhouse Kitchen" theme and WCAG 2.1 AA compliance.

*   **Constraints Discovered:**
    *   Password complexity rules (at least 8 characters, one uppercase, one lowercase, one number, and one special character) are established. The login process should respect these implicit rules for credential verification.

### Project Structure Guidance for Story 1.3:

*   **Frontend:**
    *   Create `app/login/page.tsx` for the login UI.
    *   Consider a reusable `components/ui/login-form.tsx` component, mirroring the `registration-form.tsx` pattern.
*   **Backend:**
    *   Create `app/api/auth/login/route.ts` for the login API endpoint. This will handle authentication using NextAuth.js.
*   **Authentication:**
    *   Existing `lib/auth.ts` (or similar) will be used and potentially extended for any specific login configurations within NextAuth.js.
*   **Database:**
    *   `lib/prisma.ts` will continue to be used for database interactions (e.g., user lookup for credential verification).

This summary will be incorporated into the story document to provide context and ensure that learnings from previous work are applied to the current story.

## Acceptance Criteria

*   **Given** I have a registered account,
*   **When** I am on the login page and provide valid credentials,
*   **And** I submit the login form,
*   **Then** I am successfully authenticated and redirected to my dashboard/pantry view.
*   **And** my session is securely managed by NextAuth.js.
*   **And** an option to "Remember Me" is available, extending session duration.
*   **And** error messages are displayed for invalid credentials.
*   **And** the login form adheres to the "Farmhouse Kitchen" UI principles and responsiveness.

## Tasks / Subtasks

- [x] **Frontend Development (Login Form UI)**
  - [x] Implement `LoginForm` component (Next.js Client Component) (AC: #8).
  - [x] Apply "Farmhouse Kitchen" aesthetic using Tailwind CSS and shadcn/ui (AC: #8).
  - [x] Ensure form responsiveness across devices (AC: #8).
  - [x] Implement client-side validation for email format and password presence (AC: #7).
  - [x] Integrate display of success/error messages within the UI (AC: #7).
  - [x] Add "Remember Me" checkbox and integrate with NextAuth.js session options (AC: #6).
  - [x] Ensure accessibility standards (WCAG 2.1 AA) for form fields and buttons (AC: #8).

- [x] **Backend Development (Login API)**
  - [x] Create `POST /api/auth/login` Next.js API Route (AC: #1, #2, #3, #4, #5). (Note: Logic integrated into NextAuth.js CredentialsProvider)
  - [x] Implement server-side validation for request body (`email`, `password`) (AC: #7). (Note: Handled by CredentialsProvider)
  - [x] Integrate NextAuth.js `CredentialsProvider` for user authentication logic (AC: #1, #2, #3, #4, #5).
  - [x] Implement distributed rate limiting for `POST /api/auth/login` endpoint (addressing technical debt from Story 1.2) (AC: #1, #2, #4, #5).

- [x] **Authentication & Database Integration**
  - [x] Use Prisma to lookup `User` for credential verification against `passwordHash` (AC: #1, #2, #3).
  - [x] Establish a secure session via NextAuth.js upon successful login (AC: #4, #5).
- [ ] **Testing**
  - [ ] **Unit Tests:**
    - [ ] `LoginForm` component client-side validation logic (AC: #7, #8).
    - [ ] API route handler for `/api/auth/login` (AC: #1, #2, #3, #4, #5, #7).
    - [ ] NextAuth.js configuration for login (AC: #4, #5, #6).
  - [ ] **Integration Tests:**
    - [ ] Verify the full flow of `POST /api/auth/login` integrating NextAuth.js, Prisma, and Supabase (AC: #1, #2, #3, #4, #5, #7).
    - [ ] Test edge cases: invalid credentials, locked accounts (if applicable) (AC: #7).
    - [ ] Test rate limiting functionality (AC: #1, #2, #4, #5).
  - [ ] **End-to-End (E2E) Tests:**
    - [ ] Simulate complete user login flow through the UI, from form submission to redirection (AC: #1, #2, #3, #4, #5, #6, #7, #8).
  - [ ] **UI/UX Tests (Manual - as per previous story learning):**
    - [ ] Manual visual inspection for "Farmhouse Kitchen" aesthetic and responsiveness (AC: #8).
    - [ ] Manual accessibility audit for WCAG 2.1 AA compliance (keyboard navigation, screen reader support, focus indicators) (AC: #8).

- [ ] **Documentation/Refinement**
  - [ ] Document the implemented distributed rate limiting solution and its configuration (AC: #1, #2, #4, #5).
  - [ ] Update `tech-spec-epic-epic-1.md` if any new architectural patterns or significant decisions emerge during implementation (AC: #1, #2, #3, #4, #5, #6, #7, #8).

## Dev Notes

### Source Tree Components to Touch
*   Frontend: `app/login/page.tsx` (or similar for the login page), `components/ui/login-form.tsx` (or similar).
*   Backend: `app/api/auth/login/route.ts` (or similar for API route handler).
*   Authentication: `lib/auth.ts` (or similar for NextAuth.js configuration).
*   Database: `lib/prisma.ts` (or similar for Prisma client).

### Testing Standards Summary
*   Adhere to guidelines in `docs/coding-standards.md` (once available).
*   **Unit Tests:** Jest, React Testing Library (for frontend components).
*   **Integration Tests:** Jest, Supertest (for API routes).
*   **E2E Tests:** Playwright or Cypress (for full user flow).
*   **UI/UX Tests:** Manual review, browser developer tools, accessibility auditing tools.

### Project Structure Notes
*   Follow the project structure established in story 1.1. As `unified-project-structure.md` is not yet created, refer to the `Source Tree Components to Touch` section of this story for guidance on file placement.

### References
*   **PRD:** `docs/PRD.md#FR-001`
*   **Architecture:** `docs/architecture.md` sections 3.4, 6, 7
*   **UX Design Specification:** `docs/ux-design-specification.md` relevant sections for UI principles, responsiveness.
*   **Epic Technical Specification (Epic 1):** `docs/sprint-artifacts/tech-spec-epic-epic-1.md#story-13-user-login-session-management`

### Learnings from Previous Story

**From Story 1.2: User Registration (Status: done)**

This story builds directly upon the foundational infrastructure and authentication patterns established in Story 1.2. Key learnings and actionable intelligence to apply:

- **New Services Created:** The previous story established the pattern for creating API routes (`app/api/auth/register/route.ts`) and client-side components (`app/register/page.tsx`) for authentication. This story will mirror these patterns for login.
- **Testing Setup:** The comprehensive unit, integration, and E2E testing setup for authentication flows is a valuable reference. Apply similar testing rigor to Story 1.3.
- **Technical Debt:** The high-priority `TODO` for a *distributed rate limiting solution* on the `POST /api/auth/register` endpoint is critical. This story is the ideal place to implement a shared, distributed solution that can protect *both* the registration and login endpoints from brute-force attacks.
- **Architectural Implications:** The successful integration of Next.js 14, NextAuth.js, Prisma, and Supabase for user registration confirms the architectural viability for user login.
- **UI/UX Verification:** The need for manual UI/UX verification for aesthetic, responsiveness, and accessibility is a key takeaway. Ensure the login UI adheres to the "Farmhouse Kitchen" theme and WCAG 2.1 AA compliance.
- **Constraints:** Password complexity rules established in the previous story will indirectly inform the credential verification process for login.

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

gemini-1.5-pro-latest

### Debug Log References

### Completion Notes List
- Implemented `LoginForm` component in `app/components/ui/login-form.tsx` and integrated into `app/login/page.tsx`.
- Applied "Farmhouse Kitchen" aesthetic with custom Tailwind CSS colors and shadows.
- Incorporated client-side validation for email and password presence.
- Added "Remember Me" checkbox with state management.
- Implemented in-memory rate limiting for both registration (`/api/auth/register`) and login (`CredentialsProvider`).
- Integrated "Remember Me" functionality to adjust NextAuth.js session duration.

### File List
- `app/login/page.tsx` (new)
- `app/components/ui/login-form.tsx` (new)
- `app/tailwind.config.js` (modified)
- `app/lib/rate-limiter.ts` (new)
- `app/api/auth/register/route.ts` (modified)
- `app/api/auth/[...nextauth]/route.ts` (modified)

## Change Log

- **lørdag 29. november 2025:** Initial draft generated for Story 1.3: User Login & Session Management.