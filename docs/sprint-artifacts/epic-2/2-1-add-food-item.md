# Story: 2.1 Add Food Item

**Date:** 2025-11-29
**Author:** BIP
**Status:** ready-for-dev

---

## User Story

As a user, I want to manually add a food item to my inventory, so that I can track my kitchen items.

## Acceptance Criteria

- **AC1:** A logged-in user can access a form to add a new food item.
- **AC2:** The form must capture the item's name, quantity, unit, and expiration date.
- **AC3:** Upon submission, the new item is saved to the user's inventory in the database.
- **AC4:** The user's inventory view updates immediately to show the newly added item.
- **AC5:** The API endpoint for adding an item must be secure and only accessible by authenticated users.
- **AC6:** Users can only add items to their own inventory (RLS policy must be effective).
- **AC7:** Both client-side and server-side validation must be implemented for all input fields.

## Tasks

- **T1 (Backend):** Create the API route file `app/api/inventory/route.ts`. (AC: 3, 5, 6, 7)
- **T2 (Backend):** Implement the `POST` request handler within the new API route. (AC: 3, 5, 6, 7)
- **T3 (Backend):** Implement server-side input validation for the request body (name, quantity, unit, expiration_date). (AC: 7)
- **T4 (Backend):** Implement the database logic to insert the new inventory item using the Supabase client. (AC: 3, 6)
- **T5 (Frontend):** Create the UI component file `components/specific/AddItemForm.tsx`. (AC: 1, 2)
- **T6 (Frontend):** Build the form UI using shadcn/ui components, including the custom "Quick-Add Input". (AC: 2)
- **T7 (Frontend):** Implement client-side state management and validation for the form. (AC: 2, 7)
- **T8 (Frontend):** Implement the API client logic to send the `POST` request to `/api/inventory` on form submission. (AC: 3, 4)
- **T9 (Testing):** Write integration tests for the `POST /api/inventory` endpoint to cover success, auth failure, and validation error cases. (AC: 3, 5, 6, 7)
- **T10 (Testing):** Write unit tests for the `AddItemForm.tsx` component to verify its behavior and validation logic. (AC: 1, 2, 7)

## Developer Notes

### Requirements Context
- This story implements `FR2.1 - Add Food Item` from the `docs/PRD.md`.
- It is the first functional story for Epic 2: Inventory Management.

### Technical Specification Context
- **Source:** `docs/sprint-artifacts/tech-spec-epic-2.md`
- **API Endpoint:** `POST /api/inventory`
- **Data Model:** `inventory` table requires `user_id`, `name`, `quantity`, `unit`, and `expiration_date`.
- **Workflow:** User clicks "Add Item", fills a form, submits, `InventoryPage` calls `InventoryClient.addItem`, `InventoryClient` sends `POST` to `/api/inventory`, `InventoryService` inserts to DB, UI updates.

### Architectural Context
- **Source:** `docs/architecture.md`
- **API Pattern:** RESTful API using Next.js API Routes (Route Handlers).
- **Authentication:** Requires valid user session via NextAuth.js and Supabase Auth.
- **Project Structure:** UI components in `components/specific/AddItemForm.tsx`, API route in `app/api/inventory/route.ts`.

### UX and Testing Context
- **UX Source:** `docs/ux-design-specification.md`
- Prioritize UX for the "Add Item" flow to minimize user friction, using the `Quick-Add Input` custom component.
- **Testing Source:** `docs/architecture.md` (section: "Testing Strategy")
- A multi-layered testing strategy is required, including unit, integration, and E2E tests.

### General Notes
- Ensure all data validation (both client-side and server-side) matches the technical specification.
- Remember to handle potential errors gracefully both in the UI and API responses.

## Change Log

*   **2025-11-29:** Initial draft created by SM agent.
*   **2025-11-29:** Story status updated to `ready-for-dev`.
*   **2025-11-29:** Added explicit Acceptance Criteria, Tasks, and improved Developer Notes to align with project validation standards.

---

## Dev Agent Record

*   **Context Reference:** `docs/sprint-artifacts/2-1-add-food-item.context.xml`

### Agent Model Used

Gemini 2.5 Pro and Flesh (in #yolo mode)

---