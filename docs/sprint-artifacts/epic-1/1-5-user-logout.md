# Story 1.5: User Logout

Status: ready-for-dev

## Story

As a logged-in user,
I want to log out of my account,
so that I can securely end my session.

## Acceptance Criteria

1. A logged-in user can trigger a logout action from the UI. (AC: #1)
2. When logout is triggered, the user's session is terminated securely on the server. (AC: #2)
3. Upon successful logout, the user is redirected to the public landing page. (AC: #3)

## Tasks / Subtasks

- [ ] **Task 1: Implement Logout Button** (AC: #1)
  - [ ] Create a `LogoutButton` component.
  - [ ] Place the `LogoutButton` in the main application layout or user profile dropdown.
- [ ] **Task 2: Implement Logout Functionality** (AC: #2)
  - [ ] The `LogoutButton` component should call the `signOut()` function from `next-auth/react`.
  - [ ] Configure the `signOut()` function to redirect to the landing page on completion.
- [ ] **Task 3: Testing** (AC: #1, #2, #3)
  - [ ] Create a unit test for the `LogoutButton` component to ensure it calls `signOut` on click.
  - [ ] Create an end-to-end test that:
    - Logs a user in.
    - Clicks the logout button.
    - Verifies the user is redirected to the landing page.
    - Verifies the user can no longer access protected routes.

## Dev Notes

- This story implements the user logout functionality.
- It will involve using NextAuth.js to terminate the user's session.
- The logout button should be placed in a user profile menu or a similar persistent navigation element.
- Previous story (1-4-user-login) was not yet implemented, so there are no specific code learnings to incorporate.

### Project Structure Notes

- The logout functionality will be handled by NextAuth.js.
- A client-side component will trigger the `signOut()` function from `next-auth/react`.
- This component could be part of the main layout (`app/(main)/layout.tsx`) or a specific `Profile` component.
- No new routes are expected for the logout action itself, as it's a client-side function call.

### References

- [Source: docs/PRD.md#FR1.3 - User Logout]
- [Source: docs/epics.md#Story 1.5: User Logout]
- [Source: docs/architecture.md#User & Profile Management]
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Gemini 2.5 Pro and Flesh (in #yolo mode)

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-29: Initial draft created by AI agent.
- 2025-11-29: Updated to include tech spec citation and Change Log section based on validation report.