# Story 2.2: View Inventory

**Date:** 2025-11-29
**Author:** BIP
**Status:** drafted

---

## User Story

As a user, I want to view all items in my inventory, so that I can see what food I have.

## Acceptance Criteria

- **AC1:** A logged-in user can view a list of all their inventory items on the inventory page.
- **AC2:** Each item in the list displays its name, quantity, unit, and expiration date.
- **AC3:** The inventory list is sorted by expiration date, with the soonest-expiring items at the top.
- **AC4:** Items nearing their expiration date have a color-coded border for quick visual identification, as per the UX specification.
- **AC5:** The API endpoint for fetching the inventory is secure and only returns items belonging to the authenticated user.
- **AC6:** The UI gracefully handles an empty state, displaying a friendly message and a call-to-action to add the first item.

## Tasks

- **T1 (Backend):** Create the API route file `app/api/inventory/route.ts` if it doesn't exist.
- **T2 (Backend):** Implement the `GET` request handler in the API route to fetch inventory items for the authenticated user. (AC: 1, 2, 3, 5)
- **T3 (Backend):** Ensure the database query sorts items by `expiration_date` in ascending order. (AC: 3)
- **T4 (Frontend):** Create the UI component file `components/specific/InventoryList.tsx`. (AC: 1, 2, 3, 4, 6)
- **T5 (Frontend):** Build the UI to display the list of inventory items using the `Recipe Card` component as a base for styling. (AC: 2, 4)
- **T6 (Frontend):** Implement the logic to apply the color-coded border based on the expiration date. (AC: 4)
- **T7 (Frontend):** Implement the data fetching logic on the inventory page to call the `GET /api/inventory` endpoint. (AC: 1)
- **T8 (Frontend):** Implement the empty state UI when no inventory items are returned. (AC: 6)
- **T9 (Testing):** Write an integration test for the `GET /api/inventory` endpoint to verify that it is secure and only returns items belonging to the authenticated user. (AC: 5)
- **T10 (Testing):** Write an E2E test to verify that a logged-in user can navigate to the inventory page and see their list of items. (AC: 1)
- **T11 (Testing):** Write an E2E test to verify that each item in the list displays its name, quantity, unit, and expiration date. (AC: 2)
- **T12 (Testing):** Write a unit test for the `InventoryList.tsx` component to verify that the inventory list is sorted by expiration date. (AC: 3)
- **T13 (Testing):** Write a unit test for the `InventoryList.tsx` component to verify that items nearing their expiration date have a color-coded border. (AC: 4)
- **T14 (Testing):** Write a unit test for the `InventoryList.tsx` component to verify that it gracefully handles an empty state. (AC: 6)

## Developer Notes

### Requirements Context
- This story implements `FR2.2 - View Inventory` from the `docs/PRD.md` (section: "Functional Requirements Inventory").
- This is a core part of Epic 2: Inventory Management, as defined in `docs/epics.md` (section: "Epic 2: Inventory Management").
- **Note on ACs:** Acceptance criteria are derived from `docs/epics.md` for story 2.2. AC4 is further detailed in the `docs/ux-design-specification.md`.

### Architectural Context
- **Source:** `docs/architecture.md`
- **API Pattern:** Use the existing RESTful API pattern in Next.js API Routes.
- **Authentication:** Endpoint must be protected by NextAuth.js. RLS policies on the `inventory` table are critical.
- **Project Structure:**
  - UI Page: `app/(main)/inventory/page.tsx`
  - UI Component: `components/specific/InventoryList.tsx`

### UX and Testing Context
- **UX Source:** `docs/ux-design-specification.md`
- The inventory list is a primary screen and must be mobile-first.
- The `Expiration Color-Coded Border` is a key UX feature for at-a-glance information.
- **Testing Source:** `docs/architecture.md` (section: "Testing Strategy")
- Follow the multi-layered testing strategy.

### Learnings from Previous Story (2.1)
- The previous story (`2-1-add-food-item.md`) established the `POST /api/inventory` endpoint and the `AddItemForm.tsx` component.
- This story will build on that by creating the corresponding `GET` endpoint and the list view component.
- Consistency in data validation and error handling between the `POST` and `GET` operations is important.

## Change Log

*   **2025-11-29:** Initial draft created by SM agent.
*   **2025-11-29:** Updated based on validation report to improve test coverage and add citations.

---

## Dev Agent Record

*   **Context Reference:** 
*   **Agent Model Used:** Gemini 2.5 Pro and Flesh (in #yolo mode)
*   **Debug Log References:**
*   **Completion Notes List:**
*   **File List:**
