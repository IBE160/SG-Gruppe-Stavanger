# Epic Technical Specification: Recipe Discovery & Browsing

Date: Saturday, 29 November 2025
Author: BIP
Epic ID: 3
Status: Draft

---

## Overview

This epic focuses on empowering users to proactively explore and discover new meal ideas through a robust recipe search and browsing experience. Leveraging the Spoonacular API, users will be able to search for recipes, view detailed instructions, and engage with a vast culinary database. This forms a foundational component of the ibe160 application, enabling general recipe exploration independent of the user's current inventory.

## Objectives and Scope

**In Scope:**
*   **FR3.2 - Search Recipes:** Allow users to search for recipes from the Spoonacular API, displaying results clearly with images and titles. Search performance must be under 1 second.
*   **FR3.3 - View Recipe Details:** Enable users to view comprehensive details of a selected recipe, including ingredients, instructions, cooking time, and servings.

**Out of Scope (for this epic):**
*   Smart recipe suggestions based on inventory (covered in Epic 4).
*   Marking recipes as cooked and deducting inventory (covered in Epic 4).
*   "Instant Idea" generation (covered in Epic 4).

## System Architecture Alignment

This epic primarily aligns with the application's API Pattern, AI Application Integration, Search, Performance Optimization, and API Contracts. Recipe search and detail fetching will utilize RESTful API routes implemented via Next.js API Routes (Route Handlers), integrating directly with the Spoonacular API. PostgreSQL Full-Text Search (FTS) will be leveraged for efficient text-based queries, supporting the 1-second search performance target. Performance optimizations, including Vercel Edge Caching and Next.js caching, will ensure a responsive user experience. API contracts will adhere to a consistent JSON structure with `data` for success and `error` for errors, using `camelCase` for JSON keys, ensuring smooth data exchange between the frontend and backend.

## Detailed Design

### Services and Modules

*   **Recipe Service Module (`lib/api.ts`):**
    *   **Responsibility:** Abstracts interaction with the Spoonacular API. Handles API key management, request construction, response parsing, and error handling.
    *   **Inputs:** Search query parameters, recipe IDs.
    *   **Outputs:** Raw or pre-processed recipe data from Spoonacular.
    *   **Owner:** Development Team (Backend-focused).
*   **Recipe Search Indexing/Cache:**
    *   **Responsibility:** Potentially caches frequently searched recipes or indexes key recipe metadata for faster retrieval using PostgreSQL Full-Text Search. This improves performance and reduces external API calls.
    *   **Inputs:** Spoonacular recipe data.
    *   **Outputs:** Optimized search results.
    *   **Owner:** Development Team.

### Data Models and Contracts

*   **Recipe Data Model (for detailed view):**
    ```typescript
    interface Recipe {
      id: number;
      title: string;
      image: string; // URL
      servings: number;
      readyInMinutes: number; // Cooking time
      instructions: string; // HTML or Markdown
      summary: string; // Short description/summary
      ingredients: Array<{
        id: number;
        name: string;
        original: string; // e.g., "1 cup all-purpose flour"
        amount: number;
        unit: string;
      }>;
      // ... other relevant fields from Spoonacular API
    }
    ```
*   **Search Result Item Model (for list view):**
    ```typescript
    interface SearchResultItem {
      id: number;
      title: string;
      image: string; // URL
      readyInMinutes: number; // Cooking time
      // Add 'usesExpiring' tag here for future Epic 4 integration
    }
    ```

### APIs and Interfaces

*   **`GET /api/recipes/search`**
    *   **Description:** Searches for recipes from the Spoonacular API.
    *   **Request:** `query: string` (search term), `offset: number` (for pagination), `number: number` (items per page). Optional: `cuisine`, `diet`, `intolerances`.
    *   **Response (200 OK):**
        ```json
        {
          "data": [
            { "id": 716426, "title": "Cauliflower, Brown Rice, and Cheddar Soup", "image": "https://...", "readyInMinutes": 45 },
            // ... more SearchResultItemModel
          ]
        }
        ```
    *   **Error Response (500 Internal Server Error):**
        ```json
        {
          "error": "Failed to fetch recipes from external API."
        }
        ```
    *   **Performance:** Target <1 second response time, leveraging Spoonacular caching and PostgreSQL FTS.
*   **`GET /api/recipes/{id}`**
    *   **Description:** Retrieves full details for a specific recipe.
    *   **Request:** URL parameter `id: number` (Spoonacular recipe ID).
    *   **Response (200 OK):**
        ```json
        {
          "data": {
            "id": 716426,
            "title": "Cauliflower, Brown Rice, and Cheddar Soup",
            "image": "https://...",
            "servings": 4,
            "readyInMinutes": 45,
            "instructions": "<p>Combine all ingredients...",
            "summary": "This is a delicious soup...",
            "ingredients": [ /* ... array of ingredient objects */ ]
          }
        }
        ```
    *   **Error Response (404 Not Found):**
        ```json
        {
          "error": "Recipe with ID {id} not found."
        }
        ```
    *   **Error Response (500 Internal Server Error):**
        ```json
        {
          "error": "Failed to retrieve recipe details from external API."
        }
        ```

### Workflows and Sequencing

1.  **User Navigation:** User accesses the `/recipes` page (e.g., via a "Recipes" link in the navigation bar).
2.  **Initial View:** The page displays a search input field (per UX Design Specification's "Search Patterns - Live Search") and potentially some featured/trending recipes (initial load).
3.  **Search Input:** User types a query into the search field.
4.  **Client-side Request (FR3.2):** The frontend (using React Query/SWR) debounces the input and sends a `GET /api/recipes/search?query={string}` request to the Next.js API route.
5.  **API Route Processing:**
    *   The Next.js API route (`app/api/recipes/search/route.ts`) receives the request.
    *   It invokes the `Recipe Service Module` to call the Spoonacular API.
    *   (Optional) It may consult a local cache or search index (PostgreSQL FTS) to optimize performance.
    *   Spoonacular API response is received and validated/transformed into `SearchResultItemModel`.
    *   The API route responds with the structured JSON data.
6.  **Display Search Results:** The frontend receives the response and displays the `SearchResultItemModel`s using `Recipe Card` components (per UX Design Specification). UI handles loading states and empty results.
7.  **Select Recipe (FR3.3):** User clicks on a specific `Recipe Card`.
8.  **Client-side Navigation:** The frontend navigates to the detailed recipe page, e.g., `/recipes/[id]`.
9.  **Detailed Recipe Request:** The detailed recipe page (e.g., `app/recipes/[id]/page.tsx`) sends a `GET /api/recipes/{id}` request to retrieve full recipe data.
10. **API Route Processing:**
    *   The Next.js API route (`app/api/recipes/[id]/route.ts`) receives the request.
    *   It invokes the `Recipe Service Module` to call the Spoonacular API for the specific recipe ID.
    *   Spoonacular API response is received and validated/transformed into `RecipeDataModel`.
    *   The API route responds with the structured JSON data.
11. **Display Recipe Details:** The frontend renders the complete `RecipeDataModel`, showing ingredients, instructions, cooking time, and servings.

## Non-Functional Requirements

### Performance

*   **Recipe Search Results:** Search results must be delivered to the user in under 1 second (from PRD).
*   **API Response Time:** Next.js API routes serving recipe data should respond within 200ms (excluding external Spoonacular call latency) under normal load.
*   **Caching:** Implement caching mechanisms (Vercel Edge, Next.js Data Cache/fetch caching) to optimize external API calls and reduce latency for frequently accessed recipes.
*   **Database Optimization:** Ensure efficient querying of any locally stored or indexed recipe metadata through strategic PostgreSQL indexing.

### Security

*   **API Security:** All API endpoints (`/api/recipes/search`, `/api/recipes/{id}`) must be secured against common web vulnerabilities (e.g., SQL injection, XSS) and enforce proper authentication and authorization.
*   **Input Validation:** Strict input validation for search queries and recipe IDs to prevent malicious input.
*   **Environment Variables:** Spoonacular API keys must be stored securely as environment variables and never exposed client-side.

### Reliability/Availability

*   **Service Reliability:** The overall service (Vercel + Supabase + Spoonacular integration) aims for >=99% uptime.
*   **External API Fallback:** Implement a robust caching strategy for Spoonacular API responses to provide a graceful degradation experience or a fallback offline dataset in case of Spoonacular API downtime or latency.
*   **Error Handling:** Implement robust error handling for external API calls with informative logging and user-friendly error messages.

### Observability

*   **Logging:** Implement structured logging for server-side API routes (`/api/recipes/*`) using `Pino` or `Winston` to capture request/response details, external API call metrics, and errors.
*   **Metrics:** Collect metrics on Spoonacular API call latency, success rates, and errors.
*   **Tracing:** Implement distributed tracing to monitor the flow of requests through the Next.js API routes and external API integrations.

## Dependencies and Integrations

*   **Spoonacular API:**
    *   **Description:** External REST API for comprehensive recipe data (search, details).
    *   **Integration:** Accessed via server-side Next.js API routes (`lib/api.ts`).
    *   **Constraints:** API key required, rate limits to be managed (e.g., via caching or usage plan).
*   **Next.js (Frontend & API Routes):**
    *   **Description:** Primary framework for both client-side UI and server-side API endpoints.
    *   **Integration:** Used for routing (`/recipes`, `/recipes/[id]`), data fetching (Server Components, `fetch` API), and API route handlers (`app/api/recipes/search`, `app/api/recipes/[id]`).
*   **Supabase PostgreSQL:**
    *   **Description:** Underlying database, potentially used for caching Spoonacular API responses or indexing recipe metadata for performance optimization with PostgreSQL Full-Text Search.
    *   **Integration:** Direct database queries from Next.js API routes if caching/indexing is implemented.
*   **Client-side Data Fetching Library (e.g., React Query or SWR):**
    *   **Description:** Manages server state, caching, and revalidation on the client-side for fetching recipe data.
    *   **Integration:** Used in React components (e.g., `/recipes/page.tsx`, `/recipes/[id]/page.tsx`).
    *   **Dependency:** Will be declared in `package.json`.

## Acceptance Criteria (Authoritative)

**FR3.2 - Search Recipes:**
1.  **AC3.2.1:** The system shall allow a user to enter a search query for recipes.
2.  **AC3.2.2:** Search results shall be displayed clearly with a recipe image, title, and estimated cooking time.
3.  **AC3.2.3:** Search results must be delivered to the user in under 1 second.
4.  **AC3.2.4:** The UI shall gracefully handle scenarios where no recipes match the search query, displaying a clear "no results" message.
5.  **AC3.2.5:** The UI shall gracefully handle external API errors during a recipe search, displaying a user-friendly error message.

**FR3.3 - View Recipe Details:**
1.  **AC3.3.1:** A user shall be able to select a recipe from the search results to view its full details.
2.  **AC3.3.2:** The detailed recipe view shall include the recipe title, image, servings, cooking time, full instructions, and a comprehensive list of ingredients.

## Traceability Mapping

| Acceptance Criterion | Spec Section(s)                                | Component(s)/API(s)                                  | Test Idea                                                    |
| :------------------- | :--------------------------------------------- | :--------------------------------------------------- | :----------------------------------------------------------- |
| AC3.2.1              | PRD (FR3.2)                                    | Frontend Search Component                            | Verify typing in search box triggers API call.               |
| AC3.2.2              | PRD (FR3.2), UX Design (Recipe Card), Detailed Design (Search Result Item Model) | `Recipe Card` component, `/api/recipes/search`       | Verify rendered search results match `SearchResultItemModel` and UX design. |
| AC3.2.3              | PRD (FR3.2), NFR (Performance)                 | `/api/recipes/search`, Frontend (Data Fetching)      | Measure end-to-end search response time for various queries. |
| AC3.2.4              | PRD (FR3.2)                                    | Frontend (Empty State handling)                      | Search for non-existent recipes; verify "no results" message. |
| AC3.2.5              | PRD (FR3.2), NFR (Reliability)                 | Frontend (Error Handling), `/api/recipes/search`     | Simulate Spoonacular API failure; verify error message.      |
| AC3.3.1              | PRD (FR3.3)                                    | `Recipe Card` component, Frontend (Router/Navigation) | Verify clicking a recipe card navigates to `/recipes/{id}`. |
| AC3.3.2              | PRD (FR3.3), Detailed Design (Recipe Data Model) | `Recipe Detail Page` component, `/api/recipes/{id}`  | Verify all `Recipe Data Model` fields are displayed correctly. |

## Risks, Assumptions, Open Questions

### Risks

*   **External API Dependency (Spoonacular):**
    *   **Description:** Heavy reliance on the Spoonacular API introduces a single point of failure. Downtime, rate limit changes, or unexpected data format changes in the Spoonacular API directly impact the core functionality of this epic.
    *   **Mitigation:** Robust error handling, caching strategy for API responses, monitoring of external API status.
*   **Performance Bottlenecks:**
    *   **Description:** Achieving the <1 second search performance target is challenging due to potential latency from external API calls and the need for data processing.
    *   **Mitigation:** Aggressive caching, database indexing for local metadata, performance monitoring, optimizing API calls.

### Assumptions

*   **Spoonacular API Reliability:** It is assumed that the Spoonacular API will maintain a high level of availability and performance for the MVP.
*   **Spoonacular API Data Quality:** It is assumed that the data provided by Spoonacular is accurate and sufficient for the application's needs.
*   **Network Connectivity:** Users are assumed to have stable internet connectivity to interact with the external API.

### Open Questions

*   What is the long-term strategy for Spoonacular API rate limit management as user base grows? (e.g., dedicated plan, rotating API keys).
*   Should a local cache of frequently accessed Spoonacular recipe data be implemented (e.g., in Supabase PostgreSQL) to improve performance and resilience against external API issues?
*   How will Spoonacular API key be securely managed and rotated in a production environment?

## Test Strategy Summary

*   **Unit Tests (`Jest`):**
    *   **Scope:** `lib/api.ts` (Recipe Service Module) to ensure correct interaction with Spoonacular API, robust error handling, and accurate data transformation.
*   **Integration Tests (Next.js API Routes):**
    *   **Scope:** `/api/recipes/search` and `/api/recipes/{id}` routes. Verify correct forwarding of requests to the Recipe Service Module, proper handling of Spoonacular API responses (success and error), and adherence to defined API contracts (JSON structure, status codes).
    *   **Mocks:** External Spoonacular API calls will be mocked to ensure consistent test results.
*   **End-to-End (E2E) Tests (`Playwright`/`Cypress`):**
    *   **Scope:** Simulate user flows for recipe search and detail viewing.
    *   **Scenarios:**
        *   Verify typing a query in the search bar displays relevant recipes.
        *   Validate search performance meets the <1 second target.
        *   Verify clicking a recipe card navigates to the detailed view.
        *   Assert that all expected recipe details (ingredients, instructions, etc.) are present and correct on the detail page.
        *   Test error states (e.g., no search results, simulated external API errors).
*   **Performance Testing:**
    *   **Scope:** Conduct load testing on the `/api/recipes/search` endpoint and measure client-side rendering performance to ensure the <1 second search result delivery is consistently met under anticipated user loads.
*   **Manual UI/UX Testing:**
    *   **Scope:** Verify the visual presentation, responsiveness, and usability of the search results and recipe detail pages across different devices and browsers, ensuring alignment with the UX Design Specification and `Recipe Card` components.