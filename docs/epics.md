# ibe160 - Epic Breakdown

**Author:** BIP
**Date:** søndag 23. november 2025
**Project Level:** mobile-responsive web application
**Target Scale:** general complexity

---

## Overview

This document provides the complete epic and story breakdown for ibe160, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.

### Proposed Epic Structure

#### Epic 1: Foundation & User Onboarding
**Goal:** Establish the core project infrastructure and allow users to securely register and log in to the platform.

#### Epic 2: Core Inventory Management
**Goal:** Enable users to effectively manage their kitchen inventory by adding, viewing, editing, and deleting food items.

#### Epic 3: Smart Recipe Discovery & Cooking
**Goal:** Provide users with personalized recipe suggestions based on their inventory and facilitate the cooking process with automatic inventory updates.

#### Epic 4: Waste Reduction & Shopping List
**Goal:** Help users reduce food waste through expiration alerts and enable efficient meal planning with a shopping list feature.

---

## Functional Requirements Inventory

- FR-001: User Authentication: Secure registration and login for users.
- FR-002.1: Users can manually add food items with quantities and expiration dates.
- FR-002.2: Users can view, edit, and delete items from their pantry or fridge.
- FR-003.1: Users can browse, search, and view recipes from a recipe database.
- FR-003.2: The system suggests recipes based on the user’s current inventory.
- FR-003.3: The system provides recipe recommendations specifically for items nearing expiration.
- FR-003.4: Users can manually enter 2-3 ingredients to get recipe suggestions (Basic Creative Mode).
- FR-004.1: Ingredients are automatically deducted from the inventory when a recipe is used.
- FR-005.1: Users receive in-app notifications for food items nearing expiration (2–3 days before).
- FR-006.1: Users can add, view, and delete items from a shopping list.
- FR-006.2: Items can be added manually or from missing recipe ingredients.

---

## FR Coverage Map

- **Epic 1: Foundation & User Onboarding:** FR-001
- **Epic 2: Core Inventory Management:** FR-002.1, FR-002.2
- **Epic 3: Smart Recipe Discovery & Cooking:** FR-003.1, FR-003.2, FR-003.3, FR-003.4, FR-004.1
- **Epic 4: Waste Reduction & Shopping List:** FR-005.1, FR-006.1, FR-006.2

---

<!-- Repeat for each epic (N = 1, 2, 3...) -->

## Epic 1: Foundation & User Onboarding
**Goal:** Establish the core project infrastructure and allow users to securely register and log in to the platform.

### Story 1.1: Project Setup & Core Infrastructure (Foundation)
As a developer,
I want to set up the project with the defined tech stack and basic infrastructure,
So that I can build the application efficiently and with a clear foundation.

**Acceptance Criteria:**
*   **Given** a new project environment,
*   **When** I initialize the project,
*   **Then** a Next.js 14 project is created with App Router.
*   **And** Tailwind CSS is configured for styling.
*   **And** shadcn/ui components are integrated and ready for use.
*   **And** Prisma ORM is initialized with a connection to a Supabase PostgreSQL database.
*   **And** NextAuth.js is installed and configured for email/password authentication.
*   **And** Vercel deployment is configured for continuous integration.

**Prerequisites:** None.

**Technical Notes:**
*   **Frontend:** Next.js 14 (App Router, Server Components), Tailwind CSS, shadcn/ui.
*   **Backend:** Next.js API Routes (initial setup).
*   **Database:** Supabase (PostgreSQL), Prisma ORM.
*   **Authentication:** NextAuth.js.
*   **Hosting:** Vercel.
*   **Architecture Reference:** See `architecture.md` sections 3.1, 3.2, 3.3, 3.4, 3.5.

### Story 1.2: User Registration
As a new user,
I want to register for an account with my email and a secure password,
So that I can access the platform's features.

**Acceptance Criteria:**
*   **Given** I am on the registration page,
*   **When** I provide a valid email address and a password meeting complexity requirements,
*   **And** I submit the registration form,
*   **Then** my account is successfully created and I am logged in.
*   **And** my password is securely hashed and stored in the Supabase database via Prisma.
*   **And** a success message is displayed.
*   **And** the UI reflects the "Farmhouse Kitchen" aesthetic (UX Ref: `ux-design-specification.md` section 3.1, 3.2, 4.1).
*   **And** the registration form is responsive across devices (UX Ref: `ux-design-specification.md` section 8.1).
*   **And** accessibility standards (WCAG 2.1 AA) are met for the form fields and buttons (UX Ref: `ux-design-specification.md` section 8.2).

**Prerequisites:** Story 1.1: Project Setup & Core Infrastructure.

**Technical Notes:**
*   **Frontend:** Next.js client component for the registration form.
*   **Backend:** Next.js API Route for handling registration (POST `/api/auth/register`).
*   **Authentication:** NextAuth.js for account creation and session management.
*   **Database:** Prisma to interact with the `User` model in Supabase.
*   **Architecture Reference:** See `architecture.md` sections 3.4, 6, 7.
*   **UX Reference:** See `ux-design-specification.md` sections 2.2 (Contextual Modes), 3 (Visual Foundation), 4 (Design Direction), 5.1 (Landing Page / Onboarding), 7.1 (Consistency Rules), 8 (Responsive Design & Accessibility).

### Story 1.3: User Login & Session Management
As a registered user,
I want to log in to my account and maintain my session,
So that I can seamlessly use the platform without re-authenticating frequently.

**Acceptance Criteria:**
*   **Given** I have a registered account,
*   **When** I am on the login page and provide valid credentials,
*   **And** I submit the login form,
*   **Then** I am successfully authenticated and redirected to my dashboard/pantry view.
*   **And** my session is securely managed by NextAuth.js.
*   **And** an option to "Remember Me" is available, extending session duration.
*   **And** error messages are displayed for invalid credentials.
*   **And** the login form adheres to the "Farmhouse Kitchen" UI principles and responsiveness.

**Prerequisites:** Story 1.1: Project Setup & Core Infrastructure.

**Technical Notes:**
*   **Frontend:** Next.js client component for the login form.
*   **Backend:** Next.js API Route for handling login (POST `/api/auth/login`).
*   **Authentication:** NextAuth.js for authentication and session management.
*   **Database:** Prisma for user lookup.
*   **Architecture Reference:** See `architecture.md` sections 3.4, 6, 7.
*   **UX Reference:** Similar to registration, focusing on login form and redirection experience.

---

## Epic 2: Core Inventory Management
**Goal:** Enable users to effectively manage their kitchen inventory by adding, viewing, editing, and deleting food items.

### Story 2.1: Add Food Item to Inventory
As a user,
I want to easily add food items to my kitchen inventory with details like name, quantity, category, and expiration date,
So that I can track what I have and avoid waste.

**Acceptance Criteria:**
*   **Given** I am logged in and on the "My Pantry" view,
*   **When** I initiate the "Add Food Item" flow (e.g., by dragging an icon or clicking a button),
*   **And** I provide the food item's name, quantity, unit, category, and a best-before date,
*   **And** I submit the form,
*   **Then** the food item is successfully added to my inventory and displayed in the "Open Shelves" view.
*   **And** the "Add Food Item" interaction is smooth and delightful, adhering to UX principles (UX Ref: `ux-design-specification.md` section 2.2, 5.1).
*   **And** input validation is performed for all fields.

**Prerequisites:** Story 1.3: User Login & Session Management.

**Technical Notes:**
*   **Frontend:** Next.js client component for the "Add Food Item" form/modal. Utilizes `shadcn/ui` for form elements.
*   **Backend:** Next.js API Route for adding food items (POST `/api/inventory/add`).
*   **Database:** Prisma to interact with the `FoodItem` model in Supabase.
*   **Architecture Reference:** See `architecture.md` sections 3.3, 6.
*   **UX Reference:** `ux-design-specification.md` sections 2.2 (Tactile Inventory Management, Contextual Modes), 5.1 (Inventory Management flow - Adding Items), 7.1 (Form Patterns, Feedback Patterns).

### Story 2.2: View & Browse Inventory
As a user,
I want to view my entire kitchen inventory in an organized and intuitive way,
So that I can quickly see what food items I have available.

**Acceptance Criteria:**
*   **Given** I am logged in,
*   **When** I navigate to the "My Pantry" view,
*   **Then** I see a visual representation of my food items in the "Open Shelves" layout.
*   **And** each food item displays its name, quantity, and approximate freshness/expiration status (e.g., color-coded).
*   **And** the view is responsive, adapting to different screen sizes.
*   **And** the inventory can be sorted or filtered (e.g., by category, expiration date) (MVP: basic sorting).

**Prerequisites:** Story 1.3: User Login & Session Management, Story 2.1: Add Food Item to Inventory.

**Technical Notes:**
*   **Frontend:** Next.js Server Component for initial rendering of "My Pantry" view, fetching `FoodItem` data. Client components for interactive sorting/filtering.
*   **Backend:** Next.js API Route for fetching food items (GET `/api/inventory`).
*   **Database:** Prisma to query `FoodItem`s from Supabase.
*   **Architecture Reference:** See `architecture.md` sections 3.3, 6.
*   **UX Reference:** `ux-design-specification.md` sections 2.2 ("Open Shelves" approach), 4.1 (Chosen Design Approach - The View), 5.1 (Inventory Management flow - Viewing Items).

### Story 2.3: Edit Food Item in Inventory
As a user,
I want to be able to edit the details of an existing food item in my inventory,
So that I can correct mistakes or update information.

**Acceptance Criteria:**
*   **Given** I am viewing a food item in my "My Pantry" inventory,
*   **When** I select an item for editing,
*   **And** I modify its name, quantity, unit, category, or best-before date,
*   **And** I save the changes,
*   **Then** the food item's details are updated in my inventory and the UI reflects these changes.

**Prerequisites:** Story 2.2: View & Browse Inventory.

**Technical Notes:**
*   **Frontend:** Next.js client component for an edit form/modal.
*   **Backend:** Next.js API Route for updating food items (PUT `/api/inventory/[id]`).
*   **Database:** Prisma to update `FoodItem` in Supabase.
*   **Architecture Reference:** See `architecture.md` sections 3.3, 6.
*   **UX Reference:** `ux-design-specification.md` sections 7.1 (Form Patterns, Feedback Patterns).

### Story 2.4: Delete Food Item from Inventory
As a user,
I want to be able to remove a food item from my inventory,
So that my inventory accurately reflects what I have.

**Acceptance Criteria:**
*   **Given** I am viewing a food item in my "My Pantry" inventory,
*   **When** I select an item for deletion and confirm the action,
*   **Then** the food item is removed from my inventory and no longer displayed.
*   **And** a confirmation prompt is shown before permanent deletion.

**Prerequisites:** Story 2.2: View & Browse Inventory.

**Technical Notes:**
*   **Frontend:** Next.js client component to handle deletion, likely with a confirmation dialog (using `shadcn/ui` Dialog).
*   **Backend:** Next.js API Route for deleting food items (DELETE `/api/inventory/[id]`).
*   **Database:** Prisma to delete `FoodItem` from Supabase.
*   **Architecture Reference:** See `architecture.md` sections 3.3, 6.
*   **UX Reference:** `ux-design-specification.md` sections 7.1 (Modal Patterns, Destructive Action).

## Epic 3: Smart Recipe Discovery & Cooking
**Goal:** Provide users with personalized recipe suggestions based on their inventory and facilitate the cooking process with automatic inventory updates.

### Story 3.1: Browse & Search Recipes
As a user,
I want to browse and search a wide range of recipes,
So that I can find meal ideas easily.

**Acceptance Criteria:**
*   **Given** I am logged in and navigate to the "Recipes" section,
*   **When** I view the recipe library,
*   **Then** I see a collection of recipes displayed as charming recipe cards (UX Ref: `ux-design-specification.md` section 6.1, "RecipeCard").
*   **And** I can search for recipes by keywords (e.g., "chicken," "pasta").
*   **And** the search results load within 2 seconds.
*   **And** each recipe card shows key information (e.g., title, main image).

**Prerequisites:** Story 1.3: User Login & Session Management.

**Technical Notes:**
*   **Frontend:** Next.js Server Component for initial recipe display, client component for search functionality.
*   **Backend:** Next.js API Route to query Spoonacular API (GET `/api/recipes/search`) and potentially cache results.
*   **External API:** Spoonacular API.
*   **Architecture Reference:** See `architecture.md` sections 3.6, 6, 9.
*   **UX Reference:** `ux-design-specification.md` sections 5.1 (Recipe Discovery & Cooking - Discovery), 7.1 (Loading states).

### Story 3.2: View Detailed Recipe Information
As a user,
I want to view comprehensive details for any selected recipe,
So that I can decide if I want to cook it.

**Acceptance Criteria:**
*   **Given** I am browsing recipes and select a recipe card,
*   **When** I click on a recipe card,
*   **Then** I am navigated to a "Detailed Recipe View" showing the full recipe, ingredients list, and instructions.
*   **And** available ingredients from my inventory are highlighted or checked off.
*   **And** missing ingredients can be easily added to my shopping list.
*   **And** an option to activate "Cooking Mode" is presented (UX Ref: `ux-design-specification.md` section 2.2, "Detailed Recipe View").

**Prerequisites:** Story 3.1: Browse & Search Recipes, Story 2.2: View & Browse Inventory.

**Technical Notes:**
*   **Frontend:** Next.js client component for "Detailed Recipe View."
*   **Backend:** Next.js API Route to fetch a single recipe from Spoonacular API by ID (GET `/api/recipes/[id]`).
*   **Logic:** Frontend logic to compare recipe ingredients with user's `FoodItem` inventory.
*   **Architecture Reference:** See `architecture.md` sections 3.6, 6.
*   **UX Reference:** `ux-design-specification.md` sections 2.2 (Detailed Recipe View), 5.1 (Viewing Recipe).

### Story 3.3: Smart Recipe Suggestions from Inventory
As a user,
I want to get personalized recipe suggestions based on the ingredients I currently have in my inventory,
So that I can make the most of my food and reduce waste.

**Acceptance Criteria:**
*   **Given** I am logged in and navigate to the "Recipes" section or a dedicated suggestion area,
*   **When** I request recipe suggestions from my inventory,
*   **Then** the system presents at least 3 recipes that can be made with my available ingredients.
*   **And** the suggestions prioritize recipes that use ingredients nearing expiration (if any).
*   **And** the suggestions are visually appealing and easy to understand.

**Prerequisites:** Story 2.2: View & Browse Inventory, Story 3.1: Browse & Search Recipes.

**Technical Notes:**
*   **Frontend:** Next.js client component to display suggestions.
*   **Backend:** Next.js API Route to intelligently match user's `FoodItem` inventory with Spoonacular recipes (POST `/api/recipes/suggest`). This will involve custom logic to parse ingredients and find matches.
*   **Architecture Reference:** See `architecture.md` section 6 (Backend Architecture - Recipe Matching Logic), 9.

### Story 3.4: Basic Creative Mode for Recipes
As a user,
I want to manually enter a few ingredients and get recipe suggestions,
So that I can explore new meal ideas even without a full inventory.

**Acceptance Criteria:**
*   **Given** I am logged in and access the "Creative Mode",
*   **When** I manually input 2-3 ingredients,
*   **And** I submit my selection,
*   **Then** the system returns recipe suggestions from the Spoonacular API that use those ingredients.
*   **And** the UI for inputting ingredients is simple and intuitive.

**Prerequisites:** Story 3.1: Browse & Search Recipes.

**Technical Notes:**
*   **Frontend:** Next.js client component for "Creative Mode" input form.
*   **Backend:** Next.js API Route to query Spoonacular API with specified ingredients (POST `/api/recipes/creative-mode`).
*   **External API:** Spoonacular API.
*   **Architecture Reference:** See `architecture.md` section 3.6, 6.

### Story 3.5: Automatic Inventory Update after Cooking
As a user,
I want my inventory to automatically update when I indicate that I have cooked a recipe,
So that my inventory accurately reflects consumed items without manual adjustment.

**Acceptance Criteria:**
*   **Given** I have viewed a recipe and decided to cook it,
*   **When** I confirm that I have cooked the recipe,
*   **Then** the ingredients used in the recipe are automatically deducted from my inventory.
*   **And** a confirmation message is displayed, allowing for review or undo if necessary.

**Prerequisites:** Story 2.3: Edit Food Item in Inventory, Story 3.2: View Detailed Recipe Information.

**Technical Notes:**
*   **Frontend:** Next.js client component to trigger the inventory update.
*   **Backend:** Next.js API Route (POST `/api/inventory/consume-recipe`) that takes a recipe ID and user ID, then updates `FoodItem` quantities in Supabase via Prisma.
*   **Logic:** Logic to determine exact quantities to deduct based on recipe and current inventory.
*   **Architecture Reference:** See `architecture.md` section 6.

## Epic 4: Waste Reduction & Shopping List
**Goal:** Help users reduce food waste through expiration alerts and enable efficient meal planning with a shopping list feature.

### Story 4.1: In-App Expiration Alerts
As a user,
I want to receive timely in-app notifications for food items nearing their expiration date,
So that I can prioritize using them and reduce food waste.

**Acceptance Criteria:**
*   **Given** I have food items in my inventory with expiration dates,
*   **When** a food item is 2-3 days away from its expiration date,
*   **Then** I receive an in-app notification alerting me about the即将expired item.
*   **And** clicking the notification takes me to a view showing all soon-to-expire items.
*   **And** the notification system is unintrusive but effective.

**Prerequisites:** Story 2.2: View & Browse Inventory.

**Technical Notes:**
*   **Frontend:** Next.js client component to display notifications (e.g., a badge icon).
*   **Backend:** Next.js API Route (GET `/api/notifications/expiring`) to query `FoodItem`s and determine items nearing expiration. Potentially a scheduled job or cron-like function to generate notifications periodically.
*   **Database:** Prisma to query `FoodItem`s and `Notification`s from Supabase.
*   **Architecture Reference:** See `architecture.md` section 6.

### Story 4.2: Add Item to Shopping List
As a user,
I want to easily add items to a shopping list, either manually or from missing recipe ingredients,
So that I can keep track of what I need to buy.

**Acceptance Criteria:**
*   **Given** I am logged in,
*   **When** I manually input an item into my shopping list,
*   **Then** the item is added to my shopping list.
*   **And** when viewing a recipe with missing ingredients, I can add those missing ingredients to my shopping list with a single action.
*   **And** the shopping list UI is clear and easy to use.

**Prerequisites:** Story 1.3: User Login & Session Management, Story 3.2: View Detailed Recipe Information.

**Technical Notes:**
*   **Frontend:** Next.js client component for shopping list management and adding items.
*   **Backend:** Next.js API Routes for adding shopping list items (POST `/api/shopping-list/add-manual`, POST `/api/shopping-list/add-from-recipe`).
*   **Database:** Prisma to interact with `ShoppingList` and `ShoppingListItem` models in Supabase.
*   **Architecture Reference:** See `architecture.md` sections 3.3, 6.
*   **UX Reference:** `ux-design-specification.md` sections 5.1 (User Is at the Store and Logged In), 7.1 (Form Patterns).

### Story 4.3: View & Manage Shopping List
As a user,
I want to view my shopping list, mark items as purchased, and remove items,
So that I can efficiently manage my groceries.

**Acceptance Criteria:**
*   **Given** I am logged in,
*   **When** I navigate to my shopping list,
*   **Then** I see all items currently on my list.
*   **And** I can mark items as purchased, which visually moves them to a "purchased" section or strikes them through.
*   **And** I can delete individual items or clear the entire list.
*   **And** the shopping list remains organized and easy to read.

**Prerequisites:** Story 4.2: Add Item to Shopping List.

**Technical Notes:**
*   **Frontend:** Next.js client component for the shopping list view.
*   **Backend:** Next.js API Routes for updating (PUT `/api/shopping-list/update-item`), deleting (DELETE `/api/shopping-list/delete-item`), and clearing (DELETE `/api/shopping-list/clear`) shopping list items.
*   **Database:** Prisma to interact with `ShoppingListItem`s in Supabase.
*   **Architecture Reference:** See `architecture.md` sections 3.3, 6.
*   **UX Reference:** `ux-design-specification.md` sections 5.1 (User wants to view shopping list), 7.1 (Feedback Patterns).

<!-- End epic repeat -->

---

## FR Coverage Matrix

| Functional Requirement | Epic(s) Covered | Story(ies) Covered (Example) |
|------------------------|-----------------|------------------------------|
| FR-001: User Authentication | Epic 1          | Story 1.2, Story 1.3         |
| FR-002.1: Add Food Item    | Epic 2          | Story 2.1                    |
| FR-002.2: View/Edit/Delete Food Item | Epic 2          | Story 2.2, Story 2.3, Story 2.4 |
| FR-003.1: Browse/Search Recipes | Epic 3          | Story 3.1                    |
| FR-003.2: Smart Recipe Suggestions | Epic 3          | Story 3.3                    |
| FR-003.3: Recommendations for Expiring Items | Epic 3          | Story 3.3 (part of suggestions) |
| FR-003.4: Basic Creative Mode | Epic 3          | Story 3.4                    |
| FR-004.1: Auto Inventory Update | Epic 3          | Story 3.5                    |
| FR-005.1: Expiration Alerts | Epic 4          | Story 4.1                    |
| FR-006.1: Add to Shopping List | Epic 4          | Story 4.2                    |
| FR-006.2: View/Manage Shopping List | Epic 4          | Story 4.3                    |

---

## Summary

The epics and stories for the Smart Food & Recipe Platform (ibe160) have been successfully created, incorporating insights from the PRD, UX Design Specification, and Architecture Document. The breakdown is structured to deliver incremental user value, with each story being bite-sized and actionable for development.

**Key Achievements:**
*   **Comprehensive Coverage:** All functional requirements from the PRD's MVP scope are covered across four user-value-driven epics.
*   **Detailed Stories:** Each story includes BDD-style acceptance criteria, prerequisites, and technical notes, ensuring clarity for implementation.
*   **Contextual Integration:** UX interaction patterns, visual design principles, accessibility considerations, and technical architectural decisions (tech stack, API endpoints, data models) have been woven into the story details.
*   **Development Readiness:** Stories are designed to be small enough for single developer session completion, promoting efficient sprint planning and execution.

**Next Steps:**
This document now serves as a robust foundation for Phase 4: Implementation. It is ready for sprint planning, allowing development teams to pick up stories and begin building the platform with a clear understanding of requirements and design intent.

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_This document will be updated after UX Design and Architecture workflows to incorporate interaction details and technical decisions._