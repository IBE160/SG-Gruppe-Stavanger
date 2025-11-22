# ibe160 - Epic Breakdown

**Author:**  BIP
**Date:** mandag 10. november 2025
**Project Level:** 3
**Target Scale:** 

---

## Overview

This document provides the complete epic and story breakdown for ibe160, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

The project is broken down into the following epics:
1.  **Epic: User Authentication & Profile Management**
2.  **Epic: Food Inventory Management**
3.  **Epic: Recipe Discovery**
4.  **Epic: Smart Recipe Suggestions**
5.  **Epic: Cooking & Inventory Update**
6.  **Epic: Expiration Alerts & Waste Reduction**
7.  **Epic: Shopping List Management**

---

## Epic 1: User Authentication & Profile Management

**Goal:** To enable secure access and a personalized user experience.

### Story 1.1: User Registration

**As a** new user,
**I want** to create an account using my email and a password,
**So that** I can securely access the application and save my data. (FR-001)

**Acceptance Criteria:**

**Given** I am on the registration page
**When** I enter a valid email and a secure password
**Then** my account is created, and I am automatically logged in.

**Prerequisites:** None
**Technical Notes:** Use NextAuth.js for authentication.

### Story 1.2: User Login

**As a** registered user,
**I want** to log in with my email and password,
**So that** I can access my personal inventory and settings.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I enter my correct email and password
**Then** I am logged in and redirected to my dashboard.

**Prerequisites:** Story 1.1
**Technical Notes:** Use NextAuth.js for authentication.

### Story 1.3: User Logout

**As a** logged-in user,
**I want** to log out of the application,
**So that** I can securely end my session.

**Acceptance Criteria:**

**Given** I am logged in
**When** I click the logout button
**Then** I am logged out and redirected to the homepage.

**Prerequisites:** Story 1.2
**Technical Notes:** Use NextAuth.js for authentication.

### Story 1.4: Invalid Registration (Unhappy Path)

**As a** new user,
**I want** to see clear error messages if I provide invalid information during registration,
**So that** I can correct my mistakes and successfully register.

**Acceptance Criteria:**

**Given** I am on the registration page
**When** I try to register with an already existing email
**Then** I see an error message "Email already in use".
**And when** I try to register with an invalid email format
**Then** I see an error message "Invalid email format".

**Prerequisites:** None
**Technical Notes:** Implement form validation.

### Story 1.5: Invalid Login (Unhappy Path)

**As a** registered user,
**I want** to see a clear error message if I provide incorrect login credentials,
**So that** I can try again.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I enter an incorrect email or password
**Then** I see an error message "Invalid email or password".

**Prerequisites:** Story 1.1
**Technical Notes:** Implement form validation.

---

## Epic 2: Food Inventory Management

**Goal:** To allow users to track their food items, reducing waste and enabling smart suggestions.

### Story 2.1: Add Food Item

**As a** logged-in user,
**I want** to add a food item to my inventory with a name, quantity, unit, and expiration date,
**So that** I can keep track of my food.

**Acceptance Criteria:**

**Given** I am on my inventory page
**When** I fill out the "add item" form and submit it
**Then** the new item appears in my inventory list.

**Prerequisites:** Story 1.2
**Technical Notes:** Use Prisma schema for FoodItem model.

### Story 2.2: View, Edit, and Delete Food Items

**As a** logged-in user,
**I want** to view a list of all my food items and be able to edit or delete them,
**So that** I can manage my inventory.

**Acceptance Criteria:**

**Given** I am on my inventory page
**When** I view my list of items
**Then** I can select an item to open an edit form or a delete confirmation.
**And when** I save an edit, the item is updated.
**And when** I confirm a deletion, the item is removed. The deletion process should be as frictionless as possible, with an easy "undo" option.

**Prerequisites:** Story 2.1
**Technical Notes:** Implement CRUD operations for FoodItem model.

### Story 2.3: Invalid Food Item Data (Unhappy Path)

**As a** logged-in user,
**I want** to see clear error messages if I provide invalid information when adding or editing a food item,
**So that** I can correct my mistakes.

**Acceptance Criteria:**

**Given** I am on the "add item" or "edit item" form
**When** I try to submit the form without a name
**Then** I see an error message "Item name is required".
**And when** I try to submit the form with an invalid date format
**Then** I see an error message "Invalid date format".

**Prerequisites:** Story 2.1
**Technical Notes:** Implement form validation.

---

## Epic 3: Recipe Discovery

**Goal:** To provide meal inspiration and access to a wide range of recipes.

### Story 3.1: Browse & Search Recipes

**As a** user,
**I want** to browse and search for recipes,
**So that** I can get inspiration for what to cook.

**Acceptance Criteria:**

**Given** I am on the recipe discovery page
**When** the page loads, I see a list of recipes.
**And when** I enter a keyword in the search bar and submit, I see a list of recipes that match the keyword.

**Prerequisites:** None
**Technical Notes:** Integrate with Spoonacular API.

### Story 3.2: View Recipe Details

**As a** user,
**I want** to view the details of a recipe,
**So that** I can decide if I want to cook it.

**Acceptance Criteria:**

**Given** I am viewing a list of recipes
**When** I click on a recipe
**Then** I am taken to a page with the recipe's full details.

**Prerequisites:** Story 3.1
**Technical Notes:** Display recipe information from Spoonacular API.

### Story 3.3: API Error Handling (Unhappy Path)

**As a** user,
**I want** to see a friendly error message if the recipe service is unavailable,
**So that** I know it's a temporary issue.

**Acceptance Criteria:**

**Given** I am on the recipe discovery page
**When** the application fails to fetch recipes from the Spoonacular API
**Then** I see a message like "Sorry, we couldn't load recipes right now. Please try again later."

**Prerequisites:** Story 3.1
**Technical Notes:** Implement error handling for API calls.

---

## Epic 4: Smart Recipe Suggestions

**Goal:** To directly address meal inspiration and efficient use of available ingredients.

### Story 4.1: Get Suggestions Based on Inventory

**As a** logged-in user,
**I want** to see recipe suggestions based on the ingredients I have in my inventory,
**So that** I can easily find meals to cook with what I have.

**Acceptance Criteria:**

**Given** I am logged in and have items in my inventory
**When** I navigate to the "What can I cook?" page
**Then** I see a list of recipes that I can make with my current ingredients.

**Prerequisites:** Story 2.1, Story 3.1
**Technical Notes:** Implement logic to match inventory items with recipe ingredients from Spoonacular API.

### Story 4.2: Basic Creative Mode

**As a** user,
**I want** to enter 2-3 ingredients and get recipe suggestions,
**So that** I can get inspiration for specific ingredients.

**Acceptance Criteria:**

**Given** I am on the "Creative Mode" page
**When** I enter 2-3 ingredients and submit
**Then** I see a list of recipes that use those ingredients.

**Prerequisites:** Story 3.1
**Technical Notes:** Integrate with Spoonacular API's recipe search by ingredients.

---

## Epic 5: Cooking & Inventory Update

**Goal:** To ensure inventory accuracy and reinforce the waste reduction goal.

### Story 5.1: Mark Recipe as Cooked

**As a** logged-in user,
**I want** to mark a recipe as "cooked",
**So that** the ingredients are deducted from my inventory.

**Acceptance Criteria:**

**Given** I am viewing a recipe's details
**When** I click the "I cooked this" button
**Then** I see a confirmation message, and the ingredients are removed from my inventory.

**Prerequisites:** Story 2.1, Story 3.2
**Technical Notes:** Implement logic to update inventory based on recipe ingredients.

### Story 5.2: Handle Missing Ingredients

**As a** logged-in user,
**I want** to be notified if I'm missing ingredients for a recipe,
**So that** I can add them to my shopping list.

**Acceptance Criteria:**

**Given** I am viewing a recipe's details
**When** I don't have all the ingredients in my inventory
**Then** the missing ingredients are highlighted, and I see an option to add them to my shopping list (if shopping list functionality is available).

**Prerequisites:** Story 2.1, Story 3.2
**Technical Notes:** Implement logic to compare recipe ingredients with inventory. The "add to shopping list" action should gracefully handle the absence of Epic 7's full shopping list management if Epic 7 is not yet implemented.

---

## Epic 6: Expiration Alerts & Waste Reduction

**Goal:** To proactively help users prevent food waste.

### Story 6.1: Receive Expiration Alerts

**As a** logged-in user,
**I want** to see in-app notifications for items that are expiring soon,
**So that** I can use them before they go bad.

**Acceptance Criteria:**

**Given** I am logged in and have items expiring within 2-3 days
**When** I visit my dashboard
**Then** I see a notification badge or a section highlighting the expiring items.

**Prerequisites:** Story 2.1
**Technical Notes:** Implement a system to check for expiring items.

### Story 6.2: Get Suggestions for Expiring Items

**As a** logged-in user,
**I want** to get recipe suggestions for my expiring items,
**So that** I can easily find ways to use them.

**Acceptance Criteria:**

**Given** I am viewing my expiring items
**When** I select an expiring item
**Then** I see a list of recipes that use that ingredient.

**Prerequisites:** Story 6.1, Story 4.1
**Technical Notes:** Integrate expiration alerts with the recipe suggestion feature.

---

## Epic 7: Shopping List Management

**Goal:** To streamline grocery shopping and help users plan meals more effectively.

### Story 7.1: Create and Manage Shopping List

**As a** logged-in user,
**I want** to add, edit, and delete items from a shopping list,
**So that** I can keep track of what I need to buy.

**Acceptance Criteria:**

**Given** I am on the shopping list page
**When** I add an item, it appears on the list.
**And when** I edit an item, it is updated on the list.
**And when** I delete an item, it is removed from the list.

**Prerequisites:** Story 1.2
**Technical Notes:** Use Prisma schema for ShoppingList and ShoppingListItem models.

### Story 7.2: Add Missing Ingredients to Shopping List

**As a** logged-in user,
**I want** to add missing ingredients from a recipe to my shopping list with one click,
**So that** I can easily plan my shopping.

**Acceptance Criteria:**

**Given** I am viewing a recipe for which I am missing ingredients
**When** I click the "Add missing to shopping list" button
**Then** all missing ingredients are added to my shopping list.

**Prerequisites:** Story 5.2, Story 7.1
**Technical Notes:** Implement logic to add multiple items to the shopping list at once.

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._
