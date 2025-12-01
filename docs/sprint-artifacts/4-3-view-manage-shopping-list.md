# Story 4.3: View & Manage Shopping List

Status: pending

## Story

As a **User**,
I want to view and manage my shopping list with full CRUD capabilities,
so that I can efficiently track items I need to purchase and update the list as I shop.

## Acceptance Criteria

*   **Given** I am logged in,
*   **When** I navigate to my shopping list,
*   **Then** I see all items currently on my list organized in a clear format.
*   **And** I can mark items as purchased using a checkbox or similar interaction.
*   **And** purchased items are visually distinguished (e.g., strike-through, moved to separate section).
*   **And** I can edit individual items (name, quantity, unit, category, notes).
*   **And** I can delete individual items from the list.
*   **And** I can clear all purchased items at once with a confirmation.
*   **And** the shopping list displays useful statistics (e.g., "3 of 10 items purchased").
*   **And** the shopping list remains organized and easy to read even with many items.
*   **And** the shopping list view is responsive across devices and accessible.

## Tasks / Subtasks

- [ ] **Create Shopping List Get API Route (AC: Backend data retrieval)**
  - [ ] Create `/api/shopping-list` GET endpoint
  - [ ] Implement authentication check using NextAuth.js
  - [ ] Query user's ShoppingList with all ShoppingListItems
  - [ ] Support query parameters (includePurchased, sortBy)
  - [ ] Calculate statistics (totalItems, purchasedItems, pendingItems)
  - [ ] Return shopping list data with items and stats
  - [ ] Handle case where no shopping list exists (return empty)
  - [ ] **Testing:** Unit test API route with various scenarios
- [ ] **Create Shopping List Item Update API Route (AC: Edit and mark purchased functional)**
  - [ ] Create `/api/shopping-list/item/[id]` PUT endpoint
  - [ ] Implement authentication check
  - [ ] Validate item ownership (belongs to user's shopping list)
  - [ ] Support partial updates (name, quantity, unit, category, isPurchased, notes)
  - [ ] Update item in database
  - [ ] Return updated item
  - [ ] Handle not found and unauthorized cases
  - [ ] **Testing:** Test updating various fields
- [ ] **Create Shopping List Item Delete API Route (AC: Delete functional)**
  - [ ] Create `/api/shopping-list/item/[id]` DELETE endpoint
  - [ ] Implement authentication check
  - [ ] Validate item ownership
  - [ ] Delete item from database
  - [ ] Return success message
  - [ ] Handle not found and unauthorized cases
  - [ ] **Testing:** Test deletion with valid/invalid IDs
- [ ] **Create Shopping List Clear API Route (AC: Bulk delete functional)**
  - [ ] Create `/api/shopping-list/clear` DELETE endpoint
  - [ ] Implement authentication check
  - [ ] Support query parameter for mode ("purchased" or "all")
  - [ ] Delete items based on mode (isPurchased: true or all items)
  - [ ] Return count of items deleted
  - [ ] Add confirmation requirement in frontend
  - [ ] **Testing:** Test clearing purchased only vs all items
- [ ] **Create ShoppingListPage Server Component (AC: Page accessible)**
  - [ ] Create `/app/shopping-list/page.tsx` server component
  - [ ] Implement authentication check and redirect if not logged in
  - [ ] Fetch initial shopping list data server-side
  - [ ] Pass data to client components
  - [ ] Set up page layout with "Farmhouse Kitchen" styling
  - [ ] **Testing:** Verify route is accessible to authenticated users
- [ ] **Create ShoppingListView Component (AC: List display complete)**
  - [ ] Create `ShoppingListView` client component
  - [ ] Display all shopping list items
  - [ ] Organize items (group by purchased status or category)
  - [ ] Show statistics (item counts, purchase progress)
  - [ ] Add "Add Item" button
  - [ ] Add "Clear Purchased Items" button
  - [ ] Implement empty state for no items
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] Ensure responsive design
  - [ ] **Testing:** Render component with various data scenarios
- [ ] **Create ShoppingListItem Component (AC: Item interaction complete)**
  - [ ] Create `ShoppingListItem` client component
  - [ ] Display item name, quantity, unit, category, notes
  - [ ] Add checkbox for marking as purchased
  - [ ] Add edit button with icon
  - [ ] Add delete button with icon
  - [ ] Implement visual styling for purchased state (strike-through, dimmed)
  - [ ] Show item source indicator (manual vs recipe)
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] Ensure accessibility (keyboard navigation, ARIA labels)
  - [ ] **Testing:** Test all interactions (check, edit, delete)
- [ ] **Implement Mark as Purchased Functionality (AC: Purchase tracking works)**
  - [ ] Add checkbox change handler to ShoppingListItem
  - [ ] Send PUT request to `/api/shopping-list/item/[id]` with isPurchased
  - [ ] Update UI optimistically
  - [ ] Implement rollback on error
  - [ ] Move item to purchased section or update visual state
  - [ ] Update statistics
  - [ ] **Testing:** Mark items as purchased and verify state changes
- [ ] **Implement Edit Item Functionality (AC: Edit works)**
  - [ ] Create edit modal or inline edit form
  - [ ] Pre-populate form with current item data
  - [ ] Allow editing name, quantity, unit, category, notes
  - [ ] Send PUT request to `/api/shopping-list/item/[id]` on save
  - [ ] Update UI with edited data
  - [ ] Handle validation errors
  - [ ] Close form after successful save
  - [ ] **Testing:** Edit various fields and verify updates
- [ ] **Implement Delete Item Functionality (AC: Delete works)**
  - [ ] Add delete button click handler
  - [ ] Show confirmation dialog (optional but recommended)
  - [ ] Send DELETE request to `/api/shopping-list/item/[id]`
  - [ ] Remove item from UI optimistically
  - [ ] Implement rollback on error
  - [ ] Update statistics
  - [ ] **Testing:** Delete items and verify removal
- [ ] **Implement Clear Purchased Items Functionality (AC: Bulk clear works)**
  - [ ] Add "Clear Purchased Items" button click handler
  - [ ] Show confirmation dialog with item count
  - [ ] Send DELETE request to `/api/shopping-list/clear?mode=purchased`
  - [ ] Remove purchased items from UI
  - [ ] Update statistics
  - [ ] Show success message with count deleted
  - [ ] **Testing:** Clear purchased items and verify behavior
- [ ] **Implement Shopping List Statistics Display (AC: Stats visible)**
  - [ ] Create statistics component or section
  - [ ] Display total items, purchased count, pending count
  - [ ] Show progress indicator (e.g., "3 of 10 items purchased")
  - [ ] Update statistics in real-time as items change
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] **Testing:** Verify stats accuracy with various item states
- [ ] **Implement Sorting and Organization (AC: List organized)**
  - [ ] Group items by purchase status (pending vs purchased)
  - [ ] Optional: Group items by category
  - [ ] Implement sorting options (by name, date added, category)
  - [ ] Add UI controls for sort/filter preferences
  - [ ] Maintain organization with many items
  - [ ] **Testing:** Test with varying numbers of items and categories
- [ ] **Optimize Shopping List Performance (AC: Fast load and updates)**
  - [ ] Ensure shopping list loads within 1.5 seconds
  - [ ] Optimize database queries with proper indexes
  - [ ] Implement efficient re-rendering strategies
  - [ ] Use optimistic updates for immediate feedback
  - [ ] Measure update/delete response times (<200ms target)
  - [ ] **Testing:** Performance test with 100+ items
- [ ] **Ensure Responsive Design and Accessibility (AC: UI responsive and accessible)**
  - [ ] Test layout on mobile, tablet, and desktop
  - [ ] Verify WCAG 2.1 AA compliance
  - [ ] Test keyboard navigation for all actions
  - [ ] Test with screen readers
  - [ ] Ensure sufficient color contrast
  - [ ] Add appropriate ARIA labels and roles
  - [ ] **Testing:** Accessibility audit with automated tools and manual testing
- [ ] **Implement Error Handling and Edge Cases (AC: Robust functionality)**
  - [ ] Handle empty shopping list gracefully
  - [ ] Handle network errors during operations
  - [ ] Implement retry mechanisms for failed requests
  - [ ] Show user-friendly error messages
  - [ ] Test concurrent edits and race conditions
  - [ ] **Testing:** Simulate various error scenarios

## Dev Notes

### Relevant architecture patterns and constraints
*   Next.js Server Components for initial data fetching.
*   Client Components for interactive shopping list management.
*   Next.js API Routes for all CRUD operations.
*   Prisma ORM for database interactions.
*   NextAuth.js for authentication and authorization.
*   Optimistic UI updates with rollback mechanisms.
*   Real-time statistics calculation and display.
*   Efficient re-rendering strategies for large lists.
*   "Farmhouse Kitchen" aesthetic using Tailwind CSS and shadcn/ui.
*   Performance optimization targeting <1.5s load time and <200ms update time.
*   Accessibility compliance (WCAG 2.1 AA).

### Source tree components to touch
*   `app/shopping-list/page.tsx` - Shopping list page server component
*   `app/api/shopping-list/route.ts` - Get shopping list endpoint
*   `app/api/shopping-list/item/[id]/route.ts` - Update and delete item endpoints
*   `app/api/shopping-list/clear/route.ts` - Clear items endpoint
*   `components/shopping-list/ShoppingListView.tsx` - Main list view component
*   `components/shopping-list/ShoppingListItem.tsx` - Individual item component
*   `components/shopping-list/ShoppingListStats.tsx` - Statistics display
*   `components/shopping-list/EditItemModal.tsx` - Edit item form/modal
*   `components/ui/ConfirmDialog.tsx` - Confirmation dialog for deletions
*   `lib/shopping-list-utils.ts` - Utility functions for shopping list operations

### Testing standards summary
*   **Unit Tests:** API route validation, component rendering, statistics calculation, sorting logic.
*   **Integration Tests:** API routes with database, authentication flow, CRUD operations end-to-end.
*   **End-to-End (E2E) Tests:** Complete user flows (view list, mark purchased, edit, delete, clear).
*   **Performance Tests:** Shopping list load time (<1.5s), update/delete response time (<200ms), performance with large lists (100+ items).
*   **UI/UX Tests:** Visual aesthetic, list organization, interaction responsiveness, feedback mechanisms, responsiveness, accessibility (WCAG 2.1 AA).
*   **Edge Case Tests:** Empty list, single item, 100+ items, all items purchased, no items purchased, concurrent edits, network failures.
*   **Security Testing:** Authentication on all routes, authorization for item ownership, user isolation.

### Project Structure Notes

This story completes the shopping list functionality by providing comprehensive viewing and management capabilities. It builds on Stories 4.1 and 4.2 and represents the main interface users will interact with for shopping list management. Performance and usability are critical, especially for users with large shopping lists.

### References

*   **Epics:** `docs/epics.md#Epic-4`
*   **PRD:** `docs/PRD.md#FR-006.1`
*   **Architecture:** `docs/architecture.md#Frontend-Architecture`
*   **UX Design Specification:** `docs/ux-design-specification.md#Shopping-List-Components`
*   **Epic Technical Specification (Epic 4):** `docs/sprint-artifacts/tech-spec-epic-4.md#Story-4.3`

## Dev Agent Record

### Context Reference

*   4-3-view-manage-shopping-list.context.xml

### Agent Model Used

### Debug Log References

### Completion Notes
**Completed:**
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing, full CRUD functionality working

### Completion Notes List

### File List
*   `docs/sprint-artifacts/4-3-view-manage-shopping-list.md` (created)

### Change Log

- Initialized: 2025-12-01
