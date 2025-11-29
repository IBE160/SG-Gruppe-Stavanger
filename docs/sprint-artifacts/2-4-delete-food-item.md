# Story 2.4: Delete Food Item

Status: drafted

## Story

As a user,
I want to delete an item from my inventory,
so that I can remove items I no longer have.

## Acceptance Criteria

1.  **Given** I am viewing an item in my inventory, **When** I click to delete the item, **Then** a confirmation prompt is displayed.
2.  **And** upon confirmation, the item is permanently removed from the inventory.
3.  **And** only the item's owner can delete it, enforced by Supabase RLS.

## Tasks / Subtasks

- [ ] **Backend: API Endpoint** (AC: #1, #2, #3)
    - [ ] Implement a `DELETE` route handler in `app/api/inventory/[id]/route.ts`.
    - [ ] Add logic to delete an item from the `inventory` table in the Supabase database.
    - [ ] Ensure the endpoint is protected and only the item's owner can perform the deletion, enforcing RLS policies.
- [ ] **Frontend: UI Component** (AC: #1, #2)
    - [ ] Add a "Delete" button to the inventory item display (e.g., within an `InventoryItemCard`).
    - [ ] Implement a confirmation modal component (using `shadcn/ui`) that appears when the "Delete" button is clicked.
    - [ ] On confirmation, trigger the client-side delete function.
- [ ] **Frontend: Client-side Logic** (AC: #2)
    - [ ] Create or extend a function in `lib/inventoryClient.ts` (or equivalent) to send the `DELETE` request to the API.
    - [ ] Integrate this function with the confirmation modal.
    - [ ] Update the local state of the inventory list to reflect the deletion (optimistic update or after API confirmation).
- [ ] **Testing** (AC: #1, #2, #3)
    - [ ] **Unit Test:** (AC: #1) Write a frontend unit test for the confirmation modal to ensure it appears on button click and handles user confirmation/cancellation correctly.
    - [ ] **Integration Test:** (AC: #2, #3) Write an API integration test for the `DELETE /api/inventory/{id}` endpoint to:
        - Verify it successfully deletes an item and returns a 204 status.
        - Verify it returns a 401/403 error when accessed without authentication.
        - Verify it returns a 404/403 error when a user tries to delete an item belonging to another user (testing RLS).
    - [ ] **E2E Test:** (AC: #1, #2) Write an end-to-end test that simulates a user logging in, clicking a delete button, confirming the action in the modal, and verifying the item is removed from the UI.

## Dev Notes

- **Architecture:** The implementation must follow the RESTful API pattern using Next.js Route Handlers. All data access must go through the defined API layer and respect the Supabase RLS policies.
- **Styling:** Use `shadcn/ui` components for the confirmation modal to maintain visual consistency.
- **State Management:** Use client-side state management (e.g., React Query, SWR, or simple React state) to manage the inventory list and reflect updates.

### Project Structure Notes

- **API Route:** Extend `app/api/inventory/[id]/route.ts` to include the `DELETE` handler.
- **UI Components:** The delete functionality should be integrated into an existing component (e.g., `InventoryItemCard`) and use a new confirmation modal component.
- **Client Logic:** Update/fetch logic should reside in a dedicated client-side service file, likely in `lib/`.

### References

- **Epic & Story Source:** `docs/epics.md#story-24-delete-food-item`
- **Technical Specification:** `docs/sprint-artifacts/tech-spec-epic-2.md#apis-and-interfaces`
- **Architecture Guide:** `docs/architecture.md#api-pattern`
- **PRD / Functional Requirement:** `docs/PRD.md#fr24---delete-food-item`
- **Learnings from Previous Story (2.3 Edit Food Item):** `docs/sprint-artifacts/2-3-edit-food-item.md`

## Change Log

- **2025-11-29:** Initial draft created by the Scrum Master agent.

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Gemini 2.5 Pro and Flash (in #yolo mode)

### Debug Log References

### Completion Notes List

### File List