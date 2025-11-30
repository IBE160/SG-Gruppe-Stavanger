# Story 2.4: Delete Food Item from Inventory

Status: pending

## Story

As a **User**,
I want to delete food items from my inventory,
so that I can remove items I no longer have or that have been consumed.

## Acceptance Criteria

*   **Given** I am viewing a food item in my "My Pantry" inventory,
*   **When** I select an item for deletion (e.g., drag to a "waste bin" icon, or click a "Delete" button) and confirm the action,
*   **Then** the food item is removed from my inventory and no longer displayed in the Pantry View.
*   **And** a confirmation prompt is shown before permanent deletion to prevent accidental deletions.
*   **And** the deletion interaction provides feedback (e.g., item fades out) and adheres to UX principles.
*   **And** the confirmation dialog uses the "Farmhouse Kitchen" aesthetic.

## Tasks / Subtasks

- [ ] **Implement Delete Food Item API Route (AC: Backend endpoint functional)**
  - [ ] Create `/api/inventory/[id]` DELETE endpoint
  - [ ] Implement authentication check using NextAuth.js
  - [ ] Verify food item exists and belongs to authenticated user
  - [ ] Implement Prisma mutation to delete FoodItem
  - [ ] Return appropriate success/error responses (404, 403)
  - [ ] **Testing:** Unit test API route with authorization checks
- [ ] **Create DeleteConfirmationDialog Component (AC: Confirmation UI complete)**
  - [ ] Create `DeleteConfirmationDialog` using shadcn/ui Dialog
  - [ ] Implement confirmation message and action buttons (Cancel/Delete)
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] Ensure accessibility (keyboard navigation, focus management)
  - [ ] **Testing:** Render dialog and verify buttons work correctly
- [ ] **Add Delete Trigger to IngredientIcon (AC: User can access delete)**
  - [ ] Add delete action to IngredientIcon (e.g., delete button or drag to waste bin)
  - [ ] Connect trigger to open DeleteConfirmationDialog
  - [ ] Ensure accessibility (keyboard navigation, aria-labels)
  - [ ] **Testing:** Verify delete action opens confirmation dialog
- [ ] **Implement Delete Logic (AC: Deletion functional)**
  - [ ] Connect confirmation dialog to DELETE `/api/inventory/[id]` endpoint
  - [ ] Handle success response (close dialog, show feedback, update UI)
  - [ ] Handle error response (display error message)
  - [ ] Implement optimistic UI update (item fades out)
  - [ ] Implement rollback on server error
  - [ ] **Testing:** E2E test deleting a food item through the UI
- [ ] **Add Visual Feedback (AC: Deletion provides feedback)**
  - [ ] Implement fade-out animation when item is deleted
  - [ ] Show success message or toast notification
  - [ ] **Testing:** Verify animation plays on delete
- [ ] **Add Authorization Checks (AC: Security enforced)**
  - [ ] Verify user can only delete their own food items
  - [ ] Handle 403 Forbidden response appropriately
  - [ ] **Testing:** Test deleting another user's item (should fail)

## Dev Notes

### Relevant architecture patterns and constraints
*   Client-server architecture with Next.js API Routes handling backend logic.
*   Prisma ORM for type-safe database interactions with Supabase PostgreSQL.
*   NextAuth.js for authentication and authorization.
*   Authorization checks to prevent users from deleting others' items.
*   Confirmation dialog to prevent accidental deletions.
*   Optimistic UI updates with rollback for enhanced UX.
*   Visual feedback (animations) for better user experience.
*   "Farmhouse Kitchen" aesthetic using Tailwind CSS and shadcn/ui components.

### Source tree components to touch
*   `app/api/inventory/[id]/route.ts` - Add DELETE endpoint
*   `components/pantry/DeleteConfirmationDialog.tsx` - Create confirmation dialog
*   `components/pantry/IngredientIcon.tsx` - Add delete trigger
*   `app/pantry/page.tsx` - Integrate delete functionality

### Testing standards summary
*   **Unit Tests:** API route authorization logic, Prisma data access methods.
*   **Integration Tests:** API route with database interactions, authentication and authorization flow.
*   **End-to-End (E2E) Tests:** Complete user flow from clicking delete to confirming and seeing item removed.
*   **Security Tests:** Verify authorization (users cannot delete others' items).
*   **UI/UX Tests:** Visual aesthetic, animations, accessibility (WCAG 2.1 AA), confirmation dialog usability.

### Project Structure Notes

This story depends on Stories 2.1 (FoodItem model) and 2.2 (viewing inventory). The delete functionality completes the CRUD operations for inventory management and should include proper safeguards against accidental deletion.

### References

*   **Epics:** `docs/epics.md#Epic-2`
*   **PRD:** `docs/PRD.md#FR-002.2`
*   **Architecture:** `docs/architecture.md#Data-Model` (FoodItem)
*   **UX Design Specification:** `docs/ux-design-specification.md#Component-Library`
*   **Epic Technical Specification (Epic 2):** `docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.4`

## Dev Agent Record

### Context Reference

*   2-4-delete-food-item-from-inventory.context.xml

### Agent Model Used

### Debug Log References

### Completion Notes
**Completed:**
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List

### File List
*   `docs/sprint-artifacts/2-4-delete-food-item-from-inventory.md` (created)

### Change Log

- Initialized: 2025-11-30
