# Story 2.1: Add Food Item to Inventory

Status: pending

## Story

As a **User**,
I want to add food items to my inventory with relevant details,
so that I can track what food I have available in my kitchen.

## Acceptance Criteria

*   **Given** I am logged in and on the "My Pantry" view,
*   **When** I initiate the "Add Food Item" flow (e.g., by clicking a grocery bag icon or "Add Item" button),
*   **And** I provide the food item's name, quantity, unit, category, and a best-before date,
*   **And** I submit the form,
*   **Then** the food item is successfully added to my inventory and displayed in the "Open Shelves" view.
*   **And** the "Add Food Item" interaction is smooth and delightful, adhering to UX principles (UX Ref: `ux-design-specification.md` section 2.2, 5.1).
*   **And** input validation is performed for all fields (client-side and server-side).
*   **And** the UI reflects the "Farmhouse Kitchen" aesthetic using shadcn/ui components styled appropriately.
*   **And** the form is responsive and accessible (WCAG 2.1 AA).

## Tasks / Subtasks

- [ ] **Create FoodItem Database Model (AC: Database schema ready)**
  - [ ] Add `FoodItem` model to `schema.prisma`
  - [ ] Define fields: `id`, `name`, `category`, `bestBeforeDate`, `quantity`, `unit`, `userId`, `createdAt`
  - [ ] Create relation to `User` model
  - [ ] Run `npx prisma db push` to synchronize schema with Supabase
  - [ ] **Testing:** Verify `FoodItem` table creation in Supabase
- [ ] **Implement Add Food Item API Route (AC: Backend endpoint functional)**
  - [ ] Create `/api/inventory/add` POST endpoint
  - [ ] Implement authentication check using NextAuth.js
  - [ ] Implement server-side validation for all fields
  - [ ] Implement Prisma mutation to create new FoodItem
  - [ ] Return appropriate success/error responses
  - [ ] **Testing:** Unit test API route with valid/invalid data
- [ ] **Create AddFoodItemForm Component (AC: Form UI complete)**
  - [ ] Create `AddFoodItemForm` client component using shadcn/ui Dialog
  - [ ] Implement form fields for name, category, bestBeforeDate, quantity, unit
  - [ ] Add client-side validation
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] Ensure responsive design and accessibility
  - [ ] **Testing:** Render form and verify all fields are present
- [ ] **Implement Form Submission Logic (AC: Form submits data)**
  - [ ] Connect form to POST `/api/inventory/add` endpoint
  - [ ] Handle success response (close form, show feedback)
  - [ ] Handle error response (display error message)
  - [ ] Implement optimistic UI update for Pantry View
  - [ ] **Testing:** E2E test adding a food item through the UI
- [ ] **Add "Add Item" Trigger to Pantry View (AC: User can access form)**
  - [ ] Add grocery bag icon or "Add Item" button to Pantry View
  - [ ] Connect button to open `AddFoodItemForm`
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] **Testing:** Verify button opens form when clicked

## Dev Notes

### Relevant architecture patterns and constraints
*   Client-server architecture with Next.js API Routes handling backend logic.
*   Prisma ORM for type-safe database interactions with Supabase PostgreSQL.
*   NextAuth.js for authentication and authorization.
*   Optimistic UI updates for enhanced perceived performance.
*   Client-side and server-side validation for data integrity and security.
*   "Farmhouse Kitchen" aesthetic using Tailwind CSS and shadcn/ui components.

### Source tree components to touch
*   `prisma/schema.prisma` - Add FoodItem model
*   `app/api/inventory/add/route.ts` - Create POST endpoint
*   `components/pantry/AddFoodItemForm.tsx` - Create form component
*   `components/pantry/KitchenObjectNav.tsx` - Add trigger button
*   `app/pantry/page.tsx` - Integrate add functionality

### Testing standards summary
*   **Unit Tests:** API route validation logic, form validation functions, Prisma data access methods.
*   **Integration Tests:** API route with database interactions, authentication flow.
*   **End-to-End (E2E) Tests:** Complete user flow from clicking add button to seeing new item in pantry.
*   **UI/UX Tests:** Visual aesthetic, responsiveness, accessibility (WCAG 2.1 AA), form usability.

### Project Structure Notes

This story builds on Epic 1 (User authentication and session management). The authenticated user context is required to associate food items with specific users.

### References

*   **Epics:** `docs/epics.md#Epic-2`
*   **PRD:** `docs/PRD.md#FR-002.1`
*   **Architecture:** `docs/architecture.md#Data-Model` (FoodItem)
*   **UX Design Specification:** `docs/ux-design-specification.md#Component-Library`
*   **Epic Technical Specification (Epic 2):** `docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.1`

## Dev Agent Record

### Context Reference

*   2-1-add-food-item-to-inventory.context.xml

### Agent Model Used

### Debug Log References

### Completion Notes
**Completed:**
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List

### File List
*   `docs/sprint-artifacts/2-1-add-food-item-to-inventory.md` (created)

### Change Log

- Initialized: 2025-11-30
