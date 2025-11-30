# Epic Technical Specification: Core Inventory Management

Date: søndag 30. november 2025
Author: BIP
Epic ID: epic-2
Status: Draft

---

## Overview

Enable users to effectively manage their kitchen inventory by adding, viewing, editing, and deleting food items through an intuitive, tactile, and visually delightful interface.

## Objectives and Scope

**Objectives:**
- Enable users to add food items to their kitchen inventory with relevant details.
- Provide an engaging, visual "Open Shelves" view of the user's inventory.
- Allow users to edit and update existing food items.
- Enable users to remove food items from their inventory.
- Implement the tactile, "Farmhouse Kitchen" aesthetic for inventory management.

**In Scope:**
- FR-002.1: Users can manually add food items with quantities and expiration dates.
- FR-002.2: Users can view, edit, and delete items from their pantry or fridge.
- Story 2.1: Add Food Item to Inventory.
- Story 2.2: View & Browse Inventory.
- Story 2.3: Edit Food Item in Inventory.
- Story 2.4: Delete Food Item from Inventory.

**Out of Scope (for this epic):**
- Barcode scanning for automatic item addition (future enhancement).
- Automated inventory updates from recipe cooking (covered in Epic 3).
- Advanced filtering and search capabilities beyond basic sorting.
- Bulk import/export of inventory data.
- Integration with smart home devices for automatic inventory tracking.

## System Architecture Alignment

This epic aligns with the established project architecture by leveraging the following core components and technologies:

-   **Frontend:** Next.js 14 (App Router, Server Components), Tailwind CSS, shadcn/ui.
-   **Backend:** Next.js API Routes for CRUD operations on food items.
-   **Database:** Supabase (PostgreSQL) managed via Prisma ORM.
-   **Authentication:** NextAuth.js for securing API routes and user context.
-   **Hosting & CI/CD:** Vercel for deployment and continuous integration.

For detailed architectural context, refer to `architecture.md` sections 3.1, 3.2, 3.3, 4 (Data Model - FoodItem), 5 (Frontend Architecture), 6 (Backend Architecture).

## Detailed Design

### Services and Modules

-   **Frontend Client Components:**
    -   **`PantryShelf`:** The core component for the "Open Shelves" view, handling the layout and display of food items. Implements drag-and-drop functionality for tactile interaction.
    -   **`IngredientIcon`:** Visual, interactive representation of a food item with states for normal, expiring soon, and selected.
    -   **`AddFoodItemForm`:** Modal or drawer component for adding new food items, using shadcn/ui form elements.
    -   **`EditFoodItemForm`:** Modal or drawer component for editing existing food items.
    -   **`DeleteConfirmationDialog`:** Confirmation dialog for food item deletion, using shadcn/ui Dialog component.
    -   **`KitchenObjectNav`:** Navigation elements appearing as kitchen objects (e.g., grocery bag icon for adding items).
    -   Utilizes `shadcn/ui` for standardized UI primitives (Button, Dialog, Input, Select, etc.).

-   **Frontend Server Components:**
    -   **`PantryView`:** Main server component that fetches initial food item data and renders the pantry interface.

-   **Next.js API Routes (Backend Services):**
    -   **`/api/inventory/add` (POST):** Endpoint for adding new food items to the user's inventory.
    -   **`/api/inventory` (GET):** Endpoint for fetching all food items for the authenticated user, with optional sorting/filtering.
    -   **`/api/inventory/[id]` (GET):** Endpoint for fetching a single food item by ID.
    -   **`/api/inventory/[id]` (PUT):** Endpoint for updating an existing food item.
    -   **`/api/inventory/[id]` (DELETE):** Endpoint for deleting a food item.

-   **Database Interaction Layer:**
    -   **Prisma ORM:** Provides a type-safe API for interacting with the Supabase PostgreSQL database. Manages queries and mutations for the `FoodItem` model.

-   **Authentication & Authorization:**
    -   **NextAuth.js:** Ensures all inventory API routes are protected and only accessible by authenticated users. User context is extracted from session to ensure users can only access their own inventory.

### Data Models and Contracts

-   **`FoodItem` Model (Prisma Schema / Supabase Table):**
    -   `id`: String (Primary Key, cuid)
    -   `name`: String (Required - name of the food item)
    -   `category`: String (Required - e.g., "Dairy", "Vegetables", "Meat", "Grains")
    -   `bestBeforeDate`: DateTime (Required - expiration/best-before date)
    -   `quantity`: Float (Required - amount of the item)
    -   `unit`: String (Required - e.g., "kg", "liters", "pieces", "grams")
    -   `userId`: String (Foreign Key to `User.id`)
    -   `user`: Relation to `User` model
    -   `createdAt`: DateTime (Defaults to `now()`)

### APIs and Interfaces

-   **`POST /api/inventory/add`**
    -   **Request Body:** `application/json`
        ```json
        {
          "name": "string",
          "category": "string",
          "bestBeforeDate": "string (ISO 8601 DateTime)",
          "quantity": "number",
          "unit": "string"
        }
        ```
    -   **Response (200 OK):**
        ```json
        {
          "message": "Food item added successfully",
          "foodItem": {
            "id": "string (cuid)",
            "name": "string",
            "category": "string",
            "bestBeforeDate": "string (ISO 8601 DateTime)",
            "quantity": "number",
            "unit": "string",
            "userId": "string (cuid)",
            "createdAt": "string (ISO 8601 DateTime)"
          }
        }
        ```
    -   **Response (400 Bad Request):**
        ```json
        {
          "error": "string" // e.g., "Invalid input: name is required", "Invalid date format"
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```

-   **`GET /api/inventory`**
    -   **Query Parameters:**
        -   `sortBy` (optional): "name" | "category" | "bestBeforeDate" | "createdAt" (default: "createdAt")
        -   `sortOrder` (optional): "asc" | "desc" (default: "desc")
    -   **Response (200 OK):**
        ```json
        {
          "foodItems": [
            {
              "id": "string (cuid)",
              "name": "string",
              "category": "string",
              "bestBeforeDate": "string (ISO 8601 DateTime)",
              "quantity": "number",
              "unit": "string",
              "userId": "string (cuid)",
              "createdAt": "string (ISO 8601 DateTime)"
            }
          ]
        }
        ```
    -   **Response (401 Unauthorized):**
        ```json
        {
          "error": "Unauthorized"
        }
        ```

-   **`GET /api/inventory/[id]`**
    -   **Response (200 OK):**
        ```json
        {
          "foodItem": {
            "id": "string (cuid)",
            "name": "string",
            "category": "string",
            "bestBeforeDate": "string (ISO 8601 DateTime)",
            "quantity": "number",
            "unit": "string",
            "userId": "string (cuid)",
            "createdAt": "string (ISO 8601 DateTime)"
          }
        }
        ```
    -   **Response (404 Not Found):**
        ```json
        {
          "error": "Food item not found"
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
          "error": "Access denied" // User trying to access another user's food item
        }
        ```

-   **`PUT /api/inventory/[id]`**
    -   **Request Body:** `application/json`
        ```json
        {
          "name": "string (optional)",
          "category": "string (optional)",
          "bestBeforeDate": "string (ISO 8601 DateTime, optional)",
          "quantity": "number (optional)",
          "unit": "string (optional)"
        }
        ```
    -   **Response (200 OK):**
        ```json
        {
          "message": "Food item updated successfully",
          "foodItem": {
            "id": "string (cuid)",
            "name": "string",
            "category": "string",
            "bestBeforeDate": "string (ISO 8601 DateTime)",
            "quantity": "number",
            "unit": "string",
            "userId": "string (cuid)",
            "createdAt": "string (ISO 8601 DateTime)"
          }
        }
        ```
    -   **Response (400 Bad Request):**
        ```json
        {
          "error": "string" // e.g., "Invalid input", "No fields to update"
        }
        ```
    -   **Response (404 Not Found):**
        ```json
        {
          "error": "Food item not found"
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

-   **`DELETE /api/inventory/[id]`**
    -   **Response (200 OK):**
        ```json
        {
          "message": "Food item deleted successfully",
          "foodItemId": "string (cuid)"
        }
        ```
    -   **Response (404 Not Found):**
        ```json
        {
          "error": "Food item not found"
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

### Workflows and Sequencing

#### 1. Add Food Item Workflow

1.  **User Action:** User is on the Pantry View and clicks the "grocery bag" icon or a "Add Item" button.
2.  **Frontend:** `AddFoodItemForm` component (Next.js client component in a Dialog/Drawer) renders.
3.  **User Action:** Inputs food item details: `name`, `category`, `bestBeforeDate`, `quantity`, and `unit`.
4.  **Frontend Validation:** Client-side validation ensures all required fields are filled and formats are correct.
5.  **Frontend:** `AddFoodItemForm` sends `POST` request to `/api/inventory/add` with food item data.
6.  **Backend (Next.js API Route):**
    a.  Authenticates the request using NextAuth.js to extract `userId`.
    b.  Validates request body (server-side validation).
    c.  Uses Prisma to create a new `FoodItem` record in Supabase, associating it with the authenticated user.
    d.  If successful, returns the created `FoodItem` object.
    e.  If validation fails or database error occurs, returns appropriate error response.
7.  **Backend Response:** Returns success message with the new `FoodItem` data or an error.
8.  **Frontend:**
    a.  On success: Displays success feedback (e.g., sparkle animation on new item), closes the form, and updates the Pantry View to display the new item.
    b.  On error: Displays error message to the user with guidance for correction.

#### 2. View & Browse Inventory Workflow

1.  **User Action:** User navigates to the Pantry View (e.g., `/pantry` route).
2.  **Frontend (Server Component):** `PantryView` server component is rendered.
3.  **Frontend:** Server component makes an authenticated request (or uses server-side session) to fetch data.
4.  **Backend (Next.js API Route - Internal or Direct Prisma Call):**
    a.  Authenticates the request/session to extract `userId`.
    b.  Uses Prisma to query all `FoodItem` records where `userId` matches the authenticated user.
    c.  Applies sorting based on query parameters (default: by `createdAt` descending).
    d.  Returns the list of `FoodItem` objects.
5.  **Frontend (Server Component):** Receives `foodItems` data and passes it to client components for rendering.
6.  **Frontend (Client Components):**
    a.  `PantryShelf` component receives the `foodItems` array.
    b.  For each food item, an `IngredientIcon` component is rendered with appropriate visual state (normal, expiring soon based on `bestBeforeDate`).
    c.  User sees the visual "Open Shelves" pantry populated with their food items.
7.  **User Interaction (Optional):** User can interact with sorting/filtering controls (client-side state or re-fetch with new parameters).

#### 3. Edit Food Item Workflow

1.  **User Action:** User clicks/selects a food item in the Pantry View to edit it.
2.  **Frontend:** `EditFoodItemForm` component (Next.js client component in a Dialog/Drawer) renders, pre-populated with the selected food item's current data.
3.  **User Action:** Modifies one or more fields: `name`, `category`, `bestBeforeDate`, `quantity`, or `unit`.
4.  **Frontend Validation:** Client-side validation ensures modified fields are valid.
5.  **Frontend:** `EditFoodItemForm` sends `PUT` request to `/api/inventory/[id]` with updated data (only changed fields or all fields).
6.  **Backend (Next.js API Route):**
    a.  Authenticates the request using NextAuth.js to extract `userId`.
    b.  Validates request body.
    c.  Uses Prisma to find the `FoodItem` by `id`.
    d.  Verifies that the `FoodItem.userId` matches the authenticated user (authorization check).
    e.  If authorized, updates the `FoodItem` record with new data using Prisma.
    f.  If successful, returns the updated `FoodItem` object.
    g.  If not found, not authorized, or validation fails, returns appropriate error response.
7.  **Backend Response:** Returns success message with updated `FoodItem` data or an error.
8.  **Frontend:**
    a.  On success: Displays success feedback, closes the form, and updates the Pantry View to reflect the changes.
    b.  On error: Displays error message to the user.

#### 4. Delete Food Item Workflow

1.  **User Action:** User selects a food item for deletion (e.g., drag to "waste bin" icon or click a delete button on the item).
2.  **Frontend:** `DeleteConfirmationDialog` component (using shadcn/ui Dialog) is displayed, asking for confirmation.
3.  **User Action:** Confirms the deletion.
4.  **Frontend:** Client component sends `DELETE` request to `/api/inventory/[id]`.
5.  **Backend (Next.js API Route):**
    a.  Authenticates the request using NextAuth.js to extract `userId`.
    b.  Uses Prisma to find the `FoodItem` by `id`.
    c.  Verifies that the `FoodItem.userId` matches the authenticated user (authorization check).
    d.  If authorized, deletes the `FoodItem` record using Prisma.
    e.  If successful, returns a success message with the deleted item's ID.
    f.  If not found or not authorized, returns appropriate error response.
6.  **Backend Response:** Returns success message or an error.
7.  **Frontend:**
    a.  On success: Displays success feedback (e.g., item fades out), and updates the Pantry View to remove the deleted item.
    b.  On error: Displays error message to the user.

## Non-Functional Requirements

### Performance

-   **Response Time:** All inventory API endpoints (add, get, update, delete) should respond within 300ms under typical load conditions (e.g., 90th percentile).
-   **Initial Page Load:** The Pantry View should render and display food items within 2 seconds on modern browsers and mobile devices, including initial data fetch.
-   **Responsiveness:** UI interactions (e.g., opening add/edit forms, drag-and-drop feedback) should feel instantaneous with response times under 100ms.
-   **Scalability:** The system should support users with up to 500 food items in their inventory without significant performance degradation in the UI or API response times.

### Security

-   **Authentication:** All inventory API routes must be protected by NextAuth.js, requiring a valid user session.
-   **Authorization:** Users must only be able to access, modify, or delete their own food items. Backend API routes must verify `userId` from the session matches the `userId` of the requested `FoodItem`.
-   **Input Validation:** Both client-side and server-side validation must be implemented to prevent injection attacks and ensure data integrity. Validate data types, required fields, and reasonable value ranges (e.g., positive quantities, valid date formats).
-   **Data Protection:** Data in transit must be encrypted using HTTPS/TLS. Sensitive data at rest in the database should be adequately protected by Supabase security measures.

### Reliability/Availability

-   **Uptime:** Inventory management services should maintain a minimum uptime of 99.9% (excluding planned maintenance).
-   **Error Handling:** The system should gracefully handle errors (e.g., database connection failures, invalid input, network issues) without data loss and provide informative feedback to users without exposing sensitive system details.
-   **Data Integrity:** Food item data must be consistently and accurately stored and retrieved from the database. Updates and deletions must be transactional to prevent data corruption.
-   **Optimistic UI Updates:** Implement optimistic UI updates where appropriate (e.g., immediately showing a new item after add, pending server confirmation) to enhance perceived performance, with rollback mechanisms in case of server-side failures.

### Observability

-   **Logging:** Detailed logs should be generated for critical inventory operations (e.g., item added, item deleted, failed API requests), including user context and timestamps. Logs should be accessible for monitoring and debugging.
-   **Metrics:** Key performance indicators (KPIs) such as average API response times, number of items added/edited/deleted per user, error rates for inventory operations, and user engagement with the Pantry View should be collected and monitored.
-   **Alerting:** Automated alerts should be configured for critical issues, such as high error rates on inventory endpoints, database connection problems, or service unavailability.

## Dependencies and Integrations

This epic relies on the following key technologies and integrations:

-   **Framework:** Next.js 14 (App Router, Server Components)
-   **Styling:** Tailwind CSS
-   **UI Components:** shadcn/ui (Dialog, Button, Input, Select, etc.)
-   **Database:** Supabase (PostgreSQL)
-   **ORM:** Prisma
-   **Authentication:** NextAuth.js
-   **Deployment/CI/CD:** Vercel
-   **Source Control:** Git (implied by Vercel integration)

**External Dependencies:**
-   **Completed Epic 1:** User authentication and session management must be functional for users to access inventory features.

## Acceptance Criteria (Authoritative)

### Story 2.1: Add Food Item to Inventory
*   **Given** I am logged in and on the "My Pantry" view,
*   **When** I initiate the "Add Food Item" flow (e.g., by clicking a grocery bag icon or "Add Item" button),
*   **And** I provide the food item's name, quantity, unit, category, and a best-before date,
*   **And** I submit the form,
*   **Then** the food item is successfully added to my inventory and displayed in the "Open Shelves" view.
*   **And** the "Add Food Item" interaction is smooth and delightful, adhering to UX principles (UX Ref: `ux-design-specification.md` section 2.2, 5.1).
*   **And** input validation is performed for all fields (client-side and server-side).
*   **And** the UI reflects the "Farmhouse Kitchen" aesthetic using shadcn/ui components styled appropriately.
*   **And** the form is responsive and accessible (WCAG 2.1 AA).

### Story 2.2: View & Browse Inventory
*   **Given** I am logged in,
*   **When** I navigate to the "My Pantry" view,
*   **Then** I see a visual representation of my food items in the "Open Shelves" layout.
*   **And** each food item displays its name, quantity, and approximate freshness/expiration status (e.g., color-coded or visual indicator).
*   **And** the view is responsive, adapting to different screen sizes (desktop, tablet, mobile).
*   **And** the inventory can be sorted by at least one criterion (e.g., by expiration date or creation date) (MVP: basic sorting).
*   **And** the Pantry View loads within 2 seconds on a typical connection.
*   **And** the UI adheres to the "Farmhouse Kitchen" aesthetic and accessibility standards.

### Story 2.3: Edit Food Item in Inventory
*   **Given** I am viewing a food item in my "My Pantry" inventory,
*   **When** I select an item for editing (e.g., click on it or click an "Edit" icon),
*   **And** I modify its name, quantity, unit, category, or best-before date,
*   **And** I save the changes,
*   **Then** the food item's details are updated in my inventory and the UI reflects these changes immediately.
*   **And** input validation is performed for modified fields.
*   **And** the edit interaction is smooth and uses the "Farmhouse Kitchen" themed UI components.
*   **And** the form is responsive and accessible.

### Story 2.4: Delete Food Item from Inventory
*   **Given** I am viewing a food item in my "My Pantry" inventory,
*   **When** I select an item for deletion (e.g., drag to a "waste bin" icon, or click a "Delete" button) and confirm the action,
*   **Then** the food item is removed from my inventory and no longer displayed in the Pantry View.
*   **And** a confirmation prompt is shown before permanent deletion to prevent accidental deletions.
*   **And** the deletion interaction provides feedback (e.g., item fades out) and adheres to UX principles.
*   **And** the confirmation dialog uses the "Farmhouse Kitchen" aesthetic.

## Traceability Mapping

| Acceptance Criteria (AC) | Spec Section(s)         | Component(s)/API(s)                                   | Test Idea                                                 |
| :----------------------- | :---------------------- | :---------------------------------------------------- | :-------------------------------------------------------- |
| **Story 2.1: Add Food Item to Inventory** |
| User can initiate "Add Food Item" flow | Detailed Design (Workflows - Add) | `KitchenObjectNav`, `AddFoodItemForm` component | UI test: Verify grocery bag icon/button is clickable and opens form. |
| User provides item details and submits | Detailed Design (Workflows - Add), (APIs) | `AddFoodItemForm`, `POST /api/inventory/add`, Prisma | Functional test: Add item with all valid fields, verify in DB. |
| Item displayed in "Open Shelves" view | Detailed Design (Workflows - Add) | `PantryShelf`, `IngredientIcon` components | UI test: After add, verify new item appears in Pantry View. |
| Interaction smooth and delightful | N/A (UX Ref) | Frontend components, animations | Manual UX review, interaction testing. |
| Input validation performed | Detailed Design (Workflows - Add), (APIs) | `AddFoodItemForm` (client), API route (server) | Functional test: Submit with invalid/missing data, verify error messages. |
| UI reflects "Farmhouse Kitchen" aesthetic | N/A (UX Ref) | Frontend components, CSS | Manual UI review, visual regression tests. |
| Form responsive and accessible | N/A (UX Ref) | Frontend components | Browser developer tools, accessibility audit. |
| **Story 2.2: View & Browse Inventory** |
| User navigates to "My Pantry" view | Detailed Design (Workflows - View) | Routing, `PantryView` server component | Navigation test: Click/navigate to Pantry, verify page loads. |
| Visual representation in "Open Shelves" | Detailed Design (Workflows - View) | `PantryShelf`, `IngredientIcon` components | UI test: Verify items are displayed visually as expected. |
| Item displays name, quantity, freshness | Detailed Design (Workflows - View) | `IngredientIcon` component | UI test: Inspect rendered item, verify all details shown. |
| View is responsive | N/A (UX Ref) | Frontend CSS, responsive design | Browser developer tools: Test on various viewport sizes. |
| Inventory can be sorted | Detailed Design (Workflows - View), (APIs) | Client sorting controls, `GET /api/inventory` with params | Functional test: Apply sorting, verify order changes. |
| Pantry View loads within 2 seconds | Non-Functional Requirements (Performance) | `PantryView`, API routes, database | Performance test: Measure page load time. |
| UI adheres to aesthetic/accessibility | N/A (UX Ref) | Frontend components | Manual review, automated accessibility tools. |
| **Story 2.3: Edit Food Item in Inventory** |
| User selects item for editing | Detailed Design (Workflows - Edit) | `IngredientIcon` interaction, `EditFoodItemForm` | UI test: Click item, verify edit form opens with pre-filled data. |
| User modifies details and saves | Detailed Design (Workflows - Edit), (APIs) | `EditFoodItemForm`, `PUT /api/inventory/[id]`, Prisma | Functional test: Edit item, save, verify changes in DB and UI. |
| UI reflects changes immediately | Detailed Design (Workflows - Edit) | Frontend state management, Pantry View re-render | UI test: After save, verify Pantry View updates without page refresh. |
| Input validation performed | Detailed Design (Workflows - Edit), (APIs) | `EditFoodItemForm` (client), API route (server) | Functional test: Submit invalid edits, verify error handling. |
| Edit interaction smooth and themed | N/A (UX Ref) | Frontend components | Manual UX review. |
| Form responsive and accessible | N/A (UX Ref) | Frontend components | Browser developer tools, accessibility audit. |
| **Story 2.4: Delete Food Item from Inventory** |
| User selects item for deletion and confirms | Detailed Design (Workflows - Delete) | `IngredientIcon` interaction, `DeleteConfirmationDialog`, `DELETE /api/inventory/[id]` | Functional test: Trigger delete, confirm, verify item removed from DB. |
| Item removed from inventory and UI | Detailed Design (Workflows - Delete) | Pantry View re-render | UI test: After delete, verify item no longer shown in Pantry View. |
| Confirmation prompt shown | Detailed Design (Workflows - Delete) | `DeleteConfirmationDialog` component | UI test: Trigger delete, verify confirmation dialog appears. |
| Deletion provides feedback | N/A (UX Ref) | Frontend animations, feedback | Manual UX review: Verify fade-out or similar feedback. |
| Confirmation dialog themed | N/A (UX Ref) | `DeleteConfirmationDialog` styling | Manual UI review. |

## Risks, Assumptions, Open Questions

### Risks

-   **UX Complexity:** Implementing the tactile "Open Shelves" drag-and-drop interface may present technical challenges and require significant frontend development effort, potentially impacting timeline.
-   **Performance with Large Inventories:** If users accumulate hundreds of food items, rendering performance in the Pantry View could degrade without proper optimization (e.g., virtualization, pagination).
-   **Drag-and-Drop Accessibility:** Ensuring the drag-and-drop interaction is fully accessible via keyboard navigation and screen readers may be complex and require careful implementation.
-   **Mobile Responsiveness:** Adapting the immersive "Farmhouse Kitchen" aesthetic to smaller mobile screens while maintaining usability and performance may be challenging.
-   **Data Validation Edge Cases:** Handling edge cases in food item data (e.g., unusual units, very long names, dates in the past for best-before) may require iterative refinement.

### Assumptions

-   **Documentation Completeness:** `architecture.md` and `ux-design-specification.md` are considered sufficiently detailed to inform technical implementation decisions for this epic.
-   **Supabase Stability:** The Supabase platform (PostgreSQL database) is assumed to be stable and available during development and production.
-   **Developer Proficiency:** The development team possesses adequate proficiency in Next.js 14, TypeScript, React, Prisma, Tailwind CSS, and shadcn/ui.
-   **Epic 1 Completion:** Story 1.3 (User Login & Session Management) is assumed to be fully functional and tested before starting Epic 2 stories.
-   **Category List:** A predefined, static list of food categories is acceptable for MVP. A dynamic or user-customizable category system is not required at this stage.
-   **Unit Standardization:** For MVP, free-text unit entry is acceptable. Advanced unit conversion or standardization is not required.

### Open Questions

-   **Drag-and-Drop Implementation Details:** Should drag-and-drop be implemented using HTML5 Drag and Drop API, or a third-party library (e.g., dnd-kit, react-beautiful-dnd)? What are the accessibility and cross-browser compatibility considerations?
-   **Food Item Categories:** Should there be a fixed, predefined list of categories presented in a dropdown, or should users be able to enter custom categories? If predefined, what should the initial category list include?
-   **Unit Input:** Should units be free-text input, or should there be a predefined list of common units (e.g., "kg", "liters", "pieces") presented in a dropdown or autocomplete?
-   **Best-Before Date vs. Expiration Date:** Should the date field be labeled "Best Before" or "Expiration Date"? Is there a functional difference in how the system treats these?
-   **Visual Freshness Indicator:** What is the exact visual indicator for "expiring soon" items? (e.g., color change, icon, badge) At what threshold (e.g., 3 days before expiration) should this indicator appear?
-   **Sorting Options:** Which sorting options should be available in MVP? (e.g., by name, category, expiration date, date added) Should filtering be included in MVP, or deferred to a later phase?
-   **Empty State Detail:** What specific illustration and text should be used for the empty pantry state?
-   **Optimistic UI Rollback:** If an optimistic UI update fails (e.g., server error after adding an item), what is the desired user experience for rollback and error notification?

## Test Strategy Summary

The testing strategy for Epic 2 will focus on ensuring the inventory management features are robust, performant, user-friendly, and meet all defined acceptance criteria and non-functional requirements.

### Test Levels & Focus

-   **Unit Tests:**
    -   **Focus:** Individual utility functions, data validation logic, Prisma data access functions for `FoodItem` CRUD operations, client-side form validation logic.
    -   **Coverage:** Ensures correctness of isolated logic components, including edge cases and error handling.
-   **Integration Tests:**
    -   **Focus:** Next.js API routes (`/api/inventory/*`), interaction between API routes and Prisma/Supabase, authentication/authorization logic in API routes.
    -   **Coverage:** Verifies that backend components (API routes, database) work together correctly and enforce security policies.
-   **End-to-End (E2E) Tests:**
    -   **Focus:** Simulating complete user flows for adding, viewing, editing, and deleting food items through the UI, from login to final state in database.
    -   **Coverage:** Confirms the entire system, from frontend to backend, functions correctly from a user's perspective, including routing, authentication, and data persistence.
-   **UI/UX Tests:**
    -   **Focus:** Manual and automated testing for visual aesthetic ("Farmhouse Kitchen" theme), responsiveness across devices (desktop, tablet, mobile), tactile interactions (drag-and-drop), and adherence to accessibility standards (WCAG 2.1 AA).
    -   **Coverage:** Ensures the user interface meets design specifications, provides a delightful experience, and is usable by people with disabilities.
-   **Performance Tests:**
    -   **Focus:** Measuring API response times for inventory endpoints, Pantry View initial load time, UI responsiveness with varying numbers of food items.
    -   **Coverage:** Ensures the system meets performance NFRs and remains fast and responsive even with larger inventories.

### Test Frameworks (Anticipated)

-   **Unit/Integration:** Jest, React Testing Library.
-   **E2E:** Playwright or Cypress.
-   **Accessibility:** axe-core, Lighthouse, manual testing with screen readers (e.g., NVDA, JAWS).
-   **Performance:** Lighthouse, Chrome DevTools Performance profiling, custom load testing scripts if needed.

### Test Coverage Areas

-   **Acceptance Criteria:** All acceptance criteria defined for Stories 2.1, 2.2, 2.3, and 2.4 must have corresponding test cases.
-   **Critical Paths:**
    -   Successful addition of a food item with valid data.
    -   Successful retrieval and display of all user's food items in Pantry View.
    -   Successful editing of an existing food item.
    -   Successful deletion of a food item with confirmation.
-   **Edge Cases:**
    -   Adding a food item with minimum/maximum valid values for quantity and date.
    -   Attempting to add a food item with missing required fields.
    -   Attempting to add/edit/delete a food item while unauthenticated (should fail).
    -   Attempting to edit/delete a food item belonging to another user (should fail with 403 Forbidden).
    -   Viewing an empty inventory (empty state display).
    -   Sorting inventory by different criteria.
    -   Displaying a large number of food items (e.g., 100, 500) in Pantry View to test performance.
    -   Interaction with drag-and-drop on desktop and touch devices.
    -   Keyboard navigation for all inventory management actions (add, edit, delete).
-   **Security Testing:**
    -   Verify API routes are protected by authentication.
    -   Verify authorization checks prevent users from accessing/modifying other users' food items.
    -   Test input validation to prevent injection attacks (e.g., XSS, SQL injection via Prisma - less likely but validate).
-   **Accessibility Testing:**
    -   Verify WCAG 2.1 AA compliance for all Pantry View components, forms, and dialogs.
    -   Test keyboard navigation and screen reader compatibility for all interactive elements, including drag-and-drop alternatives.
-   **Performance Testing:**
    -   Measure and verify API response times meet the <300ms target.
    -   Measure and verify Pantry View initial load time meets the <2s target.
    -   Test UI responsiveness with large inventories to identify potential bottlenecks.

---

_This Epic Technical Specification provides a comprehensive blueprint for implementing Core Inventory Management features, ensuring alignment with the project's architecture, UX design, and quality standards._
