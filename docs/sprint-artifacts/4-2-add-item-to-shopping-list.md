# Story 4.2: Add Item to Shopping List

Status: pending

## Story

As a **User**,
I want to add items to my shopping list either manually or from missing recipe ingredients,
so that I can efficiently plan my grocery shopping.

## Acceptance Criteria

*   **Given** I am logged in,
*   **When** I manually input an item into my shopping list with at least a name,
*   **Then** the item is successfully added to my shopping list.
*   **And** I can optionally provide quantity, unit, category, and notes for the item.
*   **And** when viewing a recipe with missing ingredients, I can add those missing ingredients to my shopping list with a single action (e.g., "Add All to Shopping List" button).
*   **And** the system prevents or handles duplicate items intelligently (e.g., skip duplicates or merge quantities).
*   **And** the shopping list UI is clear, intuitive, and easy to use.
*   **And** the add item flow is responsive and accessible.
*   **And** items added from recipes are marked with their source for context.

## Tasks / Subtasks

- [ ] **Update Prisma Schema for Shopping List (AC: Data model ready)**
  - [ ] Add `ShoppingList` model to Prisma schema
  - [ ] Define fields: id, userId, createdAt, updatedAt
  - [ ] Add `ShoppingListItem` model to Prisma schema
  - [ ] Define fields: id, name, quantity, unit, category, isPurchased, notes, addedFrom, recipeId, shoppingListId, createdAt, updatedAt
  - [ ] Add relations between models
  - [ ] Run Prisma migration to create database tables
  - [ ] **Testing:** Verify schema migration successful
- [ ] **Create Manual Add API Route (AC: Manual adding functional)**
  - [ ] Create `/api/shopping-list/add-manual` POST endpoint
  - [ ] Implement authentication check using NextAuth.js
  - [ ] Validate request body (name required, other fields optional)
  - [ ] Find or create ShoppingList for user
  - [ ] Create new ShoppingListItem with addedFrom: "manual"
  - [ ] Return created item with success message
  - [ ] Handle validation errors and return appropriate error messages
  - [ ] **Testing:** Unit test API route with valid/invalid data
- [ ] **Create Add from Recipe API Route (AC: Recipe ingredient adding functional)**
  - [ ] Create `/api/shopping-list/add-from-recipe` POST endpoint
  - [ ] Implement authentication check using NextAuth.js
  - [ ] Validate request body (recipeId and ingredients array required)
  - [ ] Find or create ShoppingList for user
  - [ ] Implement duplicate detection logic (check by item name)
  - [ ] Create ShoppingListItems for each ingredient with addedFrom: "recipe"
  - [ ] Return list of items added and duplicatesSkipped count
  - [ ] Handle errors gracefully
  - [ ] **Testing:** Test with various ingredient arrays and duplicate scenarios
- [ ] **Create AddShoppingListForm Component (AC: Manual add UI complete)**
  - [ ] Create `AddShoppingListForm` client component
  - [ ] Implement form with input fields (name required, quantity, unit, category, notes optional)
  - [ ] Use shadcn/ui components (Input, Select, Textarea, Button)
  - [ ] Implement client-side validation (name not empty)
  - [ ] Add form submit handler
  - [ ] Connect to `/api/shopping-list/add-manual` endpoint
  - [ ] Display success/error feedback (toast or inline message)
  - [ ] Clear form after successful submission
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] **Testing:** Test form with valid/invalid inputs
- [ ] **Create QuickAddButton Component (AC: Quick add accessible)**
  - [ ] Create `QuickAddButton` client component (floating action button)
  - [ ] Implement button that opens AddShoppingListForm in modal or drawer
  - [ ] Style as prominent but non-intrusive UI element
  - [ ] Ensure accessible (aria-labels, keyboard accessible)
  - [ ] Position appropriately for easy access
  - [ ] **Testing:** Verify button opens form correctly
- [ ] **Create RecipeIngredientSelector Component (AC: Recipe integration complete)**
  - [ ] Create `RecipeIngredientSelector` client component
  - [ ] Display missing ingredients from recipe comparison
  - [ ] Add checkbox selection for individual ingredients
  - [ ] Add "Add All to Shopping List" button
  - [ ] Add "Add Selected to Shopping List" button
  - [ ] Connect to `/api/shopping-list/add-from-recipe` endpoint
  - [ ] Display confirmation message with items added count
  - [ ] Show duplicate information if applicable
  - [ ] Update button state after adding (e.g., "Added" or disable)
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] **Testing:** Test adding all vs selected ingredients
- [ ] **Integrate RecipeIngredientSelector into Recipe Detail View (AC: Integration seamless)**
  - [ ] Add RecipeIngredientSelector to recipe detail page
  - [ ] Fetch user's current inventory
  - [ ] Compare recipe ingredients with inventory
  - [ ] Pass missing ingredients to RecipeIngredientSelector
  - [ ] Handle state updates after adding to shopping list
  - [ ] **Testing:** View recipe and add missing ingredients
- [ ] **Implement Duplicate Detection Logic (AC: Duplicates handled intelligently)**
  - [ ] Create utility function for item name comparison
  - [ ] Implement case-insensitive matching
  - [ ] Handle basic variations (e.g., "tomato" vs "tomatoes")
  - [ ] Decide on skip vs merge strategy (MVP: skip duplicates)
  - [ ] Document duplicate handling behavior
  - [ ] **Testing:** Test with exact matches, case variations, plural forms
- [ ] **Add Success Feedback Mechanisms (AC: User receives clear feedback)**
  - [ ] Implement toast notifications for successful additions
  - [ ] Show inline success messages
  - [ ] Update UI to reflect new items added
  - [ ] Provide link to shopping list after adding items
  - [ ] Handle and display error messages clearly
  - [ ] **Testing:** Verify all feedback mechanisms work correctly
- [ ] **Ensure Form Responsiveness and Accessibility (AC: UI accessible)**
  - [ ] Test forms on mobile, tablet, and desktop
  - [ ] Verify WCAG 2.1 AA compliance
  - [ ] Test keyboard navigation for all form elements
  - [ ] Add appropriate ARIA labels and roles
  - [ ] Ensure sufficient color contrast
  - [ ] Test with screen readers
  - [ ] **Testing:** Accessibility audit with automated tools
- [ ] **Optimize Add Item Performance (AC: Quick response)**
  - [ ] Ensure API routes respond within 300ms (90th percentile)
  - [ ] Implement optimistic UI updates
  - [ ] Add rollback mechanisms for failed operations
  - [ ] Measure and monitor API response times
  - [ ] **Testing:** Performance test with various item counts

## Dev Notes

### Relevant architecture patterns and constraints
*   Next.js API Routes for shopping list CRUD operations.
*   Client Components for interactive forms and buttons.
*   Prisma ORM for database interactions.
*   NextAuth.js for authentication and authorization.
*   Integration with Epic 2 (Inventory Management) for ingredient comparison.
*   Integration with Epic 3 (Recipe Discovery) for recipe ingredient extraction.
*   Duplicate detection strategy (simple name-based matching for MVP).
*   Optimistic UI updates with rollback for failed operations.
*   "Farmhouse Kitchen" aesthetic using Tailwind CSS and shadcn/ui.
*   Performance optimization targeting <300ms API response time.

### Source tree components to touch
*   `prisma/schema.prisma` - Add ShoppingList and ShoppingListItem models
*   `app/api/shopping-list/add-manual/route.ts` - Manual add endpoint
*   `app/api/shopping-list/add-from-recipe/route.ts` - Recipe ingredient add endpoint
*   `components/shopping-list/AddShoppingListForm.tsx` - Manual add form
*   `components/shopping-list/QuickAddButton.tsx` - Quick add button
*   `components/recipes/RecipeIngredientSelector.tsx` - Recipe ingredient selector
*   `app/recipes/[id]/page.tsx` - Integrate ingredient selector into recipe detail
*   `lib/duplicate-detector.ts` - Duplicate detection utility
*   `lib/ingredient-comparison.ts` - Compare recipe ingredients with inventory

### Testing standards summary
*   **Unit Tests:** API route validation, duplicate detection logic, form validation, component rendering.
*   **Integration Tests:** API routes with database, authentication flow, recipe integration, inventory comparison.
*   **End-to-End (E2E) Tests:** Complete flow from manual add to shopping list, recipe ingredient addition to shopping list.
*   **Performance Tests:** API response time (<300ms), form submission responsiveness.
*   **UI/UX Tests:** Visual aesthetic, form usability, button placement, feedback mechanisms, responsiveness, accessibility (WCAG 2.1 AA).
*   **Edge Case Tests:** Adding with only required fields, adding with all optional fields, duplicate items, empty ingredient list, very long item names, special characters in names.
*   **Security Testing:** Authentication on all routes, user isolation, input validation to prevent injection attacks.

### Project Structure Notes

This story builds the foundation for shopping list functionality and integrates with both Epic 2 (Inventory) and Epic 3 (Recipes). The duplicate detection logic is intentionally simple for MVP and can be enhanced in future iterations. The add-from-recipe functionality is a key differentiator and should provide a seamless user experience.

### References

*   **Epics:** `docs/epics.md#Epic-4`
*   **PRD:** `docs/PRD.md#FR-006.1, FR-006.2`
*   **Architecture:** `docs/architecture.md#Backend-Architecture`
*   **UX Design Specification:** `docs/ux-design-specification.md#Shopping-List-Components`
*   **Epic Technical Specification (Epic 4):** `docs/sprint-artifacts/tech-spec-epic-4.md#Story-4.2`

## Dev Agent Record

### Context Reference

*   4-2-add-item-to-shopping-list.context.xml

### Agent Model Used

### Debug Log References

### Completion Notes
**Completed:**
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing, both manual and recipe-based adding functional

### Completion Notes List

### File List
*   `docs/sprint-artifacts/4-2-add-item-to-shopping-list.md` (created)

### Change Log

- Initialized: 2025-12-01
