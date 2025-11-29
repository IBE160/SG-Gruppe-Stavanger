# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story’s `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.

| Date | Story | Epic | Type | Severity | Owner | Status | Notes |
| ---- | ----- | ---- | ---- | -------- | ----- | ------ | ----- |
| lørdag 29. november 2025 | 1.2 | 1 | Bug | High | TBD | Open | Implement rate limiting for POST /api/auth/register endpoint. |
| lørdag 29. november 2025 | 1.2 | 1 | Refactor | High | TBD | Open | Refactor user creation logic in app/api/auth/register/route.ts to integrate with NextAuth.js's CredentialsProvider. |
| lørdag 29. november 2025 | 1.2 | 1 | Bug | High | TBD | Open | Create and implement unit tests for RegistrationForm component client-side validation logic (app/register/page.test.tsx). |
| lørdag 29. november 2025 | 1.2 | 1 | Bug | High | TBD | Open | Create and implement unit tests for API route handler (app/api/auth/register/route.test.ts). |
| lørdag 29. november 2025 | 1.2 | 1 | Bug | High | TBD | Open | Password hashing in app/api/auth/register/route.ts not using NextAuth.js's built-in mechanism. |
| lørdag 29. november 2025 | 1.2 | 1 | Bug | Med | TBD | Open | Enhance server-side validation in app/api/auth/register/route.ts for email format and password complexity. |
| lørdag 29. november 2025 | 1.2 | 1 | Bug | Med | TBD | Open | Implement client-side validation for email format and password complexity in app/register/page.tsx. |
| lørdag 29. november 2025 | 1.2 | 1 | Test | Med | TBD | Open | Implement unit tests for Prisma User model interactions. |
| lørdag 29. november 2025 | 1.2 | 1 | Test | Med | TBD | Open | Implement unit tests for NextAuth.js configuration for registration. |
| lørdag 29. november 2025 | 1.2 | 1 | Test | Med | TBD | Open | Implement integration tests for POST /api/auth/register flow. |
| lørdag 29. november 2025 | 1.2 | 1 | Test | Med | TBD | Open | Implement integration tests for edge cases (existing email, invalid password format). |
| lørdag 29. november 2025 | 1.2 | 1 | Test | Med | TBD | Open | Implement End-to-End (E2E) tests for user registration flow. |
| lørdag 29. november 2025 | 1.2 | 1 | Tech Debt | Low | TBD | Open | Replace console.error with production-grade logging solution in app/api/auth/register/route.ts and app/register/page.tsx.
