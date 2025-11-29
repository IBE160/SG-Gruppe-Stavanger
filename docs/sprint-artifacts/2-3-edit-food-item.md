# Story 2.3: Edit Food Item

Status: drafted

## Story

As a user,
I want to edit the details of an existing food item,
so that I can correct or update information.

## Acceptance Criteria

1.  **Given** I am viewing an item in my inventory, **when** I click to edit the item and update its name, quantity, unit, or expiration date, **then** the changes are saved and reflected in the inventory list.

## Tasks / Subtasks

- [ ] **Backend: API Endpoint** (AC: #1)
    - [ ] Create a `PUT` or `PATCH` route handler at `app/api/inventory/[id]/route.ts`.
    - [ ] Implement logic to update an item in the `inventory` table in the Supabase database.
    - [ ] Ensure the endpoint is protected and only the item's owner can perform the update, enforcing RLS policies.
    - [ ] Validate incoming data to ensure it matches the expected schema.
- [ ] **Frontend: UI Component** (AC: #1)
    - [ ] Create an "Edit Item" form or modal component.
    - [ ] The component should be pre-populated with the existing item's data.
    - [ ] On submission, the component should call the client-side update function.
- [ ] **Frontend: Client-side Logic** (AC: #1)
    - [ ] Create a function in `lib/inventoryClient.ts` (or equivalent) to send the `PUT`/`PATCH` request to the API.
    - [ ] Integrate this function with the "Edit Item" component.
    - [ ] Update the local state of the inventory list to reflect the changes immediately (optimistic update or after API confirmation).
- [ ] **Testing** (AC: #1)
    - [ ] Write an API integration test to verify the `PUT /api/inventory/{id}` endpoint works correctly and enforces security.
    - [ ] Write a frontend unit test for the "Edit Item" component to ensure it handles user input and submission correctly.
    - [ ] Include this flow in an E2E test.

## Dev Notes

- **Architecture:** The implementation must follow the RESTful API pattern using Next.js Route Handlers. All data access must go through the defined API layer and respect the Supabase RLS policies.
- **Styling:** Use `shadcn/ui` components for the form and modal to maintain visual consistency with the rest of the application.
- **State Management:** Use client-side state management (e.g., React Query, SWR, or simple React state) to manage the inventory list and reflect updates.

### Project Structure Notes

- **API Route:** `app/api/inventory/[id]/route.ts`
- **UI Components:**
    - The edit functionality should be part of a component in `components/specific/` or `components/common/`, for example, an `InventoryItemCard` that reveals an `EditInventoryItemForm`.
- **Client Logic:** Update/fetch logic should reside in a dedicated client-side service file, likely in `lib/`.

### References

- **Epic & Story Source:** `docs/epics.md#story-23-edit-food-item`
- **Technical Specification:** `docs/sprint-artifacts/tech-spec-epic-2.md#apis-and-interfaces`
- **Architecture Guide:** `docs/architecture.md#api-pattern`
- **PRD / Functional Requirement:** `docs/PRD.md#fr23---edit-food-item`

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Gemini 2.5 Pro and Flesh (in #yolo mode)

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
