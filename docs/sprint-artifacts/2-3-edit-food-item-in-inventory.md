# Story 2.3: Edit Food Item in Inventory

Status: pending

## Story

As a **User**,
I want to edit existing food items in my inventory,
so that I can keep my inventory information accurate and up-to-date.

## Acceptance Criteria

*   **Given** I am viewing a food item in my "My Pantry" inventory,
*   **When** I select an item for editing (e.g., click on it or click an "Edit" icon),
*   **And** I modify its name, quantity, unit, category, or best-before date,
*   **And** I save the changes,
*   **Then** the food item's details are updated in my inventory and the UI reflects these changes immediately.
*   **And** input validation is performed for modified fields.
*   **And** the edit interaction is smooth and uses the "Farmhouse Kitchen" themed UI components.
*   **And** the form is responsive and accessible.

## Tasks / Subtasks

- [ ] **Implement Edit Food Item API Route (AC: Backend endpoint functional)**
  - [ ] Create `/api/inventory/[id]` PUT endpoint
  - [ ] Implement authentication check using NextAuth.js
  - [ ] Implement server-side validation for all fields
  - [ ] Verify food item exists and belongs to authenticated user
  - [ ] Implement Prisma mutation to update FoodItem
  - [ ] Return appropriate success/error responses (404, 403, 400)
  - [ ] **Testing:** Unit test API route with valid/invalid data and authorization
- [ ] **Create EditFoodItemForm Component (AC: Form UI complete)**
  - [ ] Create `EditFoodItemForm` client component using shadcn/ui Dialog
  - [ ] Implement form fields for name, category, bestBeforeDate, quantity, unit
  - [ ] Pre-populate form with current item data
  - [ ] Add client-side validation
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] Ensure responsive design and accessibility
  - [ ] **Testing:** Render form with item data, verify fields are pre-populated
- [ ] **Add Edit Trigger to IngredientIcon (AC: User can access edit)**
  - [ ] Add edit action to IngredientIcon component (e.g., click or edit button)
  - [ ] Connect trigger to open EditFoodItemForm with selected item
  - [ ] Ensure accessibility (keyboard navigation, aria-labels)
  - [ ] **Testing:** Verify clicking item opens edit form
- [ ] **Implement Form Submission Logic (AC: Form updates data)**
  - [ ] Connect form to PUT `/api/inventory/[id]` endpoint
  - [ ] Handle success response (close form, show feedback)
  - [ ] Handle error response (display error message)
  - [ ] Implement optimistic UI update for Pantry View
  - [ ] Implement rollback on server error
  - [ ] **Testing:** E2E test editing a food item through the UI
- [ ] **Add Authorization Checks (AC: Security enforced)**
  - [ ] Verify user can only edit their own food items
  - [ ] Handle 403 Forbidden response appropriately
  - [ ] **Testing:** Test editing another user's item (should fail)

## Dev Notes

### Relevant architecture patterns and constraints
*   Client-server architecture with Next.js API Routes handling backend logic.
*   Prisma ORM for type-safe database interactions with Supabase PostgreSQL.
*   NextAuth.js for authentication and authorization.
*   Authorization checks to prevent users from editing others' items.
*   Optimistic UI updates with rollback for enhanced UX.
*   Client-side and server-side validation for data integrity and security.
*   "Farmhouse Kitchen" aesthetic using Tailwind CSS and shadcn/ui components.

### Source tree components to touch
*   `app/api/inventory/[id]/route.ts` - Create PUT endpoint
*   `components/pantry/EditFoodItemForm.tsx` - Create edit form component
*   `components/pantry/IngredientIcon.tsx` - Add edit trigger
*   `app/pantry/page.tsx` - Integrate edit functionality

### Testing standards summary
*   **Unit Tests:** API route validation and authorization logic, form validation functions, Prisma data access methods.
*   **Integration Tests:** API route with database interactions, authentication and authorization flow.
*   **End-to-End (E2E) Tests:** Complete user flow from clicking item to editing and seeing updated data.
*   **Security Tests:** Verify authorization (users cannot edit others' items).
*   **UI/UX Tests:** Visual aesthetic, responsiveness, accessibility (WCAG 2.1 AA), form usability.

### Project Structure Notes

This story depends on Stories 2.1 (FoodItem model) and 2.2 (viewing inventory). The edit functionality builds on the existing inventory display and follows similar patterns to the add functionality.

### References

*   **Epics:** `docs/epics.md#Epic-2`
*   **PRD:** `docs/PRD.md#FR-002.2`
*   **Architecture:** `docs/architecture.md#Data-Model` (FoodItem)
*   **UX Design Specification:** `docs/ux-design-specification.md#Component-Library`
*   **Epic Technical Specification (Epic 2):** `docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.3`

## Dev Agent Record

### Context Reference

*   2-3-edit-food-item-in-inventory.context.xml

### Agent Model Used

### Debug Log References

### Completion Notes
**Completed:**
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List

### File List
*   `docs/sprint-artifacts/2-3-edit-food-item-in-inventory.md` (created)

### Change Log

- Initialized: 2025-11-30
