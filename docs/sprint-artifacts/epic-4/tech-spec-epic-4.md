# Epic Technical Specification: Personalized Suggestions & Alerts

Date: 2025-12-01
Author: BIP
Epic ID: 4
Status: Draft

---

## Overview

This epic, "Personalized Suggestions & Alerts," is the core "smart" component of the application. It moves beyond passive inventory tracking and proactive user-driven recipe searches to a reactive, intelligent system. It delivers on the key value proposition of turning potential food waste into inspiration by automatically generating recipe suggestions from the user's existing inventory, sending timely alerts for expiring items, and providing an "Instant Idea" feature for immediate meal solutions. This epic is responsible for the "wow" moments that drive user engagement and demonstrate the platform's intelligence.

## Objectives and Scope

### In Scope

*   **FR3.1 - Get Recipe Suggestions:** Implement the backend logic and API endpoint (`GET /api/recipes/suggestions`) to generate meaningful recipe suggestions based on a user's inventory, prioritizing items nearing their expiration date.
*   **FR3.4 - Mark Recipe as Cooked:** Create the backend logic and API endpoint (`POST /api/recipes/{id}/cook`) to allow users to mark a recipe as cooked and have the system automatically deduct the corresponding ingredients from their inventory after confirmation.
*   **FR4.1 - Expiration Alerts:** Develop the mechanism for identifying items nearing expiration (2-3 days out) and generating actionable in-app notifications. This includes a background job (`PG Cron`) to check for expiring items and a real-time channel (`Supabase Realtime`) to deliver the alert to the user. The notification must link directly to recipe suggestions using the expiring items.
*   **FR4.2 - Instant Idea Generation:** Implement the "Instant Idea" feature, which allows users to get a quick AI-generated recipe by inputting a few ingredients. This involves creating a frontend component and an API endpoint that integrates with the Google Gemini API. This feature explicitly does **not** interact with the user's persistent inventory.

### Out of Scope

*   **User Preferences & Dietary Profiles:** Recipe suggestions in this epic will be based solely on inventory, not on user-saved dietary restrictions, allergies, or cuisine preferences. This is a post-MVP feature.
*   **AI-Enhanced Search/Semantic Search:** Recipe suggestion matching will be based on ingredient names, not on advanced semantic understanding.
*   **Proactive Meal Planning:** This epic is reactive (suggesting what to cook *now*). Proactive, long-term meal planning is a future vision.
*   **Push Notifications:** Alerts are limited to in-app notifications. Email or mobile push notifications are not part of this epic.

## System Architecture Alignment

This epic aligns perfectly with the chosen architecture and leverages several key decisions:

*   **API Pattern:** All features are exposed via RESTful API endpoints (`/api/recipes/suggestions`, `/api/recipes/{id}/cook`, and a new endpoint for the Gemini integration) built with Next.js API Routes, as defined in the architecture.
*   **AI Integration:** It directly implements the dual-AI strategy, using the **Spoonacular API** for inventory-based suggestions and the **Google Gemini API** for the "Instant Idea" generative feature.
*   **Background Jobs & Real-time Features:** The expiration alert system is a prime example of using **PG Cron** for the scheduled database check and **Supabase Realtime** to push the notification to the client, validating the choice of these technologies for building asynchronous, real-time features.
*   **Database:** The logic heavily relies on querying the **Supabase PostgreSQL** database for user inventory and expiration dates.
*   **Security:** All API endpoints will be secured using **NextAuth.js** and data access will be restricted via **Supabase RLS**, ensuring a user can only get suggestions or alerts for their own inventory.
*   **Communication Patterns:** The frontend will use `React Query` or `SWR` to fetch suggestions from the API endpoints, and the `Supabase Realtime` client SDK will listen for incoming expiration alerts.

## Detailed Design

### Services and Modules

| Service / Module | Responsibilities | Inputs / Outputs | Owner |
|---|---|---|---|
| **Recipe Suggestion Service** | - Generates recipe suggestions from user's inventory. <br>- Prioritizes recipes using ingredients nearing expiration. <br>- Interfaces with the Spoonacular API. | **Input:** User ID. <br> **Output:** List of recipe objects. | Backend |
| **Inventory Deduction Service** | - Deducts specified quantities of ingredients from a user's inventory upon confirmation. | **Input:** User ID, Recipe ID, List of ingredients to deduct. <br> **Output:** Updated inventory state. | Backend |
| **Expiration Alert Service** | - Identifies inventory items expiring within the notification window (2-3 days). <br>- Creates notification records in the database. <br>- Triggers real-time events. | **Input:** (Scheduled, no direct input). <br> **Output:** Notification records, Real-time events. | Backend (PG Cron) |
| **Instant Idea Service** | - Takes user-input ingredients and generates a recipe using the Google Gemini API. | **Input:** String of ingredients. <br> **Output:** A single, AI-generated recipe object. | Backend |
| **Notification Client** | - Listens for real-time notification events via Supabase Realtime. <br>- Displays in-app notifications to the user in a non-intrusive way. | **Input:** Real-time notification payload. <br> **Output:** UI notification component. | Frontend |
| **Inventory Deduction Modal** | - Presents the user with a list of ingredients from a cooked recipe. <br>- Allows the user to confirm or adjust which ingredients should be deducted from their inventory. | **Input:** Recipe ingredients. <br> **Output:** Confirmed list of ingredients to deduct. | Frontend |

### Data Models and Contracts

This epic primarily relies on the existing `inventory_items` and `users` tables. It introduces a new `notifications` table.

**`notifications` Table Schema (PostgreSQL)**

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT, -- Link to a page, e.g., recipe suggestions for an expiring item
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own notifications
CREATE POLICY "user_can_read_own_notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);
```

### APIs and Interfaces

This epic introduces one new API endpoint and makes use of two existing ones defined in the PRD and Architecture.

**1. Get Smart Recipe Suggestions**
*   **Endpoint:** `GET /api/recipes/suggestions`
*   **Description:** Fetches recipe suggestions based on the authenticated user's inventory.
*   **Request:**
    *   Auth: Bearer Token (handled by NextAuth.js)
*   **Response (200 OK):**
    ```json
    {
      "data": [
        {
          "id": 716429,
          "title": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
          "image": "https://spoonacular.com/recipeImages/716429-312x231.jpg",
          "usedIngredientCount": 3,
          "missedIngredientCount": 2,
          "missedIngredients": [ /* ... */ ],
          "usedIngredients": [ /* ... */ ],
          "likes": 1,
          "usesExpiringItems": true // Custom flag added by our backend
        }
      ]
    }
    ```
*   **Error Codes:** `401` (Unauthorized), `500` (Server Error).

**2. Mark Recipe as Cooked**
*   **Endpoint:** `POST /api/recipes/{id}/cook`
*   **Description:** Marks a recipe as cooked and deducts the used ingredients from the user's inventory.
*   **Request Body:**
    ```json
    {
      "ingredients": [
        { "id": "uuid-of-inv-item-1", "amount": 100, "unit": "g" },
        { "id": "uuid-of-inv-item-2", "amount": 1, "unit": "item" }
      ]
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "data": {
        "message": "Inventory updated successfully."
      }
    }
    ```
*   **Error Codes:** `400` (Bad Request - invalid ingredients), `401` (Unauthorized), `404` (Recipe not found), `500` (Server Error).

**3. Get Instant Idea**
*   **Endpoint:** `POST /api/instant-idea`
*   **Description:** Generates a recipe from a string of ingredients using the Google Gemini API.
*   **Request Body:**
    ```json
    {
      "ingredients": "3 eggs, 1 tomato, some cheese"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "data": {
        "title": "Simple Cheesy Tomato Omelette",
        "ingredients": [
          "3 large eggs",
          "1 ripe tomato, diced",
          "1/4 cup shredded cheese (cheddar or mozzarella recommended)",
          "Salt and pepper to taste",
          "1 tsp butter or oil"
        ],
        "instructions": [
          "1. Whisk eggs in a bowl with a pinch of salt and pepper.",
          "2. Heat butter or oil in a non-stick skillet over medium heat.",
          "3. Pour in the eggs and let them cook for a minute until the edges start to set.",
          "4. Sprinkle the diced tomato and shredded cheese over one half of the omelette.",
          "5. Fold the other half over and cook for another 1-2 minutes until the cheese is melted and the eggs are fully cooked.",
          "6. Serve immediately."
        ]
      }
    }
    ```
*   **Error Codes:** `400` (Bad Request - no ingredients provided), `401` (Unauthorized), `500` (Server/Gemini API Error).

### Workflows and Sequencing

**1. Expiration Alert Workflow**
1.  **[Scheduled]** `PG Cron` job runs once daily (e.g., at 01:00 UTC).
2.  **[Backend]** The job executes a SQL function `check_expiring_items()`.
3.  **[Database]** The function queries the `inventory_items` table for items expiring in the next `N` days (configurable, default 3) that have not already been notified about.
4.  **[Database]** For each expiring item found, it inserts a new row into the `notifications` table (e.g., message: "Your tomatoes are expiring soon!").
5.  **[Database]** The `notifications` table has a trigger that sends a payload to a `Supabase Realtime` channel (e.g., `user-notifications:<user_id>`).
6.  **[Frontend]** The logged-in user's client, subscribed to this channel, receives the real-time event.
7.  **[Frontend]** A notification component appears, displaying the message and a link to view recipe suggestions for that item.

**2. "Mark as Cooked" Workflow**
1.  **[Frontend]** User clicks the "I Cooked This" button on a recipe details page.
2.  **[Frontend]** The "Inventory Deduction Modal" appears, pre-populated with the ingredients from the recipe.
3.  **[Frontend]** User confirms the ingredients and quantities to be deducted.
4.  **[Frontend]** Client sends a `POST` request to `/api/recipes/{id}/cook` with the confirmed ingredient list.
5.  **[Backend]** The API route authenticates the user.
6.  **[Backend]** It validates that the user owns the inventory items being deducted.
7.  **[Backend]** It runs a transaction to update the quantities or delete the items from the user's inventory in the `inventory_items` table.
8.  **[Backend]** Returns a success message.
9.  **[Frontend]** The UI updates to reflect the change, possibly by invalidating the `inventory` query cache (`React Query`/`SWR`).

## Non-Functional Requirements

### Performance

*   **Recipe Suggestion Latency:** The `GET /api/recipes/suggestions` endpoint must return a response in **< 1500ms**, including the external call to the Spoonacular API. A caching layer (e.g., Vercel Data Cache) should be implemented to cache Spoonacular responses for common ingredient combinations for a short period (e.g., 1 hour) to improve performance and reduce API costs.
*   **Instant Idea Latency:** The `POST /api/instant-idea` endpoint must return a response in **< 3000ms**, accounting for the generative nature of the Google Gemini API call. The UI must show a clear loading state during this process.
*   **Real-time Delivery:** Expiration alert notifications should be delivered to the client via Supabase Realtime in **< 500ms** after the database event is triggered.

### Security

*   **Authorization:** All endpoints (`/api/recipes/suggestions`, `/api/recipes/{id}/cook`, `/api/instant-idea`) MUST be protected and require a valid NextAuth.js session.
*   **Data Access:** All database queries related to inventory MUST be subject to Supabase Row Level Security (RLS) policies to ensure a user can only access their own data. The `check_expiring_items()` background job must run with elevated privileges (`security_invoker`) to access all users' data, but its logic must be strictly confined to its purpose.
*   **Input Validation:** All API endpoints must validate their inputs. For example, the `/api/recipes/{id}/cook` endpoint must validate that the ingredient IDs in the payload belong to the authenticated user. The `/api/instant-idea` endpoint should sanitize the free-text input to prevent injection attacks against the LLM.

### Reliability/Availability

*   **External API Failures:** The application must be resilient to failures from the Spoonacular and Google Gemini APIs.
    *   If Spoonacular fails, the recipe suggestion endpoint should return a `503 Service Unavailable` error with a user-friendly message. The frontend should gracefully handle this state.
    *   If Gemini fails, the "Instant Idea" feature should return a `503` error and display a message like "The AI chef is busy right now, please try again in a moment."
*   **Background Job Failures:** The `check_expiring_items()` cron job should include robust error handling and logging. If the job fails, it should not prevent subsequent runs. A monitoring mechanism should be considered post-MVP to alert developers of repeated job failures.

### Observability

*   **Logging:**
    *   Structured logs (using Pino or Winston) must be generated for all key events within the API routes for this epic.
    *   Log successful recipe suggestion generations, including the number of suggestions returned.
    *   Log all "recipe cooked" events, including the user ID and recipe ID.
    *   Log all successful "Instant Idea" generations.
    *   Critically, log any errors from the Spoonacular or Gemini APIs, including the error message and status code from the external provider.
*   **Metrics:**
    *   Track the response latency for all three API endpoints.
    *   Count the number of `200 OK` vs `5xx` responses for the external API calls to monitor their health.
*   **Tracing:** (Post-MVP) Implement distributed tracing to follow a request from the frontend through the Next.js API route to the external API and back, to easily pinpoint performance bottlenecks.

## Dependencies and Integrations

| Type | Dependency / Integration Point | Version / Constraint | Purpose |
|---|---|---|---|
| **External API** | Spoonacular API | Latest Stable | Source for inventory-based recipe suggestions. |
| **External API** | Google Gemini API | Latest Stable | Powers the "Instant Idea" generative recipe feature. |
| **Internal Service** | Supabase PostgreSQL | v17 (Managed) | Data persistence for inventory items and notifications. |
| **Internal Service** | Supabase Auth | Latest Stable | User authentication and session management via NextAuth.js. |
| **Internal Service** | Supabase Realtime | Latest Stable | Pushing live expiration alert notifications to the client. |
| **Internal Service** | Supabase (PG Cron) | Latest Stable | Scheduled execution of the `check_expiring_items` background job. |
| **NPM Package** | `next` | v16+ | Core application framework. |
| **NPM Package** | `next-auth` | v4.24.13+ | Handling authentication sessions. |
| **NPM Package** | `@supabase/supabase-js` | Latest Stable | Client library for interacting with Supabase services (DB, Realtime). |
| **NPM Package** | `@google/generative-ai` | Latest Stable | Official client library for interacting with the Google Gemini API. |
| **Epic Dependency** | Epic 2: Inventory Management | Must be `done` | The entire suggestion and alert system is dependent on a functional inventory system. |
| **Epic Dependency** | Epic 3: Recipe Discovery & Browsing | `Recipe Card` component must be available | The UI for displaying recipe suggestions will reuse the `Recipe Card` component developed in Epic 3. |

## Acceptance Criteria (Authoritative)

**For Story 4.1: Get Smart Recipe Suggestions**
*   **AC 4.1.1:** Given a user is logged in and has at least 3 distinct items in their inventory, when they navigate to the dashboard, the system MUST generate at least 3 meaningful recipe suggestions.
*   **AC 4.1.2:** Given the user has an item expiring in 2 days and another expiring in 10 days, the recipe suggestions MUST prioritize using the item expiring in 2 days.
*   **AC 4.1.3:** Each suggested recipe card MUST indicate if it "Uses expiring" items, as per the UX specification.
*   **AC 4.1.4:** The `GET /api/recipes/suggestions` endpoint MUST only return suggestions for the authenticated user's inventory.

**For Story 4.2: Mark Recipe as Cooked and Deduct Inventory**
*   **AC 4.2.1:** Given a user is viewing a recipe, when they click the "I Cooked This" button, a confirmation modal ("Inventory Deduction Modal") MUST appear.
*   **AC 4.2.2:** Upon confirmation in the modal, the `POST /api/recipes/{id}/cook` endpoint MUST be called, and the specified ingredient quantities MUST be deducted from the user's inventory.
*   **AC 4.2.3:** The deduction action MUST be a deliberate, confirmed action to ensure data quality, as per the PRD's Metric Integrity principle.

**For Story 4.3: Expiration Alerts**
*   **AC 4.3.1:** Given a user has an item in their inventory with an expiration date 2 days from now, the system MUST generate an in-app notification for that user.
*   **AC 4.3.2:** The in-app notification MUST be "actionable," containing a direct link to a view showing recipe suggestions that use the expiring item.
*   **AC 4.3.3:** Notifications MUST be bundled if multiple items are expiring on the same day to avoid notification fatigue (e.g., "Your tomatoes and 2 other items are expiring soon").

**For Story 4.4: Instant Idea Generation**
*   **AC 4.4.1:** Given a user is on the main screen, when they click the "Instant Idea" button, a prompt MUST appear allowing them to enter ingredients.
*   **AC 4.4.2:** After entering at least two ingredients and submitting, the system MUST display an immediate, AI-generated recipe suggestion from the Gemini API.
*   **AC 4.4.3:** This action MUST NOT make any changes to the user's persistent inventory data.

## Traceability Mapping

| Acceptance Criterion | Spec Section(s) | Component(s) / API(s) | Test Idea |
|---|---|---|---|
| **AC 4.1.1** | Detailed Design > APIs | `GET /api/recipes/suggestions` | Integration test: Seed inventory with 5 items, call endpoint, assert > 3 recipes returned. |
| **AC 4.1.2** | Detailed Design > Services | Recipe Suggestion Service | Unit test: Mock inventory with items at different expiration dates, assert correct prioritization. |
| **AC 4.1.3** | N/A (UX Spec) | `RecipeCard` Component | E2E test (Playwright): Log in, view dashboard, assert "Uses expiring" badge is visible on correct card. |
| **AC 4.2.1** | Detailed Design > Workflows | Inventory Deduction Modal | E2E test: Click "I Cooked This" button, assert modal appears. |
| **AC 4.2.2** | Detailed Design > APIs | `POST /api/recipes/{id}/cook` | Integration test: Seed inventory, call endpoint with ingredients, then fetch inventory and assert quantities are reduced. |
| **AC 4.3.1** | Detailed Design > Workflows | Expiration Alert Service (PG Cron) | Integration test: Manually run `check_expiring_items()` function, query `notifications` table for new entry. |
| **AC 4.3.2** | N/A (UX Spec) | Notification UI Component | E2E test: Trigger a notification, click it, assert the user is navigated to the correct page. |
| **AC 4.4.1** | Detailed Design > Services | Instant Idea Service | E2E test: Click "Instant Idea" button, assert input prompt is visible. |
| **AC 4.4.2** | Detailed Design > APIs | `POST /api/instant-idea` | Integration test: Call endpoint with ingredients, assert a valid recipe structure is returned. |
| **AC 4.4.3** | Detailed Design > Services | Instant Idea Service | Integration test: Call `POST /api/instant-idea`, then `GET /api/inventory` and assert inventory remains unchanged. |

## Risks, Assumptions, Open Questions

*   **Risk:** The quality of Spoonacular's recipe suggestions for limited ingredients might be low.
    *   **Mitigation:** The suggestion logic will include a filter to ensure a minimum number of the user's ingredients are used. The UI will clearly show "used" vs. "missed" ingredients to manage expectations.
*   **Risk:** The Google Gemini API may return inconsistent or poorly formatted recipe structures.
    *   **Mitigation:** The backend service will have a robust parsing and validation layer. A prompt engineering strategy will be developed with few-shot examples to guide the LLM into providing a consistent JSON output. If parsing fails, a user-friendly error is returned.
*   **Risk:** The `PG Cron` job for expiration alerts could be resource-intensive as the user base grows.
    *   **Mitigation:** The SQL function will be optimized to query only active users and items close to expiration. The job frequency will be monitored and adjusted if necessary. For massive scale, this would be re-evaluated, but it is sufficient for the target scale.
*   **Assumption:** Users will understand the distinction between the inventory-based suggestions and the "Instant Idea" feature.
    *   **Mitigation:** The UI will use clear and distinct labeling for each feature. The "Instant Idea" button will be visually prominent and have a tooltip explaining its purpose.
*   **Question:** What is the optimal notification window for expiration alerts (currently set to 2-3 days)?
    *   **Next Step:** This will be launched with the 3-day default. We will gather user feedback and monitor the "Actionable Nudges" metric post-launch to see if this window should be adjusted or made user-configurable.

## Test Strategy Summary

*   **Unit Tests:**
    *   Test the `Recipe Suggestion Service` logic for prioritizing expiring items.
    *   Test the `Instant Idea Service`'s ability to correctly parse a valid response from a mocked Gemini API.
    *   Test utility functions for date calculations.
*   **Integration Tests:**
    *   Write tests for all three API endpoints (`/suggestions`, `/cook`, `/instant-idea`) that interact with a test database (for inventory) and mocked external APIs (Spoonacular, Gemini).
    *   Write a test for the `check_expiring_items()` PostgreSQL function to ensure it correctly identifies items and creates entries in the `notifications` table.
*   **End-to-End (E2E) Tests (Playwright/Cypress):**
    *   A full user flow: Log in, see a suggestion on the dashboard, click it, mark it as cooked, and verify the inventory is updated.
    *   A full alert flow: Seed an item about to expire, manually trigger the alert mechanism, verify the in-app notification appears on the UI, click it, and ensure it leads to the correct page.
    *   A full "Instant Idea" flow: Click the button, enter ingredients, and verify a recipe appears on the screen without affecting the main inventory display.