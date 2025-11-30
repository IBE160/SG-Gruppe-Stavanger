# Story 3.1: Browse & Search Recipes

Status: pending

## Story

As a **User**,
I want to browse and search recipes from a recipe database,
so that I can discover new dishes to cook with my available ingredients.

## Acceptance Criteria

*   **Given** I am logged in and navigate to the "Recipes" section,
*   **When** I view the recipe library,
*   **Then** I see a collection of recipes displayed as charming recipe cards (UX Ref: `ux-design-specification.md` section 6.1, "RecipeCard").
*   **And** I can search for recipes by keywords (e.g., "chicken," "pasta").
*   **And** the search results load within 2 seconds.
*   **And** each recipe card shows key information (e.g., title, main image, ready in minutes, servings).
*   **And** the UI adheres to the "Farmhouse Kitchen" aesthetic and is responsive.
*   **And** the interface is accessible (WCAG 2.1 AA).

## Tasks / Subtasks

- [ ] **Create Recipe Search API Route (AC: Backend endpoint functional)**
  - [ ] Create `/api/recipes/search` GET endpoint
  - [ ] Implement authentication check using NextAuth.js
  - [ ] Integrate Spoonacular API client for recipe search
  - [ ] Implement query parameter handling (query, number, offset)
  - [ ] Implement response caching for better performance
  - [ ] Handle Spoonacular API errors (rate limits, timeouts, service unavailable)
  - [ ] Return appropriate success/error responses
  - [ ] **Testing:** Unit test API route with valid/invalid queries
- [ ] **Create Recipe Detail Fetch API Route (AC: Backend endpoint functional)**
  - [ ] Create `/api/recipes/[id]` GET endpoint
  - [ ] Implement authentication check using NextAuth.js
  - [ ] Integrate Spoonacular API for detailed recipe fetch
  - [ ] Implement response caching with appropriate TTL
  - [ ] Handle recipe not found scenarios
  - [ ] **Testing:** Unit test API route with valid/invalid recipe IDs
- [ ] **Create Spoonacular API Client Service (AC: External API integration)**
  - [ ] Create Spoonacular API client service layer
  - [ ] Implement authentication with API key from environment variables
  - [ ] Implement rate limiting logic
  - [ ] Implement caching mechanism with TTL
  - [ ] Create error handling for API failures
  - [ ] **Testing:** Test API client with various scenarios
- [ ] **Create RecipeCard Component (AC: Recipe visualization)**
  - [ ] Create `RecipeCard` client component
  - [ ] Display recipe thumbnail, title, readyInMinutes, and servings
  - [ ] Style according to "Farmhouse Kitchen" aesthetic using shadcn/ui
  - [ ] Implement click handler for navigation to recipe detail
  - [ ] Ensure responsive design
  - [ ] Add accessibility features (aria-labels, keyboard navigation)
  - [ ] **Testing:** Render component with mock recipe data
- [ ] **Create RecipeSearchBar Component (AC: Search UI complete)**
  - [ ] Create `RecipeSearchBar` client component
  - [ ] Implement search input with shadcn/ui Input component
  - [ ] Add search button or enter-to-search functionality
  - [ ] Implement debouncing for search queries
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] Ensure accessibility
  - [ ] **Testing:** Verify search triggers correctly
- [ ] **Create RecipeBrowseView Server Component (AC: Recipe library page)**
  - [ ] Create `/app/recipes/page.tsx` server component
  - [ ] Implement authentication check and redirect if not logged in
  - [ ] Fetch initial popular/trending recipes
  - [ ] Pass data to client components
  - [ ] Set up page layout with "Farmhouse Kitchen" styling
  - [ ] **Testing:** Verify route is accessible to authenticated users
- [ ] **Integrate Search Functionality (AC: Search works end-to-end)**
  - [ ] Connect RecipeSearchBar to `/api/recipes/search` endpoint
  - [ ] Handle search results and update display
  - [ ] Implement loading states during search
  - [ ] Handle empty search results
  - [ ] Display error messages for failed searches
  - [ ] Ensure search results load within 2 seconds
  - [ ] **Testing:** E2E test searching recipes through the UI
- [ ] **Implement Pagination for Search Results (AC: User can browse results)**
  - [ ] Add pagination UI controls
  - [ ] Implement offset-based pagination
  - [ ] Update API calls with offset parameter
  - [ ] Handle navigation between pages
  - [ ] **Testing:** Verify pagination works correctly

## Dev Notes

### Relevant architecture patterns and constraints
*   Client-server architecture with Next.js API Routes handling backend logic.
*   Next.js Server Components for efficient initial data fetching.
*   Client Components for interactive elements (search, cards).
*   External API integration with Spoonacular API.
*   Caching strategy for API responses to reduce latency and costs.
*   Rate limiting to prevent API abuse and manage costs.
*   NextAuth.js for authentication and authorization.
*   "Farmhouse Kitchen" aesthetic using Tailwind CSS and shadcn/ui components.
*   Performance optimization targeting <2s load time.

### Source tree components to touch
*   `app/recipes/page.tsx` - Recipe browse view server component
*   `app/api/recipes/search/route.ts` - Search endpoint
*   `app/api/recipes/[id]/route.ts` - Recipe detail endpoint
*   `lib/spoonacular-client.ts` - Spoonacular API client service
*   `components/recipes/RecipeCard.tsx` - Recipe card component
*   `components/recipes/RecipeSearchBar.tsx` - Search bar component
*   `components/recipes/RecipePagination.tsx` - Pagination controls

### Testing standards summary
*   **Unit Tests:** API route validation, Spoonacular client methods, caching logic, component rendering.
*   **Integration Tests:** API routes with Spoonacular API, authentication flow, caching behavior.
*   **End-to-End (E2E) Tests:** Complete user flow from browsing to searching recipes.
*   **Performance Tests:** Measure search response time (<2s), page load time, cache effectiveness.
*   **UI/UX Tests:** Visual aesthetic, responsiveness, accessibility (WCAG 2.1 AA).
*   **External API Tests:** Spoonacular API integration, error handling, rate limiting.

### Project Structure Notes

This story is the foundation of Epic 3 and provides the basic recipe browsing and searching functionality. It integrates with the Spoonacular API and sets up the infrastructure for subsequent stories. Requires active Spoonacular API subscription.

### References

*   **Epics:** `docs/epics.md#Epic-3`
*   **PRD:** `docs/PRD.md#FR-003.1`
*   **Architecture:** `docs/architecture.md#External-APIs` (Spoonacular)
*   **UX Design Specification:** `docs/ux-design-specification.md#Recipe-Components`
*   **Epic Technical Specification (Epic 3):** `docs/sprint-artifacts/tech-spec-epic-3.md#Story-3.1`

## Dev Agent Record

### Context Reference

*   3-1-browse-search-recipes.context.xml

### Agent Model Used

### Debug Log References

### Completion Notes
**Completed:**
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List

### File List
*   `docs/sprint-artifacts/3-1-browse-search-recipes.md` (created)

### Change Log

- Initialized: 2025-11-30
