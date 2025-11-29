# Epic Technical Specification: Inventory Management

Date: 2025-11-29
Author: BIP
Epic ID: 2
Status: Draft

---

## Overview

This document provides the technical specification for Epic 2: Inventory Management. The primary goal of this epic is to deliver the core capability for users to manage their kitchen inventory. This includes adding, editing, and viewing food items, which is central to the app's purpose of reducing food waste. This epic builds upon the foundational services established in Epic 1, including user authentication and database setup.

## Objectives and Scope

**In-Scope:**

*   **FR2.1: Add Food Item:** A user can manually add a food item to their inventory.
*   **FR2.2: View Inventory:** A user can view all items in their inventory.
*   **FR2.3: Edit Food Item:** A user can edit the details of an existing food item.
*   **FR2.4: Delete Food Item:** A user can delete an item from their inventory.
*   Backend API endpoints to support these CRUD operations.
*   Database schema for storing inventory items.
*   Basic UI for inventory management, including a list view and forms for adding/editing items.

**Out-of-Scope:**

*   Barcode scanning or receipt parsing for automatic inventory entry.
*   Smart suggestions based on inventory (this is part of a later epic).
*   Advanced filtering or sorting of the inventory list beyond the default.

## System Architecture Alignment

The implementation of this epic will align with the established architecture:

*   **Data Persistence:** Inventory data will be stored in a new `inventory` table in the Supabase PostgreSQL database, linked to the `users` table.
*   **API Pattern:** RESTful API endpoints will be created as Next.js API Routes (Route Handlers) under `/api/inventory` to handle CRUD operations.
*   **Authentication:** All API endpoints will be protected, requiring a valid user session managed by NextAuth.js and Supabase Auth.
*   **Real-time Features:** Supabase Realtime will be configured on the `inventory` table to enable future real-time updates to the frontend.

## Detailed Design

### Services and Modules

| Service/Module | Responsibilities | Inputs/Outputs | Owner |
|---|---|---|---|
| `InventoryService` (Backend) | - Handles all CRUD operations for inventory items. <br> - Enforces business logic (e.g., data validation, user ownership). | - Input: API requests from the frontend. <br> - Output: JSON responses, database changes. | Backend |
| `InventoryClient` (Frontend) | - Provides methods for interacting with the `/api/inventory` endpoints. <br> - Handles data fetching, caching, and state management. | - Input: User actions from UI components. <br> - Output: API calls, updated UI state. | Frontend |
| `InventoryPage` (UI) | - Displays the user's inventory list. <br> - Provides UI for adding, editing, and deleting items. | - Input: User interactions. <br> - Output: Calls to `InventoryClient`. | Frontend |

### Data Models and Contracts

**`inventory` table schema (Supabase PostgreSQL):**

```sql
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  expiration_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can only see their own inventory" ON inventory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inventory" ON inventory
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory" ON inventory
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory" ON inventory
  FOR DELETE USING (auth.uid() = user_id);
```

### APIs and Interfaces

**API Endpoints (RESTful API under `/api/inventory`):**

*   **`GET /api/inventory`**
    *   **Description:** Get all inventory items for the authenticated user.
    *   **Response (200 OK):** `{"data": [{"id": "...", "name": "...", ...}]}`
*   **`POST /api/inventory`**
    *   **Description:** Add a new item to the inventory.
    *   **Request Body:** `{"name": "...", "quantity": "...", "unit": "...", "expiration_date": "..."}`
    *   **Response (201 Created):** `{"data": {"id": "...", "name": "...", ...}}`
*   **`PUT /api/inventory/{id}`**
    *   **Description:** Update an existing inventory item.
    *   **Request Body:** `{"name": "...", "quantity": "...", "unit": "...", "expiration_date": "..."}`
    *   **Response (200 OK):** `{"data": {"id": "...", "name": "...", ...}}`
*   **`DELETE /api/inventory/{id}`**
    *   **Description:** Delete an inventory item.
    *   **Response (204 No Content):**

### Workflows and Sequencing

**Add Item Workflow:**

1.  User clicks "Add Item" on the `InventoryPage`.
2.  A form/modal appears.
3.  User enters item details and submits.
4.  `InventoryPage` calls `InventoryClient.addItem(newItem)`.
5.  `InventoryClient` sends a `POST` request to `/api/inventory`.
6.  The `InventoryService` validates the data and inserts it into the `inventory` table.
7.  The UI updates to show the new item (optimistically or on success).

**Delete Item Workflow:**

1.  User clicks the "Delete" button on an inventory item.
2.  A confirmation modal appears.
3.  User confirms deletion.
4.  `InventoryPage` calls `InventoryClient.deleteItem(itemId)`.
5.  `InventoryClient` sends a `DELETE` request to `/api/inventory/{id}`.
6.  The `InventoryService` removes the item from the database.
7.  The item is removed from the UI.

## Non-Functional Requirements

### Performance

*   **API Response Time:** All `/api/inventory` endpoints must respond in < 200ms under normal load.
*   **UI Rendering:** The inventory list should render in < 500ms, even with over 100 items.
*   **Database Queries:** All database queries related to inventory must execute in < 50ms.

### Security

*   **Authentication:** All `/api/inventory` endpoints MUST be protected and require a valid JWT token.
*   **Authorization:** Supabase RLS policies MUST be implemented and enforced to ensure users can only access their own inventory data.
*   **Input Validation:** All incoming API request bodies MUST be validated to prevent injection attacks.

### Reliability/Availability

*   **Service Uptime:** The inventory service must meet the overall project uptime goal of >=99%.
*   **Data Integrity:** All inventory data must be stored durably in the Supabase PostgreSQL database. Foreign key constraints must be used to maintain integrity with the `users` table.

### Observability

*   **Logging:** All API requests to `/api/inventory` should be logged with their status code and response time. Any errors during CRUD operations must be logged with detailed error messages.
*   **Monitoring:** Key performance metrics (API latency, error rates) should be monitored in Vercel and Supabase.

## Dependencies and Integrations

*   **Next.js:** Core frontend and backend framework.
*   **React:** For building UI components.
*   **Supabase Client JS:** For interacting with the Supabase database from the backend.
*   **NextAuth.js:** For handling authentication.
*   **Tailwind CSS & shadcn/ui:** For UI styling and components.
*   **Vercel:** For deployment and hosting.
*   **Supabase:** For database, auth, and real-time services.

## Acceptance Criteria (Authoritative)

1.  A logged-in user can add a new food item with a name, quantity, unit, and expiration date.
2.  A logged-in user can view a list of all their inventory items.
3.  The inventory list is sorted by expiration date, with the soonest expiring items first.
4.  A logged-in user can update the details of an existing inventory item.
5.  A logged-in user can delete an inventory item after a confirmation prompt.
6.  An unauthenticated user cannot access any inventory data.
7.  A user cannot view, edit, or delete inventory items belonging to another user.

## Traceability Mapping

| AC # | Spec Section(s) | Component(s)/API(s) | Test Idea |
|---|---|---|---|
| 1 | FR2.1, `POST /api/inventory` | `InventoryPage`, `AddItemForm` | E2E test: Log in, add an item, verify it appears in the list. |
| 2 | FR2.2, `GET /api/inventory` | `InventoryPage`, `InventoryList` | E2E test: Log in, verify inventory items are displayed. |
| 3 | FR2.2 | `InventoryList` | Unit test: Provide a list of items, verify they are sorted correctly. |
| 4 | FR2.3, `PUT /api/inventory/{id}` | `InventoryPage`, `EditItemForm` | E2E test: Log in, edit an item, verify the changes are saved. |
| 5 | FR2.4, `DELETE /api/inventory/{id}` | `InventoryPage`, `DeleteItemButton` | E2E test: Log in, delete an item, confirm, verify it's gone. |
| 6 | Security | All `/api/inventory` endpoints | API test: Attempt to access endpoints without a token, expect 401. |
| 7 | Security, RLS Policies | All `/api/inventory` endpoints | API test: Log in as User A, try to access User B's data, expect 404/empty response. |

## Risks, Assumptions, Open Questions

*   **Risk:** The manual entry of inventory items could be tedious for users, leading to low adoption. Mitigation: The UI for adding items must be heavily optimized for speed and ease of use.
*   **Assumption:** Users will consistently and accurately enter expiration dates. This is crucial for later "smart" features.
*   **Question:** What is the expected range of units a user might enter? Do we need to standardize or provide a pre-defined list? For MVP, we will allow free text.

## Test Strategy Summary

*   **Unit Tests:** UI components (`InventoryList`, `AddItemForm`) will be tested with Jest and React Testing Library to ensure they render correctly and handle user input.
*   **Integration Tests:** API endpoints will be tested to verify CRUD operations work as expected and that RLS policies are enforced.
*   **End-to-End Tests:** A Playwright/Cypress test will simulate the full user flow: logging in, adding an item, editing it, and deleting it.
