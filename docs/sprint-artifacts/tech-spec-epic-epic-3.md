# Epic Technical Specification: Recipe Discovery

Date: søndag 23. november 2025
Author: BIP
Epic ID: epic-3
Status: Draft

---

## Overview

This section outlines the technical specification for 'Recipe Discovery', a core epic within the Smart Food & Recipe Platform. The platform is designed to help users reduce food waste and discover meal inspiration. This epic focuses on allowing users to browse, search, and view recipes from a recipe database (Spoonacular API), and to receive smart recipe suggestions based on their current inventory.

## Objectives and Scope

**In Scope:**
*   Users can browse, search, and view recipes from a recipe database.
*   The system suggests recipes based on the user’s current inventory.
*   The system provides recipe recommendations specifically for items nearing expiration.
*   Users can manually enter 2-3 ingredients to get recipe suggestions (Basic Creative Mode).

**Out of Scope (for this epic):**
*   AI-powered Ingredient Substitution.
*   AI-Enhanced Search.
*   Fully AI-powered meal planning.

## System Architecture Alignment

This epic heavily relies on integration with the Spoonacular API via Next.js API Routes. Backend logic will handle calls to Spoonacular, potentially caching responses to optimize performance. The frontend (Next.js 14, Tailwind CSS) will display search results and recipe details, providing a seamless user experience for browsing and viewing recipes. Data persistence for user-specific recipe interactions (e.g., liked recipes, planned meals) will use Supabase PostgreSQL via Prisma.

## Detailed Design

### Services and Modules

*   **Service:** Next.js API Routes (`/api/recipes`, `/api/suggestions`)
    *   **Responsibilities:**
        *   Proxy requests to Spoonacular API for browsing and searching recipes.
        *   Implement logic for smart recipe suggestions based on user inventory (`FoodItem` data) and expiring items.
        *   Handle caching of Spoonacular API responses to manage rate limits and improve performance.
    *   **Inputs/Outputs:**
        *   Receives recipe search queries, ingredient lists for suggestions.
        *   Outputs recipe data from Spoonacular, processed suggestions.
*   **Module:** `Recipe` (Database Model/Cache via Prisma)
    *   **Responsibilities:** (Placeholder for Spoonacular recipes, actual storage might be partial or cached) to store fetched recipe data for performance or user-specific modifications.
    *   **Inputs/Outputs:** Stores/retrieves recipe details.

### Data Models and Contracts

```prisma
model Recipe { // Placeholder for Spoonacular recipes, actual storage might be partial or cached
  id             String   @id @default(cuid()) // Spoonacular ID or generated
  title          String
  ingredients    Json // Storing as JSON to accommodate varying structures from API
  instructions   String
  cookingTime    Int
  servings       Int
  tags           String?
  createdAt      DateTime @default(now())
}
```

### APIs and Interfaces

*   **API Endpoint:** `/api/recipes`
    *   **`GET /api/recipes`**
        *   **Description:** Browse/search recipes from Spoonacular.
        *   **Query Params:** `query: string` (search term), `ingredients: string[]` (filter by ingredients), etc.
        *   **Response:** `[{ id: string, title: string, ... }]` (array of recipes)
*   **API Endpoint:** `/api/suggestions`
    *   **`GET /api/suggestions`**
        *   **Description:** Get smart recipe suggestions based on user's inventory.
        *   **Response:** `[{ id: string, title: string, missingIngredients: string[], ... }]` (array of suggested recipes)
*   **External API:** Spoonacular API
    *   **Endpoints Used:** `/recipes/complexSearch`, `/recipes/{id}/information`
    *   **Integration:** Handled via Next.js API Routes, abstracting direct calls from the frontend.

### Workflows and Sequencing

#### User Discovers Recipes Based on Inventory

1.  **User navigates to recipe discovery (e.g., clicks "recipe box" icon).** (UX)
2.  **Frontend sends `GET /api/suggestions` request (optionally with inventory data).**
3.  **Backend (API Route) retrieves user's `FoodItem` inventory from Supabase.**
4.  **Backend calls Spoonacular API (e.g., `/recipes/complexSearch`) with available ingredients.**
5.  **Backend processes Spoonacular response to generate smart suggestions, identifying missing ingredients.**
6.  **Backend returns suggested recipes to frontend.**
7.  **Frontend displays suggested recipes as "charming recipe cards."** (UX)
8.  **User selects a recipe, frontend sends `GET /api/recipes/{id}` request.**
9.  **Backend fetches detailed recipe information from Spoonacular (cached if available).**
10. **Frontend displays "Detailed Recipe View" with ingredients and instructions.** (UX)

## Non-Functional Requirements

### Performance

Recipe search and suggestion loading must complete within 2 seconds. This includes external API calls and internal processing. Caching strategies will be crucial for meeting this target.

### Security

All interactions with Spoonacular API will be proxied through secure Next.js API Routes, preventing direct exposure of API keys to the client. User's inventory data, used for suggestions, will remain secure and only accessible to authenticated users. Personal recipe preferences will be stored and retrieved securely.

### Reliability/Availability

High availability (≥99% uptime) for recipe discovery features is critical. This epic leverages Vercel and Supabase for hosting. Caching of Spoonacular API responses will be implemented to mitigate external service outages or rate limit issues. Robust error handling for Spoonacular API calls is required.

### Observability

Logging for Spoonacular API calls (request/response, errors) and recipe suggestion logic will be implemented. Key metrics like recipe search latency, Spoonacular API response times, and suggestion accuracy will be monitored to ensure optimal performance and user experience.

## Dependencies and Integrations

*   **Frontend/Backend Framework:** Next.js 14
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Database:** Supabase (PostgreSQL) - used for user inventory (`FoodItem`) and potentially caching/storing user-specific recipe data.
*   **ORM:** Prisma
*   **Authentication:** NextAuth.js - secures API endpoints related to user data.
*   **External APIs:** Spoonacular API - primary source of recipe data, integrated via Next.js API Routes.
*   **Deployment:** Vercel (for Next.js application), Supabase Cloud (for PostgreSQL database)

## Acceptance Criteria (Authoritative)

1.  **Given** I am an authenticated user, **when** I search for recipes, **then** I receive a list of recipes from the database matching my search criteria.
2.  **Given** I am an authenticated user, **when** I view a recipe, **then** I can see its title, ingredients, instructions, cooking time, and servings.
3.  **Given** I am an authenticated user with food items in my inventory, **when** I request recipe suggestions, **then** the system suggests recipes that can be made with my available ingredients.
4.  **Given** I am an authenticated user, **when** I have food items nearing expiration, **then** the system recommends recipes specifically utilizing those expiring items.
5.  **Given** I am an authenticated user, **when** I manually enter 2-3 ingredients, **then** the system provides recipe suggestions based on those ingredients (Basic Creative Mode).

## Traceability Mapping

| Acceptance Criteria | Spec Section(s)                                    | Component(s)/API(s)                  | Test Idea                                                 |
| :------------------ | :------------------------------------------------- | :----------------------------------- | :-------------------------------------------------------- |
| AC 1                | FR-003.1 (PRD), Detailed Design (Tech Spec)        | `/api/recipes` (GET), Spoonacular API | Unit/Integration: Test `GET /api/recipes` with various search terms. |
| AC 2                | FR-003.1 (PRD), Detailed Design (Tech Spec)        | `/api/recipes/{id}` (GET), Recipe model | Unit/Integration: Test `GET /api/recipes/{id}` returns complete recipe details. |
| AC 3                | FR-003.2 (PRD), Detailed Design (Tech Spec)        | `/api/suggestions` (GET), Inventory Service | Unit/Integration: Test `GET /api/suggestions` with user inventory. |
| AC 4                | FR-003.3 (PRD), Detailed Design (Tech Spec)        | `/api/suggestions` (GET), Inventory Service | Unit/Integration: Test `GET /api/suggestions` prioritizes expiring items. |
| AC 5                | FR-003.4 (PRD), Detailed Design (Tech Spec)        | `/api/suggestions` (GET)            | Unit/Integration: Test `GET /api/suggestions` with 2-3 manual ingredients. |

## Risks, Assumptions, Open Questions

*   **Risk:** Spoonacular API rate limits or downtime could impact recipe discovery functionality.
    *   **Mitigation:** Implement robust caching mechanisms for Spoonacular API responses. Implement graceful degradation (e.g., show limited cached recipes or error message).
*   **Assumption:** Spoonacular API provides sufficient variety and quality of recipes for initial MVP.
    *   **Verification:** Regular review of Spoonacular's API offerings and user feedback on recipe quality.
*   **Question:** How will "smart recipe suggestions" handle edge cases where inventory is very limited or diverse?
*   **Question:** What is the performance impact of processing user inventory against Spoonacular API for suggestions?

## Test Strategy Summary

*   **Unit Tests:** Focus on individual functions for API routes (e.g., Spoonacular API proxy, suggestion logic).
*   **Integration Tests:** Verify the full flow of recipe search, viewing recipe details, and generating smart suggestions through API endpoints, including interaction with Spoonacular API and user inventory from Supabase.
*   **End-to-End (E2E) Tests:** Simulate user interactions in the frontend for searching, browsing, and getting suggestions, ensuring UI and backend integrate correctly.
*   **Performance Tests:** Measure latency for recipe searches and suggestions, especially under various load conditions and API response times.
*   **API Contract Tests:** Ensure compatibility with Spoonacular API's expected request/response formats.
