# Story 3.3: Smart Recipe Suggestions from Inventory

Status: pending

## Story

As a **User**,
I want to receive personalized recipe suggestions based on my current inventory,
so that I can make the most of my available ingredients and reduce food waste.

## Acceptance Criteria

*   **Given** I am logged in and navigate to the "Recipes" section or a dedicated suggestion area,
*   **When** I request recipe suggestions from my inventory,
*   **Then** the system presents at least 3 recipes that can be made with my available ingredients.
*   **And** the suggestions prioritize recipes that use ingredients nearing expiration (if any).
*   **And** the suggestions are visually appealing and easy to understand.
*   **And** each suggestion shows how many of my ingredients are used and how many are missing.
*   **And** suggestions load within 3 seconds.

## Tasks / Subtasks

- [ ] **Create Recipe Suggestion API Route (AC: Backend endpoint functional)**
  - [ ] Create `/api/recipes/suggest` POST endpoint
  - [ ] Implement authentication check using NextAuth.js to extract userId
  - [ ] Query user's FoodItem inventory via Prisma
  - [ ] Identify ingredients, prioritizing those nearing expiration
  - [ ] Construct ingredient list for Spoonacular API
  - [ ] Query Spoonacular "Find by Ingredients" endpoint
  - [ ] Implement ranking logic for suggestions
  - [ ] Return at least 3 recipe suggestions
  - [ ] Handle edge cases (empty inventory, no matching recipes)
  - [ ] **Testing:** Unit test API route with various inventory scenarios
- [ ] **Implement Expiration Prioritization Logic (AC: Expiring ingredients prioritized)**
  - [ ] Define expiration threshold (e.g., items expiring within 3-5 days)
  - [ ] Query FoodItem table for items with bestBeforeDate within threshold
  - [ ] Weight suggestions to favor recipes using expiring ingredients
  - [ ] Test prioritization algorithm
  - [ ] **Testing:** Verify expiring items are prioritized in suggestions
- [ ] **Implement Recipe Ranking Algorithm (AC: Best matches ranked higher)**
  - [ ] Rank by number of used ingredients (higher is better)
  - [ ] Rank by number of missing ingredients (lower is better)
  - [ ] Apply bonus for recipes using expiring ingredients
  - [ ] Return top-ranked suggestions
  - [ ] **Testing:** Test ranking with various recipe sets
- [ ] **Create RecipeSuggestionList Component (AC: Suggestions display)**
  - [ ] Create `RecipeSuggestionList` client component
  - [ ] Display suggested recipes in grid or list format
  - [ ] Show ingredient match indicators (e.g., "Uses 8 of your ingredients")
  - [ ] Highlight if recipe helps use expiring items
  - [ ] Use RecipeCard component for consistent styling
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] **Testing:** Render component with mock suggestion data
- [ ] **Create Suggestion Trigger UI (AC: User can request suggestions)**
  - [ ] Add "Recipes from My Pantry" button or section
  - [ ] Place trigger in prominent location (recipes page or dashboard)
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] **Testing:** Verify trigger is visible and accessible
- [ ] **Integrate Suggestion Functionality (AC: Suggestions work end-to-end)**
  - [ ] Connect trigger to `/api/recipes/suggest` endpoint
  - [ ] Handle loading state during suggestion generation
  - [ ] Display suggestions when received
  - [ ] Handle empty results (e.g., "No recipes found for your inventory")
  - [ ] Handle errors gracefully
  - [ ] Ensure suggestions load within 3 seconds
  - [ ] **Testing:** E2E test requesting and displaying suggestions
- [ ] **Implement Ingredient Match Count Display (AC: Match info shown)**
  - [ ] Display "Used Ingredients" count for each suggestion
  - [ ] Display "Missing Ingredients" count for each suggestion
  - [ ] Show visual indicator (e.g., badge, progress bar)
  - [ ] Ensure clarity and accessibility
  - [ ] **Testing:** Verify counts are accurate and displayed
- [ ] **Add Expiring Ingredient Highlight (AC: Expiring items highlighted)**
  - [ ] Add visual indicator for recipes using expiring ingredients
  - [ ] Use color coding or badge (e.g., "Helps use expiring items")
  - [ ] Ensure indicator is noticeable but not intrusive
  - [ ] **Testing:** Verify indicator appears for relevant recipes

## Dev Notes

### Relevant architecture patterns and constraints
*   Client-server architecture with Next.js API Routes.
*   Integration with user inventory from Epic 2 (FoodItem table).
*   External API integration with Spoonacular "Find by Ingredients" endpoint.
*   Complex ranking algorithm for suggestion quality.
*   Performance optimization targeting <3s suggestion generation.
*   Caching strategy to reduce API calls and improve response time.
*   NextAuth.js for authentication and user context.
*   "Farmhouse Kitchen" aesthetic using Tailwind CSS and shadcn/ui.

### Source tree components to touch
*   `app/api/recipes/suggest/route.ts` - Suggestion endpoint
*   `lib/recipe-suggestion-engine.ts` - Ranking and prioritization logic
*   `lib/spoonacular-client.ts` - Spoonacular API client (extend for "Find by Ingredients")
*   `components/recipes/RecipeSuggestionList.tsx` - Suggestion display component
*   `components/recipes/SuggestionTrigger.tsx` - Trigger button/section
*   `app/recipes/page.tsx` - Integrate suggestion section
*   `app/dashboard/page.tsx` - Optional: Add suggestions to dashboard

### Testing standards summary
*   **Unit Tests:** Ranking algorithm, expiration prioritization, ingredient list construction, API route logic.
*   **Integration Tests:** API route with Prisma and Spoonacular API, suggestion generation flow.
*   **End-to-End (E2E) Tests:** Request suggestions from UI, verify results displayed, test with different inventory states.
*   **Performance Tests:** Measure suggestion generation time (<3s), test with large inventories.
*   **Edge Case Tests:** Empty inventory, no matches, all ingredients expiring, very large inventory.
*   **UI/UX Tests:** Visual aesthetic, responsiveness, accessibility, clarity of match indicators.

### Project Structure Notes

This story is a core feature of Epic 3 and directly integrates with Epic 2's inventory management. The quality of suggestions depends heavily on the ranking algorithm and Spoonacular API results. May require iterative tuning based on user feedback.

### References

*   **Epics:** `docs/epics.md#Epic-3`
*   **PRD:** `docs/PRD.md#FR-003.2`, `FR-003.3`
*   **Architecture:** `docs/architecture.md#Backend-Architecture`, `External-APIs`
*   **UX Design Specification:** `docs/ux-design-specification.md#Recipe-Suggestions`
*   **Epic Technical Specification (Epic 3):** `docs/sprint-artifacts/tech-spec-epic-3.md#Story-3.3`

## Dev Agent Record

### Context Reference

*   3-3-smart-recipe-suggestions-from-inventory.context.xml

### Agent Model Used

### Debug Log References

### Completion Notes
**Completed:**
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List

### File List
*   `docs/sprint-artifacts/3-3-smart-recipe-suggestions-from-inventory.md` (created)

### Change Log

- Initialized: 2025-11-30
