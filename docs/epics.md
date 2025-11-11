# ibe160 - Epic Breakdown

**Author:** BIP
**Date:** 2025-11-11
**Project Level:** 3
**Target Scale:** small team

---

## Overview

This document provides the complete epic and story breakdown for ibe160, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

This project will be structured around the following epics, designed to deliver incremental value and address core user needs. The sequencing of these epics considers their inter-dependencies, with foundational epics prioritized first.

### Epic 1: User Authentication & Profile Management
*   **Goal:** Enable users to securely access and manage their personalized application experience.
*   **Scope:** User registration, login, session management, and basic profile updates.
*   **Rationale:** Foundational for any personalized application, ensuring secure access and user identity. This epic is a prerequisite for all other epics.

### Story 1.1: User Registration
As a New user,
I want to Register for an account using my email and a secure password,
So that I can Access the application's personalized features.

**Acceptance Criteria:**
**Given** I am on the registration page
**When** I enter a valid email address and a password meeting complexity requirements, and confirm the password
**Then** My account is created, and I am logged in.
**And** I receive a confirmation email.
**Given** I am on the registration page
**When** I enter an already registered email address
**Then** I receive an error message indicating the email is already in use.

**Prerequisites:** None
**Covers:** FR001

**Technical Notes:** Implement email/password authentication using NextAuth.js. Password hashing and secure storage are required.

### Story 1.2: User Login
As a Registered user,
I want to Log in to my account using my email and password,
So that I can Access my personalized inventory and recipes.

**Acceptance Criteria:**
**Given** I am on the login page
**When** I enter my registered email and correct password
**Then** I am successfully logged in and redirected to my dashboard.
**Given** I am on the login page
**When** I enter an incorrect password for a registered email
**Then** I receive an error message indicating invalid credentials.

**Prerequisites:** Story 1.1 (User Registration)
**Covers:** FR001

**Technical Notes:** Utilize NextAuth.js for session management and authentication.

### Story 1.3: Session Persistence
As a Logged-in user,
I want to Remain logged in for an extended period (30+ days),
So that I can Avoid frequent re-logins, especially on mobile devices.

**Acceptance Criteria:**
**Given** I have successfully logged in
**When** I close and reopen the application within 30 days without explicitly logging out
**Then** I am automatically logged back into my account.

**Prerequisites:** Story 1.2 (User Login)
**Covers:** FR012

**Technical Notes:** Configure NextAuth.js session strategy for long-term persistence.

### Story 1.4: Profile Information Management
As a Logged-in user,
I want to View and update my profile information (e.g., email, password),
So that I can Keep my account details accurate and secure.

**Acceptance Criteria:**
**Given** I am logged in and on my profile settings page
**When** I update my email address to a new valid email and save changes
**Then** My email address is updated, and I receive a confirmation email to the new address.
**Given** I am logged in and on my profile settings page
**When** I update my password by providing my current password and a new password meeting complexity requirements
**Then** My password is updated, and I am required to re-authenticate with the new password.

**Prerequisites:** Story 1.2 (User Login)
**Covers:** FR001

**Technical Notes:** Implement secure password update flow, potentially requiring re-authentication.

### Epic 2: Inventory Management
*   **Goal:** Empower users to efficiently track and manage their kitchen inventory to reduce waste, directly impacting the "Number of food items added to inventory" KPI.
*   **Scope:** Adding, editing, deleting food items, viewing pantry/fridge overview, expiration alerts, and confirmation for ingredient deduction.
*   **Rationale:** Addresses the core problem of food waste by providing tools for inventory control. Given its size, this epic may be broken down into smaller, phased deliveries to ensure manageability for a small team.

### Story 2.1: Add Food Item to Inventory
As a User,
I want to Add a food item to my inventory, including its name, quantity, and expiration date,
So that I can Accurately track what I have in my kitchen.

**Acceptance Criteria:**
**Given** I am on the inventory management screen
**When** I provide a food item name, quantity, and a valid expiration date
**Then** The food item is successfully added to my inventory.
**And** The item appears in my inventory list.

**Prerequisites:** Epic 1 (User Authentication & Profile Management)
**Covers:** FR002

**Technical Notes:** Implement a form for data entry. Consider input validation for dates and quantities.

### Story 2.2: View and Edit Food Items
As a User,
I want to View and edit details of food items in my inventory,
So that I can Keep my inventory accurate as items are used or details change.

**Acceptance Criteria:**
**Given** I am viewing my inventory list
**When** I select a food item and modify its quantity or expiration date
**Then** The changes are saved, and the updated details are reflected in the inventory list.

**Prerequisites:** Story 2.1 (Add Food Item to Inventory)
**Covers:** FR003

**Technical Notes:** Implement an editable view for each inventory item.

### Story 2.3: Delete Food Item from Inventory
As a User,
I want to Delete a food item from my inventory,
So that I can Remove items that are no longer available or desired.

**Acceptance Criteria:**
**Given** I am viewing my inventory list
**When** I select a food item and confirm its deletion
**Then** The food item is removed from my inventory list.

**Prerequisites:** Story 2.1 (Add Food Item to Inventory)
**Covers:** FR003

**Technical Notes:** Implement a confirmation dialog before permanent deletion.

### Story 2.4: Inventory Overview (Pantry/Fridge)
As a User,
I want to View an overview of my pantry and fridge,
So that I can Quickly see what ingredients are available at a glance.

**Acceptance Criteria:**
**Given** I am on the inventory management screen
**When** I view my inventory
**Then** I see a categorized list of my food items, potentially separated by pantry and fridge.

**Prerequisites:** Story 2.1 (Add Food Item to Inventory)
**Covers:** FR004

**Technical Notes:** Design a clear and intuitive UI for displaying inventory.

### Story 2.5: Expiration Alerts
As a User,
I want to Receive in-app notifications for food items nearing their expiration date (2-3 days before),
So that I can Use them before they go bad and reduce food waste.

**Acceptance Criteria:**
**Given** I have food items in my inventory with expiration dates
**When** An item's expiration date is 2-3 days away
**Then** I receive an in-app notification alerting me to the nearing expiration.

**Prerequisites:** Story 2.1 (Add Food Item to Inventory)
**Covers:** FR009

**Technical Notes:** Implement a background process or scheduled check for expiring items and a notification system.

### Story 2.6: Confirmation for Ingredient Deduction
As a User,
I want to Be prompted for confirmation before my inventory is updated after cooking a meal,
So that I can Prevent accidental deductions and maintain accurate inventory.

**Acceptance Criteria:**
**Given** I have completed a recipe that uses ingredients from my inventory
**When** The system attempts to deduct ingredients from my inventory
**Then** I am presented with a confirmation dialog listing the ingredients to be deducted.
**And** My inventory is only updated if I confirm the deduction.

**Prerequisites:** Epic 3 (Recipe Discovery & Meal Planning)
**Covers:** FR008

**Technical Notes:** Implement a modal or dialog for user confirmation.

### Story 2.7: Recipe Recommendations for Expiring Items
As a User,
I want to Receive recipe recommendations that use ingredients close to their expiration date,
So that I can Prioritize using those items and further reduce food waste.

**Acceptance Criteria:**
**Given** I have food items nearing expiration in my inventory
**When** I view recipe suggestions
**Then** Recipes utilizing these expiring ingredients are prominently displayed or prioritized.

**Prerequisites:** Story 2.5 (Expiration Alerts), Epic 3 (Recipe Discovery & Meal Planning)
**Covers:** FR010

**Technical Notes:** Integrate expiration data into the recipe recommendation algorithm.

### Epic 3: Recipe Discovery & Meal Planning
*   **Goal:** Inspire users with relevant meal ideas based on their available ingredients, contributing to the "Number of recipes cooked" KPI.
*   **Scope:** Browsing/searching recipes, flexible recipe suggestions (even with missing ingredients), grocery list generation, and fuzzy search for ingredients.
*   **Rationale:** Solves the problem of meal inspiration and efficient use of existing ingredients. This epic depends on the core inventory data from Epic 2.

### Story 3.1: Browse and Search Recipes
As a User,
I want to Browse and search for recipes from the Spoonacular API,
So that I can Find meal ideas easily.

**Acceptance Criteria:**
**Given** I am on the recipe discovery screen
**When** I enter a search term (e.g., "chicken pasta")
**Then** A list of relevant recipes from the Spoonacular API is displayed.
**Given** I am on the recipe discovery screen
**When** I browse recipes without a specific search term
**Then** A curated list of recipes is displayed.

**Prerequisites:** Epic 1 (User Authentication & Profile Management)
**Covers:** FR006

**Technical Notes:** Integrate with Spoonacular API for recipe data. Implement search functionality.

### Story 3.2: Flexible Recipe Suggestions
As a User,
I want to Get recipe suggestions even if I'm missing one or two ingredients,
So that I can Find meal ideas without being limited by my current inventory.

**Acceptance Criteria:**
**Given** I have an incomplete set of ingredients for a recipe in my inventory
**When** I view recipe suggestions
**Then** The system suggests recipes that I can make by purchasing only 1-2 missing ingredients.

**Prerequisites:** Epic 2 (Inventory Management), Story 3.1 (Browse and Search Recipes)
**Covers:** FR007

**Technical Notes:** Implement a flexible matching algorithm that considers missing ingredients.

### Story 3.3: Generate Grocery List
As a User,
I want to Generate a grocery list for a selected recipe, excluding items I already own,
So that I can Efficiently shop for missing ingredients.

**Acceptance Criteria:**
**Given** I have selected a recipe
**When** I choose to generate a grocery list
**Then** A list of ingredients required for the recipe, *not* currently in my inventory, is displayed.

**Prerequisites:** Epic 2 (Inventory Management), Story 3.1 (Browse and Search Recipes)
**Covers:** FR005

**Technical Notes:** Compare recipe ingredients with user's current inventory to create the list.

### Story 3.4: Fuzzy Search for Ingredients
As a User,
I want to Use flexible ingredient search that matches variations (e.g., "tomato" matches "canned tomatoes", "cherry tomatoes"),
So that I can Find ingredients more easily and accurately.

**Acceptance Criteria:**
**Given** I am searching for recipes or adding ingredients to my inventory
**When** I type "tomato"
**Then** The search results include "canned tomatoes", "cherry tomatoes", and other relevant variations.

**Prerequisites:** Story 2.1 (Add Food Item to Inventory), Story 3.1 (Browse and Search Recipes)
**Covers:** FR015

**Technical Notes:** Implement a fuzzy matching algorithm for ingredient names.

### Epic 4: Offline Functionality & Data Sync
*   **Goal:** Ensure a seamless and reliable user experience even in low-connectivity environments.
*   **Scope:** Offline access to inventory and recipes, and clear data synchronization indicators.
*   **Rationale:** Critical for mobile-first experience, especially when users are in places like grocery stores with poor reception.

### Story 4.1: Offline Inventory Access
As a User,
I want to Access my inventory even without an internet connection,
So that I can Check what I have while at the grocery store or in areas with poor reception.

**Acceptance Criteria:**
**Given** I have previously synced my inventory while online
**When** I open the application without an active internet connection
**Then** My last synced inventory data is displayed.

**Prerequisites:** Epic 2 (Inventory Management)
**Covers:** NFR004

**Technical Notes:** Implement an offline-first caching strategy for inventory data.

### Story 4.2: Offline Recipe Access
As a User,
I want to Access previously viewed or saved recipes even without an internet connection,
So that I can Get meal inspiration anywhere, anytime.

**Acceptance Criteria:**
**Given** I have previously viewed or saved recipes while online
**When** I open the application without an active internet connection
**Then** My previously viewed or saved recipe data is displayed.

**Prerequisites:** Epic 3 (Recipe Discovery & Meal Planning)
**Covers:** NFR004

**Technical Notes:** Implement an offline-first caching strategy for recipe data.

### Story 4.3: Data Synchronization Indicator
As a User,
I want to See when my data was last synced,
So that I can Trust the freshness of the information displayed, especially in offline scenarios.

**Acceptance Criteria:**
**Given** I am viewing my inventory or recipes
**When** The application has successfully synced data
**Then** A "Last synced: [timestamp]" indicator is displayed.
**Given** I am viewing my inventory or recipes offline
**When** The application attempts to sync but fails due to no connection
**Then** The "Last synced: [timestamp]" indicator reflects the last successful sync, and a message indicates offline mode.

**Prerequisites:** Epic 2 (Inventory Management), Epic 3 (Recipe Discovery & Meal Planning)
**Covers:** FR013

**Technical Notes:** Implement a mechanism to track and display the last successful data synchronization timestamp.

### Epic 5: User Onboarding & Guidance
*   **Goal:** Guide new users to quickly understand and utilize the application's core features, aiming for 80% of test users to succeed without a tutorial.
*   **Scope:** Clear onboarding guidance, helpful empty states.
*   **Rationale:** Essential for user adoption and retention, reducing friction for first-time users. Stories within this epic will need to consider different user personas (e.g., "busy parent," "budget-conscious student").

### Story 5.1: First-Time User Onboarding
As a New user,
I want to Be greeted with clear guidance on how to get started,
So that I can Quickly understand the app's core functionality and add my first ingredient.

**Acceptance Criteria:**
**Given** I have just registered and logged in for the first time
**When** I land on the main dashboard or inventory screen
**Then** I see a prominent, concise onboarding message or tour guiding me to add my first ingredient.

**Prerequisites:** Epic 1 (User Authentication & Profile Management), Story 2.1 (Add Food Item to Inventory)
**Covers:** FR014, NFR003

**Technical Notes:** Implement a simple onboarding flow, possibly a tooltip or a brief interactive guide.

### Story 5.2: Helpful Empty States
As a User,
I want to See helpful empty states when there is no data (e.g., empty inventory, no search results),
So that I can Understand what to do next and avoid confusion.

**Acceptance Criteria:**
**Given** My inventory is empty
**When** I view my inventory screen
**Then** I see a message like "Your pantry is empty! Add your first ingredient to get started." with a clear call to action.
**Given** I search for recipes and no results are found
**When** I view the search results screen
**Then** I see a message like "No recipes found. Try a different search term or add more ingredients to your pantry."

**Prerequisites:** Epic 2 (Inventory Management), Epic 3 (Recipe Discovery & Meal Planning)
**Covers:** FR014

**Technical Notes:** Design specific empty state UI components for various data-less scenarios.

### Epic 6: System Feedback & Usability
*   **Goal:** Provide a robust and user-friendly interface that communicates system status and handles errors gracefully.
*   **Scope:** Clear loading indicators, user-friendly error messages with retry options.
*   **Rationale:** Enhances user trust and experience by providing transparency and recovery mechanisms during operations.

### Story 6.1: Clear Loading Indicators
As a User,
I want to See clear loading indicators when the system is performing an operation,
So that I can Understand that my action is being processed and avoid unnecessary re-clicks.

**Acceptance Criteria:**
**Given** I initiate an action that requires data fetching or processing (e.g., searching recipes, saving inventory)
**When** The system is busy
**Then** A visual loading indicator (e.g., spinner, progress bar) is displayed in the relevant UI area.

**Prerequisites:** All epics involving user interaction and data processing.
**Covers:** FR016

**Technical Notes:** Implement consistent loading states across the application.

### Story 6.2: User-Friendly Error Messages with Retry
As a User,
I want to Receive user-friendly error messages with retry options when operations fail,
So that I can Understand what went wrong and attempt to resolve the issue.

**Acceptance Criteria:**
**Given** An operation fails (e.g., network error during recipe search, database save error)
**When** The error occurs
**Then** A clear, concise error message is displayed, explaining the problem in plain language.
**And** A "Retry" button or similar option is provided to re-attempt the operation.

**Prerequisites:** All epics involving data operations.
**Covers:** FR016

**Technical Notes:** Implement a global error handling mechanism and standardized error message components.