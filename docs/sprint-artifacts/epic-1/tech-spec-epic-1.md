# Epic 1: User Authentication & Initial Setup - Technical Specification

This document consolidates the technical specifications and acceptance criteria for Epic 1, which covers the initial project setup and user authentication features.

---

### Story 1.1: Project Initialization

**Goal:** Set up the Next.js project with TypeScript and Tailwind CSS, including repository, environment configuration, and CI/CD setup for Vercel, based on the Architecture Document.

**Status:** Ready for Development

**Acceptance Criteria:**
*   A new Next.js project is initialized using the App Router.
*   TypeScript is configured and integrated into the project.
*   Tailwind CSS is installed and configured for styling, with initial configuration for base styles.
*   The project structure strictly adheres to the "Project Structure and Boundaries" and "Approved Location Patterns" sections of the Architecture Document.
*   A new Git repository is initialized, and the initial project setup is committed.
*   A `.gitignore` file is properly configured to exclude unnecessary files and directories.
*   A `README.md` file is created with basic project setup instructions.
*   Configuration for development, staging, and production environments is established (e.g., using `.env` files or environment variables).
*   Basic scripts for running the application in development mode (`npm run dev`) are functional.
*   A basic "Hello World" or equivalent placeholder page is successfully rendered in the browser.
*   All new files adhere to `kebab-case` naming conventions.
*   All new components adhere to `PascalCase` naming conventions.
*   Initial CI/CD setup is configured for automated builds.
*   Basic deployment to Vercel is set up and functional for at least one environment (e.g., development or staging).

---

### Story 1.2: Database Setup

**Goal:** Connect the Next.js app to the Supabase PostgreSQL database and create the initial `profiles` table.

**Status:** Ready for Development

**Prerequisites:**
*   A Supabase project has been provisioned by an administrator, and necessary access credentials are available.

**Acceptance Criteria:**
*   The `@supabase/supabase-js` client library is successfully integrated into the Next.js application.
*   The Next.js application successfully establishes a secure connection to the provisioned Supabase PostgreSQL database using appropriate environment variables for credentials.
*   A `profiles` table is created in the connected Supabase database with the following columns:
    *   `id` (UUID, Primary Key, referencing `auth.users.id`)
    *   `email` (text, Unique)
    *   `created_at` (timestamp with time zone, with a default value of `now()`)
*   The Next.js application demonstrates basic, successful communication with the database to verify the connection and schema.
*   No initial seed data is present in the `profiles` table.

---

### Story 1.3: User Registration

**Goal:** Allow new users to securely create an account using email and password, with email verification.

**Status:** Ready for Development

**Acceptance Criteria:**
*   A responsive registration form is created, adhering to the Mobile-First dashboard approach, using the `shadcn/ui` design system with the "Fresh & Organic" theme.
*   The form includes input fields for 'email', 'password', and 'confirm password', with client-side validation.
*   The form is integrated with Supabase Authentication via `NextAuth.js`.
*   Upon valid submission, a new user is created in Supabase `auth.users`, enforcing Supabase's default strong password policy.
*   An email verification message is automatically dispatched to the user's email.
*   The user is redirected to a generic page instructing them to check their email for verification.
*   Friendly, non-technical error messages are displayed via Toast Notifications for failed attempts.

---

### Story 1.4: User Login

**Goal:** Allow registered users to securely log in, be redirected to the dashboard, and access a "Forgot Password" flow.

**Status:** Ready for Development

**Acceptance Criteria:**
*   A responsive login form is created, consistent with the UI/UX of the registration page.
*   The form includes input fields for 'email' and 'password'.
*   The form is integrated with Supabase Authentication via `NextAuth.js`.
*   Upon successful login, the user is redirected to the `/dashboard` route.
*   A "Forgot Password" link is present and redirects to the Supabase-managed password recovery flow.
*   Friendly, non-technical error messages are displayed via Toast Notifications for failed attempts (e.g., "Invalid email or password", "Please verify your email address").
*   The application relies on the default `NextAuth.js` session management behavior.

---

### Story 1.5: User Logout

**Goal:** Allow a logged-in user to securely end their session and be redirected to the landing page.

**Status:** Ready for Development

**Acceptance Criteria:**
*   A logout button is implemented and located appropriately for both mobile (Fixed Bottom Bar/menu) and desktop (Fixed Left Sidebar/user dropdown) viewports.
*   The logout action is direct and does not require a confirmation step.
*   Upon clicking the button, the user's session is securely terminated via `NextAuth.js`.
*   The user is redirected to the application's root path (`/`).
*   The application correctly reflects the user's logged-out status.
*   Friendly Toast Notifications are used for any unexpected errors during the logout process.