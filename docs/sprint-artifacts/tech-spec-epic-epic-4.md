# Epic Technical Specification: Expiration Alerts and Shopping List Management

Date: søndag 23. november 2025
Author: BIP
Epic ID: epic-4
Status: Draft

---

## Overview

This section outlines the technical specification for 'Expiration Alerts and Shopping List Management', a core epic within the Smart Food & Recipe Platform. The platform is designed to help users reduce food waste and manage their pantry effectively. This epic focuses on providing in-app notifications for food nearing expiration and enabling users to create, view, and manage shopping lists, including adding missing recipe ingredients.

## Objectives and Scope

**In Scope:**
*   Users receive in-app notifications for food items nearing expiration (2–3 days before).
*   Users can add, view, and delete items from a shopping list.
*   Items can be added manually or from missing recipe ingredients.

**Out of Scope (for this epic):**
*   Smart Shopping Suggestions.
*   Automated grocery ordering.

## System Architecture Alignment

This epic leverages Next.js API Routes for backend logic, interacting with the Supabase PostgreSQL database via Prisma for data persistence of shopping lists and managing notification triggers for expiring food items. A `Notification` model will be used for alerts. Frontend (Next.js 14, Tailwind CSS) will display alerts and manage shopping list UI. Logic for identifying expiring items will process `FoodItem` data.

## Detailed Design

### Services and Modules

*   **Service:** Next.js API Routes (`/api/notifications`, `/api/shopping-list`)
    *   **Responsibilities (Notifications):**
        *   Identify `FoodItem`s nearing expiration.
        *   Generate `Notification` records for users.
        *   Serve `Notification`s to the frontend.
    *   **Responsibilities (Shopping List):**
        *   Handle CRUD operations for `ShoppingList` and `ShoppingListItem` data.
        *   Integrate with recipe discovery to add missing ingredients.
    *   **Inputs/Outputs:**
        *   Inputs: `FoodItem` data, `ShoppingListItem` details.
        *   Outputs: `Notification` data, `ShoppingList` and `ShoppingListItem` data.
*   **Module:** `Notification` (Database Model via Prisma)
    *   **Responsibilities:** Store in-app notification data.
*   **Module:** `ShoppingList`, `ShoppingListItem` (Database Models via Prisma)
    *   **Responsibilities:** Store shopping list data for users.

### Data Models and Contracts

```prisma
model Notification {
  id              String   @id @default(cuid())
  userId          String
  message         String
  type            String
  isRead          Boolean  @default(false)
  createdAt       DateTime @default(now())
  foodItemId      String? // Links notification to a specific food item (e.g., for expiration)
}

model ShoppingList {
  id        String         @id @default(cuid())
  userId    String         @unique
  user      User           @relation(fields: [userId], references: [id])
  items     ShoppingListItem[] // A shopping list can have many items
  createdAt DateTime       @default(now())
}

model ShoppingListItem {
  id            String     @id @default(cuid())
  shoppingListId String
  shoppingList  ShoppingList @relation(fields: [shoppingListId], references: [id])
  name          String
  quantity      Float?
  unit          String?
  isCompleted   Boolean    @default(false)
  createdAt     DateTime   @default(now())
}
```

### APIs and Interfaces

*   **API Endpoint:** `/api/notifications`
    *   **`GET /api/notifications`**
        *   **Description:** Retrieve a user's notifications.
        *   **Response:** `[{ id: string, message: string, ... }]` (array of notifications)
    *   **`PUT /api/notifications/:id`**
        *   **Description:** Mark a notification as read.
        *   **Request Body:** `{ isRead: boolean }`
        *   **Response:** `{ id: string, message: string, ... }` (updated notification)
*   **API Endpoint:** `/api/shopping-list`
    *   **`GET /api/shopping-list`**
        *   **Description:** Retrieve the user's shopping list.
        *   **Response:** `{ id: string, items: [{ name: string, quantity: number, ... }] }`
    *   **`POST /api/shopping-list/items`**
        *   **Description:** Add an item to the shopping list.
        *   **Request Body:** `{ name: string, quantity?: number, unit?: string }`
        *   **Response:** `{ id: string, name: string, ... }` (newly created ShoppingListItem)
    *   **`PUT /api/shopping-list/items/:id`**
        *   **Description:** Update an item in the shopping list.
        *   **Request Body:** `{ name?: string, quantity?: number, unit?: string, isCompleted?: boolean }`
        *   **Response:** `{ id: string, name: string, ... }` (updated ShoppingListItem)
    *   **`DELETE /api/shopping-list/items/:id`**
        *   **Description:** Delete an item from the shopping list.
        *   **Response:** `{ message: "Shopping list item deleted successfully" }`

### Workflows and Sequencing

#### Expiration Alerts

1.  **Backend (scheduled task or triggered event) identifies `FoodItem`s nearing expiration.** (Triggered by `FoodItem` `bestBeforeDate`).
2.  **Backend generates `Notification` records for affected users.**
3.  **Frontend sends `GET /api/notifications` request.**
4.  **Backend retrieves `Notification`s from Supabase.**
5.  **Frontend displays in-app notifications for expiring items.** (UX)
6.  **User interacts with notification (e.g., marks as read), frontend sends `PUT /api/notifications/{id}`.**

#### Shopping List Management

1.  **User navigates to shopping list feature.** (UX)
2.  **Frontend sends `GET /api/shopping-list` request.**
3.  **Backend retrieves `ShoppingList` and `ShoppingListItem`s from Supabase.**
4.  **Frontend displays shopping list.** (UX)
5.  **User adds an item manually, frontend sends `POST /api/shopping-list/items`.**
6.  **User adds missing recipe ingredients (from Recipe Discovery Epic), frontend sends `POST /api/shopping-list/items`.**
7.  **User edits/deletes items, frontend sends `PUT /api/shopping-list/items/{id}` or `DELETE /api/shopping-list/items/{id}`.**

## Non-Functional Requirements

### Performance

Expiration alerts must be delivered promptly (within 1 hour of an item entering the expiration window). Shopping list operations (add, view, edit, delete) should complete within 1 second. High Lighthouse scores are targeted.

### Security

User's shopping lists and notification preferences must be secured. Access to `/api/notifications` and `/api/shopping-list` endpoints must be restricted to authenticated users, ensuring privacy and preventing unauthorized access to personal data. Sensitive `FoodItem` data used for alerts must be handled securely.

### Reliability/Availability

This epic leverages Vercel and Supabase for hosting, ensuring high availability (≥99% uptime). Expiration alert generation processes must be reliable, ensuring no user misses a critical alert. Data for shopping lists and notifications will be persistently stored and regularly backed up by Supabase.

### Observability

Logging will track expiration alert triggers, successful notification deliveries, and user interactions with shopping list features. Metrics will include alert delivery rates, shopping list item creation/completion rates, and API response times for these services.

## Dependencies and Integrations

*   **Frontend/Backend Framework:** Next.js 14
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Database:** Supabase (PostgreSQL) - used for `FoodItem` data (for expiration alerts), `Notification` data, and `ShoppingList` data.
*   **ORM:** Prisma
*   **Authentication:** NextAuth.js - secures API endpoints related to user data.
*   **External APIs:** None directly relevant to this epic's core functionality.
*   **Deployment:** Vercel (for Next.js application), Supabase Cloud (for PostgreSQL database)

## Acceptance Criteria (Authoritative)

1.  **Given** I have food items in my inventory, **when** an item is 2-3 days from its expiration date, **then** I receive an in-app notification alerting me of its approaching expiration.
2.  **Given** I am an authenticated user, **when** I view my shopping list, **then** I can see all items I have added.
3.  **Given** I am an authenticated user, **when** I add an item to my shopping list, **then** the item is successfully added and displayed.
4.  **Given** I am an authenticated user and have an item on my shopping list, **when** I delete the item, **then** it is removed from my shopping list.
5.  **Given** I am an authenticated user viewing a recipe, **when** I identify a missing ingredient, **then** I can add that missing ingredient directly to my shopping list.

## Traceability Mapping

| Acceptance Criteria | Spec Section(s)                                    | Component(s)/API(s)                  | Test Idea                                                 |
| :------------------ | :------------------------------------------------- | :----------------------------------- | :-------------------------------------------------------- |
| AC 1                | FR-005.1 (PRD), Detailed Design (Tech Spec)        | `/api/notifications` (GET), `Notification` model, Scheduled Task | Unit/Integration: Test notification generation and delivery for expiring items. |
| AC 2                | FR-006.1 (PRD), Detailed Design (Tech Spec)        | `/api/shopping-list` (GET)            | Unit/Integration: Test `GET /api/shopping-list` returns correct data. |
| AC 3                | FR-006.1 (PRD), Detailed Design (Tech Spec)        | `/api/shopping-list/items` (POST), `ShoppingListItem` model | Unit/Integration: Test `POST /api/shopping-list/items` endpoint. |
| AC 4                | FR-006.1 (PRD), Detailed Design (Tech Spec)        | `/api/shopping-list/items/:id` (DELETE) | Unit/Integration: Test `DELETE /api/shopping-list/items/:id` endpoint. |
| AC 5                | FR-006.2 (PRD), Detailed Design (Tech Spec)        | `/api/shopping-list/items` (POST)     | Unit/Integration: Test adding missing recipe ingredients to shopping list. |

## Risks, Assumptions, Open Questions

*   **Risk:** Users may neglect to input accurate expiration dates, rendering the alert system less effective.
    *   **Mitigation:** Implement clear UI/UX for date input, visual cues for nearing expiration, and potentially integrate with OCR for receipt scanning (future growth feature).
*   **Assumption:** The chosen notification mechanism (in-app) is sufficient for user engagement.
    *   **Verification:** Monitor notification open rates and user feedback. Consider push notifications for future.
*   **Question:** How frequently should the system check for expiring items to trigger alerts?
*   **Question:** What is the maximum number of items a shopping list can reasonably handle before performance degrades?

## Test Strategy Summary

*   **Unit Tests:** Focus on individual functions for API routes (e.g., notification generation logic, shopping list item CRUD).
*   **Integration Tests:** Verify the full flow of expiration alert generation (based on `FoodItem` dates), shopping list management (add, view, delete items, including missing recipe ingredients).
*   **End-to-End (E2E) Tests:** Simulate user interactions in the frontend for managing shopping lists and receiving/dismissing expiration alerts.
*   **Scheduled Task Testing:** Specifically test the backend process that identifies expiring items and creates notifications, ensuring it runs reliably at the expected intervals.
*   **Security Tests:** Verify authenticated access and authorization rules for `Notification` and `ShoppingList` data.
