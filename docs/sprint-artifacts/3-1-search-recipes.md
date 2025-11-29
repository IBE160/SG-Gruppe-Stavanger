# Story 3.1: Search Recipes

Status: drafted

## Story

As a user,
I want to search for recipes,
so that I can find meal ideas.

## Acceptance Criteria

1.  **Authentication:** The user must be logged in to access the recipes page.
2.  **Navigation:** When the user is on the recipes page (`app/(main)/recipes/`), a search input field is visible.
3.  **Search Input:** When the user enters a search query into the input field.
4.  **Live Search:** Search results are displayed immediately as the user types (Live Search pattern per `UX Design Specification.md`).
5.  **Spoonacular Integration:** The system sends the search query to the Spoonacular API via `GET /api/recipes/search`.
6.  **Results Display:** The system displays a list of recipes from the Spoonacular API matching the query. Each result is presented as a "Recipe Card" component, showing an image, title, and cooking time.
7.  **Performance:** Search results are delivered and rendered in under 1 second.
8.  **Error Handling (API):** If the Spoonacular API returns an error, a user-friendly error message is displayed.
9.  **Error Handling (No Results):** If no recipes are found for the query, a message indicating "No results found" is displayed, potentially with a suggestion for a broader search.
10. **Accessibility:** The search functionality and results display adhere to WCAG 2.1 AA guidelines.
11. **Responsiveness:** The recipe search page and results display are fully responsive across all major modern desktop and mobile browsers.

## Tasks / Subtasks

-   **Frontend Development:**
    -   [ ] **Create Recipes Page Layout:**
        -   [ ] Implement `app/(main)/recipes/page.tsx` and `layout.tsx` (or modify existing `layout.tsx`).
        -   [ ] Ensure `page.tsx` includes a search input field and an area for displaying recipe results.
        -   [ ] Implement responsive design using Tailwind CSS and shadcn/ui components.
    -   [ ] **Implement Search Input Component:**
        -   [ ] Create a reusable `SearchInput` component (e.g., in `components/common/SearchInput.tsx`).
        -   [ ] Integrate the `SearchInput` component into the recipes page.
        -   [ ] Implement client-side state management for the search query using React Hooks.
    -   [ ] **Implement Recipe Card Component:**
        -   [ ] Create `components/specific/RecipeCard.tsx` to display recipe image, title, and cooking time.
        -   [ ] Ensure `RecipeCard` adheres to UX design principles (e.g., visual style, responsiveness).
    -   [ ] **Integrate Client-Side Data Fetching (React Query/SWR):**
        -   [ ] Use `React Query` (or `SWR`) for efficient client-side data fetching from `/api/recipes/search`.
        -   [ ] Implement `loading` and `error` states for the recipe results display.
        -   [ ] Handle debouncing of search input to optimize API calls.
    -   [ ] **Display Search Results:**
        -   [ ] Map fetched recipe data to `RecipeCard` components for display.
        -   [ ] Implement pagination or infinite scroll if needed (consider scope for MVP).
    -   [ ] **Handle Empty States and Errors:**
        -   [ ] Display "No results found" message when appropriate.
        -   [ ] Show user-friendly error messages for API failures.

-   **Backend Development (Next.js API Route):**
    -   [ ] **Create API Route for Recipe Search:**
        -   [ ] Implement `app/api/recipes/search/route.ts`.
        -   [ ] Ensure the route handles `GET` requests with a `query` parameter.
    -   [ ] **Integrate with Spoonacular API:**
        -   [ ] Use the standard `fetch` API within the API route to call the Spoonacular API.
        -   [ ] Implement secure handling of the Spoonacular API key (environment variables).
        -   [ ] Map Spoonacular API response to a consistent JSON format with `camelCase` keys.
        -   [ ] Implement basic error handling for Spoonacular API calls.
    -   [ ] **Implement API Response Formatting:**
        -   [ ] Ensure consistent JSON structure for API responses (`data` for success, `error` for errors).
        -   [ ] Use `camelCase` for all JSON keys.
        -   [ ] Validate API request and response schemas (e.g., using Zod).
    -   [ ] **Performance Considerations:**
        -   [ ] Implement caching within the API route for frequently searched terms to reduce Spoonacular API calls and improve performance.
        -   [ ] Consider Vercel Edge Caching configuration for the API route.

-   **Testing:**
    -   [ ] **Unit Tests:**
        -   [ ] Write unit tests for `SearchInput` component.
        -   [ ] Write unit tests for `RecipeCard` component.
        -   [ ] Write unit tests for any utility functions created (e.g., API response parsing).
    -   [ ] **Integration Tests:**
        -   [ ] Write integration tests for `app/api/recipes/search/route.ts` to mock Spoonacular API and verify response.
        -   [ ] Write integration tests for the client-side data fetching logic.
    -   [ ] **End-to-End (E2E) Tests:**
        -   [ ] Write E2E tests using `Playwright` or `Cypress` for the entire search flow: navigating to recipes page, typing a query, verifying results display, and error handling.
    -   [ ] **Performance Testing:**
        -   [ ] Verify search performance is under 1 second under various network conditions.
    -   [ ] **Accessibility Testing:**
        -   [ ] Perform automated and manual accessibility checks for WCAG 2.1 AA compliance.

-   **Documentation:**
    -   [ ] Update API documentation for `GET /api/recipes/search`.
    -   [ ] Document any new reusable components.
    -   [ ] Add notes on caching strategy for this API.

-   **Code Quality & Standards:**
    -   [ ] Ensure all code adheres to ESLint and Prettier rules.
    -   [ ] Ensure TypeScript best practices are followed.
    -   [ ] Conduct peer code review.

## Dev Notes

- Relevant architecture patterns and constraints
- Source tree components to touch
- Testing standards summary

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming)
- Detected conflicts or variances (with rationale)

### Story: Search Recipes (3.1) - Requirements Context Summary

**User Story Statement:**
As a user, I want to search for recipes, so that I can find meal ideas.

**Functional Requirements (FR) Coverage:**
- **FR3.2 - Search Recipes:** A user can search for recipes from the Spoonacular API.

**Acceptance Criteria (from Epics.md):**
- Given I am logged in and on the recipes page
- When I enter a search query
- Then I see a list of recipes from the Spoonacular API matching my query.
- And search results are displayed clearly with images and titles (Recipe Card component).
- And search performance is under 1 second.
- And the UI gracefully handles no results and API errors.

**Acceptance Criteria (from PRD.md - supplementing Epics.md):**
- Search results are displayed clearly with images and titles.
- Search performance meets the <1 second target defined in the Business Metrics.

**Architectural Considerations (from Architecture.md):**
- **API Pattern:** RESTful API using Next.js API Routes (Route Handlers) for `/api/recipes/search`.
- **AI Application Integration:** Use Spoonacular API for core recipe data.
- **Frontend Routes:** `app/(main)/recipes/`.
- **API Routes:** `app/api/recipes/` for Spoonacular integration.
- **Search:** PostgreSQL Full-Text Search can be used for relevant recipe searches (future consideration for local data, but primarily Spoonacular API for this story).
- **Performance Optimization:** Next.js caching and Vercel Edge Caching are critical for meeting the <1 second search performance target.

**UX/Design Considerations (from UX Design Specification.md):**
- **Design Direction:** Mobile-First Dashboard.
- **Component:** "Recipe Card" will display search results (image, title, cooking time).
- **Search Pattern:** Implement "Live Search" with immediate results.
- **Error Handling:** Gracefully handle no results and API errors, consistent with defined error handling strategy.
- **Consistency Patterns:** Adhere to Naming, Structure, Format, Communication, Lifecycle, Location, and Consistency patterns for consistent UI/UX using shadcn/ui and Tailwind CSS.

### Story: Search Recipes (3.1) - Structure Alignment Summary

**Project Structure Alignment:**
- **File/Folder Naming:** Adhere to `kebab-case` for files and folders (e.g., `app/recipes/search/page.tsx`).
- **Component Naming:** Use `PascalCase` for React components (e.g., `RecipeCard`).
- **Variable/Function Naming:** Employ `camelCase` for variables and functions (e.g., `searchRecipes`).
- **Database Naming:** Use `snake_case` for database tables/columns if interacting directly with Supabase for search history or caching.
- **API Endpoints:** Consistent, descriptive API endpoints (e.g., `GET /api/recipes/search`).

**Codebase Location:**
- **Frontend UI:** `app/(main)/recipes/search/page.tsx` for the main search page, `app/recipes/layout.tsx` for layout.
- **API Routes:** `app/api/recipes/search/route.ts` to handle Spoonacular API calls.
- **Reusable UI Components:** `components/specific/RecipeCard.tsx` for displaying individual recipes in search results.
- **Utilities:** `lib/api.ts` for handling external Spoonacular API calls.
- **Types:** `lib/types.ts` for defining recipe and search result interfaces.

**Implementation Patterns to Follow (from Architecture.md):**
- **Naming Patterns:** Strict adherence to defined `kebab-case`, `PascalCase`, `camelCase`, `snake_case`.
- **Structure Patterns:** Co-locate `route.ts`, `page.tsx` within feature-specific `app` sub-folders. Place `RecipeCard` in `components/specific/`.
- **Format Patterns:** JSON for API communications with `camelCase` keys; UTC ISO 8601 for dates; use Zod for schema validation.
- **Communication Patterns:** Use `React Query` (or `SWR`) for client-side data fetching from `/api/recipes/search`. Standard `fetch` API within `app/api/recipes/search/route.ts` for Spoonacular.
- **Lifecycle Patterns:** Use React Hooks (`useState`, `useEffect`, etc.) for managing search input, results, loading states, and error handling.
- **Location Patterns:** Strict adherence to the `app/`, `components/`, `lib/` directory structure.
- **Consistency Patterns:** Implement consistent UI/UX using `shadcn/ui` and `Tailwind CSS`. Ensure WCAG 2.1 AA accessibility. Adhere to ESLint and Prettier for code style.

**Lessons Learned from Previous Story:**
- "First story in epic - no predecessor context." No specific learnings to apply from prior development for this particular story.
- However, general architecture decisions from Epic 1 should be followed. For example, use NextAuth.js for user authentication and Supabase for database interactions, as established in the foundational epic.

### References

- Cite all technical details with source paths and sections, e.g. [Source: docs/<file>.md#Section]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Gemini

### Debug Log References

### Completion Notes List

### File List
