# Story 3.5: Automatic Inventory Update after Cooking

Status: pending

## Story

As a **User**,
I want my inventory to be automatically updated when I cook a recipe,
so that I don't have to manually track what ingredients I've used.

## Acceptance Criteria

*   **Given** I have viewed a recipe and decided to cook it,
*   **When** I confirm that I have cooked the recipe,
*   **Then** the ingredients used in the recipe are automatically deducted from my inventory.
*   **And** a confirmation message is displayed showing which items were updated.
*   **And** if there are insufficient quantities, warnings are shown.
*   **And** the inventory update completes within 1 second.
*   **And** the updated inventory is immediately reflected in the Pantry View.

## Tasks / Subtasks

- [ ] **Create Inventory Consumption API Route (AC: Backend endpoint functional)**
  - [ ] Create `/api/inventory/consume-recipe` POST endpoint
  - [ ] Implement authentication check using NextAuth.js to extract userId
  - [ ] Validate request body (recipeId, optional servings)
  - [ ] Fetch recipe details from Spoonacular API or cache
  - [ ] Parse extendedIngredients to extract names and quantities
  - [ ] Query user's FoodItem inventory via Prisma
  - [ ] Match recipe ingredients with inventory items
  - [ ] Calculate quantities to deduct based on servings
  - [ ] Update FoodItem quantities in Supabase via Prisma
  - [ ] Handle items with zero or negative quantities
  - [ ] Collect warnings for insufficient quantities
  - [ ] Return updated items list and warnings
  - [ ] **Testing:** Unit test API route with various scenarios
- [ ] **Implement Ingredient Matching Logic (AC: Ingredients matched correctly)**
  - [ ] Create matching algorithm (fuzzy matching or exact)
  - [ ] Handle variations in ingredient names
  - [ ] Map recipe ingredients to inventory FoodItem records
  - [ ] Handle unmatched ingredients gracefully
  - [ ] Log unmatched ingredients for debugging
  - [ ] **Testing:** Test matching with various ingredient name variations
- [ ] **Implement Quantity Calculation Logic (AC: Quantities deducted correctly)**
  - [ ] Parse recipe ingredient quantities and units
  - [ ] Convert units if necessary (or handle approximate matching)
  - [ ] Calculate deduction amount based on servings
  - [ ] Handle fractional quantities
  - [ ] Round to appropriate precision
  - [ ] **Testing:** Test calculation with various quantities and units
- [ ] **Implement Inventory Update Transaction (AC: Updates atomic and reliable)**
  - [ ] Use Prisma transaction for updating multiple FoodItems
  - [ ] Ensure atomicity (all-or-nothing update)
  - [ ] Handle database errors and rollback
  - [ ] Update quantities for matched items
  - [ ] Delete items with zero quantity or set to 0 (based on design decision)
  - [ ] **Testing:** Test transaction rollback on error
- [ ] **Handle Insufficient Quantities (AC: Warnings displayed)**
  - [ ] Check if inventory quantity is sufficient before deduction
  - [ ] If insufficient, deduct available amount and set to 0
  - [ ] Collect warning messages for insufficient items
  - [ ] Return warnings in API response
  - [ ] **Testing:** Test with inventory that has insufficient quantities
- [ ] **Create Cooking Confirmation Dialog (AC: User confirms cooking)**
  - [ ] Create confirmation dialog component
  - [ ] Display recipe title and confirmation message
  - [ ] Add "Confirm" and "Cancel" buttons
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] Ensure accessibility
  - [ ] **Testing:** Render dialog and verify interaction
- [ ] **Add "I Cooked This" Button to Recipe Detail (AC: User can trigger update)**
  - [ ] Add button to RecipeDetailView component
  - [ ] Position button prominently (e.g., near "Start Cooking")
  - [ ] Connect button to confirmation dialog
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] **Testing:** Verify button appears and triggers dialog
- [ ] **Integrate Confirmation with API (AC: Cooking triggers update)**
  - [ ] Connect confirmation dialog to `/api/inventory/consume-recipe` endpoint
  - [ ] Send recipeId and servings in request body
  - [ ] Handle loading state during API call
  - [ ] Display confirmation message on success
  - [ ] Display warnings if any
  - [ ] Handle errors and display error messages
  - [ ] **Testing:** E2E test cooking a recipe and updating inventory
- [ ] **Display Update Confirmation and Summary (AC: Confirmation displayed)**
  - [ ] Create confirmation message component
  - [ ] Display success message (e.g., "Great job! Your inventory has been updated.")
  - [ ] Show summary of updated items with before/after quantities
  - [ ] Display warnings for insufficient quantities
  - [ ] Style as toast notification or dialog
  - [ ] **Testing:** Verify confirmation appears with correct data
- [ ] **Implement Optional Undo Feature (AC: User can undo if needed)**
  - [ ] Add "Undo" button to confirmation message
  - [ ] Create `/api/inventory/undo-consumption` endpoint (optional)
  - [ ] Store transaction data for undo (time-limited)
  - [ ] Implement undo logic to reverse inventory changes
  - [ ] Set undo window (e.g., 30 seconds)
  - [ ] **Testing:** Test undo functionality
- [ ] **Update Frontend Inventory State (AC: Pantry View reflects changes)**
  - [ ] Trigger inventory data refresh after cooking confirmation
  - [ ] Implement optimistic UI update (optional)
  - [ ] Update local state or re-fetch inventory data
  - [ ] Ensure Pantry View shows updated quantities
  - [ ] **Testing:** Navigate to Pantry after cooking, verify changes
- [ ] **Optimize Performance (AC: Update completes within 1 second)**
  - [ ] Optimize database queries for inventory updates
  - [ ] Use Prisma batch updates where possible
  - [ ] Minimize API calls to Spoonacular (use cache)
  - [ ] Test with recipes containing many ingredients (up to 20)
  - [ ] **Testing:** Measure update execution time

## Dev Notes

### Relevant architecture patterns and constraints
*   Client-server architecture with Next.js API Routes.
*   Integration with Epic 2 inventory management (FoodItem table).
*   Transactional database updates for data integrity.
*   Complex matching and calculation logic for inventory consumption.
*   Performance optimization targeting <1s update time.
*   Optimistic UI updates with rollback on failure.
*   NextAuth.js for authentication and user context.
*   "Farmhouse Kitchen" aesthetic throughout the UI.

### Source tree components to touch
*   `app/api/inventory/consume-recipe/route.ts` - Consumption endpoint
*   `app/api/inventory/undo-consumption/route.ts` - Undo endpoint (optional)
*   `lib/ingredient-matcher.ts` - Matching logic (shared with Story 3.2)
*   `lib/quantity-calculator.ts` - Quantity calculation logic
*   `components/recipes/CookingConfirmationDialog.tsx` - Confirmation dialog
*   `components/recipes/UpdateSummary.tsx` - Update summary display
*   `components/recipes/RecipeDetailView.tsx` - Add "I Cooked This" button
*   `app/pantry/page.tsx` - Ensure inventory refresh works

### Testing standards summary
*   **Unit Tests:** Ingredient matching, quantity calculation, transaction logic, API route validation.
*   **Integration Tests:** API route with Prisma transactions, inventory update flow, cache integration.
*   **End-to-End (E2E) Tests:** Complete user flow from cooking confirmation to inventory update.
*   **Performance Tests:** Measure update execution time (<1s), test with large recipes.
*   **Edge Case Tests:** Insufficient quantities, unmatched ingredients, zero quantities, unit mismatches.
*   **Data Integrity Tests:** Verify transactional updates, rollback on errors, no partial updates.
*   **UI/UX Tests:** Visual aesthetic, confirmation message clarity, warning display, accessibility.

### Project Structure Notes

This story is critical for the user experience as it automates a tedious manual process. The quality of ingredient matching and quantity calculation directly impacts reliability. Requires careful testing for edge cases and error handling. Consider implementing an undo feature for user confidence.

### References

*   **Epics:** `docs/epics.md#Epic-3`
*   **PRD:** `docs/PRD.md#FR-004.1`
*   **Architecture:** `docs/architecture.md#Backend-Architecture`, `Data-Model`
*   **UX Design Specification:** `docs/ux-design-specification.md#Cooking-Confirmation`
*   **Epic Technical Specification (Epic 3):** `docs/sprint-artifacts/tech-spec-epic-3.md#Story-3.5`

## Dev Agent Record

### Context Reference

*   3-5-automatic-inventory-update-after-cooking.context.xml

### Agent Model Used

### Debug Log References

### Completion Notes
**Completed:**
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List

### File List
*   `docs/sprint-artifacts/3-5-automatic-inventory-update-after-cooking.md` (created)

### Change Log

- Initialized: 2025-11-30
