# Epic Technical Specification: Smart Recipe Discovery & Cooking

Date: søndag 30. november 2025
Author: BIP
Epic ID: epic-3
Status: Draft

---

## Overview

Provide users with personalized recipe suggestions based on their inventory and facilitate the cooking process with automatic inventory updates, enabling users to make the most of their food while reducing waste.

## Objectives and Scope

**Objectives:**
- Enable users to browse and search a comprehensive recipe database.
- Provide intelligent recipe suggestions based on user's current inventory.
- Prioritize recipes that use ingredients nearing expiration to minimize food waste.
- Allow users to manually explore recipes with a few ingredients (Creative Mode).
- Automatically update inventory when users cook recipes.
- Integrate seamlessly with the Spoonacular API for recipe data.

**In Scope:**
- FR-003.1: Users can browse, search, and view recipes from a recipe database.
- FR-003.2: The system suggests recipes based on the user's current inventory.
- FR-003.3: The system provides recipe recommendations specifically for items nearing expiration.
- FR-003.4: Users can manually enter 2-3 ingredients to get recipe suggestions (Basic Creative Mode).
- FR-004.1: Ingredients are automatically deducted from the inventory when a recipe is used.
- Story 3.1: Browse & Search Recipes.
- Story 3.2: View Detailed Recipe Information.
- Story 3.3: Smart Recipe Suggestions from Inventory.
- Story 3.4: Basic Creative Mode for Recipes.
- Story 3.5: Automatic Inventory Update after Cooking.

**Out of Scope (for this epic):**
- User-generated recipe submissions and sharing.
- Advanced dietary restrictions and allergen filtering (future enhancement).
- Meal planning calendar with scheduled recipes.
- Nutritional analysis and tracking.
- Recipe rating and review system.
- Video cooking instructions.
- Integration with smart kitchen appliances.

## System Architecture Alignment

This epic aligns with the established project architecture by leveraging the following core components and technologies:

-   **Frontend:** Next.js 14 (App Router, Server Components), Tailwind CSS, shadcn/ui.
-   **Backend:** Next.js API Routes for recipe operations and inventory updates.
-   **Database:** Supabase (PostgreSQL) managed via Prisma ORM.
-   **External API:** Spoonacular API for recipe data.
-   **Authentication:** NextAuth.js for securing API routes and user context.
-   **Hosting & CI/CD:** Vercel for deployment and continuous integration.

For detailed architectural context, refer to `architecture.md` sections 3.1, 3.2, 3.3, 3.6, 4 (Data Model - Recipe, FoodItem), 5 (Frontend Architecture), 6 (Backend Architecture), 9 (External APIs - Spoonacular).

## Detailed Design

### Services and Modules

-   **Frontend Client Components:**
    -   **`RecipeCard`:** Visual card representation of a recipe with thumbnail, title, and key metadata. Used in browse/search results.
    -   **`RecipeSearchBar`:** Search input component with autocomplete for finding recipes by keywords.
    -   **`RecipeDetailView`:** Comprehensive view showing full recipe details, ingredients, instructions, and cooking mode activation.
    -   **`IngredientMatchIndicator`:** Component showing which recipe ingredients are available in user's inventory.
    -   **`CreativeModeForm`:** Form component for entering 2-3 ingredients to find recipe suggestions.
    -   **`CookingModePanel`:** Interactive step-by-step cooking interface with progress tracking.
    -   **`RecipeSuggestionList`:** Component displaying personalized recipe suggestions based on inventory.
    -   Utilizes `shadcn/ui` for standardized UI primitives (Button, Card, Input, Badge, Dialog, etc.).

-   **Frontend Server Components:**
    -   **`RecipeBrowseView`:** Main server component that fetches initial recipe data and renders the recipe library.
    -   **`RecipeDetailPage`:** Server component for individual recipe pages with SSR for better SEO.

-   **Next.js API Routes (Backend Services):**
    -   **`/api/recipes/search` (GET):** Endpoint for searching recipes via Spoonacular API.
    -   **`/api/recipes/[id]` (GET):** Endpoint for fetching detailed recipe information by ID.
    -   **`/api/recipes/suggest` (POST):** Endpoint for generating recipe suggestions based on user's inventory.
    -   **`/api/recipes/creative-mode` (POST):** Endpoint for finding recipes based on manually entered ingredients.
    -   **`/api/inventory/consume-recipe` (POST):** Endpoint for deducting recipe ingredients from user's inventory.

-   **Database Interaction Layer:**
    -   **Prisma ORM:** Provides a type-safe API for interacting with the Supabase PostgreSQL database. Manages queries and mutations for the `FoodItem` model and potential `Recipe` caching.

-   **External API Integration:**
    -   **Spoonacular API Client:** Service layer for making authenticated requests to Spoonacular API, handling rate limiting, and caching responses.

-   **Authentication & Authorization:**
    -   **NextAuth.js:** Ensures all recipe and inventory API routes are protected and only accessible by authenticated users.

### Data Models and Contracts

-   **`Recipe` Model (Potential Cached Data - Prisma Schema / Supabase Table):**
    -   `id`: String (Primary Key, Spoonacular recipe ID)
    -   `title`: String (Recipe title)
    -   `image`: String (URL to recipe image)
    -   `readyInMinutes`: Int (Preparation time)
    -   `servings`: Int (Number of servings)
    -   `sourceUrl`: String (Original recipe URL)
    -   `summary`: String (Recipe summary/description)
    -   `instructions`: String (Cooking instructions)
    -   `extendedIngredients`: Json (Array of ingredient objects)
    -   `cachedAt`: DateTime (Timestamp for cache invalidation)

-   **`FoodItem` Model (Referenced from Epic 2):**
    -   Used for inventory matching and consumption tracking.

### APIs and Interfaces

-   **`GET /api/recipes/search`**
    -   **Query Parameters:**
        -   `query` (required): String (search keywords)
        -   `number` (optional): Number (results limit, default: 20)
        -   `offset` (optional): Number (pagination offset, default: 0)
    -   **Response (200 OK):**
        ```json
        {
          "results": [
            {
              "id": "number",
              "title": "string",
              "image": "string (URL)",
              "readyInMinutes": "number",
              "servings": "number"
            }
          ],
          "totalResults": "number",
          "offset": "number"
        }
        ```
    -   **Response (400 Bad Request):**
        ```json
        {
          "error": "string" // e.g., "Query parameter is required"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```
    -   **Response (503 Service Unavailable):**
        ```json
        {
          "error": "Recipe service temporarily unavailable"
        }
        ```

-   **`GET /api/recipes/[id]`**
    -   **Response (200 OK):**
        ```json
        {
          "recipe": {
            "id": "number",
            "title": "string",
            "image": "string (URL)",
            "readyInMinutes": "number",
            "servings": "number",
            "sourceUrl": "string (URL)",
            "summary": "string (HTML)",
            "instructions": "string (HTML)",
            "extendedIngredients": [
              {
                "id": "number",
                "name": "string",
                "amount": "number",
                "unit": "string",
                "original": "string"
              }
            ]
          }
        }
        ```
    -   **Response (404 Not Found):**
        ```json
        {
          "error": "Recipe not found"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```

-   **`POST /api/recipes/suggest`**
    -   **Request Body:** `application/json`
        ```json
        {
          "prioritizeExpiring": "boolean (optional, default: true)"
        }
        ```
    -   **Response (200 OK):**
        ```json
        {
          "suggestions": [
            {
              "id": "number",
              "title": "string",
              "image": "string (URL)",
              "usedIngredientCount": "number",
              "missedIngredientCount": "number",
              "missedIngredients": [
                {
                  "name": "string",
                  "amount": "number",
                  "unit": "string"
                }
              ]
            }
          ],
          "message": "string (optional)"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```

-   **`POST /api/recipes/creative-mode`**
    -   **Request Body:** `application/json`
        ```json
        {
          "ingredients": ["string", "string", "string"]
        }
        ```
    -   **Response (200 OK):**
        ```json
        {
          "recipes": [
            {
              "id": "number",
              "title": "string",
              "image": "string (URL)",
              "usedIngredientCount": "number",
              "missedIngredientCount": "number"
            }
          ]
        }
        ```
    -   **Response (400 Bad Request):**
        ```json
        {
          "error": "string" // e.g., "At least 2 ingredients required"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```

-   **`POST /api/inventory/consume-recipe`**
    -   **Request Body:** `application/json`
        ```json
        {
          "recipeId": "number",
          "servings": "number (optional, default from recipe)"
        }
        ```
    -   **Response (200 OK):**
        ```json
        {
          "message": "Inventory updated successfully",
          "updatedItems": [
            {
              "id": "string (cuid)",
              "name": "string",
              "previousQuantity": "number",
              "newQuantity": "number",
              "unit": "string"
            }
          ],
          "warnings": [
            "string" // e.g., "Insufficient quantity for milk"
          ]
        }
        ```
    -   **Response (400 Bad Request):**
        ```json
        {
          "error": "string" // e.g., "Invalid recipe ID"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```
    -   **Response (404 Not Found):**
        ```json
        {
          "error": "Recipe not found"
        }
        ```

### Workflows and Sequencing

#### 1. Browse & Search Recipes Workflow

1.  **User Action:** User navigates to the "Recipes" section.
2.  **Frontend (Server Component):** `RecipeBrowseView` server component is rendered.
3.  **Frontend:** Server component makes an initial request to fetch popular/trending recipes.
4.  **Backend (Next.js API Route):**
    a.  Authenticates the request using NextAuth.js.
    b.  Queries Spoonacular API for random/trending recipes.
    c.  Caches results for performance.
    d.  Returns recipe data.
5.  **Frontend (Server Component):** Receives recipe data and passes to client components for rendering.
6.  **Frontend (Client Components):**
    a.  `RecipeCard` components render for each recipe.
    b.  User sees the recipe library.
7.  **User Action (Search):** User enters search keywords in `RecipeSearchBar`.
8.  **Frontend:** Client component sends `GET` request to `/api/recipes/search` with query parameter.
9.  **Backend (Next.js API Route):**
    a.  Authenticates the request.
    b.  Queries Spoonacular API with search keywords.
    c.  Returns search results.
10. **Frontend:** Updates recipe display with search results within 2 seconds.

#### 2. View Detailed Recipe Information Workflow

1.  **User Action:** User clicks on a `RecipeCard`.
2.  **Frontend:** Navigation to `/recipes/[id]` route.
3.  **Frontend (Server Component):** `RecipeDetailPage` server component renders.
4.  **Frontend:** Server component sends `GET` request to `/api/recipes/[id]`.
5.  **Backend (Next.js API Route):**
    a.  Authenticates the request.
    b.  Checks cache for recipe details.
    c.  If not cached, queries Spoonacular API for full recipe information.
    d.  Caches the result.
    e.  Returns detailed recipe data.
6.  **Frontend (Server Component):** Receives recipe data and passes to client components.
7.  **Frontend (Client Components):**
    a.  `RecipeDetailView` component renders with full recipe information.
    b.  Fetches user's `FoodItem` inventory (client-side or via props).
    c.  `IngredientMatchIndicator` compares recipe ingredients with user's inventory.
    d.  Highlights available ingredients and shows missing ingredients.
    e.  Displays "Add to Shopping List" option for missing ingredients.
    f.  Shows "Start Cooking" button to activate Cooking Mode.

#### 3. Smart Recipe Suggestions from Inventory Workflow

1.  **User Action:** User navigates to suggestion area or clicks "Recipes from My Pantry".
2.  **Frontend:** Client component sends `POST` request to `/api/recipes/suggest`.
3.  **Backend (Next.js API Route):**
    a.  Authenticates the request using NextAuth.js to extract `userId`.
    b.  Uses Prisma to query all `FoodItem` records for the user.
    c.  Identifies ingredients, prioritizing those nearing expiration if `prioritizeExpiring` is true.
    d.  Constructs a comma-separated ingredient list.
    e.  Queries Spoonacular API "Find by Ingredients" endpoint.
    f.  Ranks results by:
        - Number of used ingredients (higher is better).
        - Number of missing ingredients (lower is better).
        - Priority to recipes using expiring ingredients.
    g.  Returns at least 3 recipe suggestions.
4.  **Backend Response:** Returns suggestion data.
5.  **Frontend:**
    a.  `RecipeSuggestionList` component displays suggested recipes.
    b.  Shows match indicators (e.g., "Uses 8 of your ingredients").
    c.  Highlights if recipe helps use expiring items.

#### 4. Basic Creative Mode for Recipes Workflow

1.  **User Action:** User accesses "Creative Mode" feature.
2.  **Frontend:** `CreativeModeForm` component renders.
3.  **User Action:** Inputs 2-3 ingredients manually.
4.  **Frontend Validation:** Ensures at least 2 ingredients are entered.
5.  **Frontend:** Sends `POST` request to `/api/recipes/creative-mode` with ingredient list.
6.  **Backend (Next.js API Route):**
    a.  Authenticates the request.
    b.  Validates request body (minimum 2 ingredients).
    c.  Queries Spoonacular API "Find by Ingredients" endpoint with specified ingredients.
    d.  Returns recipe suggestions.
7.  **Backend Response:** Returns recipe data.
8.  **Frontend:**
    a.  Displays recipes in a grid or list format.
    b.  Shows which of the user's specified ingredients are used.

#### 5. Automatic Inventory Update after Cooking Workflow

1.  **User Action:** User is viewing a recipe detail and clicks "I Cooked This" or similar.
2.  **Frontend:** Confirmation dialog appears asking user to confirm cooking completion.
3.  **User Action:** Confirms cooking.
4.  **Frontend:** Sends `POST` request to `/api/inventory/consume-recipe` with `recipeId` and optional `servings`.
5.  **Backend (Next.js API Route):**
    a.  Authenticates the request using NextAuth.js to extract `userId`.
    b.  Fetches recipe details from Spoonacular API (or cache).
    c.  Parses `extendedIngredients` to extract ingredient names and quantities.
    d.  Queries user's `FoodItem` inventory via Prisma.
    e.  Matches recipe ingredients with inventory items (fuzzy matching or exact).
    f.  Calculates quantities to deduct based on recipe servings.
    g.  Updates `FoodItem` quantities in Supabase via Prisma.
    h.  If an item's quantity becomes zero or negative, either deletes the item or sets quantity to 0 with a warning.
    i.  Collects warnings for insufficient quantities.
    j.  Returns list of updated items and any warnings.
6.  **Backend Response:** Returns success message with details of updated items.
7.  **Frontend:**
    a.  On success: Displays confirmation message (e.g., "Great job! Your inventory has been updated.").
    b.  Shows a summary of updated items with before/after quantities.
    c.  If warnings exist, displays them (e.g., "Note: You didn't have enough milk. Updated to 0.").
    d.  Provides "Undo" option (optional enhancement) for a brief period.
    e.  Updates local inventory state or triggers re-fetch of inventory data.

## Non-Functional Requirements

### Performance

-   **Recipe Search Response Time:** Recipe search results should be returned within 2 seconds (90th percentile), including Spoonacular API latency.
-   **Recipe Detail Load Time:** Detailed recipe view should load within 2 seconds on modern browsers and mobile devices.
-   **Suggestion Generation:** Smart recipe suggestions should be generated and displayed within 3 seconds.
-   **API Caching:** Implement caching for Spoonacular API responses to reduce latency and API usage costs. Cache popular recipes and search results with appropriate TTL (e.g., 24-48 hours).
-   **Inventory Update Speed:** Automatic inventory updates after cooking should complete within 1 second for typical recipes (up to 20 ingredients).

### Security

-   **Authentication:** All recipe and inventory API routes must be protected by NextAuth.js, requiring a valid user session.
-   **Authorization:** Users must only be able to update their own inventory. Backend API routes must verify `userId` from the session.
-   **API Key Protection:** Spoonacular API keys must be stored securely in environment variables and never exposed to the client.
-   **Input Validation:** Both client-side and server-side validation must be implemented to prevent injection attacks and ensure data integrity.
-   **Rate Limiting:** Implement rate limiting on recipe search and suggestion endpoints to prevent abuse and manage API costs.

### Reliability/Availability

-   **Uptime:** Recipe discovery services should maintain a minimum uptime of 99.9% (excluding planned maintenance).
-   **Error Handling:** The system should gracefully handle Spoonacular API errors (rate limits, timeouts, service unavailability) and provide informative feedback to users.
-   **Fallback Mechanisms:** If Spoonacular API is unavailable, display cached recipes or a user-friendly error message.
-   **Data Integrity:** Inventory updates must be transactional to prevent partial updates or data corruption.
-   **Optimistic UI Updates:** Implement optimistic UI updates for inventory consumption with rollback mechanisms in case of server-side failures.

### Observability

-   **Logging:** Detailed logs should be generated for critical operations (e.g., recipe searches, suggestions generated, inventory updates, Spoonacular API errors), including user context and timestamps.
-   **Metrics:** Key performance indicators (KPIs) such as recipe search latency, suggestion quality metrics, Spoonacular API usage, error rates, and user engagement with recipes should be collected and monitored.
-   **Alerting:** Automated alerts should be configured for critical issues, such as Spoonacular API rate limit approaching, high error rates on recipe endpoints, or service unavailability.
-   **API Usage Monitoring:** Track Spoonacular API call volume to manage costs and prevent quota exhaustion.

## Dependencies and Integrations

This epic relies on the following key technologies and integrations:

-   **Framework:** Next.js 14 (App Router, Server Components)
-   **Styling:** Tailwind CSS
-   **UI Components:** shadcn/ui (Card, Button, Input, Badge, Dialog, etc.)
-   **Database:** Supabase (PostgreSQL)
-   **ORM:** Prisma
-   **Authentication:** NextAuth.js
-   **External API:** Spoonacular API (requires API key subscription)
-   **Deployment/CI/CD:** Vercel
-   **Source Control:** Git (implied by Vercel integration)

**External Dependencies:**
-   **Completed Epic 2:** Core Inventory Management must be functional for inventory-based recipe suggestions and automatic consumption.
-   **Spoonacular API:** Requires active subscription with sufficient quota for recipe searches, details, and ingredient-based searches.

## Acceptance Criteria (Authoritative)

### Story 3.1: Browse & Search Recipes
*   **Given** I am logged in and navigate to the "Recipes" section,
*   **When** I view the recipe library,
*   **Then** I see a collection of recipes displayed as charming recipe cards (UX Ref: `ux-design-specification.md` section 6.1, "RecipeCard").
*   **And** I can search for recipes by keywords (e.g., "chicken," "pasta").
*   **And** the search results load within 2 seconds.
*   **And** each recipe card shows key information (e.g., title, main image, ready in minutes, servings).
*   **And** the UI adheres to the "Farmhouse Kitchen" aesthetic and is responsive.
*   **And** the interface is accessible (WCAG 2.1 AA).

### Story 3.2: View Detailed Recipe Information
*   **Given** I am browsing recipes and select a recipe card,
*   **When** I click on a recipe card,
*   **Then** I am navigated to a "Detailed Recipe View" showing the full recipe, ingredients list, and instructions.
*   **And** available ingredients from my inventory are highlighted or checked off.
*   **And** missing ingredients can be easily added to my shopping list.
*   **And** an option to activate "Cooking Mode" is presented (UX Ref: `ux-design-specification.md` section 2.2, "Detailed Recipe View").
*   **And** the detailed view loads within 2 seconds.
*   **And** the UI is responsive and accessible.

### Story 3.3: Smart Recipe Suggestions from Inventory
*   **Given** I am logged in and navigate to the "Recipes" section or a dedicated suggestion area,
*   **When** I request recipe suggestions from my inventory,
*   **Then** the system presents at least 3 recipes that can be made with my available ingredients.
*   **And** the suggestions prioritize recipes that use ingredients nearing expiration (if any).
*   **And** the suggestions are visually appealing and easy to understand.
*   **And** each suggestion shows how many of my ingredients are used and how many are missing.
*   **And** suggestions load within 3 seconds.

### Story 3.4: Basic Creative Mode for Recipes
*   **Given** I am logged in and access the "Creative Mode",
*   **When** I manually input 2-3 ingredients,
*   **And** I submit my selection,
*   **Then** the system returns recipe suggestions from the Spoonacular API that use those ingredients.
*   **And** the UI for inputting ingredients is simple and intuitive.
*   **And** results are displayed in a user-friendly format.
*   **And** the form validates that at least 2 ingredients are entered.

### Story 3.5: Automatic Inventory Update after Cooking
*   **Given** I have viewed a recipe and decided to cook it,
*   **When** I confirm that I have cooked the recipe,
*   **Then** the ingredients used in the recipe are automatically deducted from my inventory.
*   **And** a confirmation message is displayed showing which items were updated.
*   **And** if there are insufficient quantities, warnings are shown.
*   **And** the inventory update completes within 1 second.
*   **And** the updated inventory is immediately reflected in the Pantry View.

## Traceability Mapping

| Acceptance Criteria (AC) | Spec Section(s)         | Component(s)/API(s)                                   | Test Idea                                                 |
| :----------------------- | :---------------------- | :---------------------------------------------------- | :-------------------------------------------------------- |
| **Story 3.1: Browse & Search Recipes** |
| User navigates to "Recipes" section | Detailed Design (Workflows - Browse) | Routing, `RecipeBrowseView` server component | Navigation test: Navigate to Recipes, verify page loads. |
| Recipe library displayed as cards | Detailed Design (Workflows - Browse) | `RecipeCard` components | UI test: Verify recipes are displayed as cards with proper styling. |
| User can search by keywords | Detailed Design (Workflows - Browse), (APIs) | `RecipeSearchBar`, `GET /api/recipes/search` | Functional test: Enter search term, verify results match query. |
| Search results load within 2 seconds | Non-Functional Requirements (Performance) | `GET /api/recipes/search`, Spoonacular API | Performance test: Measure search response time. |
| Cards show key information | Detailed Design (Workflows - Browse) | `RecipeCard` component | UI test: Inspect card content, verify title, image, time, servings. |
| UI themed and responsive | N/A (UX Ref) | Frontend components, CSS | Manual review, responsive testing across devices. |
| Interface accessible | N/A (UX Ref) | Frontend components | Accessibility audit with automated tools and screen readers. |
| **Story 3.2: View Detailed Recipe Information** |
| User clicks recipe card | Detailed Design (Workflows - View Detail) | `RecipeCard` interaction, routing | UI test: Click card, verify navigation to detail page. |
| Detailed view shows full recipe | Detailed Design (Workflows - View Detail), (APIs) | `RecipeDetailView`, `GET /api/recipes/[id]` | Functional test: Verify ingredients, instructions, and metadata displayed. |
| Available ingredients highlighted | Detailed Design (Workflows - View Detail) | `IngredientMatchIndicator` | UI test: Compare with inventory, verify correct highlighting. |
| Missing ingredients can be added to list | Detailed Design (Workflows - View Detail) | Integration with Shopping List | Functional test: Click add to shopping list, verify items added. |
| "Cooking Mode" option presented | Detailed Design (Workflows - View Detail) | `CookingModePanel` trigger | UI test: Verify button/option is visible and functional. |
| Detail view loads within 2 seconds | Non-Functional Requirements (Performance) | `RecipeDetailPage`, API routes | Performance test: Measure page load time. |
| UI responsive and accessible | N/A (UX Ref) | Frontend components | Responsive and accessibility testing. |
| **Story 3.3: Smart Recipe Suggestions from Inventory** |
| User requests suggestions | Detailed Design (Workflows - Suggestions) | Trigger button/link, `POST /api/recipes/suggest` | UI test: Click suggestion trigger, verify request sent. |
| System presents at least 3 recipes | Detailed Design (Workflows - Suggestions), (APIs) | `POST /api/recipes/suggest`, Spoonacular API | Functional test: Verify minimum 3 suggestions returned. |
| Prioritize expiring ingredients | Detailed Design (Workflows - Suggestions) | Backend ranking logic | Functional test: Create inventory with expiring items, verify prioritization. |
| Suggestions visually appealing | N/A (UX Ref) | `RecipeSuggestionList` component | Manual UI review. |
| Show ingredient match count | Detailed Design (APIs) | `POST /api/recipes/suggest` response data | UI test: Verify used/missing counts displayed for each suggestion. |
| Suggestions load within 3 seconds | Non-Functional Requirements (Performance) | `POST /api/recipes/suggest` | Performance test: Measure suggestion generation time. |
| **Story 3.4: Basic Creative Mode for Recipes** |
| User accesses Creative Mode | Detailed Design (Workflows - Creative Mode) | Navigation, `CreativeModeForm` | UI test: Verify Creative Mode is accessible from UI. |
| User inputs 2-3 ingredients | Detailed Design (Workflows - Creative Mode) | `CreativeModeForm` input fields | UI test: Enter ingredients, verify input handling. |
| System returns recipe suggestions | Detailed Design (Workflows - Creative Mode), (APIs) | `POST /api/recipes/creative-mode`, Spoonacular API | Functional test: Submit ingredients, verify recipes returned. |
| UI simple and intuitive | N/A (UX Ref) | `CreativeModeForm` | Manual UX review. |
| Results displayed user-friendly | N/A (UX Ref) | Recipe display components | Manual UI review. |
| Form validates minimum 2 ingredients | Detailed Design (APIs) | `CreativeModeForm` validation | Functional test: Submit with <2 ingredients, verify error message. |
| **Story 3.5: Automatic Inventory Update after Cooking** |
| User confirms cooking | Detailed Design (Workflows - Inventory Update) | Confirmation dialog, `POST /api/inventory/consume-recipe` | Functional test: Confirm cooking, verify API called. |
| Ingredients deducted from inventory | Detailed Design (Workflows - Inventory Update), (APIs) | `POST /api/inventory/consume-recipe`, Prisma | Functional test: Verify inventory quantities decreased correctly in DB. |
| Confirmation message displayed | Detailed Design (Workflows - Inventory Update) | Frontend feedback UI | UI test: After update, verify confirmation message shown. |
| Warnings for insufficient quantities | Detailed Design (APIs) | `POST /api/inventory/consume-recipe` response | Functional test: Cook recipe with insufficient inventory, verify warnings. |
| Update completes within 1 second | Non-Functional Requirements (Performance) | `POST /api/inventory/consume-recipe` | Performance test: Measure update execution time. |
| Inventory reflected in Pantry View | Detailed Design (Workflows - Inventory Update) | Frontend state update, Pantry View refresh | UI test: Navigate to Pantry after cooking, verify changes visible. |

## Risks, Assumptions, Open Questions

### Risks

-   **Spoonacular API Dependency:** The entire recipe discovery feature depends on Spoonacular API availability and performance. API downtime, rate limiting, or cost overruns could impact user experience.
-   **API Cost Management:** Excessive API calls to Spoonacular could result in unexpected costs. Caching strategy and rate limiting must be carefully implemented.
-   **Ingredient Matching Accuracy:** Matching user's inventory items with recipe ingredients (which may have different naming conventions, units, or forms) may be imperfect, leading to incorrect suggestions or inventory updates.
-   **Complex Ingredient Parsing:** Parsing Spoonacular's ingredient data and matching it with user inventory requires robust logic to handle variations in naming, quantities, and units.
-   **User Experience with Mismatches:** Users may be frustrated if suggested recipes don't truly match their available ingredients due to matching inaccuracies.
-   **Inventory Update Edge Cases:** Handling edge cases in automatic inventory updates (e.g., partial servings, unit conversions, items not found in inventory) may be complex.
-   **Performance with Large Inventories:** For users with very large inventories (hundreds of items), ingredient matching for suggestions could become slow without optimization.

### Assumptions

-   **Spoonacular API Reliability:** Spoonacular API is assumed to be generally reliable and performant, with acceptable uptime and response times.
-   **API Quota Sufficiency:** The Spoonacular API subscription provides sufficient quota for expected user activity during MVP and beyond.
-   **Ingredient Naming Standardization:** While not perfectly standardized, Spoonacular's ingredient names are assumed to be reasonably consistent and parseable.
-   **User Inventory Accuracy:** Users are expected to maintain reasonably accurate inventory data for suggestions and automatic updates to be effective.
-   **Recipe Complexity:** MVP focuses on standard recipes with typical ingredient lists. Highly complex or unusual recipes may not be handled optimally.
-   **Unit Conversion Tolerance:** For MVP, exact unit conversion between recipe requirements and inventory units is not critical. Approximate matching is acceptable.
-   **Cooking Mode Simplicity:** For MVP, "Cooking Mode" is primarily a visual enhancement of the recipe detail view. Advanced features like timers or voice control are out of scope.

### Open Questions

-   **Ingredient Matching Algorithm:** What algorithm should be used for matching inventory items with recipe ingredients? Exact string match, fuzzy matching, keyword matching, or a combination? Should we use a library or build custom logic?
-   **Unit Conversion:** Should the system attempt to convert units between inventory and recipes (e.g., convert "1 cup" to "240 ml")? If so, what conversion library or strategy should be used? Or is approximate matching sufficient for MVP?
-   **Caching Strategy:** What should be the TTL (time-to-live) for cached Spoonacular API responses? Should popular recipes be cached longer? How should cache invalidation be handled?
-   **Expiration Threshold for Prioritization:** At what threshold (e.g., 3 days, 5 days) should an ingredient be considered "nearing expiration" for prioritization in suggestions?
-   **Number of Suggestions:** Should the system always return exactly 3 suggestions, or a variable number (e.g., 3-10) based on match quality?
-   **Handling Insufficient Inventory:** When a user confirms cooking a recipe but doesn't have sufficient quantities of all ingredients, what should the behavior be?
    -   Prevent cooking confirmation?
    -   Allow cooking but show warnings?
    -   Deduct available quantities and warn about missing amounts?
-   **"Undo" Feature for Inventory Updates:** Should there be an "Undo" button after automatic inventory updates? How long should the undo window be open?
-   **Recipe Rating/Favorites:** Should MVP include the ability for users to rate or favorite recipes for future reference, or is this deferred?
-   **Cooking Mode Detail:** What specific features should "Cooking Mode" include in MVP? Just a step-by-step view of instructions, or additional features like ingredient checklist, timers, etc.?
-   **Shopping List Integration Detail:** When adding missing ingredients to shopping list from a recipe, should quantities be automatically added, or just ingredient names?

## Test Strategy Summary

The testing strategy for Epic 3 will focus on ensuring the recipe discovery and cooking features are robust, performant, user-friendly, integrate correctly with Spoonacular API and user inventory, and meet all defined acceptance criteria and non-functional requirements.

### Test Levels & Focus

-   **Unit Tests:**
    -   **Focus:** Ingredient matching logic, quantity calculation for inventory updates, unit parsing and conversion (if implemented), Spoonacular API response parsing, caching logic.
    -   **Coverage:** Ensures correctness of isolated logic components, including edge cases (unusual units, missing data, zero quantities) and error handling.
-   **Integration Tests:**
    -   **Focus:** Next.js API routes (`/api/recipes/*`, `/api/inventory/consume-recipe`), interaction between API routes and Spoonacular API, interaction between API routes and Prisma/Supabase, authentication/authorization logic.
    -   **Coverage:** Verifies that backend components (API routes, external API, database) work together correctly and enforce security policies. Tests API rate limiting and error handling.
-   **End-to-End (E2E) Tests:**
    -   **Focus:** Simulating complete user flows for browsing, searching, viewing recipes, getting suggestions, using creative mode, and cooking recipes with inventory updates, from login to final state in database.
    -   **Coverage:** Confirms the entire system, from frontend to backend to external API, functions correctly from a user's perspective, including routing, authentication, data persistence, and UI updates.
-   **UI/UX Tests:**
    -   **Focus:** Manual and automated testing for visual aesthetic ("Farmhouse Kitchen" theme), responsiveness across devices, recipe card design, detailed view layout, suggestion display, and adherence to accessibility standards (WCAG 2.1 AA).
    -   **Coverage:** Ensures the user interface meets design specifications, provides a delightful experience, and is usable by people with disabilities.
-   **Performance Tests:**
    -   **Focus:** Measuring API response times for recipe search, detail fetch, suggestion generation, and inventory update endpoints. Testing Spoonacular API integration latency and caching effectiveness.
    -   **Coverage:** Ensures the system meets performance NFRs and remains fast and responsive.
-   **External API Tests:**
    -   **Focus:** Testing integration with Spoonacular API, including correct request formatting, response parsing, error handling (rate limits, timeouts, invalid responses), and caching behavior.
    -   **Coverage:** Ensures robust integration with the external dependency.

### Test Frameworks (Anticipated)

-   **Unit/Integration:** Jest, React Testing Library.
-   **E2E:** Playwright or Cypress.
-   **Accessibility:** axe-core, Lighthouse, manual testing with screen readers (e.g., NVDA, JAWS).
-   **Performance:** Lighthouse, Chrome DevTools Performance profiling, custom scripts for API response time measurement.
-   **API Mocking:** MSW (Mock Service Worker) for mocking Spoonacular API in unit/integration tests.

### Test Coverage Areas

-   **Acceptance Criteria:** All acceptance criteria defined for Stories 3.1, 3.2, 3.3, 3.4, and 3.5 must have corresponding test cases.
-   **Critical Paths:**
    -   Successful recipe search with valid query.
    -   Successful loading of detailed recipe information.
    -   Successful generation of recipe suggestions based on user inventory.
    -   Successful recipe suggestions via Creative Mode with 2-3 ingredients.
    -   Successful automatic inventory update after confirming cooking.
-   **Edge Cases:**
    -   Searching with an empty query or very long query.
    -   Searching for a term with no results.
    -   Viewing a recipe that doesn't exist (invalid ID).
    -   Requesting suggestions with an empty inventory.
    -   Requesting suggestions with inventory items that have no matching recipes.
    -   Creative Mode with only 1 ingredient (should fail validation).
    -   Creative Mode with more than 3 ingredients (should be allowed but test behavior).
    -   Cooking a recipe when inventory has insufficient quantities for all ingredients.
    -   Cooking a recipe when inventory has zero quantity of a required ingredient.
    -   Cooking a recipe with unusual or unmatched ingredient names.
    -   Handling Spoonacular API rate limit errors.
    -   Handling Spoonacular API timeout or service unavailable errors.
    -   Cache hit vs. cache miss scenarios for recipe data.
-   **Security Testing:**
    -   Verify all API routes are protected by authentication.
    -   Verify users cannot consume recipes or access suggestions without being logged in.
    -   Test input validation to prevent injection attacks (e.g., malicious search queries).
    -   Verify Spoonacular API keys are not exposed in client-side code or responses.
-   **Accessibility Testing:**
    -   Verify WCAG 2.1 AA compliance for all recipe components, search interfaces, forms, and dialogs.
    -   Test keyboard navigation and screen reader compatibility for all interactive elements.
-   **Performance Testing:**
    -   Measure and verify recipe search response time meets the <2s target.
    -   Measure and verify detailed recipe view load time meets the <2s target.
    -   Measure and verify suggestion generation time meets the <3s target.
    -   Measure and verify inventory update time meets the <1s target.
    -   Test performance with large inventories (e.g., 100, 500 items) for suggestion generation.
    -   Test caching effectiveness in reducing Spoonacular API calls and improving response times.

---

_This Epic Technical Specification provides a comprehensive blueprint for implementing Smart Recipe Discovery & Cooking features, ensuring alignment with the project's architecture, UX design, and quality standards._
