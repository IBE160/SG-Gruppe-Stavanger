# Story 1.1: Project Setup & Core Infrastructure (Foundation)

Status: Approved

## Story

As a **Developer**,
I want to set up the project with the defined tech stack and basic infrastructure,
so that I can build the application efficiently and with a clear foundation.

## Acceptance Criteria

*   **Given** a new project environment,
*   **When** I initialize the project,
*   **Then** a Next.js 14 project is created with App Router.
*   **And** Tailwind CSS is configured for styling.
*   **And** shadcn/ui components are integrated and ready for use.
*   **And** Prisma ORM is initialized with a connection to a Supabase PostgreSQL database.
*   **And** NextAuth.js is installed and configured for email/password authentication.
*   **And** Vercel deployment is configured for continuous integration.

## Tasks / Subtasks

- [ ] **Setup Next.js Project (AC: Next.js 14 project)**
  - [ ] Initialize new Next.js 14 project with App Router
  - [ ] Configure `tsconfig.json` and `next.config.js`
  - [ ] Install essential Next.js dependencies
  - [ ] **Testing:** Verify project structure and basic Next.js functionality
- [ ] **Integrate Tailwind CSS (AC: Tailwind CSS configured)**
  - [ ] Install Tailwind CSS and its peer dependencies
  - [ ] Configure `tailwind.config.js` with project-specific settings
  - [ ] Import Tailwind directives into `globals.css` (or equivalent)
  - [ ] **Testing:** Verify Tailwind utility classes are applied correctly (e.g., test a simple styled div)
- [ ] **Integrate shadcn/ui Components (AC: shadcn/ui components integrated)**
  - [ ] Initialize shadcn/ui within the project
  - [ ] Add `Button` and `Input` components as initial examples
  - [ ] Configure `components.json` for custom theming (Farmhouse Kitchen aesthetic)
  - [ ] **Testing:** Render and visually inspect shadcn components
- [ ] **Setup Prisma & Supabase (AC: Prisma ORM initialized with Supabase PostgreSQL)**
  - [ ] Install Prisma CLI and client libraries
  - [ ] Configure `schema.prisma` with `postgresql` provider and `Supabase` connection string (from environment variables)
  - [ ] Define initial `User` model in `schema.prisma` (as per `architecture.md` and `tech-spec-epic-epic-1.md`)
  - [ ] Run `npx prisma db push` to synchronize schema with Supabase
  - [ ] **Testing:** Verify database connection and `User` table creation in Supabase
- [ ] **Configure NextAuth.js (AC: NextAuth.js installed and configured)**
  - [ ] Install NextAuth.js library
  - [ ] Create `[...nextauth].js` handler for email/password provider
  - [ ] Configure `JWT` and `session` options
  - [ ] Set up adapter for Prisma to integrate with Supabase `User` model
  - [ ] Add authentication routes (e.g., `/api/auth/signin`, `/api/auth/callback`)
  - [ ] **Testing:** Attempt a dummy registration/login flow to verify basic authentication
- [ ] **Setup Vercel Deployment (AC: Vercel deployment configured)**
  - [ ] Initialize Git repository (if not already)
  - [ ] Link project to Vercel account via Vercel CLI or dashboard
  - [ ] Configure `vercel.json` for deployment settings (if needed)
  - [ ] Push to main branch to trigger initial deployment
  - [ ] **Testing:** Verify successful deployment of the Next.js application to Vercel

## Dev Notes

### Relevant architecture patterns and constraints
*   Client-server architecture with clear separation of concerns.
*   Serverless-first approach utilizing Next.js API Routes for backend logic.
*   Vercel for hosting Next.js application (frontend and API routes).
*   Supabase (PostgreSQL) for database, managed via Prisma ORM.
*   NextAuth.js for secure user authentication and session management.
*   Emphasis on scalability, performance, and a high-quality user experience.
*   Leveraging Next.js 14 features like App Router and Server Components for optimization.
*   Tailwind CSS + shadcn/ui for highly customizable and accessible UI.

### Source tree components to touch
*   Next.js project setup files (`package.json`, `tsconfig.json`, `next.config.js`)
*   Tailwind CSS configuration (`tailwind.config.js`, `globals.css`)
*   shadcn/ui component integration (e.g., `components.json`, example components)
*   Prisma schema (`schema.prisma`) and database migration scripts
*   NextAuth.js configuration (`pages/api/auth/[...nextauth].js` or similar)
*   Vercel deployment configuration (`vercel.json`)

### Testing standards summary
*   **Unit Tests:** Focus on individual functions, utility modules, Prisma data access layer interactions, and NextAuth.js configurations.
*   **Integration Tests:** Focus on Next.js API routes (`/api/auth/register`, `/api/auth/login`), database interactions, and the interplay between NextAuth.js and Prisma/Supabase.
*   **End-to-End (E2E) Tests:** Simulating complete user flows for registration and login through the UI.
*   **UI/UX Tests:** Manual and automated testing for visual aesthetic, responsiveness across devices, and adherence to accessibility standards (WCAG 2.1 AA).

### Project Structure Notes

As this is the first story in the epic, there are no previous story learnings or existing project structure documents to align with or learn from at this stage.

This foundational story will establish the initial project structure and conventions.

### References

*   **Epics:** `docs/epics.md#Epic-1` (Assumed section for Epic 1)
*   **PRD:** `docs/PRD.md#Project-Overview`
*   **Architecture:** `docs/architecture.md#System-Architecture-Overview`
*   **UX Design Specification:** `docs/ux-design-specification.md#Design-Principles`
*   **Epic Technical Specification (Epic 1):** `docs/sprint-artifacts/tech-spec-epic-epic-1.md#Introduction`

## Dev Agent Record

### Context Reference

*   1-1-project-setup-core-infrastructure-foundation.context.xml

### Agent Model Used

gemini-1.5-pro-api

### Debug Log References

### Completion Notes List

### File List
*   `docs/sprint-artifacts/1-1-project-setup-core-infrastructure-foundation.md` (created)

### Change Log

- Initialized: 2025-11-23 (Scrum Master Review)