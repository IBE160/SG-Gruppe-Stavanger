# Story 3.2: View Detailed Recipe Information

Status: pending

## Story

As a **User**,
I want to view detailed information about a recipe including ingredients and instructions,
so that I can understand what I need and how to cook the dish.

## Acceptance Criteria

*   **Given** I am browsing recipes and select a recipe card,
*   **When** I click on a recipe card,
*   **Then** I am navigated to a "Detailed Recipe View" showing the full recipe, ingredients list, and instructions.
*   **And** available ingredients from my inventory are highlighted or checked off.
*   **And** missing ingredients can be easily added to my shopping list.
*   **And** an option to activate "Cooking Mode" is presented (UX Ref: `ux-design-specification.md` section 2.2, "Detailed Recipe View").
*   **And** the detailed view loads within 2 seconds.
*   **And** the UI is responsive and accessible.

## Tasks / Subtasks

- [ ] **Create Recipe Detail Page Route (AC: Detail page accessible)**
  - [ ] Create `/app/recipes/[id]/page.tsx` server component
  - [ ] Implement authentication check and redirect if not logged in
  - [ ] Fetch recipe data using server-side data fetching
  - [ ] Pass recipe data to client components
  - [ ] Set up page layout with "Farmhouse Kitchen" styling
  - [ ] **Testing:** Verify route is accessible with valid recipe ID
- [ ] **Create RecipeDetailView Component (AC: Recipe display complete)**
  - [ ] Create `RecipeDetailView` client component
  - [ ] Display recipe title, image, metadata (time, servings, etc.)
  - [ ] Display ingredients list with quantities and units
  - [ ] Display cooking instructions (parse HTML from Spoonacular)
  - [ ] Display source URL and attribution
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] Ensure responsive design
  - [ ] **Testing:** Render component with mock recipe data
- [ ] **Create IngredientMatchIndicator Component (AC: Inventory matching)**
  - [ ] Create `IngredientMatchIndicator` component
  - [ ] Fetch user's current inventory data
  - [ ] Implement matching logic between recipe ingredients and inventory
  - [ ] Highlight available ingredients (e.g., checkmark, green color)
  - [ ] Display missing ingredients differently (e.g., unchecked, red color)
  - [ ] Handle fuzzy matching for ingredient names
  - [ ] Add accessibility features for visual indicators
  - [ ] **Testing:** Test matching logic with various inventory scenarios
- [ ] **Implement Add to Shopping List Functionality (AC: Missing ingredients can be added)**
  - [ ] Add "Add to Shopping List" button/link for missing ingredients
  - [ ] Integrate with shopping list API (if available) or prepare for future integration
  - [ ] Show confirmation when ingredients added
  - [ ] Handle errors gracefully
  - [ ] **Testing:** Verify ingredients are added to shopping list
- [ ] **Create CookingModePanel Component (AC: Cooking mode accessible)**
  - [ ] Create `CookingModePanel` component
  - [ ] Implement step-by-step instruction view
  - [ ] Add progress tracking for cooking steps
  - [ ] Style as an interactive panel or dialog
  - [ ] Add "Start Cooking" button to activate mode
  - [ ] Ensure accessibility (keyboard navigation, screen reader support)
  - [ ] **Testing:** Verify cooking mode activates and displays correctly
- [ ] **Implement Cooking Mode Toggle (AC: User can activate cooking mode)**
  - [ ] Add "Start Cooking" button in RecipeDetailView
  - [ ] Connect button to CookingModePanel
  - [ ] Implement state management for cooking mode active/inactive
  - [ ] Add "I Cooked This" or similar completion action
  - [ ] **Testing:** Toggle cooking mode on and off
- [ ] **Optimize Performance for Detail View (AC: Loads within 2 seconds)**
  - [ ] Implement server-side caching for recipe data
  - [ ] Optimize image loading (use Next.js Image component)
  - [ ] Implement loading states
  - [ ] Test load time with various recipe sizes
  - [ ] **Testing:** Measure page load time with Lighthouse
- [ ] **Ensure Responsive Design and Accessibility (AC: UI responsive and accessible)**
  - [ ] Test layout on mobile, tablet, and desktop
  - [ ] Verify WCAG 2.1 AA compliance
  - [ ] Test keyboard navigation
  - [ ] Test with screen readers
  - [ ] **Testing:** Accessibility audit with automated tools

## Dev Notes

### Relevant architecture patterns and constraints
*   Next.js Server Components for efficient initial data fetching.
*   Client Components for interactive elements (cooking mode, ingredient matching).
*   Integration with user inventory data from Epic 2.
*   Fuzzy matching algorithm for ingredient comparison.
*   Separation of concerns between data fetching and presentation.
*   Performance optimization targeting <2s load time.
*   "Farmhouse Kitchen" aesthetic throughout the UI.
*   Accessibility compliance (WCAG 2.1 AA).

### Source tree components to touch
*   `app/recipes/[id]/page.tsx` - Recipe detail page server component
*   `components/recipes/RecipeDetailView.tsx` - Main detail view component
*   `components/recipes/IngredientMatchIndicator.tsx` - Ingredient matching component
*   `components/recipes/CookingModePanel.tsx` - Cooking mode interface
*   `lib/ingredient-matcher.ts` - Ingredient matching logic
*   `app/api/inventory/route.ts` - May need to fetch inventory data

### Testing standards summary
*   **Unit Tests:** Ingredient matching logic, component rendering, state management.
*   **Integration Tests:** Recipe detail page with inventory data, shopping list integration.
*   **End-to-End (E2E) Tests:** Navigate from recipe card to detail view, activate cooking mode, add to shopping list.
*   **Performance Tests:** Measure detail view load time (<2s).
*   **UI/UX Tests:** Visual aesthetic, responsiveness, accessibility (WCAG 2.1 AA).
*   **Edge Case Tests:** Handle recipes with many ingredients, unusual units, missing inventory items.

### Project Structure Notes

This story builds on Story 3.1 (browse and search) and integrates with Epic 2 (inventory management) for ingredient matching. The ingredient matching logic is critical for user experience and may require iterative refinement.

### References

*   **Epics:** `docs/epics.md#Epic-3`
*   **PRD:** `docs/PRD.md#FR-003.1`
*   **Architecture:** `docs/architecture.md#Frontend-Architecture`
*   **UX Design Specification:** `docs/ux-design-specification.md#Detailed-Recipe-View`
*   **Epic Technical Specification (Epic 3):** `docs/sprint-artifacts/tech-spec-epic-3.md#Story-3.2`

## Dev Agent Record

### Context Reference

*   3-2-view-detailed-recipe-information.context.xml

### Agent Model Used

### Debug Log References

### Completion Notes
**Completed:**
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List

### File List
*   `docs/sprint-artifacts/3-2-view-detailed-recipe-information.md` (created)

### Change Log

- Initialized: 2025-11-30
