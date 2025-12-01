# Epic Technical Specification: Waste Reduction & Shopping List

Date: søndag 1. desember 2025
Author: BIP
Epic ID: epic-4
Status: Draft

---

## Overview

Help users reduce food waste through proactive expiration alerts and enable efficient meal planning with a comprehensive shopping list feature that integrates seamlessly with recipe discovery and inventory management.

## Objectives and Scope

**Objectives:**
- Enable users to receive timely notifications for food items nearing expiration.
- Provide proactive waste reduction insights and recommendations.
- Allow users to create and manage shopping lists efficiently.
- Enable seamless addition of missing recipe ingredients to shopping lists.
- Support manual shopping list item management for flexible meal planning.
- Integrate shopping lists with inventory management for streamlined grocery workflows.

**In Scope:**
- FR-005.1: Users receive in-app notifications for food items nearing expiration (2–3 days before).
- FR-006.1: Users can add, view, and delete items from a shopping list.
- FR-006.2: Items can be added manually or from missing recipe ingredients.
- Story 4.1: In-App Expiration Alerts.
- Story 4.2: Add Item to Shopping List.
- Story 4.3: View & Manage Shopping List.

**Out of Scope (for this epic):**
- Push notifications or email alerts for expiration warnings (future enhancement).
- Shopping list sharing between multiple users or households.
- Integration with online grocery stores for direct ordering.
- Barcode scanning for shopping list items.
- Recipe meal planning calendar integration.
- Price tracking and budget management features.
- Store location-based shopping list organization.
- Automatic reordering or subscription services.

## System Architecture Alignment

This epic aligns with the established project architecture by leveraging the following core components and technologies:

-   **Frontend:** Next.js 14 (App Router, Server Components), Tailwind CSS, shadcn/ui.
-   **Backend:** Next.js API Routes for shopping list CRUD operations and notification management.
-   **Database:** Supabase (PostgreSQL) managed via Prisma ORM.
-   **Authentication:** NextAuth.js for securing API routes and user context.
-   **Hosting & CI/CD:** Vercel for deployment and continuous integration.
-   **Scheduling:** Vercel Cron Jobs for periodic expiration checking.

For detailed architectural context, refer to `architecture.md` sections 3.1, 3.2, 3.3, 4 (Data Model - ShoppingList, ShoppingListItem, Notification), 5 (Frontend Architecture), 6 (Backend Architecture).

## Detailed Design

### Services and Modules

-   **Frontend Client Components:**
    -   **`NotificationBadge`:** Visual indicator showing count of active notifications, clickable to view notification panel.
    -   **`NotificationPanel`:** Dropdown or slide-out panel displaying recent expiration alerts and waste reduction tips.
    -   **`ExpiringItemsList`:** Component showing food items nearing expiration with visual urgency indicators.
    -   **`ShoppingListView`:** Main component for displaying shopping list with items organized by status.
    -   **`ShoppingListItem`:** Individual item component with checkbox, edit, and delete actions.
    -   **`AddShoppingListForm`:** Form component for manually adding items to shopping list.
    -   **`QuickAddButton`:** Floating action button or context button for quickly adding items.
    -   **`RecipeIngredientSelector`:** Component within recipe detail view for bulk-adding missing ingredients.
    -   Utilizes `shadcn/ui` for standardized UI primitives (Badge, Card, Checkbox, Input, Button, Dialog, Sheet, etc.).

-   **Frontend Server Components:**
    -   **`ShoppingListPage`:** Main server component that fetches initial shopping list data.
    -   **`NotificationServer`:** Server component for initial notification data fetch.

-   **Next.js API Routes (Backend Services):**
    -   **`/api/notifications/expiring` (GET):** Endpoint for fetching expiration notifications for the current user.
    -   **`/api/notifications/[id]/dismiss` (POST):** Endpoint for dismissing/marking notification as read.
    -   **`/api/shopping-list` (GET):** Endpoint for fetching user's shopping list with all items.
    -   **`/api/shopping-list/add-manual` (POST):** Endpoint for manually adding items to shopping list.
    -   **`/api/shopping-list/add-from-recipe` (POST):** Endpoint for adding multiple items from recipe missing ingredients.
    -   **`/api/shopping-list/item/[id]` (PUT):** Endpoint for updating a shopping list item (e.g., mark as purchased, edit quantity).
    -   **`/api/shopping-list/item/[id]` (DELETE):** Endpoint for deleting a shopping list item.
    -   **`/api/shopping-list/clear` (DELETE):** Endpoint for clearing all purchased items or entire list.
    -   **`/api/cron/check-expiration` (GET):** Scheduled endpoint (Vercel Cron) for periodic expiration checking and notification generation.

-   **Database Interaction Layer:**
    -   **Prisma ORM:** Provides a type-safe API for interacting with the Supabase PostgreSQL database. Manages queries and mutations for the `ShoppingList`, `ShoppingListItem`, and `Notification` models.

-   **Background Services:**
    -   **Expiration Checker:** Scheduled job (Vercel Cron) that runs periodically to scan `FoodItem` records and generate `Notification` records for items nearing expiration.

-   **Authentication & Authorization:**
    -   **NextAuth.js:** Ensures all shopping list and notification API routes are protected and only accessible by authenticated users.

### Data Models and Contracts

-   **`ShoppingList` Model (Prisma Schema / Supabase Table):**
    -   `id`: String (Primary Key, cuid)
    -   `userId`: String (Foreign Key to `User.id`)
    -   `user`: Relation to `User` model
    -   `items`: Relation to `ShoppingListItem[]` model
    -   `createdAt`: DateTime (Defaults to `now()`)
    -   `updatedAt`: DateTime (Updates automatically)

-   **`ShoppingListItem` Model (Prisma Schema / Supabase Table):**
    -   `id`: String (Primary Key, cuid)
    -   `name`: String (Required - item name)
    -   `quantity`: Float (Optional - amount needed)
    -   `unit`: String (Optional - e.g., "kg", "liters", "pieces")
    -   `category`: String (Optional - e.g., "Dairy", "Vegetables")
    -   `isPurchased`: Boolean (Default: false - purchase status)
    -   `notes`: String (Optional - additional notes)
    -   `addedFrom`: String (Optional - "manual" | "recipe" - source tracking)
    -   `recipeId`: String (Optional - reference to recipe if added from recipe)
    -   `shoppingListId`: String (Foreign Key to `ShoppingList.id`)
    -   `shoppingList`: Relation to `ShoppingList` model
    -   `createdAt`: DateTime (Defaults to `now()`)
    -   `updatedAt`: DateTime (Updates automatically)

-   **`Notification` Model (Prisma Schema / Supabase Table):**
    -   `id`: String (Primary Key, cuid)
    -   `type`: String (Required - e.g., "EXPIRATION_WARNING", "WASTE_TIP")
    -   `title`: String (Required - notification headline)
    -   `message`: String (Required - notification body)
    -   `isRead`: Boolean (Default: false - read status)
    -   `priority`: String (Optional - "LOW" | "MEDIUM" | "HIGH")
    -   `relatedItemId`: String (Optional - Foreign Key to `FoodItem.id` if applicable)
    -   `relatedItem`: Relation to `FoodItem` model (Optional)
    -   `userId`: String (Foreign Key to `User.id`)
    -   `user`: Relation to `User` model
    -   `createdAt`: DateTime (Defaults to `now()`)
    -   `expiresAt`: DateTime (Optional - when notification should auto-expire)

-   **`FoodItem` Model (Referenced from Epic 2):**
    -   Used for expiration checking and notification generation.

### APIs and Interfaces

-   **`GET /api/notifications/expiring`**
    -   **Query Parameters:**
        -   `limit` (optional): Number (max notifications to return, default: 20)
        -   `includeRead` (optional): Boolean (include read notifications, default: false)
    -   **Response (200 OK):**
        ```json
        {
          "notifications": [
            {
              "id": "string (cuid)",
              "type": "EXPIRATION_WARNING",
              "title": "string",
              "message": "string",
              "isRead": "boolean",
              "priority": "HIGH",
              "relatedItemId": "string (cuid, optional)",
              "relatedItem": {
                "id": "string (cuid)",
                "name": "string",
                "bestBeforeDate": "string (ISO 8601 DateTime)"
              },
              "createdAt": "string (ISO 8601 DateTime)"
            }
          ],
          "unreadCount": "number"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```

-   **`POST /api/notifications/[id]/dismiss`**
    -   **Response (200 OK):**
        ```json
        {
          "message": "Notification dismissed successfully",
          "notificationId": "string (cuid)"
        }
        ```
    -   **Response (404 Not Found):**
        ```json
        {
          "error": "Notification not found"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```

-   **`GET /api/shopping-list`**
    -   **Query Parameters:**
        -   `includePurchased` (optional): Boolean (include purchased items, default: true)
        -   `sortBy` (optional): "createdAt" | "name" | "category" (default: "createdAt")
    -   **Response (200 OK):**
        ```json
        {
          "shoppingList": {
            "id": "string (cuid)",
            "items": [
              {
                "id": "string (cuid)",
                "name": "string",
                "quantity": "number",
                "unit": "string",
                "category": "string",
                "isPurchased": "boolean",
                "notes": "string",
                "addedFrom": "manual | recipe",
                "recipeId": "string (optional)",
                "createdAt": "string (ISO 8601 DateTime)"
              }
            ],
            "createdAt": "string (ISO 8601 DateTime)",
            "updatedAt": "string (ISO 8601 DateTime)"
          },
          "stats": {
            "totalItems": "number",
            "purchasedItems": "number",
            "pendingItems": "number"
          }
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```

-   **`POST /api/shopping-list/add-manual`**
    -   **Request Body:** `application/json`
        ```json
        {
          "name": "string",
          "quantity": "number (optional)",
          "unit": "string (optional)",
          "category": "string (optional)",
          "notes": "string (optional)"
        }
        ```
    -   **Response (200 OK):**
        ```json
        {
          "message": "Item added successfully",
          "item": {
            "id": "string (cuid)",
            "name": "string",
            "quantity": "number",
            "unit": "string",
            "category": "string",
            "isPurchased": "boolean",
            "notes": "string",
            "addedFrom": "manual",
            "createdAt": "string (ISO 8601 DateTime)"
          }
        }
        ```
    -   **Response (400 Bad Request):**
        ```json
        {
          "error": "string" // e.g., "Item name is required"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```

-   **`POST /api/shopping-list/add-from-recipe`**
    -   **Request Body:** `application/json`
        ```json
        {
          "recipeId": "string | number",
          "ingredients": [
            {
              "name": "string",
              "amount": "number",
              "unit": "string"
            }
          ]
        }
        ```
    -   **Response (200 OK):**
        ```json
        {
          "message": "Ingredients added to shopping list",
          "itemsAdded": [
            {
              "id": "string (cuid)",
              "name": "string",
              "quantity": "number",
              "unit": "string",
              "addedFrom": "recipe",
              "recipeId": "string"
            }
          ],
          "duplicatesSkipped": "number"
        }
        ```
    -   **Response (400 Bad Request):**
        ```json
        {
          "error": "string" // e.g., "Invalid recipe ID or ingredients"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```

-   **`PUT /api/shopping-list/item/[id]`**
    -   **Request Body:** `application/json`
        ```json
        {
          "name": "string (optional)",
          "quantity": "number (optional)",
          "unit": "string (optional)",
          "category": "string (optional)",
          "isPurchased": "boolean (optional)",
          "notes": "string (optional)"
        }
        ```
    -   **Response (200 OK):**
        ```json
        {
          "message": "Item updated successfully",
          "item": {
            "id": "string (cuid)",
            "name": "string",
            "quantity": "number",
            "unit": "string",
            "category": "string",
            "isPurchased": "boolean",
            "notes": "string",
            "updatedAt": "string (ISO 8601 DateTime)"
          }
        }
        ```
    -   **Response (404 Not Found):**
        ```json
        {
          "error": "Shopping list item not found"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```
    -   **Response (403 Forbidden):**
        ```json
        {
          "error": "Access denied"
        }
        ```

-   **`DELETE /api/shopping-list/item/[id]`**
    -   **Response (200 OK):**
        ```json
        {
          "message": "Item deleted successfully",
          "itemId": "string (cuid)"
        }
        ```
    -   **Response (404 Not Found):**
        ```json
        {
          "error": "Shopping list item not found"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```
    -   **Response (403 Forbidden):**
        ```json
        {
          "error": "Access denied"
        }
        ```

-   **`DELETE /api/shopping-list/clear`**
    -   **Query Parameters:**
        -   `mode` (optional): "purchased" | "all" (default: "purchased")
    -   **Response (200 OK):**
        ```json
        {
          "message": "Shopping list cleared successfully",
          "itemsDeleted": "number"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```

-   **`GET /api/cron/check-expiration`** (Internal - Vercel Cron)
    -   **Authentication:** Protected by Vercel Cron secret token
    -   **Response (200 OK):**
        ```json
        {
          "message": "Expiration check completed",
          "notificationsCreated": "number",
          "usersNotified": "number"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Invalid cron secret"
        }
        ```

### Workflows and Sequencing

#### 1. In-App Expiration Alerts Workflow

1.  **Background Process (Scheduled - Vercel Cron):**
    a.  Vercel Cron triggers `/api/cron/check-expiration` endpoint at scheduled intervals (e.g., daily at midnight, twice daily).
    b.  Endpoint authenticates request using Vercel Cron secret.
    c.  Backend queries all `FoodItem` records via Prisma where `bestBeforeDate` is within 2-3 days.
    d.  For each item nearing expiration:
        - Checks if a notification already exists for this item (to avoid duplicates).
        - If not, creates a new `Notification` record with type `EXPIRATION_WARNING`, priority `HIGH`, and links to the `FoodItem`.
    e.  Returns summary of notifications created.
2.  **User Access to Notifications:**
    a.  **User Action:** User logs in or navigates to the application.
    b.  **Frontend:** `NotificationBadge` component makes a request to `/api/notifications/expiring` (optionally on page load or periodically via polling/websocket).
    c.  **Backend (Next.js API Route):**
        - Authenticates the request using NextAuth.js to extract `userId`.
        - Queries `Notification` records for the user where `isRead` is false.
        - Returns notifications sorted by priority and creation date.
    d.  **Frontend:**
        - `NotificationBadge` displays unread count if notifications exist.
        - User clicks on badge to open `NotificationPanel`.
3.  **Viewing Notification Details:**
    a.  **Frontend:** `NotificationPanel` displays list of notifications with titles, messages, and related item details.
    b.  **Frontend:** Each notification shows:
        - Title (e.g., "Milk expiring soon!")
        - Message (e.g., "Your milk expires in 2 days")
        - Priority indicator (visual styling)
        - Link to "View Expiring Items" or directly to the related `FoodItem` in Pantry.
    c.  **User Action:** User clicks notification to view more details or clicks "View All Expiring Items".
    d.  **Frontend:** Navigation to `ExpiringItemsList` view showing all soon-to-expire items from inventory.
4.  **Dismissing Notifications:**
    a.  **User Action:** User clicks "Dismiss" or marks notification as read.
    b.  **Frontend:** Sends `POST` request to `/api/notifications/[id]/dismiss`.
    c.  **Backend (Next.js API Route):**
        - Authenticates the request.
        - Finds the `Notification` by ID.
        - Verifies that the `Notification.userId` matches the authenticated user.
        - Updates `isRead` to `true`.
        - Returns success message.
    d.  **Frontend:** Updates UI to remove or dim the dismissed notification, decrements unread count.

#### 2. Add Item to Shopping List (Manual) Workflow

1.  **User Action:** User navigates to shopping list view and clicks "Add Item" button or quick-add floating button.
2.  **Frontend:** `AddShoppingListForm` component (modal or inline form) is displayed.
3.  **User Action:** Inputs item details: `name` (required), `quantity`, `unit`, `category`, `notes` (all optional).
4.  **Frontend Validation:** Client-side validation ensures `name` is not empty.
5.  **Frontend:** Sends `POST` request to `/api/shopping-list/add-manual` with item data.
6.  **Backend (Next.js API Route):**
    a.  Authenticates the request using NextAuth.js to extract `userId`.
    b.  Validates request body (server-side validation).
    c.  Finds or creates `ShoppingList` for the user (if doesn't exist).
    d.  Uses Prisma to create a new `ShoppingListItem` record with `addedFrom: "manual"`.
    e.  Returns the created item.
7.  **Backend Response:** Returns success message with new item data.
8.  **Frontend:**
    a.  On success: Displays success feedback (e.g., toast notification), closes form, updates shopping list view with new item.
    b.  On error: Displays error message.

#### 3. Add Items from Recipe Workflow

1.  **User Action:** User is viewing a recipe detail (`RecipeDetailView`) and sees missing ingredients highlighted.
2.  **Frontend:** `RecipeIngredientSelector` component displays missing ingredients with individual or bulk-add options.
3.  **User Action:** Clicks "Add All Missing Ingredients to Shopping List" or selects specific ingredients.
4.  **Frontend:** Collects selected/all missing ingredient data (name, amount, unit).
5.  **Frontend:** Sends `POST` request to `/api/shopping-list/add-from-recipe` with `recipeId` and `ingredients` array.
6.  **Backend (Next.js API Route):**
    a.  Authenticates the request using NextAuth.js to extract `userId`.
    b.  Validates request body.
    c.  Finds or creates `ShoppingList` for the user.
    d.  For each ingredient in the array:
        - Checks if a similar item already exists in the shopping list (optional: duplicate detection by name).
        - If not a duplicate, creates a new `ShoppingListItem` with `addedFrom: "recipe"` and `recipeId`.
        - If duplicate, either skips or merges quantities (configurable logic).
    e.  Returns list of items added and count of duplicates skipped.
7.  **Backend Response:** Returns success message with details of added items.
8.  **Frontend:**
    a.  On success: Displays confirmation (e.g., "5 ingredients added to shopping list"), optionally provides link to shopping list.
    b.  Updates button state to "Added" or similar.
    c.  On error: Displays error message.

#### 4. View & Manage Shopping List Workflow

1.  **User Action:** User navigates to the Shopping List page (e.g., `/shopping-list` route).
2.  **Frontend (Server Component):** `ShoppingListPage` server component is rendered.
3.  **Frontend:** Server component or client-side request to `GET /api/shopping-list`.
4.  **Backend (Next.js API Route):**
    a.  Authenticates the request using NextAuth.js to extract `userId`.
    b.  Uses Prisma to query `ShoppingList` and associated `ShoppingListItem`s for the user.
    c.  Applies sorting and filtering based on query parameters (default: show all, sort by creation date).
    d.  Returns shopping list data with items and stats.
5.  **Frontend (Client Components):**
    a.  `ShoppingListView` component receives shopping list data.
    b.  Items are displayed, typically grouped by status (pending vs. purchased).
    c.  Each `ShoppingListItem` component renders with:
        - Checkbox for marking as purchased.
        - Item name, quantity, unit, category.
        - Edit button and delete button.
    d.  Additional UI elements:
        - "Add Item" button.
        - "Clear Purchased Items" button.
        - Item count stats (e.g., "3 of 10 items purchased").
6.  **User Interaction - Mark as Purchased:**
    a.  **User Action:** User clicks checkbox to mark item as purchased.
    b.  **Frontend:** Sends `PUT` request to `/api/shopping-list/item/[id]` with `isPurchased: true`.
    c.  **Backend:** Authenticates, validates, updates item, returns updated item.
    d.  **Frontend:** Updates UI to reflect purchase status (e.g., strike-through, move to purchased section).
7.  **User Interaction - Edit Item:**
    a.  **User Action:** User clicks edit button on an item.
    b.  **Frontend:** Opens edit form (modal or inline) pre-populated with item data.
    c.  **User Action:** Modifies fields and saves.
    d.  **Frontend:** Sends `PUT` request to `/api/shopping-list/item/[id]` with updated data.
    e.  **Backend:** Authenticates, validates, updates item, returns updated item.
    f.  **Frontend:** Updates item display in shopping list.
8.  **User Interaction - Delete Item:**
    a.  **User Action:** User clicks delete button on an item.
    b.  **Frontend:** Optionally shows confirmation dialog.
    c.  **User Action:** Confirms deletion.
    d.  **Frontend:** Sends `DELETE` request to `/api/shopping-list/item/[id]`.
    e.  **Backend:** Authenticates, validates ownership, deletes item, returns success.
    f.  **Frontend:** Removes item from UI.
9.  **User Interaction - Clear Purchased Items:**
    a.  **User Action:** User clicks "Clear Purchased Items" button.
    b.  **Frontend:** Shows confirmation dialog.
    c.  **User Action:** Confirms clearing.
    d.  **Frontend:** Sends `DELETE` request to `/api/shopping-list/clear?mode=purchased`.
    e.  **Backend:** Authenticates, deletes all items where `isPurchased: true`, returns count.
    f.  **Frontend:** Updates shopping list view, removes purchased items.

## Non-Functional Requirements

### Performance

-   **Notification Fetch Time:** Notification data should be fetched and displayed within 500ms on page load.
-   **Shopping List Load Time:** Shopping list view should render with all items within 1.5 seconds on typical connections.
-   **Add Item Response Time:** Adding items to shopping list (manual or from recipe) should complete within 300ms (90th percentile).
-   **Update/Delete Response Time:** Marking items as purchased, editing, or deleting items should respond within 200ms.
-   **Background Job Efficiency:** Expiration checking cron job should complete within 60 seconds for systems with up to 10,000 active food items across all users.
-   **Real-time Updates:** UI should update optimistically for immediate user feedback, with rollback mechanisms for failed operations.

### Security

-   **Authentication:** All shopping list and notification API routes must be protected by NextAuth.js, requiring a valid user session.
-   **Authorization:** Users must only be able to access their own shopping lists, notifications, and related data. Backend must verify `userId` ownership.
-   **Cron Endpoint Protection:** `/api/cron/check-expiration` must be protected by Vercel Cron secret token to prevent unauthorized execution.
-   **Input Validation:** Both client-side and server-side validation for all shopping list item inputs to prevent injection attacks.
-   **Data Isolation:** Ensure strict data isolation between users in all database queries.

### Reliability/Availability

-   **Uptime:** Shopping list and notification services should maintain a minimum uptime of 99.9% (excluding planned maintenance).
-   **Cron Job Reliability:** Expiration checking job should have retry mechanisms for transient failures and alert on persistent failures.
-   **Error Handling:** Graceful error handling for all operations with informative user feedback without exposing system internals.
-   **Data Consistency:** Shopping list operations must be transactional to prevent data corruption or partial updates.
-   **Notification Accuracy:** Expiration notifications must be accurate and avoid false positives/negatives within the 2-3 day threshold.

### Observability

-   **Logging:** Detailed logs for critical operations (notifications created, shopping list modifications, cron job executions, API errors) with user context and timestamps.
-   **Metrics:** Key performance indicators including:
    - Notification generation rate and accuracy.
    - Shopping list usage (items added per user, add-from-recipe vs. manual ratio).
    - API response times for all shopping list endpoints.
    - Cron job execution time and success rate.
    - User engagement with notifications (dismissal rate, click-through rate).
-   **Alerting:** Automated alerts for:
    - Cron job failures or timeouts.
    - High error rates on shopping list or notification endpoints.
    - Unusual notification generation patterns (potential data issues).
    - Service unavailability.

## Dependencies and Integrations

This epic relies on the following key technologies and integrations:

-   **Framework:** Next.js 14 (App Router, Server Components)
-   **Styling:** Tailwind CSS
-   **UI Components:** shadcn/ui (Badge, Checkbox, Card, Sheet, Dialog, Button, Input, etc.)
-   **Database:** Supabase (PostgreSQL)
-   **ORM:** Prisma
-   **Authentication:** NextAuth.js
-   **Scheduling:** Vercel Cron Jobs
-   **Deployment/CI/CD:** Vercel
-   **Source Control:** Git (implied by Vercel integration)

**External Dependencies:**
-   **Completed Epic 2:** Core Inventory Management must be functional for expiration checking and notification generation.
-   **Completed Epic 3:** Recipe Discovery features must be functional for add-from-recipe workflow.
-   **Vercel Platform:** Cron job functionality requires Vercel Pro plan or equivalent cron service.

## Acceptance Criteria (Authoritative)

### Story 4.1: In-App Expiration Alerts
*   **Given** I have food items in my inventory with expiration dates,
*   **When** a food item is 2-3 days away from its expiration date,
*   **Then** I receive an in-app notification alerting me about the soon-to-expire item.
*   **And** clicking the notification takes me to a view showing all soon-to-expire items.
*   **And** the notification system is unintrusive but effective (e.g., badge indicator, not blocking modals).
*   **And** notifications are generated automatically by a background process without user action.
*   **And** I can dismiss notifications to clear them from my notification panel.
*   **And** the notification displays relevant information (item name, days until expiration).
*   **And** the notification UI adheres to the "Farmhouse Kitchen" aesthetic and is accessible.

### Story 4.2: Add Item to Shopping List
*   **Given** I am logged in,
*   **When** I manually input an item into my shopping list with at least a name,
*   **Then** the item is successfully added to my shopping list.
*   **And** I can optionally provide quantity, unit, category, and notes for the item.
*   **And** when viewing a recipe with missing ingredients, I can add those missing ingredients to my shopping list with a single action (e.g., "Add All to Shopping List" button).
*   **And** the system prevents or handles duplicate items intelligently (e.g., skip duplicates or merge quantities).
*   **And** the shopping list UI is clear, intuitive, and easy to use.
*   **And** the add item flow is responsive and accessible.
*   **And** items added from recipes are marked with their source for context.

### Story 4.3: View & Manage Shopping List
*   **Given** I am logged in,
*   **When** I navigate to my shopping list,
*   **Then** I see all items currently on my list organized in a clear format.
*   **And** I can mark items as purchased using a checkbox or similar interaction.
*   **And** purchased items are visually distinguished (e.g., strike-through, moved to separate section).
*   **And** I can edit individual items (name, quantity, unit, category, notes).
*   **And** I can delete individual items from the list.
*   **And** I can clear all purchased items at once with a confirmation.
*   **And** the shopping list displays useful statistics (e.g., "3 of 10 items purchased").
*   **And** the shopping list remains organized and easy to read even with many items.
*   **And** the shopping list view is responsive across devices and accessible.

## Traceability Mapping

| Acceptance Criteria (AC) | Spec Section(s)         | Component(s)/API(s)                                   | Test Idea                                                 |
| :----------------------- | :---------------------- | :---------------------------------------------------- | :-------------------------------------------------------- |
| **Story 4.1: In-App Expiration Alerts** |
| User has items with expiration dates | N/A (Prerequisite) | `FoodItem` model from Epic 2 | Setup test: Create food items with various expiration dates. |
| Notification when item 2-3 days from expiration | Detailed Design (Workflows - Expiration Alerts) | `/api/cron/check-expiration`, `Notification` model | Functional test: Run cron job with items expiring in 2 days, verify notifications created. |
| Clicking notification shows expiring items | Detailed Design (Workflows - Expiration Alerts) | `NotificationPanel`, routing to `ExpiringItemsList` | UI test: Click notification, verify navigation to correct view with filtered items. |
| Notification system unintrusive | N/A (UX Ref) | `NotificationBadge` component | Manual UX review: Verify badge display, no blocking modals. |
| Notifications generated automatically | Detailed Design (Workflows - Expiration Alerts) | Vercel Cron, `/api/cron/check-expiration` | Integration test: Schedule cron job, verify automatic execution and notification creation. |
| User can dismiss notifications | Detailed Design (Workflows - Expiration Alerts), (APIs) | `POST /api/notifications/[id]/dismiss` | Functional test: Dismiss notification, verify `isRead` updated in DB and UI updates. |
| Notification displays relevant info | Detailed Design (Workflows - Expiration Alerts) | `NotificationPanel` component | UI test: Inspect notification content, verify item name and days until expiration shown. |
| UI themed and accessible | N/A (UX Ref) | Frontend components | Manual review and accessibility audit. |
| **Story 4.2: Add Item to Shopping List** |
| User manually adds item with name | Detailed Design (Workflows - Add Manual) | `AddShoppingListForm`, `POST /api/shopping-list/add-manual` | Functional test: Add item with only name, verify created in DB. |
| Optional fields provided | Detailed Design (APIs) | `AddShoppingListForm`, `ShoppingListItem` model | Functional test: Add item with all optional fields, verify stored correctly. |
| Add missing ingredients from recipe | Detailed Design (Workflows - Add from Recipe) | `RecipeIngredientSelector`, `POST /api/shopping-list/add-from-recipe` | Functional test: View recipe, add missing ingredients, verify all added to shopping list. |
| Handle duplicates intelligently | Detailed Design (Workflows - Add from Recipe) | Backend logic in `/api/shopping-list/add-from-recipe` | Functional test: Add duplicate item, verify behavior (skip or merge). |
| Shopping list UI clear and easy | N/A (UX Ref) | `ShoppingListView`, `AddShoppingListForm` | Manual UX review. |
| Add item flow responsive and accessible | N/A (UX Ref) | Frontend components | Responsive testing and accessibility audit. |
| Items marked with source | Detailed Design (Data Models) | `ShoppingListItem.addedFrom` field | Functional test: Add items from both sources, verify `addedFrom` field populated correctly. |
| **Story 4.3: View & Manage Shopping List** |
| User navigates to shopping list | Detailed Design (Workflows - View & Manage) | Routing, `ShoppingListPage` server component | Navigation test: Navigate to shopping list, verify page loads. |
| All items displayed clearly | Detailed Design (Workflows - View & Manage) | `ShoppingListView`, `GET /api/shopping-list` | UI test: Verify all items from DB displayed correctly. |
| Mark items as purchased | Detailed Design (Workflows - View & Manage) | `ShoppingListItem` checkbox, `PUT /api/shopping-list/item/[id]` | Functional test: Check item, verify `isPurchased` updated and UI changes. |
| Purchased items visually distinguished | Detailed Design (Workflows - View & Manage) | `ShoppingListItem` component styling | UI test: Mark item purchased, verify visual change (strike-through, etc.). |
| Edit individual items | Detailed Design (Workflows - View & Manage), (APIs) | Edit form, `PUT /api/shopping-list/item/[id]` | Functional test: Edit item fields, save, verify updates in DB and UI. |
| Delete individual items | Detailed Design (Workflows - View & Manage), (APIs) | Delete button, `DELETE /api/shopping-list/item/[id]` | Functional test: Delete item, verify removed from DB and UI. |
| Clear purchased items with confirmation | Detailed Design (Workflows - View & Manage), (APIs) | Clear button, confirmation dialog, `DELETE /api/shopping-list/clear` | Functional test: Clear purchased, verify only purchased items deleted. |
| Display statistics | Detailed Design (APIs) | `ShoppingListView` stats display | UI test: Verify stats (item counts) displayed correctly. |
| List organized and readable | N/A (UX Ref) | `ShoppingListView` layout | Manual UI review with varying item counts. |
| Responsive and accessible | N/A (UX Ref) | Frontend components | Responsive testing and accessibility audit. |

## Risks, Assumptions, Open Questions

### Risks

-   **Cron Job Reliability:** Relying on Vercel Cron Jobs for critical notification generation. If cron fails or has delays, users may not receive timely expiration alerts. Need robust monitoring and alerting.
-   **Notification Fatigue:** Users may receive many expiration notifications if they have large inventories. Notification design must balance helpfulness with avoiding annoyance.
-   **Duplicate Detection Complexity:** Determining duplicate shopping list items (especially when adding from recipes vs. manual) can be complex due to variations in naming and units.
-   **Time Zone Handling:** Expiration checking must correctly handle different time zones to ensure notifications are accurate for all users.
-   **Scalability of Cron Job:** As user base grows, the expiration checking job may need to process many food items. May require optimization (batching, indexing) or migration to a more robust job queue system.
-   **Shopping List Conflicts:** Multiple devices or sessions simultaneously editing shopping list could lead to conflicts or race conditions without proper handling.
-   **User Adoption of Notifications:** Users may ignore or disable notifications if not implemented thoughtfully, reducing the waste reduction impact.

### Assumptions

-   **Vercel Cron Availability:** Vercel Cron Jobs are assumed to be reliable and sufficient for MVP expiration checking frequency (e.g., once or twice daily).
-   **2-3 Day Threshold:** The 2-3 day expiration warning threshold is assumed to be appropriate for most users and food types. May need adjustment based on user feedback.
-   **In-App Only for MVP:** Email or push notifications for expiration alerts are out of scope for MVP. In-app notifications are sufficient for initial launch.
-   **Single Shopping List per User:** Each user has one shopping list. Multiple lists or list sharing is not required for MVP.
-   **Simple Duplicate Handling:** For MVP, simple duplicate detection by exact item name match is acceptable. Advanced fuzzy matching or unit normalization is deferred.
-   **User Accuracy:** Users are expected to maintain accurate `bestBeforeDate` values in their inventory for expiration alerts to be meaningful.
-   **English Language:** Notification messages and UI text are initially in English. Internationalization is out of scope for MVP.

### Open Questions

-   **Notification Frequency:** How often should the expiration checking cron job run? Once daily (midnight)? Twice daily (morning and evening)? Should this be configurable per user?
-   **Notification Expiration:** Should notifications have an automatic expiration time (e.g., disappear after the food item actually expires, or after 7 days)? How should expired notifications be handled?
-   **Notification Preferences:** Should users have settings to customize notification behavior (e.g., disable expiration alerts, change threshold days)? Deferred to post-MVP?
-   **Duplicate Merging Strategy:** When adding items from recipe and duplicates exist, should quantities be merged/summed, or should duplicates be skipped entirely? What's the best UX?
-   **Shopping List Sorting and Filtering:** What sorting options should be available (by name, category, date added, purchase status)? Should users be able to filter by category?
-   **Shopping List Persistence:** Should shopping list items persist indefinitely, or should there be an auto-cleanup mechanism for very old items?
-   **"Add to Inventory" Flow:** Should there be a quick flow to add purchased shopping list items directly to inventory from the shopping list view? This could streamline the workflow.
-   **Grouping in Shopping List:** Should items be grouped by category (e.g., "Dairy", "Vegetables") in the shopping list view for better organization?
-   **Undo for Shopping List Actions:** Should there be an "Undo" option for accidental deletions or marking items as purchased?
-   **Recipe Link in Shopping List:** When items are added from a recipe, should the shopping list item link back to that recipe for easy reference?
-   **Notification Sound/Badge:** Should there be optional sound or badge notifications (browser/OS level) for new expiration alerts? How to handle browser notification permissions?

## Test Strategy Summary

The testing strategy for Epic 4 will focus on ensuring waste reduction notifications are accurate and timely, shopping list functionality is robust and user-friendly, integrations work correctly, and all defined acceptance criteria and non-functional requirements are met.

### Test Levels & Focus

-   **Unit Tests:**
    -   **Focus:** Expiration detection logic, notification creation logic, shopping list item duplicate detection, date calculations for expiration thresholds.
    -   **Coverage:** Ensures correctness of isolated logic components, including edge cases (items expiring exactly in 2 days, expired items, items with no dates) and error handling.
-   **Integration Tests:**
    -   **Focus:** Next.js API routes (`/api/notifications/*`, `/api/shopping-list/*`, `/api/cron/check-expiration`), interaction between API routes and Prisma/Supabase, authentication/authorization logic, cron job integration.
    -   **Coverage:** Verifies that backend components (API routes, database, scheduled jobs) work together correctly and enforce security policies.
-   **End-to-End (E2E) Tests:**
    -   **Focus:** Simulating complete user flows for receiving notifications, adding items to shopping list (both manual and from recipe), managing shopping list (view, edit, delete, mark purchased, clear), from login to final state in database and UI.
    -   **Coverage:** Confirms the entire system, from frontend to backend to scheduled jobs, functions correctly from a user's perspective, including routing, authentication, data persistence, and UI updates.
-   **Scheduled Job Tests:**
    -   **Focus:** Testing the expiration checking cron job in isolation and integration. Verify correct notification generation logic, performance with various data sizes, error handling, and idempotency.
    -   **Coverage:** Ensures background job reliability and accuracy.
-   **UI/UX Tests:**
    -   **Focus:** Manual and automated testing for notification badge and panel design, shopping list layout and interactions (checkboxes, edit/delete buttons, forms), responsiveness across devices, and adherence to accessibility standards (WCAG 2.1 AA).
    -   **Coverage:** Ensures the user interface meets design specifications, provides a delightful experience, and is usable by people with disabilities.
-   **Performance Tests:**
    -   **Focus:** Measuring API response times for notification and shopping list endpoints, shopping list load time with varying numbers of items, cron job execution time with realistic data volumes.
    -   **Coverage:** Ensures the system meets performance NFRs and remains fast and responsive.

### Test Frameworks (Anticipated)

-   **Unit/Integration:** Jest, React Testing Library.
-   **E2E:** Playwright or Cypress.
-   **Accessibility:** axe-core, Lighthouse, manual testing with screen readers (e.g., NVDA, JAWS).
-   **Performance:** Lighthouse, Chrome DevTools Performance profiling, custom scripts for API response time measurement.
-   **Cron Job Testing:** Custom test scripts to simulate cron execution, potentially using Vercel CLI or direct endpoint invocation.

### Test Coverage Areas

-   **Acceptance Criteria:** All acceptance criteria defined for Stories 4.1, 4.2, and 4.3 must have corresponding test cases.
-   **Critical Paths:**
    -   Successful expiration notification generation by cron job.
    -   Successful display of notifications to user.
    -   Successful manual addition of item to shopping list.
    -   Successful addition of recipe ingredients to shopping list.
    -   Successful viewing of shopping list with all items.
    -   Successful marking item as purchased.
    -   Successful deletion of shopping list item.
    -   Successful clearing of purchased items.
-   **Edge Cases:**
    -   Expiration checking with empty inventory (no notifications).
    -   Expiration checking with items expiring today, tomorrow, in 2 days, in 3 days, in 4 days (boundary testing).
    -   Notification generation for items already having notifications (duplicate prevention).
    -   Adding shopping list item with only name (minimum required data).
    -   Adding shopping list item with all optional fields populated.
    -   Adding duplicate items to shopping list (same name).
    -   Adding items from recipe when some items already exist in shopping list.
    -   Viewing shopping list with zero items (empty state).
    -   Viewing shopping list with 100+ items (performance).
    -   Editing shopping list item with various field changes.
    -   Deleting last item in shopping list.
    -   Clearing purchased items when no items are purchased.
    -   Clearing purchased items when all items are purchased.
    -   Concurrent edits to shopping list from multiple sessions (race condition testing).
    -   Cron job failure scenarios and retry behavior.
    -   Cron job execution with very large datasets (stress testing).
-   **Security Testing:**
    -   Verify all API routes are protected by authentication.
    -   Verify users cannot access other users' shopping lists or notifications.
    -   Verify cron endpoint is protected by secret token.
    -   Test input validation to prevent injection attacks.
-   **Accessibility Testing:**
    -   Verify WCAG 2.1 AA compliance for all notification and shopping list components, forms, and dialogs.
    -   Test keyboard navigation and screen reader compatibility for all interactive elements.
-   **Performance Testing:**
    -   Measure and verify notification fetch time meets the <500ms target.
    -   Measure and verify shopping list load time meets the <1.5s target.
    -   Measure and verify add/update/delete operations meet the <200-300ms targets.
    -   Measure and verify cron job execution time meets the <60s target for expected data volumes.

---

_This Epic Technical Specification provides a comprehensive blueprint for implementing Waste Reduction & Shopping List features, ensuring alignment with the project's architecture, UX design, and quality standards._
