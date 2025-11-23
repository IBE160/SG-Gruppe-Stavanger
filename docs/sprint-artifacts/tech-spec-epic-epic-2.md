# Epic Technical Specification: {{epic_title}}

Date: søndag 23. november 2025
Author: BIP
Epic ID: epic-2
Status: Draft

---

## Overview

This section outlines the technical specification for 'Food Inventory Management', a core epic within the Smart Food & Recipe Platform. The platform is designed to help users reduce food waste and discover meal inspiration through intelligent kitchen inventory management. This epic focuses on allowing users to manually add food items with quantities and expiration dates, and to view, edit, and delete items from their pantry or fridge.

## Objectives and Scope

**In Scope:**
*   Users can manually add food items with quantities and expiration dates.
*   Users can view, edit, and delete items from their pantry or fridge.

**Out of Scope (for this epic):**
*   Automatic inventory input (e.g., picture of receipt/food items).
*   Integration with smart kitchen appliances.

## System Architecture Alignment

This epic leverages the Next.js API Routes for backend logic, interacting with the Supabase PostgreSQL database via Prisma for data persistence of food items. User authentication is handled by NextAuth.js. The frontend uses Next.js 14 and Tailwind CSS for a mobile-responsive UI where users interact with a visual 'Open Shelves' pantry.

## Detailed Design

### Services and Modules

*   **Module:** `FoodItem` (Database Model via Prisma)
    *   **Responsibilities:** Stores `FoodItem` data (name, category, bestBeforeDate, quantity, unit, userId).
    *   **Inputs/Outputs:** Receives `FoodItem` creation/update requests; outputs `FoodItem` data.
*   **Service:** Next.js API Routes (`/api/food-items`)
    *   **Responsibilities:** Handles CRUD operations for food items. Implements business logic for adding, viewing, editing, and deleting `FoodItem` records in the database.
    *   **Inputs/Outputs:**
        *   **Input (Add):** `POST /api/food-items` with `FoodItem` details in request body.
        *   **Input (View):** `GET /api/food-items` (all for user) or `GET /api/food-items/{id}` (single).
        *   **Input (Edit):** `PUT /api/food-items/{id}` with updated `FoodItem` details.
        *   **Input (Delete):** `DELETE /api/food-items/{id}`.
        *   **Output:** JSON response with `FoodItem` data or status.

### Data Models and Contracts

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String // Stores hashed passwords for security
  createdAt     DateTime @default(now())
  foodItems     FoodItem[] // A user can have many food items
  preferences   UserPreference? // A user can have one set of preferences
  shoppingList  ShoppingList? // A user can have one shopping list
}

model FoodItem {
  id              String   @id @default(cuid())
  name            String
  category        String
  bestBeforeDate  DateTime
  quantity        Float
  unit            String
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  createdAt       DateTime @default(now())
}
```

### APIs and Interfaces

*   **API Endpoint:** `/api/food-items`
    *   **`POST /api/food-items`**
        *   **Description:** Add a new food item.
        *   **Request Body:** `{ name: string, category: string, bestBeforeDate: string, quantity: number, unit: string }`
        *   **Response:** `{ id: string, name: string, ... }` (newly created FoodItem)
    *   **`GET /api/food-items`**
        *   **Description:** Get all food items for the authenticated user.
        *   **Response:** `[{ id: string, name: string, ... }]` (array of FoodItems)
    *   **`GET /api/food-items/:id`**
        *   **Description:** Get a single food item by ID.
        *   **Response:** `{ id: string, name: string, ... }` (single FoodItem)
    *   **`PUT /api/food-items/:id`**
        *   **Description:** Update an existing food item.
        *   **Request Body:** `{ name?: string, category?: string, ... }` (partial FoodItem update)
        *   **Response:** `{ id: string, name: string, ... }` (updated FoodItem)
    *   **`DELETE /api/food-items/:id`**
        *   **Description:** Delete a food item by ID.
        *   **Response:** `{ message: "Food item deleted successfully" }`

### Workflows and Sequencing

#### User Comes Home from Grocery Shopping: Adding New Food Items

1.  **User opens "Unloading Groceries" mode (via "grocery bag" icon).** (UX)
2.  **User selects/searches for a food item.** (UX: drag-and-drop, search)
3.  **User inputs quantity, unit, and expiration date.** (UX: tactile input, date picker)
4.  **Frontend sends `POST /api/food-items` request.**
5.  **Backend (API Route) validates input and stores `FoodItem` in Supabase via Prisma.**
6.  **Backend returns success/failure.**
7.  **Frontend updates "Open Shelves" view with new item.** (UX)

#### User Checks Inventory

1.  **User navigates to "Pantry View - The Open Shelves".** (UX)
2.  **Frontend sends `GET /api/food-items` request to retrieve user's inventory.**
3.  **Backend fetches `FoodItem`s from Supabase via Prisma.**
4.  **Backend returns list of `FoodItem`s.**
5.  **Frontend displays current inventory visually on "Open Shelves".** (UX)

## Non-Functional Requirements

### Performance

Inventory management operations (add, view, edit, delete food items) must complete within 1 second under normal load. This contributes to the overall goal of the app feeling fast and responsive.

### Security

User's inventory data (FoodItem records) must be secured using NextAuth.js for authentication and authorization. Access to `/api/food-items` endpoints must be restricted to authenticated users, ensuring only a user can manage their own inventory. Passwords will be securely hashed.

### Reliability/Availability

The Food Inventory Management features will leverage Supabase PostgreSQL for data persistence and Next.js API Routes hosted on Vercel, ensuring high availability (≥99% uptime) and automatic scalability. Data will be backed up regularly by Supabase. Prisma's migration capabilities will ensure database schema changes are managed reliably.

### Observability

Basic logging for inventory management operations will be available via Vercel and Supabase. For future enhancements, a comprehensive logging and monitoring strategy (e.g., Sentry, Datadog) should be considered to track `FoodItem` CRUD operations and identify potential issues.

## Dependencies and Integrations

*   **Frontend/Backend Framework:** Next.js 14
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Database:** Supabase (PostgreSQL)
*   **ORM:** Prisma
*   **Authentication:** NextAuth.js
*   **External APIs (for this epic):** None directly (Spoonacular API used by Recipe Discovery Epic)
*   **Deployment:** Vercel (for Next.js application), Supabase Cloud (for PostgreSQL database)

## Acceptance Criteria (Authoritative)

1.  **Given** I am an authenticated user, **when** I add a new food item, **then** the item is successfully recorded in my inventory with the specified name, quantity, unit, category, and expiration date.
2.  **Given** I am an authenticated user, **when** I view my inventory, **then** I can see a list of all my added food items, including their details.
3.  **Given** I am an authenticated user and have a food item in my inventory, **when** I edit its details (e.g., quantity, expiration date), **then** the changes are saved and reflected in my inventory.
4.  **Given** I am an authenticated user and have a food item in my inventory, **when** I delete the item, **then** it is removed from my inventory.

## Traceability Mapping

| Acceptance Criteria | Spec Section(s)                                    | Component(s)/API(s)                  | Test Idea                                                 |
| :------------------ | :------------------------------------------------- | :----------------------------------- | :-------------------------------------------------------- |
| AC 1                | FR-002.1 (PRD), Detailed Design (Tech Spec)        | `/api/food-items` (POST), `FoodItem` model | Unit/Integration: Test `POST /api/food-items` endpoint with valid/invalid data. |
| AC 2                | FR-002.2 (PRD), Detailed Design (Tech Spec)        | `/api/food-items` (GET)            | Unit/Integration: Test `GET /api/food-items` endpoint returns correct data. |
| AC 3                | FR-002.2 (PRD), Detailed Design (Tech Spec)        | `/api/food-items/:id` (PUT), `FoodItem` model | Unit/Integration: Test `PUT /api/food-items/:id` with valid/invalid updates. |
| AC 4                | FR-002.2 (PRD), Detailed Design (Tech Spec)        | `/api/food-items/:id` (DELETE)     | Unit/Integration: Test `DELETE /api/food-items/:id` endpoint. |

## Risks, Assumptions, Open Questions

*   **Risk:** Inconsistent ingredient naming/units from user input may lead to poor recipe matching.
    *   **Mitigation:** Implement input validation with a standardized list of ingredients/units (if possible) or leverage fuzzy matching.
*   **Assumption:** Prisma ORM handles database migrations and schema changes reliably.
    *   **Verification:** Establish clear CI/CD pipeline for database migrations.
*   **Question:** How will "category" for FoodItem be defined and managed? Is it a free-text field or a predefined list?
*   **Question:** How will "bestBeforeDate" be enforced or validated in the UI to prevent invalid dates?

## Test Strategy Summary

*   **Unit Tests:** Focus on individual functions for API routes (e.g., validation logic, Prisma calls).
*   **Integration Tests:** Verify the full CRUD flow for `FoodItem`s through API endpoints, interacting with the Supabase database.
*   **End-to-End (E2E) Tests:** Simulate user interactions in the frontend for adding, viewing, editing, and deleting food items, ensuring the UI and backend integrate correctly. (e.g., using Playwright or Cypress).
*   **Performance Tests:** Measure response times for inventory operations under various loads.
*   **Security Tests:** Verify authenticated access and authorization rules for `FoodItem` data.
