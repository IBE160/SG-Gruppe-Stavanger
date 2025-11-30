# Story 3.2: View Recipe Details

Status: drafted

## Story

As a user,
I want to view the full details of a recipe,
so that I can decide if I want to cook it.

## Acceptance Criteria

1.  **Authentication:** The user must be logged in to access the recipe detail page.
2.  **Navigation:** When the user clicks on a recipe from a list (e.g., search results), they are navigated to a dynamic route like `app/(main)/recipes/{id}`.
3.  **Data Fetching:** The application fetches detailed recipe information for the given `{id}` from the Spoonacular API via a backend API route.
4.  **API Route:** A `GET /api/recipes/{id}` endpoint is implemented to handle the data fetching from Spoonacular.
5.  **Detailed Display:** The recipe detail page clearly displays:
    *   Recipe Title
    *   Image
    *   List of Ingredients
    *   Step-by-step Instructions
    *   Cooking Time
    *   Number of Servings
6.  **Error Handling (API):** If the Spoonacular API fails or returns an error, a user-friendly error message is displayed on the page.
7.  **Error Handling (Not Found):** If a recipe with the given `{id}` does not exist, a "Recipe not found" page or message is displayed.
8.  **Responsiveness:** The recipe detail page is fully responsive and usable on both desktop and mobile devices.
9.  **Accessibility:** The page and its content adhere to WCAG 2.1 AA guidelines.
10. **Linking:** The user can easily navigate back to the previous page (e.g., search results).

## Tasks / Subtasks

-   **Frontend Development:**
    -   [ ] **Create Dynamic Recipe Page (AC: #2, #8, #10):**
        -   [ ] Implement dynamic route `app/(main)/recipes/[id]/page.tsx`.
        -   [ ] Add a "Back" button or breadcrumb for navigation.
        -   [ ] Ensure the layout is responsive.
    -   [ ] **Implement Client-Side Data Fetching (AC: #3, #6, #7):**
        -   [ ] Use React Query or SWR on the page to call the `/api/recipes/{id}` endpoint.
        -   [ ] Implement loading states (e.g., skeleton loaders for recipe content).
        -   [ ] Implement and display appropriate error states for API failures or not-found errors.
    -   [ ] **Create Recipe Detail Components (AC: #5):**
        -   [ ] Develop components to render the ingredients list (`IngredientList.tsx`).
        -   [ ] Develop components to render the cooking instructions (`Instructions.tsx`).
        -   [ ] Structure the page to present all required data fields clearly.

-   **Backend Development (Next.js API Route):**
    -   [ ] **Create API Route for Recipe Details (AC: #4):**
        -   [ ] Implement `app/api/recipes/[id]/route.ts`.
        -   [ ] The route must handle `GET` requests and extract the dynamic `id` parameter.
    -   [ ] **Integrate with Spoonacular API (AC: #3, #6):**
        -   [ ] In the API route, call the Spoonacular "Get Recipe Information" endpoint using the provided `id`.
        -   [ ] Securely manage the Spoonacular API key using environment variables.
        -   [ ] Implement robust error handling for the external API call.
    -   [ ] **API Response Formatting (AC: #5):**
        -   [ ] Standardize the JSON response from the API route (e.g., using a `data` object for success and `error` for failures) with `camelCase` keys.

-   **Testing:**
    -   [ ] **Unit Tests:**
        -   [ ] Write unit tests for `IngredientList` and `Instructions` components.
    -   [ ] **Integration Tests:**
        -   [ ] Test the `app/api/recipes/[id]/route.ts` with a mocked Spoonacular response.
    -   [ ] **E2E Tests:**
        -   [ ] Write a Playwright/Cypress test for the entire user flow: clicking a recipe card on the search page, verifying the details on the recipe page, and checking error states.
    -   [ ] **Accessibility Testing (AC: #9):**
        -   [ ] Run automated and manual checks to ensure WCAG 2.1 AA compliance.

## Dev Notes

### Story: View Recipe Details (3.2) - Requirements Context Summary

**User Story Statement:**
As a user, I want to view the full details of a recipe, so that I can decide if I want to cook it.

**Functional Requirements (FR) Coverage:**
- **FR3.3 - View Recipe Details:** A user can view the full details of a recipe, including ingredients, instructions, cooking time, and servings.

**Acceptance Criteria (from Epics.md):**
- Given I have a list of recipes
- When I click on a recipe
- Then I am taken to a detailed view of that recipe.
- And the view includes ingredients, instructions, cooking time, and servings.

**Architectural Considerations (from Architecture.md):**
- **API Pattern:** RESTful API using Next.js API Routes for `/api/recipes/{id}`.
- **Frontend Routes:** A dynamic route will be used: `app/(main)/recipes/[id]/`.
- **Data Fetching:** Client-side fetching using React Query/SWR is preferred for dynamic content.

**UX/Design Considerations (from UX Design Specification.md):**
- **Layout:** The page should be clean and easy to read, with clear separation between ingredients and instructions.
- **Consistency:** The design should be consistent with the rest of the application, using the established `shadcn/ui` and `Tailwind CSS` conventions.

### Story: View Recipe Details (3.2) - Structure Alignment Summary

**Project Structure Alignment:**
- **File/Folder Naming:** Adhere to `kebab-case`.
- **Component Naming:** `PascalCase`.
- **Variable/Function Naming:** `camelCase`.
- **API Endpoints:** `GET /api/recipes/{id}`.

**Codebase Location:**
- **Frontend UI:** `app/(main)/recipes/[id]/page.tsx`.
- **API Routes:** `app/api/recipes/[id]/route.ts`.
- **Reusable UI Components:** `components/specific/IngredientList.tsx`, `components/specific/Instructions.tsx`.
- **Types:** `lib/types.ts` should be updated with types for detailed recipe information.

**Implementation Patterns to Follow (from Architecture.md):**
- **Communication Patterns:** Use React Query/SWR for client-side data fetching.
- **Location Patterns:** Follow the established `app/`, `components/`, and `lib/` directory structure.
- **Consistency Patterns:** Implement consistent UI/UX using `shadcn/ui` and `Tailwind CSS`.

### Lessons Learned from Previous Story
This story directly follows "Search Recipes" (3.1). The primary dependency is the `RecipeCard.tsx` component created in the previous story, which will pass the recipe `id` to this page. Ensure the linking between the search results and the detail page is correctly implemented. No unresolved review items were noted from the previous story.
[Source: `docs/sprint-artifacts/3-1-search-recipes.md`]

### References

- [Source: `docs/sprint-artifacts/tech-spec-epic-3.md#story-32-view-recipe-details`]
- [Source: `docs/epics.md#epic-3-recipe-management`]
- [Source: `docs/PRD.md#recipe-discovery-and-viewing`]
- [Source: `docs/architecture.md#api-routes`]
- [Source: `docs/ux-design-specification.md#recipe-detail-page`]

## Dev Agent Record
- **Context Reference:** Initial draft generated based on `tech-spec-epic-3.md` and `epics.md`.
- **Agent Model Used:** Gemini 1.5 Pro
- **Debug Log References:** N/A
- **Completion Notes List:** 
  - Story created based on technical spec.
- **File List:**
  - `docs/sprint-artifacts/3-2-view-recipe-details.md` (NEW)

## Change Log

- **2025-11-30:** Initial draft created by agent.
- **2025-11-30:** Updated status to 'drafted', added Dev Agent Record, and improved citations based on validation report.
