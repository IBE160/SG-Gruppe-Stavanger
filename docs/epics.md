# ibe160 - Epic Breakdown

**Author:** BIP
**Date:** 2025-11-28
**Project Level:** {{project_level}}
**Target Scale:** {{target_scale}}

---

## Overview

This document provides the complete epic and story breakdown for ibe160, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.

🆕 **INITIAL CREATION MODE**

No existing epics found - I'll create the initial epic breakdown.

**Available Context:**
  - ✅ PRD (required)
  - ✅ UX Design (will incorporate interaction patterns)
  - ✅ Architecture (will incorporate technical decisions)

### Epics Summary

*   **Epic 1: Foundation & Core Setup:** Establishes the essential technical groundwork, including the project structure, database, user authentication, and the basic application shell. This is the bedrock upon which all other features will be built.
*   **Epic 2: Inventory Management:** Delivers the core capability for users to manage their kitchen inventory. This includes adding, editing, and viewing food items, which is central to the app's purpose.
*   **Epic 3: Recipe Discovery & Browsing:** Focuses on the user's ability to **proactively** search, browse, and view recipes from the external Spoonacular API. This epic is about general recipe exploration.
*   **Epic 4: Personalized Suggestions & Alerts:** Implements the **reactive** "smart" features. This includes generating recipe suggestions based on the user's inventory, sending expiration alerts, and delivering the **"Instant Idea" button** for quick, on-the-fly recipe generation.

---

## Functional Requirements Inventory

- FR1.1: User Registration
- FR1.2: User Login
- FR1.3: User Logout
- FR1.4: User Onboarding (Post-MVP)
- FR2.1: Add Food Item
- FR2.2: View Inventory
- FR2.3: Edit Food Item
- FR2.4: Delete Food Item
- FR3.1: Get Recipe Suggestions
- FR3.2: Search Recipes
- FR3.3: View Recipe Details
- FR3.4: Mark Recipe as Cooked
- FR4.1: Expiration Alerts
- FR4.2: Instant Idea Generation

---

## FR Coverage Map

*   **Epic 1: Foundation & Core Setup:** FR1.1, FR1.2, FR1.3
*   **Epic 2: Inventory Management:** FR2.1, FR2.2, FR2.3, FR2.4
*   **Epic 3: Recipe Discovery & Browsing:** FR3.2, FR3.3
*   **Epic 4: Personalized Suggestions & Alerts:** FR3.1, FR3.4, FR4.1, FR4.2
*   **Post-MVP:** FR1.4

---

## Epic 1: Foundation & Core Setup

Establishes the essential technical groundwork, including the project structure, database, user authentication, and the basic application shell. This is the bedrock upon which all other features will be built.

### Story 1.1: Project Initialization

As a developer, I want to initialize the project with the correct structure and dependencies, so that I can start building the application.

**Acceptance Criteria:**

**Given** the project is new
**When** I run `npx create-next-app@latest ibe160-app --typescript --tailwind --eslint --app`
**Then** a new Next.js project is created with TypeScript, Tailwind CSS, ESLint and the App Router.
**And** the project structure from `architecture.md` is created.

**Prerequisites:** None

**Technical Notes:** Refer to `architecture.md` for project structure.

### Story 1.2: Database Setup

As a developer, I want to set up the Supabase database, so that I can store and manage application data.

**Acceptance Criteria:**

**Given** a Supabase project is created
**When** I connect the Next.js app to the Supabase project
**Then** the application can communicate with the database.
**And** the database schema for users is created.

**Prerequisites:** Story 1.1

**Technical Notes:** Refer to `architecture.md` for database schema.

### Story 1.3: User Registration

As a new user, I want to create an account with an email and password, so that I can access the application.

**Acceptance Criteria:**

**Given** I am on the registration page
**When** I enter a valid email and a strong password
**Then** my account is created.
**And** I receive a verification email.

**Prerequisites:** Story 1.2

**Technical Notes:** Use NextAuth.js with Supabase Auth. Refer to `architecture.md` and `FR1.1` in `PRD.md`.

### Story 1.4: User Login

As a registered user, I want to log in with my email and password, so that I can access my account.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I enter my correct credentials
**Then** I am logged in and redirected to the dashboard.

**Prerequisites:** Story 1.3

**Technical Notes:** Use NextAuth.js with Supabase Auth. Refer to `architecture.md` and `FR1.2` in `PRD.md`.

### Story 1.5: User Logout

As a logged-in user, I want to log out of my account, so that I can securely end my session.

**Acceptance Criteria:**

**Given** I am logged in
**When** I click the logout button
**Then** I am logged out and redirected to the landing page.

**Prerequisites:** Story 1.4

**Technical Notes:** Use NextAuth.js. Refer to `architecture.md` and `FR1.3` in `PRD.md`.

---

## Epic 2: Inventory Management

Delivers the core capability for users to manage their kitchen inventory. This includes adding, editing, and viewing food items, which is central to the app's purpose.

### Story 2.1: Add Food Item

As a user, I want to manually add a food item to my inventory, so that I can track my kitchen items.

**Acceptance Criteria:**

**Given** I am logged in and on the inventory page
**When** I click "Add Item" and provide a name, quantity, unit, and expiration date
**Then** the item is added to my inventory list.
**And** the process is optimized for speed (per UX principles).
**And** an empty state should be handled if no items are present.

**Prerequisites:** Epic 1

**Technical Notes:** Use `POST /api/inventory`. Refer to `architecture.md` and `FR2.1` in `PRD.md`. Implement "Quick-Add Input" custom component (per UX).

### Story 2.2: View Inventory

As a user, I want to view all items in my inventory, so that I can see what food I have.

**Acceptance Criteria:**

**Given** I am logged in and on the inventory page
**When** I view my inventory
**Then** all my items are displayed with name, quantity, unit, and expiration date.
**And** items are sorted by expiration date, soonest-expiring first.
**And** items nearing expiration have a color-coded border (per UX).

**Prerequisites:** Story 2.1

**Technical Notes:** Use `GET /api/inventory`. Refer to `architecture.md` and `FR2.2` in `PRD.md`.

### Story 2.3: Edit Food Item

As a user, I want to edit the details of an existing food item, so that I can correct or update information.

**Acceptance Criteria:**

**Given** I am viewing an item in my inventory
**When** I click to edit the item and update its name, quantity, unit, or expiration date
**Then** the changes are saved and reflected in the inventory list.

**Prerequisites:** Story 2.2

**Technical Notes:** Use `PUT /api/inventory/{id}`. Refer to `architecture.md` and `FR2.3` in `PRD.md`.

### Story 2.4: Delete Food Item

As a user, I want to delete an item from my inventory, so that I can remove items I no longer have.

**Acceptance Criteria:**

**Given** I am viewing an item in my inventory
**When** I click to delete the item
**Then** a confirmation prompt is displayed.
**And** upon confirmation, the item is permanently removed from the inventory.

**Prerequisites:** Story 2.2

**Technical Notes:** Use `DELETE /api/inventory/{id}`. Refer to `architecture.md` and `FR2.4` in `PRD.md`. Implement confirmation modal (per UX).

---

## Epic 3: Recipe Discovery & Browsing

Focuses on the user's ability to **proactively** search, browse, and view recipes from the external Spoonacular API. This epic is about general recipe exploration.

### Story 3.1: Search Recipes

As a user, I want to search for recipes, so that I can find meal ideas.

**Acceptance Criteria:**

**Given** I am logged in and on the recipes page
**When** I enter a search query
**Then** I see a list of recipes from the Spoonacular API matching my query.
**And** search results are displayed clearly with images and titles (Recipe Card component).
**And** search performance is under 1 second.
**And** the UI gracefully handles no results and API errors.

**Prerequisites:** Epic 1

**Technical Notes:** Use `GET /api/recipes/search`. Refer to `architecture.md` and `FR3.2` in `PRD.md`. Implement "Live Search" pattern (per UX).

### Story 3.2: View Recipe Details

As a user, I want to view the full details of a recipe, so that I can decide if I want to cook it.

**Acceptance Criteria:**

**Given** I have a list of recipes
**When** I click on a recipe
**Then** I am taken to a detailed view of that recipe.
**And** the view includes ingredients, instructions, cooking time, and servings.

**Prerequisites:** Story 3.1

**Technical Notes:** Refer to `architecture.md` and `FR3.3` in `PRD.md`. The recipe detail page should be a separate route.

---

## Epic 4: Personalized Suggestions & Alerts

Implements the **reactive** "smart" features. This includes generating recipe suggestions based on the user's inventory, sending expiration alerts, and delivering the **"Instant Idea" button** for quick, on-the-fly recipe generation.

### Story 4.1: Get Smart Recipe Suggestions

As a user, I want to receive recipe suggestions based on my current inventory, so that I can cook with ingredients I already have, especially those nearing expiration.

**Acceptance Criteria:**

**Given** I am logged in and have items in my inventory
**When** I view the dashboard or a dedicated suggestions section
**Then** the system generates at least 3 meaningful recipe suggestions if sufficient ingredients exist.
**And** suggestions are prioritized based on ingredients nearing expiration.
**And** each recipe card indicates if it "Uses expiring" items (per UX).

**Prerequisites:** Epic 2, Epic 3

**Technical Notes:** Use `GET /api/recipes/suggestions`. Refer to `architecture.md` and `FR3.1` in `PRD.md`.

### Story 4.2: Mark Recipe as Cooked and Deduct Inventory

As a user, I want to mark a recipe as cooked, so that the used ingredients are automatically removed from my inventory.

**Acceptance Criteria:**

**Given** I am viewing a recipe's details
**When** I indicate that I have cooked the recipe
**Then** the system prompts me to confirm which ingredients were used.
**And** upon confirmation, the quantities of the used ingredients are deducted from my inventory.
**And** this deduction is a deliberate, confirmed action (per UX).

**Prerequisites:** Story 2.2 (View Inventory), Story 3.2 (View Recipe Details)

**Technical Notes:** Use `POST /api/recipes/{id}/cook`. Refer to `architecture.md` and `FR3.4` in `PRD.md`. Implement "Inventory Deduction Modal" custom component (per UX).

### Story 4.3: Expiration Alerts

As a user, I want to receive alerts for items nearing expiration, so that I can use them before they go to waste.

**Acceptance Criteria:**

**Given** I have items in my inventory with expiration dates
**When** items are 2-3 days from expiring
**Then** I receive an in-app notification.
**And** the notification directly links to recipes using those expiring items (Expiration-to-Inspiration Loop, per UX).
**And** notifications are bundled to avoid fatigue (per UX and PRD).

**Prerequisites:** Story 2.2 (View Inventory)

**Technical Notes:** Use `GET /api/notifications`. Implement `PG Cron` for background checks and `Supabase Realtime` for in-app notifications. Refer to `architecture.md` and `FR4.1` in `PRD.md`.

### Story 4.4: Instant Idea Generation

As a user, I want to quickly get a recipe suggestion by typing a few ingredients, without affecting my persistent inventory, so that I can get an instant meal idea.

**Acceptance Criteria:**

**Given** I am on the main screen
**When** I click the "Instant Idea" button
**Then** a prompt appears to enter 2-3 ingredients.
**And** an immediate AI-generated recipe suggestion is provided based on my input.
**And** this action does not modify my inventory.

**Prerequisites:** Epic 3 (Recipe Discovery & Browsing)

**Technical Notes:** Refer to `architecture.md` and `FR4.2` in `PRD.md`. Implement "Instant Idea Button" custom component (per UX). Integrate with Google Gemini API.

---

## FR Coverage Matrix

- FR1.1: User Registration → Epic 1, Story 1.3
- FR1.2: User Login → Epic 1, Story 1.4
- FR1.3: User Logout → Epic 1, Story 1.5
- FR1.4: User Onboarding (Post-MVP) → Not in MVP epics
- FR2.1: Add Food Item → Epic 2, Story 2.1
- FR2.2: View Inventory → Epic 2, Story 2.2
- FR2.3: Edit Food Item → Epic 2, Story 2.3
- FR2.4: Delete Food Item → Epic 2, Story 2.4
- FR3.1: Get Recipe Suggestions → Epic 4, Story 4.1
- FR3.2: Search Recipes → Epic 3, Story 3.1
- FR3.3: View Recipe Details → Epic 3, Story 3.2
- FR3.4: Mark Recipe as Cooked → Epic 4, Story 4.2
- FR4.1: Expiration Alerts → Epic 4, Story 4.3
- FR4.2: Instant Idea Generation → Epic 4, Story 4.4

---

## Summary

*   **Epic 1: Foundation & Core Setup:** Provides the necessary technical foundation for the application.
*   **Epic 2: Inventory Management:** Enables users to effectively track and manage their food items.
*   **Epic 3: Recipe Discovery & Browsing:** Allows users to proactively search and explore recipes.
*   **Epic 4: Personalized Suggestions & Alerts:** Delivers smart, reactive features to help users reduce waste and find meal ideas.

**✅ Epic Breakdown Complete**

**Created:** epics.md with epic and story breakdown

**FR Coverage:** All functional requirements from PRD mapped to stories

**Context Incorporated:**

- ✅ PRD requirements
- ✅ UX interaction patterns
- ✅ Architecture technical decisions
  **Status:** COMPLETE - Ready for Phase 4 Implementation!

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_This document will be updated after UX Design and Architecture workflows to incorporate interaction details and technical decisions._
