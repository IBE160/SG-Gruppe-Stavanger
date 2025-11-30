# Story 3.4: Basic Creative Mode for Recipes

Status: pending

## Story

As a **User**,
I want to manually enter a few ingredients to get recipe suggestions,
so that I can explore creative cooking possibilities with specific items I want to use.

## Acceptance Criteria

*   **Given** I am logged in and access the "Creative Mode",
*   **When** I manually input 2-3 ingredients,
*   **And** I submit my selection,
*   **Then** the system returns recipe suggestions from the Spoonacular API that use those ingredients.
*   **And** the UI for inputting ingredients is simple and intuitive.
*   **And** results are displayed in a user-friendly format.
*   **And** the form validates that at least 2 ingredients are entered.

## Tasks / Subtasks

- [ ] **Create Creative Mode API Route (AC: Backend endpoint functional)**
  - [ ] Create `/api/recipes/creative-mode` POST endpoint
  - [ ] Implement authentication check using NextAuth.js
  - [ ] Implement request body validation (minimum 2 ingredients)
  - [ ] Construct ingredient list for Spoonacular API
  - [ ] Query Spoonacular "Find by Ingredients" endpoint
  - [ ] Return recipe suggestions
  - [ ] Handle validation errors (400 Bad Request)
  - [ ] Handle Spoonacular API errors
  - [ ] **Testing:** Unit test API route with valid/invalid ingredient lists
- [ ] **Create CreativeModeForm Component (AC: Input UI complete)**
  - [ ] Create `CreativeModeForm` client component
  - [ ] Implement input fields for 2-3 ingredients
  - [ ] Use shadcn/ui Input components
  - [ ] Add dynamic field addition (up to 3 ingredients initially)
  - [ ] Implement client-side validation (minimum 2 ingredients)
  - [ ] Add submit button
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] Ensure responsive design
  - [ ] Add accessibility features
  - [ ] **Testing:** Render form and verify all fields work
- [ ] **Implement Form Validation (AC: Validates minimum 2 ingredients)**
  - [ ] Add client-side validation on submit
  - [ ] Display error message if <2 ingredients entered
  - [ ] Prevent empty ingredient submissions
  - [ ] Trim whitespace from inputs
  - [ ] **Testing:** Test validation with various input combinations
- [ ] **Create Creative Mode Page/Section (AC: Feature accessible)**
  - [ ] Create `/app/recipes/creative-mode/page.tsx` or add section to recipes page
  - [ ] Implement authentication check
  - [ ] Render CreativeModeForm component
  - [ ] Set up page layout with "Farmhouse Kitchen" styling
  - [ ] Add explanatory text for users
  - [ ] **Testing:** Verify page is accessible to authenticated users
- [ ] **Integrate Form with API (AC: Form submits and receives results)**
  - [ ] Connect form submit to `/api/recipes/creative-mode` endpoint
  - [ ] Handle loading state during API call
  - [ ] Display recipe results when received
  - [ ] Handle API errors and display error messages
  - [ ] Handle empty results scenario
  - [ ] **Testing:** E2E test submitting ingredients and receiving results
- [ ] **Display Creative Mode Results (AC: Results user-friendly)**
  - [ ] Reuse RecipeCard component for displaying results
  - [ ] Display recipes in grid or list format
  - [ ] Show which of user's specified ingredients are used
  - [ ] Show how many additional ingredients are needed
  - [ ] Add "Try Another Combination" or "Reset" button
  - [ ] **Testing:** Verify results display correctly
- [ ] **Add Navigation to Creative Mode (AC: Feature discoverable)**
  - [ ] Add navigation link/button in recipes section
  - [ ] Add icon or visual cue (e.g., "Creative Mode" badge)
  - [ ] Ensure navigation is intuitive
  - [ ] **Testing:** Verify users can easily find and access Creative Mode
- [ ] **Implement Simple and Intuitive UX (AC: UI simple and intuitive)**
  - [ ] Add helpful placeholder text in input fields
  - [ ] Add tooltip or help text explaining the feature
  - [ ] Ensure clear visual feedback during interaction
  - [ ] Test with potential users for usability
  - [ ] **Testing:** Manual UX review and user testing

## Dev Notes

### Relevant architecture patterns and constraints
*   Client-server architecture with Next.js API Routes.
*   External API integration with Spoonacular "Find by Ingredients" endpoint.
*   Client-side and server-side validation for data integrity.
*   Simple, focused UI design for ease of use.
*   NextAuth.js for authentication.
*   "Farmhouse Kitchen" aesthetic using Tailwind CSS and shadcn/ui.
*   Responsive design for all devices.

### Source tree components to touch
*   `app/api/recipes/creative-mode/route.ts` - Creative mode endpoint
*   `app/recipes/creative-mode/page.tsx` - Creative mode page
*   `components/recipes/CreativeModeForm.tsx` - Input form component
*   `components/recipes/CreativeModeResults.tsx` - Results display component
*   `lib/spoonacular-client.ts` - Spoonacular API client (reuse "Find by Ingredients")
*   `app/recipes/page.tsx` - Add navigation to Creative Mode

### Testing standards summary
*   **Unit Tests:** API route validation, form validation logic, ingredient parsing.
*   **Integration Tests:** API route with Spoonacular API, form submission flow.
*   **End-to-End (E2E) Tests:** Complete user flow from entering ingredients to viewing results.
*   **UI/UX Tests:** Visual aesthetic, form usability, responsiveness, accessibility (WCAG 2.1 AA).
*   **Edge Case Tests:** Single ingredient (should fail), empty ingredients, special characters, very long ingredient names.

### Project Structure Notes

This story provides an alternative way to discover recipes beyond inventory-based suggestions. It's a simpler, more exploratory feature that complements Story 3.3. MVP focuses on 2-3 ingredients but can be extended in future iterations.

### References

*   **Epics:** `docs/epics.md#Epic-3`
*   **PRD:** `docs/PRD.md#FR-003.4`
*   **Architecture:** `docs/architecture.md#Frontend-Architecture`
*   **UX Design Specification:** `docs/ux-design-specification.md#Creative-Mode`
*   **Epic Technical Specification (Epic 3):** `docs/sprint-artifacts/tech-spec-epic-3.md#Story-3.4`

## Dev Agent Record

### Context Reference

*   3-4-basic-creative-mode-for-recipes.context.xml

### Agent Model Used

### Debug Log References

### Completion Notes
**Completed:**
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List

### File List
*   `docs/sprint-artifacts/3-4-basic-creative-mode-for-recipes.md` (created)

### Change Log

- Initialized: 2025-11-30
