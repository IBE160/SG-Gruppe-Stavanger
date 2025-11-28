# Epic Technical Specification: Foundation & Core Setup

Date: 2025-11-28
Author: BIP
Epic ID: 1
Status: Draft

---

## Overview

This epic establishes the foundational technical infrastructure for the `ibe160` application. It covers the initialization of the Next.js project, the setup of the Supabase PostgreSQL database, and the implementation of core user authentication features (registration, login, logout) using NextAuth.js. This work serves as the bedrock upon which all subsequent application features will be built, directly supporting the project's goal of creating an intelligent kitchen assistant.

## Objectives and Scope

**In Scope:**
- Initializing the Next.js project (`ibe160-app`) using `npx create-next-app` with TypeScript, Tailwind CSS, ESLint, and the App Router.
- Establishing the complete project folder structure as defined in `architecture.md`.
- Setting up the Supabase project, including the PostgreSQL database schema required for user management.
- Implementing user registration with email verification (FR1.1).
- Implementing user login with email and password (FR1.2).
- Implementing user logout functionality (FR1.3).
- Creating the main application shell and root layout (`layout.tsx`) for a consistent user interface.

**Out of Scope:**
- Any features related to inventory management (Epic 2).
- Any features related to recipe discovery or suggestions (Epic 3 & 4).
- User onboarding flows, which are designated as Post-MVP (FR1.4).
- User profile management beyond basic authentication.

## System Architecture Alignment

The work in this epic directly implements the foundational decisions documented in `architecture.md`. It involves initializing the project with the specified stack (Next.js, TypeScript, Tailwind CSS), setting up the Supabase PostgreSQL database, and integrating NextAuth.js with Supabase Auth for authentication. All implementation will adhere strictly to the defined project structure, naming conventions (`kebab-case` for files, `PascalCase` for components, etc.), and communication patterns to ensure a consistent and maintainable codebase from the start.

## Detailed Design

### Services and Modules

| Service/Module | Responsibilities | Inputs/Outputs | Owner |
|---|---|---|---|
| **Next.js Application** | Render UI, manage client-side state, and host API routes. | N/A | Dev Team |
| **NextAuth.js** | Handle all user authentication logic including registration, login, logout, and session management. | User credentials | Dev Team |
| **Supabase Client (`lib/db.ts`)** | Provide a singleton client for interacting with the Supabase backend (database and auth). | Supabase URL & anon key | Dev Team |
| **Resend Client** | Send transactional emails, primarily the account verification email upon registration. | Email address, content | Dev Team |

### Data Models and Contracts

This epic establishes the core `users` entity, which is managed by Supabase Authentication. A corresponding `profiles` table will be created for public user data that can be safely read by other users if needed in the future (though not required for Epic 1).

**`auth.users` (managed by Supabase)**
```sql
-- This table is managed by Supabase Auth and contains sensitive user data.
-- We interact with it via the Supabase client.
(
  id uuid primary key,
  email varchar,
  encrypted_password varchar,
  ...other auth-related fields
)
```

**`public.profiles` (to be created)**
```sql
-- This table stores public-safe user data and is linked to the auth.users table.
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at timestamptz,
  username text UNIQUE,
  full_name text,
  avatar_url text,

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);
```
*For Epic 1, only the `id` field linking to `auth.users` is strictly necessary.*

### APIs and Interfaces

All authentication APIs are provided and managed by NextAuth.js via its route handler.

| Method | Path | Description | Request Body | Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | User registration. Logic will be custom to handle Supabase sign-up. | `{ email, password }` | `{ success: true }` or `{ error: "..." }` |
| POST | `/api/auth/login` | User login. Handled by NextAuth.js credentials provider. | `{ email, password }` | Session cookie, redirect |
| POST | `/api/auth/logout` | User logout. Handled by NextAuth.js. | (None) | Clears session cookie, redirect |

### Workflows and Sequencing

**1. User Registration Flow (FR1.1):**
1.  **Frontend:** User navigates to `/register`, fills in the email and password form, and submits.
2.  **Backend:** The form submission calls a Server Action that uses the Supabase client to `supabase.auth.signUp()`.
3.  **Email:** Supabase sends a confirmation email to the user's provided address using its built-in email provider.
4.  **Confirmation:** The user clicks the verification link in the email, which confirms their account in Supabase.
5.  **Frontend:** The user is redirected to the login page with a "Verification successful" message.

**2. User Login Flow (FR1.2):**
1.  **Frontend:** User navigates to `/login`, enters their credentials, and submits.
2.  **Backend:** The request is handled by the NextAuth.js `[...nextauth]` route handler.
3.  **Authentication:** The `CredentialsProvider` in NextAuth.js calls `supabase.auth.signInWithPassword()` to validate the credentials against the Supabase `auth.users` table.
4.  **Session:** Upon successful validation, NextAuth.js creates a session and returns a secure session cookie to the client.
5.  **Frontend:** The user is redirected to the main application dashboard (`/dashboard`).

## Non-Functional Requirements

### Performance

- **API Response Time:** All authentication-related API endpoints (e.g., login, registration) must respond in under 500ms.
- **Page Load Speed:** The login and registration pages must achieve a Google Lighthouse Performance score of over 90.

### Security

- **Authentication:** All authentication and session management will be handled by NextAuth.js, leveraging the security features of Supabase Auth.
- **Data Privacy:** Passwords will be securely hashed by Supabase Auth. No sensitive user data will be stored client-side.
- **Access Control:** Row Level Security (RLS) policies will be enabled by default on all tables holding user data (e.g., `profiles`), ensuring users can only access their own information.
- **Transport Security:** All communication between the client, Next.js server, and Supabase will be over HTTPS.

### Reliability/Availability

- **Service Uptime:** Core authentication functionality is dependent on Supabase Auth uptime, which has a target of >=99.9%.
- **Error Handling:** The application will handle authentication errors (e.g., incorrect password, network failure) gracefully and display clear, user-friendly messages without exposing sensitive system details.

### Observability

- **Logging:** All server-side authentication actions (e.g., successful login, failed login attempt, registration) will be logged with a structured format (e.g., using Pino or Winston) to provide a clear audit trail and aid in debugging.
- **Client-Side Monitoring:** During development, client-side errors will be logged to the browser console. For production, a tool like Sentry will be integrated (as per architectural patterns).

## Dependencies and Integrations

As the project has not yet been initialized (see Story 1.1), a `package.json` file does not exist. This section outlines the planned dependencies and integrations for this epic based on the architecture document.

### Key NPM Packages
- **`next`**: Core Next.js framework.
- **`react`, `react-dom`**: UI library.
- **`typescript`**: Language superset for type safety.
- **`tailwindcss`**: Utility-first CSS framework.
- **`next-auth`**: Authentication library for session management.
- **`@supabase/supabase-js`**: Official client library for interacting with the Supabase backend.
- **`resend`**: Client library for the Resend email API.
- **`shadcn-ui`, `lucide-react`**: UI component library and icon set.

### External Service Integrations
- **Supabase:** Provides the core backend services for PostgreSQL database, authentication, and background jobs.
- **Resend:** Used for sending transactional emails, such as account verification messages.

## Acceptance Criteria (Authoritative)

### Story 1.1: Project Initialization
- **AC1:** A new Next.js project is created using the command `npx create-next-app@latest ibe160-app --typescript --tailwind --eslint --app`.
- **AC2:** The generated project correctly includes configurations for TypeScript, Tailwind CSS, ESLint, and the App Router.
- **AC3:** The project's folder structure is manually created to match the structure defined in `architecture.md`.

### Story 1.2: Database Setup
- **AC1:** The Next.js application can successfully establish a connection to the designated Supabase project using the provided environment variables.
- **AC2:** The `public.profiles` table, which links to `auth.users`, is successfully created in the Supabase database via a migration script.

### Story 1.3: User Registration (FR1.1)
- **AC1:** A new user can submit the registration form with a valid email and a password meeting complexity requirements.
- **AC2:** Upon form submission, a verification email is dispatched to the user's email address via the integrated email provider (Resend/Supabase).
- **AC3:** A new entry for the user is created in the `auth.users` table in Supabase, initially in an unconfirmed state.

### Story 1.4: User Login (FR1.2)
- **AC1:** A registered and verified user can log in successfully using their correct email and password.
- **AC2:** Upon successful login, the user is redirected to the application dashboard (`/dashboard`).
- **AC3:** If login fails due to incorrect credentials, a clear and user-friendly error message is displayed on the login form.

### Story 1.5: User Logout (FR1.3)
- **AC1:** A logged-in user has access to a "Logout" button or interactive element.
- **AC2:** Clicking the "Logout" button terminates the user's session securely.
- **AC3:** After logout, the user is redirected to a public-facing page, such as the landing or login page.

## Traceability Mapping

| AC ID       | Spec Section(s)             | Component(s) / API(s)               | FR    | Test Idea                                         |
|-------------|-----------------------------|-------------------------------------|-------|---------------------------------------------------|
| 1.1.AC1-3   | Detailed Design             | `npx create-next-app`               | N/A   | Verify `package.json` and folder structure post-init. |
| 1.2.AC1-2   | Data Models                 | Supabase Client, SQL Migration      | N/A   | Write an integration test to check DB connection.   |
| 1.3.AC1-3   | APIs, Workflows             | `/register` page, `/api/auth/register` | FR1.1 | E2E Test: A new user registers and receives email.  |
| 1.4.AC1-3   | APIs, Workflows             | `/login` page, `/api/auth/login`    | FR1.2 | E2E Test: A user logs in and is redirected.         |
| 1.5.AC1-3   | APIs, Workflows             | `LogoutButton` component            | FR1.3 | E2E Test: A user logs out and is redirected.      |

## Risks, Assumptions, Open Questions

- **Risk:** Incorrect configuration of Supabase Row Level Security (RLS) policies could lead to data leakage between users.
  - **Mitigation:** Implement automated tests that specifically verify RLS policies. These tests should create multiple mock users and assert that one user cannot access another user's data.
- **Assumption:** The chosen versions of `next`, `next-auth`, and `@supabase/supabase-js` are fully compatible.
  - **Mitigation:** Pin dependency versions in `package.json` and consult official documentation and community channels for any known compatibility issues before beginning implementation.
- **Question:** What are the specific password strength requirements (minimum length, character types, etc.) for user registration?
  - **Next Step:** This needs to be clarified with the product owner before building the registration form to ensure the validation logic is correct.

## Test Strategy Summary

The test strategy will follow the multi-layered approach defined in the architecture document to ensure the reliability of the foundational authentication system.

- **Unit Tests (Jest / React Testing Library):** Focus on individual React components in isolation, such as the login and registration forms. Tests will verify form rendering, validation logic, and user input handling.
- **Integration Tests (Jest / Supabase Client):** Test the integration between application services. For example, test the user registration Server Action to ensure it correctly calls the Supabase client and handles success or error responses.
- **End-to-End (E2E) Tests (Playwright / Cypress):** Simulate full user journeys in a browser environment. E2E tests will cover the complete user registration flow (including email verification if possible) and the login/logout process, validating all acceptance criteria.
