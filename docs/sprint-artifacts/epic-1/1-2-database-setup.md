# Story 1.2: Database Setup

Status: ready-for-dev

## Story

As a developer,
I want to set up the Supabase database,
so that I can store and manage application data.

## Acceptance Criteria

1.  **Given** a Supabase project is created, **When** I connect the Next.js app to the Supabase project, **Then** the application can communicate with the database.
2.  **Given** the Next.js app can communicate with the database, **Then** the database schema for users (specifically the `public.profiles` table linked to `auth.users`) is created.

## Tasks / Subtasks

- [ ] Task: Set up Supabase project
  - [ ] Create a new Supabase project via the Supabase dashboard.
  - [ ] Retrieve Supabase URL and `anon` key for environment configuration.
- [ ] Task: Connect Next.js app to Supabase
  - [ ] Configure environment variables in `.env.local` for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - [ ] Implement a Supabase client instance in `lib/supabaseClient.ts` (or similar location) as per `architecture.md`.
  - [ ] Verify successful connection by performing a basic query (e.g., fetching a non-existent table).
- [ ] Task: Define and apply user schema (`public.profiles`)
  - [ ] Create a migration file (e.g., `supabase/migrations/YYYYMMDDHHMMSS_create_profiles_table.sql`) for the `public.profiles` table.
  - [ ] The `public.profiles` table should include `id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE` and other relevant fields as outlined in `tech-spec-epic-1.md`.
  - [ ] Apply the migration to the Supabase database using `supabase db push` or equivalent.
  - [ ] Verify the `public.profiles` table exists and is correctly linked to `auth.users`.
- [ ] Task: Basic Row Level Security (RLS) setup
  - [ ] Enable RLS on the `public.profiles` table.
  - [ ] Create a basic RLS policy to allow users to `SELECT` and `UPDATE` their own profile. (Source: architecture.md)

## Dev Notes

- **Relevant architecture patterns and constraints:**
  - Data Persistence: Supabase PostgreSQL.
  - Authentication: NextAuth.js with Supabase Auth (implies need for `auth.users` table, which `public.profiles` will link to).
  - Use `lib/db.ts` (or similar) for Supabase client.
  - All dates and times should be stored in UTC in the database.
  - Ensure Row Level Security (RLS) is enabled and configured for user data.
- **Source tree components to touch:**
  - `lib/supabaseClient.ts` (new file)
  - `supabase/migrations/` (new directory and file)
  - `.env.local` (modified)
- **Testing standards summary:**
  - Integration Tests: Verify database connection and schema creation.
  - Integration Tests: Verify RLS policies function correctly (e.g., user can only access their own profile).

### Project Structure Notes

- **Alignment with unified project structure:** `lib/` for client logic, `supabase/` for migrations.
- **Detected conflicts or variances (with rationale):** None expected at this stage.

### References

- [Source: docs/epics.md#Story-1.2:-Database-Setup]
- [Source: docs/PRD.md#Functional-Requirements] (FR1.1, FR1.2, FR1.3 related to user management implying database support)
- [Source: docs/architecture.md#Data-Persistence]
- [Source: docs/architecture.md#Data-Architecture]
- [Source: docs/architecture.md#Development-Environment] (Supabase CLI setup)
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Data-Models-and-Contracts]

## Dev Agent Record

### Context Reference

- C:\ibe160\SmartMat\SG-Gruppe-Stavanger\docs\sprint-artifacts\1-2-database-setup.context.xml

### Agent Model Used

Gemini 2.5 Pro and Flesh (in #yolo mode)

### Debug Log References

### Completion Notes List

### File List

## Change Log

- Initial Draft: 2025-11-28 (BIP)
