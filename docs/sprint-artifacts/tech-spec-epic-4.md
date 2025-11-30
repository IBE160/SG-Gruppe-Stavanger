# Epic Technical Specification: 

Date: 2025-11-30
Author: BIP
Epic ID: 4
Status: Draft

---

## Overview

This epic, "Personalized Suggestions & Alerts," focuses on implementing the reactive "smart" features of the ibe160 application. It aims to reduce food waste and inspire cooking by intelligently leveraging user inventory data to provide timely and relevant recipe suggestions, expiration alerts, and a frictionless "Instant Idea" generation capability. This directly supports the core value proposition of transforming potential waste into culinary inspiration.

## Objectives and Scope

**Objectives:**
- To provide users with intelligent recipe suggestions based on their current inventory, prioritizing items nearing expiration.
- To notify users proactively about expiring food items, offering actionable solutions.
- To enable quick, on-the-fly recipe ideas without impacting the user's persistent inventory.
- To automatically deduct used ingredients from inventory upon marking a recipe as cooked.

**In-Scope:**
- **FR3.1 - Get Smart Recipe Suggestions:** Generate recipe suggestions based on current inventory, prioritizing expiring items.
- **FR3.4 - Mark Recipe as Cooked and Deduct Inventory:** Allow users to mark recipes as cooked, prompting for ingredient deduction.
- **FR4.1 - Expiration Alerts:** Implement in-app notifications for items nearing expiration, linked to relevant recipes.
- **FR4.2 - Instant Idea Generation:** Provide a prominent "Instant Idea" button for quick, AI-generated recipe suggestions based on user input, without affecting inventory.
- UI components for displaying suggestions, alerts, and the instant idea input.
- Backend logic for inventory-based recipe matching and expiration tracking.

**Out-of-Scope:**
- User preferences for dietary restrictions or cuisine types for recipe generation (to be addressed in Growth Features).
- Complex AI-driven ingredient substitution beyond basic suggestions for "Instant Idea."
- External communication channels for alerts (e.g., SMS, email) beyond in-app notifications.

## System Architecture Alignment

Epic 4's implementation will align with the established architectural decisions:
- **API Pattern:** Utilize Next.js API Routes (Route Handlers) for `/api/recipes/suggestions`, `/api/recipes/{id}/cook`, `/api/notifications`, and the "Instant Idea" endpoint.
- **AI Application Integration:** Leverage the Spoonacular API for recipe data and the Google Gemini API for the generative AI features within the "Instant Idea" button.
- **Deployment Target:** Frontend and API routes will be deployed on Vercel, with backend services managed by Supabase.
- **Real-time Features:** Supabase Realtime will be used to push in-app expiration alerts.
- **Search:** PostgreSQL Full-Text Search (FTS) will facilitate efficient inventory-based recipe matching.
- **Background Jobs:** PG Cron in Supabase will be instrumental for scheduled tasks, such as regularly checking for expiring items to trigger alerts.
- **Communication Patterns:** `React Query` for client-side data fetching of suggestions and alerts, `Supabase Realtime` client SDK for live updates.
- **Consistency Patterns:** Adherence to defined naming, structure, format, and consistency rules for maintainability and quality.

## Detailed Design

### Services and Modules

| Service/Module | Responsibilities | Inputs/Outputs | Owner |
|---|---|---|---|
| **Smart Recipe Suggestions** | - Fetches inventory items nearing expiration. <br> - Queries the Spoonacular API with these ingredients. <br> - Returns a prioritized list of recipe suggestions. | **In:** User ID. <br> **Out:** Array of Recipe objects. | Backend |
| **Inventory Deduction Service** | - Receives confirmation of a cooked recipe. <br> - Updates the quantities of specified inventory items. | **In:** User ID, list of ingredients and quantities to deduct. <br> **Out:** Updated inventory state. | Backend |
| **Expiration Alert Service** | - A scheduled job (PG Cron) identifies expiring items daily. <br> - Creates `notification` records in the database. <br> - Triggers real-time events via Supabase Realtime to notify the frontend. | **In:** (Scheduled) <br> **Out:** Notification events. | Backend (PG Cron, Supabase) |
| **Instant Idea Service** | - Receives a list of 2-3 ingredients from the user. <br> - Calls the Google Gemini API to generate a creative recipe. <br> - Formats and returns the generated recipe. | **In:** Array of ingredient strings. <br> **Out:** Generated Recipe object. | Backend |

### Data Models and Contracts

The following data models will be implemented in the Supabase PostgreSQL database, following `snake_case` conventions.

**`notifications` table:**
```sql
CREATE TABLE notifications (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id BIGINT REFERENCES inventory(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'expiration', -- e.g., 'expiration', 'suggestion'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own notifications
CREATE POLICY "user_can_read_own_notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);
```

### APIs and Interfaces

API endpoints will follow the RESTful patterns defined in the architecture.

**1. Get Smart Recipe Suggestions**
- **Endpoint:** `GET /api/recipes/suggestions`
- **Request:** (Authenticated User)
- **Response (200 OK):**
```json
{
  "data": [
    {
      "id": 660306,
      "title": "Slow Cooker Chicken Tortilla Soup",
      "image": "https://spoonacular.com/recipeImages/660306-312x231.jpg",
      "usedIngredientCount": 3,
      "missedIngredientCount": 2,
      "usesExpiringItems": true
    }
  ]
}
```

**2. Mark Recipe as Cooked & Deduct Ingredients**
- **Endpoint:** `POST /api/recipes/{id}/cook`
- **Request Body:**
```json
{
  "ingredientsToDeduct": [
    { "inventoryItemId": 123, "quantity": 1 },
    { "inventoryItemId": 456, "quantity": 0.5 }
  ]
}
```
- **Response (200 OK):**
```json
{
  "data": { "message": "Inventory updated successfully." }
}
```

**3. Get Notifications**
- **Endpoint:** `GET /api/notifications`
- **Request:** (Authenticated User)
- **Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Expiring Soon: Tomatoes",
      "message": "Your tomatoes are expiring in 2 days. Find recipes to use them!",
      "type": "expiration",
      "isRead": false,
      "createdAt": "2025-12-01T10:00:00Z"
    }
  ]
}
```

**4. Instant Idea Generation**
- **Endpoint:** `POST /api/instant-idea`
- **Request Body:**
```json
{
  "ingredients": ["chicken breast", "rice", "broccoli"]
}
```
- **Response (200 OK):**
```json
{
  "data": {
    "title": "Garlic Herb Chicken with Rice and Broccoli",
    "ingredients": [
      "1 lb chicken breast, diced",
      "1 cup white rice",
      "2 cups broccoli florets",
      "..."
    ],
    "instructions": [
      "1. Sauté chicken in a pan until browned.",
      "2. Cook rice according to package directions.",
      "..."
    ]
  }
}
```

### Workflows and Sequencing

**1. Expiration Alert Workflow (FR4.1)**
1.  **Nightly (e.g., 2 AM UTC):** A `PG Cron` job runs a SQL function `check_expiring_items()`.
2.  The function scans the `inventory` table for items expiring in the next 2-3 days.
3.  For each found item, a new record is inserted into the `notifications` table.
4.  **On Frontend:** The `Supabase Realtime` client is subscribed to inserts on the `notifications` table for the current `user_id`.
5.  When a new notification is inserted, Supabase pushes the event to the client.
6.  The frontend displays an in-app alert (e.g., a Toast or a badge on a bell icon) based on the received data.
7.  Clicking the alert navigates the user to a recipe list pre-filtered with the expiring item.

**2. Smart Suggestion Workflow (FR3.1)**
1.  **User Action:** User navigates to the Dashboard.
2.  **Frontend:** A `useQuery` hook triggers a call to `GET /api/recipes/suggestions`.
3.  **Backend:** The API route authenticates the user, fetches their inventory (prioritizing items with `expiration_date` in the next 3-5 days), and compiles a list of ingredients.
4.  The backend makes a request to the Spoonacular API's "Search Recipes by Ingredients" endpoint.
5.  **Frontend:** The UI displays the returned recipes in "Recipe Card" components, highlighting those that use expiring ingredients.

**3. Instant Idea Workflow (FR4.2)**
1.  **User Action:** User clicks the "Instant Idea" button.
2.  **Frontend:** A modal appears with a text input. User types ingredients (e.g., "eggs, cheese, spinach").
3.  On submission, the frontend calls `POST /api/instant-idea` with the ingredients list.
4.  **Backend:** The API route constructs a prompt for the Google Gemini API (e.g., "Create a simple recipe using only eggs, cheese, and spinach. Provide a title, ingredients list, and instructions.").
5.  The backend parses the Gemini API's response into a structured JSON object.
6.  **Frontend:** The modal updates to display the generated recipe details. This state is temporary and does not affect the user's persistent inventory.

**4. Inventory Deduction Workflow (FR3.4)**
1.  **User Action:** User clicks the "I Cooked This" button on a recipe details page.
2.  **Frontend:** The "Inventory Deduction Modal" appears, pre-populated with ingredients from the recipe that are also in the user's inventory.
3.  User confirms or adjusts the quantities to be deducted.
4.  On confirmation, the frontend calls `POST /api/recipes/{id}/cook` with the list of inventory item IDs and quantities to deduct.
5.  **Backend:** The API route validates the request, authenticates the user, and runs an `UPDATE` query on the `inventory` table for each item, decrementing the `quantity`.
6.  **Frontend:** The modal closes, a confirmation "Toast" notification is shown, and the inventory view is automatically refreshed via `React Query`'s cache invalidation.



## Non-Functional Requirements

### Performance

- **API Response Time:** All API endpoints for this epic (`/api/recipes/suggestions`, `/api/recipes/{id}/cook`, `/api/notifications`, `/api/instant-idea`) must respond within **200ms** under normal load, excluding external API latencies (Spoonacular, Gemini).
- **Suggestion Latency:** The perceived time for `GET /api/recipes/suggestions` should be under **1 second**. This will be achieved by optimizing the inventory query and potentially caching Spoonacular responses.
- **Client-Side Performance:** Frontend components rendering suggestions and alerts must not degrade the overall application's Lighthouse score, maintaining a score of over 90.

### Security

- **Authentication & Authorization:** All API endpoints in this epic must be protected and require a valid, authenticated user session managed by NextAuth.js.
- **Data Access Control:** Database queries for suggestions and notifications must be scoped to the authenticated user's `user_id`, enforced by Supabase Row Level Security (RLS) policies. Direct access to other users' data is forbidden.
- **Input Validation:** The `POST /api/instant-idea` and `POST /api/recipes/{id}/cook` endpoints must validate and sanitize all incoming data to prevent injection attacks or malformed requests. Zod schemas should be used for validation.
- **API Key Security:** API keys for Spoonacular and Google Gemini must be stored securely as environment variables on the server and never exposed to the client.

### Reliability/Availability

- **Service Uptime:** The services underpinning this epic are expected to meet the overall system uptime goal of **>=99%**, as provided by Vercel and Supabase.
- **Graceful Degradation:**
    - If the Spoonacular API is down or slow, the recipe suggestion feature should time out gracefully and return a user-friendly message, rather than a system error.
    - If the Gemini API fails, the "Instant Idea" feature should immediately inform the user of the issue.
- **Transactional Integrity:** The inventory deduction process (`POST /api/recipes/{id}/cook`) must be atomic. If any part of the deduction fails, the entire transaction should be rolled back to prevent data inconsistency.

### Observability

- **Structured Logging:** All backend API routes for this epic must implement structured logging (e.g., using `Pino`). Logs should include the `userId`, the specific API route, and the outcome of the operation (success or error).
- **Error Monitoring:** Critical errors, such as failures in fetching suggestions, deducting inventory, or generating instant ideas, must be captured. For production environments, these errors should be sent to a monitoring service like Sentry.
- **Performance Monitoring:** The response times for all API endpoints in this epic should be monitored to ensure they remain within the defined performance targets.


## Dependencies and Integrations

The implementation of Epic 4 relies heavily on seamless integration with various internal and external services.

### External API Dependencies

-   **Spoonacular API:**
    -   **Purpose:** Primary source for recipe data.
    -   **Integration Point:** Used by the Smart Recipe Suggestions service (`GET /api/recipes/suggestions`) to find recipes based on available ingredients.
    -   **Constraint:** API key required; rate limits must be respected.
-   **Google Gemini API:**
    -   **Purpose:** Generative AI for creative recipe suggestions.
    -   **Integration Point:** Used by the Instant Idea Service (`POST /api/instant-idea`) to generate recipes from user-provided ingredients.
    -   **Constraint:** API key required; content filtering and response parsing must be handled.

### Internal Service Integrations

-   **Supabase PostgreSQL Database:**
    -   **Purpose:** Stores user inventory data, user profiles, and generated notifications.
    -   **Integration Point:** `inventory` table for recipe suggestions and deductions; `notifications` table for expiration alerts.
    -   **Constraint:** Row Level Security (RLS) must be correctly configured for `inventory` and `notifications` tables.
-   **Supabase Auth:**
    -   **Purpose:** Manages user authentication and authorization.
    -   **Integration Point:** All API routes for Epic 4 features (`/api/recipes/*`, `/api/notifications`, `/api/instant-idea`) require authenticated user sessions.
    -   **Constraint:** Ensures only the authenticated user can access/modify their own data.
-   **Supabase Realtime:**
    -   **Purpose:** Real-time push notifications for expiration alerts.
    -   **Integration Point:** Frontend subscribes to changes in the `notifications` table to display live alerts.
    -   **Constraint:** Efficient handling of subscriptions and payload delivery.
-   **Supabase PG Cron:**
    -   **Purpose:** Scheduled background tasks for expiration checks.
    -   **Integration Point:** Executes a daily SQL function to identify expiring items and generate notifications.
    -   **Constraint:** Correct scheduling and robust SQL function implementation.
-   **NextAuth.js:**
    -   **Purpose:** Frontend authentication layer and session management.
    -   **Integration Point:** Provides session data (`userId`) to client-side components and server-side API routes for all Epic 4 features.
    -   **Constraint:** Secure session handling and integration with Supabase Auth.

### Frameworks & Libraries

-   **Next.js (App Router, Server Components/Actions):** The foundational web framework for building both the frontend UI and backend API routes.
-   **React Query (or SWR):** Used for efficient client-side data fetching, caching, and state management for recipe suggestions and notifications.
-   **Tailwind CSS & shadcn/ui:** Provides the styling and UI component foundation for displaying all Epic 4 features.
-   **Zod:** Used for schema validation of API request and response payloads, ensuring data integrity.

### Dependencies from Other Epics

-   **Epic 2 (Inventory Management):** Full functionality of Epic 4's suggestions, alerts, and deductions are directly dependent on a complete and functional inventory system (FR2.1 - FR2.4).
-   **Epic 3 (Recipe Discovery & Browsing):** The "Mark Recipe as Cooked" (FR3.4) feature relies on the ability to view recipe details, which is part of Epic 3 (FR3.3). The Smart Recipe Suggestions (FR3.1) also leverages the recipe display components.

## Acceptance Criteria (Authoritative)

The following are the authoritative acceptance criteria for Epic 4, derived directly from the Product Requirements Document (PRD) and refined in the Epic Breakdown.

**FR3.1 - Get Smart Recipe Suggestions:**
- **AC1:** The system generates at least 3 recipe suggestions if there are sufficient ingredients in the user's inventory.
- **AC2:** Suggestions are prioritized based on ingredients that are nearing their expiration date.
- **AC3:** The suggestions are 'meaningful' (contain at least 3 ingredients).
- **AC4:** Each recipe card displays an indicator if it uses expiring ingredients (per UX).

**FR3.4 - Mark Recipe as Cooked and Deduct Inventory:**
- **AC1:** When a user marks a recipe as cooked, the system prompts the user to confirm which ingredients from their inventory were used.
- **AC2:** Upon user confirmation, the quantities of the used ingredients are automatically deducted from the user's inventory.
- **AC3:** The deduction process is a deliberate, confirmed action through a modal (per UX).

**FR4.1 - Expiration Alerts:**
- **AC1:** An in-app notification is generated for inventory items expiring in the next 2-3 days.
- **AC2:** The notification directly links the user to a list of recipes that can use the expiring item.
- **AC3:** Notifications are bundled to avoid 'notification fatigue' and are actionable (per UX and PRD).

**FR4.2 - Instant Idea Generation:**
- **AC1:** A prominent "Instant Idea" button is available on the main screen.
- **AC2:** Upon clicking the button, a user can input 2-3 ingredients.
- **AC3:** The system provides an immediate AI-generated recipe suggestion based on the input.
- **AC4:** This "Instant Idea" action does not modify the user's persistent inventory.

## Traceability Mapping

| Acceptance Criterion | Spec Section(s) | Component(s)/API(s) | Test Idea |
|---|---|---|---|
| FR3.1-AC1: At least 3 suggestions | Detailed Design: Smart Recipe Suggestions, APIs: GET /api/recipes/suggestions | Backend: `Smart Recipe Suggestions` service, Frontend: `Recipe Card` component | Verify 3+ suggestions are returned when inventory supports it. |
| FR3.1-AC2: Prioritize expiring | Detailed Design: Smart Recipe Suggestions | Backend: `Smart Recipe Suggestions` service (DB query logic) | Test with expiring vs. non-expiring items; verify priority. |
| FR3.1-AC3: Meaningful suggestions | Detailed Design: Smart Recipe Suggestions | Backend: `Smart Recipe Suggestions` service (Spoonacular parsing) | Check generated recipes have >=3 ingredients. |
| FR3.1-AC4: "Uses expiring" tag | Detailed Design: Smart Recipe Suggestions, UX: Recipe Card | Frontend: `Recipe Card` component | Verify UI tag appears when applicable. |
| FR3.4-AC1: Confirm ingredients | Detailed Design: Inventory Deduction Workflow, UX: Inventory Deduction Modal | Frontend: `Inventory Deduction Modal` | Verify modal appears with pre-filled ingredients. |
| FR3.4-AC2: Deduct quantities | Detailed Design: Inventory Deduction Service, APIs: POST /api/recipes/{id}/cook | Backend: `Inventory Deduction Service` | Confirm inventory quantities are reduced correctly post-cook. |
| FR3.4-AC3: Deliberate action | Detailed Design: Inventory Deduction Workflow | Frontend: `Inventory Deduction Modal` | Test cancellation/confirmation flow of the modal. |
| FR4.1-AC1: In-app notification | Detailed Design: Expiration Alert Workflow, APIs: GET /api/notifications | Backend: `Expiration Alert Service` (PG Cron, Supabase Realtime), Frontend: `Notification Component` | Verify notification appears when items are 2-3 days from expiring. |
| FR4.1-AC2: Links to recipes | Detailed Design: Expiration Alert Workflow | Frontend: `Notification Component` (navigation logic) | Click notification, verify correct recipe list loads. |
| FR4.1-AC3: Bundled, actionable | UX: Notification Patterns | Frontend: `Notification Component` | Test multiple expiring items, verify bundled alert; verify actionable link. |
| FR4.2-AC1: "Instant Idea" button | UX: Design Direction (Dashboard), Component Library | Frontend: `Instant Idea Button` component | Verify button presence on main screen. |
| FR4.2-AC2: Input 2-3 ingredients | Detailed Design: Instant Idea Workflow | Frontend: `Instant Idea Button` modal | Verify modal allows ingredient input. |
| FR4.2-AC3: AI-generated recipe | Detailed Design: Instant Idea Service, APIs: POST /api/instant-idea | Backend: `Instant Idea Service` (Gemini API) | Test various ingredient inputs, verify valid recipe response. |
| FR4.2-AC4: No inventory modification | Detailed Design: Instant Idea Workflow | Backend: `Instant Idea Service` | Confirm inventory remains unchanged after using "Instant Idea". |



## Risks, Assumptions, Open Questions

### Risks

-   **R1: External API Dependency (Spoonacular/Gemini) Reliability:**
    -   **Description:** Downtime or performance degradation of Spoonacular or Google Gemini APIs could directly impact the core functionality of recipe suggestions and instant idea generation.
    -   **Mitigation:**
        -   Implement robust error handling and retry mechanisms for API calls.
        -   Display user-friendly messages during API outages/latency.
        -   Consider caching frequently requested Spoonacular recipes.
        -   Explore fallback mechanisms for "Instant Idea" (e.g., a simplified local dataset or template-based suggestions if Gemini fails consistently).
-   **R2: Notification Fatigue:**
    -   **Description:** Over-notifying users about expiring items could lead to them disabling notifications or ignoring alerts, negating the feature's value.
    -   **Mitigation:**
        -   Adhere strictly to the bundling of alerts (e.g., "3 items are expiring soon" rather than individual alerts).
        -   Ensure notifications are highly actionable and link directly to solutions (recipes).
        -   Monitor notification disable rates as a key metric.
-   **R3: AI Response Quality for "Instant Idea":**
    -   **Description:** The quality and relevance of recipes generated by the Google Gemini API might not consistently meet user expectations, especially for unusual ingredient combinations.
    -   **Mitigation:**
        -   Craft clear and concise prompts for Gemini.
        -   Implement post-processing/filtering of Gemini's output to ensure basic recipe structure.
        -   Provide a feedback mechanism for users to rate generated ideas.
        -   Clearly set user expectations that these are "ideas" and may require adjustment.

### Assumptions

-   **A1: User Willingness to Interact with Alerts:** Users will be motivated by actionable expiration alerts to view and utilize recipe suggestions, thereby reducing food waste.
-   **A2: API Stability:** The external Spoonacular and Google Gemini APIs will maintain sufficient uptime and performance to support the application's real-time needs.
-   **A3: Data Integrity of Inventory:** The inventory data (quantity, expiration dates) provided by the user (from Epic 2) is sufficiently accurate to generate meaningful recipe suggestions.
-   **A4: Network Connectivity:** Users will have sufficient network connectivity to receive real-time updates and interact with API-dependent features.

### Open Questions

-   **Q1: Recipe Filtering Enhancements:** Should the "Smart Recipe Suggestions" feature eventually incorporate user dietary preferences (e.g., vegetarian, gluten-free) or cuisine types, which are currently out-of-scope (Growth Features)?
-   **Q2: Advanced Inventory Deduction:** Beyond simple quantity deduction, are there requirements for handling partial usage or suggesting alternative uses for remaining ingredients after cooking?
-   **Q3: User Feedback Loop for AI:** What specific mechanisms (e.g., thumbs up/down, brief text input) will be implemented to gather user feedback on the quality of AI-generated recipes from the "Instant Idea" feature?
-   **Q4: Scalability of Gemini API:** What are the expected costs and rate limits for the Google Gemini API when scaling to a large user base, and what strategies are in place to manage these?


## Test Strategy Summary





The test strategy for Epic 4 will follow the multi-layered approach outlined in the architecture, encompassing Unit, Integration, and End-to-End (E2E) tests to ensure the reliability, functionality, and user experience of the personalized suggestions and alerts features.





### Unit Tests





-   **Focus:** Individual functions, components, and utility modules.


-   **Tools:** Jest, React Testing Library.


-   **Coverage:**


    -   Backend logic for querying expiring items, parsing Spoonacular/Gemini API responses, and updating inventory quantities.


    -   Frontend components such as `Recipe Card`, `Instant Idea Button`, `Notification Component`, and `Inventory Deduction Modal` for correct rendering and state changes.


    -   Zod schemas for API payload validation.





### Integration Tests





-   **Focus:** Interaction between services, API routes, and database.


-   **Tools:** Jest, Supertest (for API routes), direct database client (for Supabase interactions).


-   **Coverage:**


    -   **API Endpoints:** Verify that `GET /api/recipes/suggestions`, `POST /api/recipes/{id}/cook`, `GET /api/notifications`, and `POST /api/instant-idea` behave as expected, handling various inputs (e.g., empty inventory, no expiring items, invalid ingredients).


    -   **Database Interactions:** Ensure that inventory deductions are correctly persisted, and notifications are accurately created.


    -   **External API Mocks:** Mock Spoonacular and Google Gemini API responses to test integration logic in isolation.





### End-to-End (E2E) Tests





-   **Focus:** User-centric scenarios covering entire workflows as defined by Acceptance Criteria.


-   **Tools:** Playwright or Cypress.


-   **Coverage:**


    -   **Smart Recipe Suggestions:** User logs in, adds items to inventory (including expiring ones), navigates to the dashboard/suggestions, and verifies that appropriate recipe suggestions are displayed.


    -   **Mark Recipe as Cooked:** User views a recipe, clicks "Cooked," confirms deductions, and verifies inventory update.


    -   **Expiration Alerts:** Simulate expiring items, verify in-app notification appears, and clicking it leads to relevant recipes.


    -   **Instant Idea Generation:** User clicks the button, inputs ingredients, and verifies an AI-generated recipe is displayed without altering inventory.


    -   **Security and Authentication:** Ensure all features are only accessible to authenticated users and that data separation between users is maintained.





### Acceptance Criteria Verification





Each Acceptance Criterion (AC) will have at least one corresponding test case, primarily at the E2E or Integration level, to ensure direct traceability and validation of the specified requirements.





### Edge Cases and Error Handling





-   Tests will be designed to cover edge cases such as empty inventory, no matching recipes, API failures, network interruptions, and invalid user input.


-   Error messages and graceful degradation (as defined in NFRs) will be explicitly tested.
