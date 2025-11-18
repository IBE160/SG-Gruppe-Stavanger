# Epics and Stories for ibe160

**Project:** ibe160
**Date:** 2025-11-18
**Author:** BIP

This document breaks down the project requirements into actionable epics and user stories. It is a living document that will be updated as the project progresses.

---

## Epics Summary

*   **Epic 1: Foundation & Core Setup:** Establishes the essential technical groundwork, including the project structure, database, user authentication, and the basic application shell. This is the bedrock upon which all other features will be built.
*   **Epic 2: Inventory Management:** Delivers the core capability for users to manage their kitchen inventory. This includes adding, editing, and viewing food items, which is central to the app's purpose.
*   **Epic 3: Recipe Discovery & Browsing:** Focuses on the user's ability to **proactively** search, browse, and view recipes from the external Spoonacular API. This epic is about general recipe exploration.
*   **Epic 4: Personalized Suggestions & Alerts:** Implements the **reactive** "smart" features. This includes generating recipe suggestions based on the user's inventory, sending expiration alerts, and delivering the **"Instant Idea" button** for quick, on-the-fly recipe generation.

### Dependency Mapping Analysis

*   **Epic 1 (Foundation & Core Setup)** is the foundational block.
    *   **Impact:** All other epics depend on its completion. Any delays here will cascade through the entire project.
*   **Epic 2 (Inventory Management)** is the next critical path item.
    *   **Dependency:** Relies on the database and UI shell from Epic 1.
    *   **Impact:** Epic 4 (Intelligent Suggestions & Alerts) is blocked until this is complete.
*   **Epic 3 (Recipe Discovery & Interaction)** can be partially developed in parallel.
    *   **Dependency:** Relies on the UI shell from Epic 1. The basic search and display can be built without inventory.
    *   **Impact:** Full integration with smart features depends on Epic 4.
*   **Epic 4 (Intelligent Suggestions & Alerts)** is the final value-add epic.
    *   **Dependencies:** Requires a complete inventory system (Epic 2) and the recipe display components (Epic 3).
    *   **Impact:** This epic delivers the "magic" of the application.

**Visualized Flow:**

```
[Epic 1: Foundation] -> [Epic 2: Inventory] -> [Epic 4: Suggestions]
       |
       +-> [Epic 3: Recipe Discovery] ---^
```

---

## Epic 1: Foundation & Core Setup

**Goal:** Establish the essential technical groundwork, including the project structure, database, user authentication, and the basic application shell.

### Stories

#### 1.1: Project Initialization & Setup
*   **Scope:** MVP
*   **Covers:** NFR-SYS-1
*   **User Story:** As a developer, I want a new Next.js project initialized with the standard folder structure, ESLint, Prettier, and other development dependencies so that I can start building the application on a solid foundation.
*   **Dependencies:** None
*   **BDD Criteria:**
    *   **Given** a new project is needed
    *   **When** the project is initialized
    *   **Then** a new Next.js application is created with the App Router, and ESLint and Prettier are configured.

#### 1.2: Database & ORM Setup
*   **Scope:** MVP
*   **Covers:** NFR-SYS-1
*   **User Story:** As a developer, I want the Supabase database connected to the application with Prisma as the ORM so that I can interact with the database in a type-safe way.
*   **Dependencies:** 1.1
*   **BDD Criteria:**
    *   **Given** the project is initialized
    *   **When** the database is set up
    *   **Then** the application is connected to the Supabase PostgreSQL database, Prisma is configured, and the initial schema is created.
    *   **And** the database schema is optimized for performance and scalability.
    *   **And** access to the database is secured.

#### 1.3: User Authentication
*   **Scope:** MVP
*   **Covers:** FR1.1, FR1.2
*   **User Story:** As a user, I want to be able to register and log in to the application so that I can access my personal inventory.
*   **Dependencies:** 1.2
*   **BDD Criteria:**
    *   **Given** a new user visits the application
    *   **When** they register with an email and password
    *   **Then** a new user account is created and they are authenticated.
    *   **And** passwords are securely hashed.
    *   **And** user sessions are managed securely.

#### 1.4: Basic UI Shell & Navigation
*   **Scope:** MVP
*   **Covers:** FR1.3
*   **User Story:** As a user, I want a basic application shell with a navigation bar so that I can easily move between the main sections of the application.
*   **Dependencies:** 1.3
*   **BDD Criteria:**
    *   **Given** a logged-in user
    *   **When** they view the application
    *   **Then** a navigation bar is present with links to the main sections.
    *   **And** the UI is responsive and accessible (WCAG 2.1 AA).
    *   **And** page load times achieve a Lighthouse score of over 90.
    *   **When** the user logs out
    *   **Then** their session is terminated.
    *   **And** they are redirected to the public landing page.

---

## Epic 2: Inventory Management

**Goal:** Delivers the core capability for users to manage their kitchen inventory. This includes adding, editing, and viewing food items, which is central to the app's purpose.

### Stories

#### 2.1: Add Food Item
*   **Scope:** MVP
*   **Covers:** FR2.1
*   **User Story:** As a user, I want to manually add a food item to my inventory with its name, quantity, unit, and expiration date so that I can keep track of what I have.
*   **Dependencies:** 1.4
*   **BDD Criteria:**
    *   **Given** I am on the inventory management screen
    *   **When** I provide a food item's name, quantity, unit, and expiration date
    *   **Then** the item is added to my inventory list.
    *   **And** the process is optimized for speed (completes in under 2 seconds).
    *   **And** the system handles variations in ingredient names (e.g., 'tomato' vs. 'tomatoes').
    *   **And** the system handles a variety of units (e.g., grams, ounces, cups).

#### 2.2: View Inventory List
*   **Scope:** MVP
*   **Covers:** FR2.2
*   **User Story:** As a user, I want to view all items in my inventory, sorted by expiration date, so that I can quickly see what needs to be used soon.
*   **Dependencies:** 2.1
*   **BDD Criteria:**
    *   **Given** I am on the inventory management screen
    *   **When** I view my inventory
    *   **Then** all my food items are displayed.
    *   **And** items are sorted with the soonest-expiring items at the top.
    *   **And** the inventory list loads in under 1 second.

#### 2.3: Edit Food Item
*   **Scope:** MVP
*   **Covers:** FR2.3
*   **User Story:** As a user, I want to edit the details of an existing food item (name, quantity, unit, expiration date) so that I can correct mistakes or update information.
*   **Dependencies:** 2.2
*   **BDD Criteria:**
    *   **Given** I have an item in my inventory
    *   **When** I select to edit its details
    *   **Then** I can modify its name, quantity, unit, and expiration date.
    *   **And** the changes are reflected in the inventory list.

#### 2.4: Delete Food Item
*   **Scope:** MVP
*   **Covers:** FR2.4
*   **User Story:** As a user, I want to delete a food item from my inventory so that I can remove items I no longer have or need to track.
*   **Dependencies:** 2.2
*   **BDD Criteria:**
    *   **Given** I have an item in my inventory
    *   **When** I select to delete it
    *   **Then** a confirmation prompt is displayed.
    *   **And** upon confirmation, the item is permanently removed from my inventory.

### Notes: What If Scenario Analysis

*   **Scenario 1: What if a user finds the manual entry process too tedious and abandons the app?**
    *   **Implication:** This is a major risk to user adoption, as highlighted in the PRD.
    *   **Insight:** The "Add Food Item" story (2.1) must be incredibly fast and frictionless. For post-MVP, we should strongly consider features like barcode scanning or receipt parsing to automate this process.

*   **Scenario 2: What if a user adds an item without an expiration date?**
    *   **Implication:** The core logic for expiration alerts and prioritizing recipes will fail for that item.
    *   **Insight:** For the MVP, the expiration date field should be required to ensure the core loop functions correctly. We can explore using default expiration dates for common items in a future iteration to reduce friction.

*   **Scenario 3: What if a user wants to add multiple items at once (e.g., after a grocery trip)?**
    *   **Implication:** Adding items one by one would be frustrating and time-consuming.
    *   **Insight:** While the MVP focuses on single-item actions, a "bulk add" feature should be a high-priority consideration for a future epic to improve the user experience for regular shoppers.

*   **Scenario 4: What if the user's inventory becomes very large?**
    *   **Implication:** The inventory list could become slow and difficult to navigate.
    *   **Insight:** We must ensure the inventory view is performant from the start. While sorting by expiration date is sufficient for the MVP, we should plan for search and filtering capabilities as the user's inventory grows.

---
## Epic 3: Recipe Discovery & Browsing

**Goal:** Focuses on the user's ability to **proactively** search, browse, and view recipes from the external Spoonacular API. This epic is about general recipe exploration.

### Stories

#### 3.1: Search Recipes by Keyword
*   **Scope:** MVP
*   **Covers:** FR3.2
*   **User Story:** As a user, I want to search for recipes using keywords (e.g., "chicken pasta", "vegetarian chili") so that I can find recipes that match my interests.
*   **Dependencies:** 1.4
*   **BDD Criteria:**
    *   **Given** I am on the recipe discovery screen
    *   **When** I enter a keyword into the search bar and submit
    *   **Then** a list of relevant recipes from the Spoonacular API is displayed.
    *   **And** search results load within 1 second.

#### 3.2: View Recipe Search Results
*   **Scope:** MVP
*   **Covers:** FR3.2
*   **User Story:** As a user, I want to see a clear list of recipe search results with images and titles so that I can quickly identify recipes of interest.
*   **Dependencies:** 3.1
*   **BDD Criteria:**
    *   **Given** I have performed a recipe search
    *   **When** the results are displayed
    *   **Then** each recipe shows a clear image and title.
    *   **And** I can easily scroll through the results.

#### 3.3: View Full Recipe Details
*   **Scope:** MVP
*   **Covers:** FR3.3
*   **User Story:** As a user, I want to view the full details of a selected recipe, including ingredients, instructions, cooking time, and servings, so that I can decide if I want to cook it.
*   **Dependencies:** 3.2
*   **BDD Criteria:**
    *   **Given** I am viewing a recipe in the search results
    *   **When** I select a recipe
    *   **Then** I am taken to a detailed view showing ingredients, instructions, cooking time, and servings.

#### 3.4: Mark Recipe as Cooked & Deduct Ingredients
*   **Scope:** MVP
*   **Covers:** FR3.4
*   **User Story:** As a user, I want to mark a recipe as "cooked" and have the used ingredients automatically deducted from my inventory so that my inventory remains accurate.
*   **Dependencies:** 3.3, 2.2
*   **BDD Criteria:**
    *   **Given** I am viewing a recipe's details
    *   **When** I click "Mark as Cooked"
    *   **Then** I am prompted to confirm which ingredients were used from my inventory.
    *   **And** upon confirmation, the quantities of the used ingredients are deducted from my inventory.

### Notes: What If Scenario Analysis

*   **Scenario 1: What if the Spoonacular API is down or responds slowly?**
    *   **Implication:** This would break the core functionality of recipe discovery and severely degrade the user experience. The PRD identifies this as a key risk.
    *   **Insight:** The "Search Recipes by Keyword" story (3.1) needs a robust error handling and caching strategy. We should implement a fallback mechanism, such as using a small, locally stored seed dataset of recipes if the API is unavailable. This ensures the app remains functional even during an outage.

*   **Scenario 2: What if the user's search query returns no results?**
    *   **Implication:** The user might feel frustrated or think the app is broken.
    *   **Insight:** The "View Recipe Search Results" story (3.2) should include a clear "no results found" message. We could also suggest alternative search terms or provide a link to browse popular recipes to keep the user engaged.

*   **Scenario 3: What if the recipe data from the API is inconsistent or of poor quality?**
    *   **Implication:** This could lead to a confusing or frustrating user experience (e.g., missing ingredients, unclear instructions).
    *   **Insight:** While we don't have full control over the API data, the "View Full Recipe Details" story (3.3) should be designed to handle missing or incomplete data gracefully. We should also consider providing a way for users to report issues with a recipe, which could be used to improve the data quality over time.

*   **Scenario 4: What if the user marks a recipe as cooked but doesn't have all the ingredients in their inventory?**
    *   **Implication:** The "Mark Recipe as Cooked & Deduct Ingredients" story (3.4) needs to handle this gracefully.
    *   **Insight:** The confirmation step is crucial here. The app should only show ingredients that are actually in the user's inventory and allow them to confirm the deduction. It should not assume they have ingredients that are not being tracked.

---

## Epic 4: Personalized Suggestions & Alerts

**Goal:** Implements the **reactive** "smart" features. This includes generating recipe suggestions based on the user's inventory, sending expiration alerts, and delivering the **"Instant Idea" button** for quick, on-the-fly recipe generation.

### Stories

#### 4.1: Smart Recipe Suggestions from Inventory
*   **Scope:** MVP
*   **Covers:** FR3.1
*   **User Story:** As a user, I want to receive personalized recipe suggestions based on the ingredients currently in my inventory, especially those nearing expiration, so that I can reduce food waste and get meal inspiration.
*   **Dependencies:** 2.2, 3.2
*   **BDD Criteria:**
    *   **Given** I have items in my inventory
    *   **When** I request recipe suggestions
    *   **Then** the system generates at least 3 meaningful recipe suggestions using my available ingredients.
    *   **And** suggestions prioritize ingredients nearing their expiration date.

#### 4.2: Expiration Alerts
*   **Scope:** MVP
*   **Covers:** FR4.1
*   **User Story:** As a user, I want to receive in-app notifications for food items nearing their expiration date (2-3 days prior) so that I can plan to use them before they spoil.
*   **Dependencies:** 2.2
*   **BDD Criteria:**
    *   **Given** I have food items in my inventory with expiration dates
    *   **When** an item is 2-3 days from expiring
    *   **Then** I receive an in-app notification.
    *   **And** the notification is actionable, linking to recipes using that item.

#### 4.3: "Instant Idea" Button
*   **Scope:** MVP
*   **Covers:** (Part of MVP scope, but not an explicit FR)
*   **User Story:** As a user, I want a prominent "Instant Idea" button that allows me to quickly get a recipe suggestion by typing in 2-3 ingredients, without affecting my persistent inventory, so that I can get immediate meal inspiration with zero friction.
*   **Dependencies:** 1.4, 3.2
*   **BDD Criteria:**
    *   **Given** I am on the main screen
    *   **When** I click the "Instant Idea" button and enter 2-3 ingredients
    *   **Then** I receive an immediate recipe suggestion based on those ingredients.
    *   **And** this action does not modify my saved inventory.

### Notes: What If Scenario Analysis

*   **Scenario 1: What if the "smart" recipe suggestions are not relevant or appealing to the user?**
    *   **Implication:** This would undermine the core "magic" of the app and lead to user disappointment.
    *   **Insight:** The algorithm for "Smart Recipe Suggestions from Inventory" (Story 4.1) needs to be well-tuned. For the MVP, we can start with a simple algorithm that prioritizes recipes with the most matching ingredients and soon-to-expire items. For future iterations, we should consider incorporating user preferences (likes/dislikes, dietary needs) to improve the relevance of suggestions.

*   **Scenario 2: What if the user experiences "notification fatigue" and ignores the expiration alerts?**
    *   **Implication:** The alerts would become ineffective, and a key feature for reducing food waste would be lost. The PRD identifies this as a risk.
    *   **Insight:** The "Expiration Alerts" (Story 4.2) must be actionable and well-managed. We should bundle notifications (e.g., "3 items are expiring soon") rather than sending individual alerts for each item. We should also provide users with control over notification frequency and timing.

*   **Scenario 3: What if the "Instant Idea" button doesn't provide good suggestions or is slow?**
    *   **Implication:** This feature is designed for a "wow" moment. If it's slow or the suggestions are poor, it will have the opposite effect.
    *   **Insight:** The "Instant Idea" button (Story 4.3) needs to be fast and provide high-quality suggestions. We should consider using a faster, more specialized model for this feature, or even a curated list of simple recipes, to ensure a good user experience.

*   **Scenario 4: What if the user has very few items in their inventory?**
    *   **Implication:** The app might not be able to generate any meaningful recipe suggestions.
    *   **Insight:** In this case, the "Smart Recipe Suggestions from Inventory" (Story 4.1) should provide a clear message to the user, such as "Add more items to get recipe suggestions." We could also suggest some popular or simple recipes to keep the user engaged.

---

## Final Review Summary

The epic and story breakdown is comprehensive and aligns well with the Product Requirements Document. All functional requirements have been addressed, and the stories are designed to be vertically sliced and implementable. The dependency mapping provides a clear development path, and the BDD criteria offer testable definitions for each story. The "What If" scenarios have added valuable insights for future considerations and potential risks.

This document is now ready for the next phase of planning.
