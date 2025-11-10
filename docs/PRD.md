# ibe160 - Product Requirements Document

**Author:**  BIP
**Date:** mandag 10. november 2025
**Version:** 1.0

---

## Executive Summary

This document outlines the product brief for the Smart Food & Recipe Platform, a mobile-responsive web application designed to help users reduce food waste and discover meal inspiration. The platform will provide intelligent kitchen inventory management, expiration alerts, and personalized recipe suggestions based on available ingredients.

### What Makes This Special

The "magic" of this product is in empowering users to feel in control of their food consumption. It's about the satisfaction of not having to waste food, saving money, understanding food consumption through analytics, and enjoying a more varied diet. The product's innovative edge comes from its strong environmental focus, particularly the expanded concept of upcycling food and related household items, presented through a playful and inspiring user experience.

---

## Project Classification

**Technical Type:** Mobile-responsive web application
**Domain:** Food, sustainability, household management
**Complexity:** General

This project is a mobile-responsive web application in the food, sustainability, and household management domain. It is considered to have a general complexity level.

---

## Success Criteria

Our primary success is when a user, prompted by an expiration alert, cooks a suggested recipe using ingredients they already have, and feels a sense of accomplishment from saving money and preventing waste.

### Business Metrics

*   **Control over expenses:** Users can see an estimated amount of money saved each month by using their ingredients, reinforcing the value of the app.
*   **Dietary Variety:** Track the number of *different* recipes a user cooks each month to measure if they are eating more varied meals.
*   **User Engagement:** High engagement with inventory management and recipe suggestion features.
*   **Retention:** High user retention rate, indicating that users find long-term value in the platform.

---

## Product Scope

### MVP - Minimum Viable Product

*   **User Authentication:** Secure registration and login using NextAuth.js (email/password).
*   **Food Inventory Management:** Users manually add food items with quantities and expiration dates. The experience of adding items must be particularly smooth and delightful.
*   **Inventory Overview:** Users can view, edit, and delete items from their pantry or fridge.
*   **Recipe Database (Spoonacular API):** Browse, search, and view recipes from Spoonacular’s API.
*   **Smart Recipe Suggestions:** Suggest recipes based on the user’s current inventory.
*   **Automatic Inventory Update:** When a recipe is used, ingredients are automatically deducted.
*   **Expiration Alerts:** In-app notifications for food nearing expiration (2–3 days before).
*   **Shopping List Management:** Users can add, view, and delete items from a shopping list. Items can be added manually or from missing recipe ingredients.

### Growth Features (Post-MVP)

*   **User Preferences & Dietary Profiles**
*   **Recipe Tagging & Advanced Filters**
*   **AI-powered Ingredient Substitution**
*   **AI-Enhanced Search**
*   **Smart Shopping Suggestions**
*   **Nutritional Analysis**
*   **Automated Inventory Input** (e.g., picture of receipt/food items)
*   **Dashboard Summaries with Savings Metrics**
*   **Eco-Facts & Food Stories**
*   **Upcycle Your Scraps** (including general household creativity)

### Vision (Future)

*   **Fully AI-powered meal planning**
*   **Automated grocery ordering**
*   **Integration with smart kitchen appliances** (e.g., smart fridges)
*   **Partnerships with grocery delivery services**
*   **A thriving community** for sharing recipes and tips
*   **Expansion into international markets**
*   **AI-driven shopping list suggestions** based on purchase history and preferences.

---

## Innovation & Novel Patterns

The product's innovation lies in its holistic approach to reducing waste. It's not just about using up food; it's about changing the user's mindset. By reminding users of what they have and inspiring them to use it, we combat the "out of sight, out of mind" problem. The "Upcycle Your Scraps" feature, expanded to include general household creativity (e.g., using coffee grounds for a body scrub, or toilet paper rolls for crafts), transforms moments of potential waste into opportunities for fun and resourcefulness.

### Validation Approach

The success of these innovative features will be validated by user engagement metrics (e.g., how many users click on "Upcycle It!" prompts) and qualitative feedback from user interviews and surveys.

---

## Mobile-responsive web application Specific Requirements

The technical foundation will be a modern stack designed for robustness and a high-quality user experience:
*   **Frontend:** Next.js 14 with Tailwind CSS for a modern, responsive, and aesthetically pleasing UI.
*   **Backend:** Next.js API Routes with a Supabase (PostgreSQL) database and Prisma ORM for a reliable and scalable backend.
*   **Authentication:** NextAuth.js for secure user management.
*   **Recipe Source:** Spoonacular API for a vast and varied recipe database.

---

## User Experience Principles

The application should feel **playful and inspiring**. The user interface should be clean, modern, and intuitive, requiring no tutorial.

### Key Interactions

The process of adding food items to the inventory must be particularly **smooth and delightful**, encouraging users to keep their inventory up-to-date.

---

## Functional Requirements

The following are the core functional requirements for the Minimum Viable Product (MVP):

*   **User Authentication:** Secure registration and login for users.
*   **Food Inventory Management:**
    *   Users can manually add food items with quantities and expiration dates.
    *   Users can view, edit, and delete items from their pantry or fridge.
*   **Recipe Discovery & Suggestions:**
    *   Users can browse, search, and view recipes from the Spoonacular API.
    *   The system suggests recipes based on the user’s current inventory.
    *   The system provides recipe recommendations specifically for items nearing expiration.
    *   Users can manually enter 2-3 ingredients to get recipe suggestions (Basic Creative Mode).
*   **Inventory Update:**
    *   Ingredients are automatically deducted from the inventory when a recipe is used.
*   **Expiration Alerts:**
    *   Users receive in-app notifications for food items nearing expiration (2–3 days before).
*   **Shopping List Management:**
    *   Users can add, view, and delete items from a shopping list.
    *   Items can be added manually or from missing recipe ingredients.

These functional requirements are further detailed through the following key user flows:

1.  **User Comes Home from Grocery Shopping:** Adding new food items to inventory.
2.  **User Is Hungry and Wants to Know What to Cook for Dinner:** Discovering recipes based on available ingredients and updating inventory after cooking.
3.  **User Is at the Store and Wants to Check What They Need to Buy:** Viewing pantry contents.
4.  **User Is at the Store and Wants Dinner Inspiration:** Browsing recipes.
5.  **User Is at the Store and Logged In, Looking for Dinner Ideas:** Discovering recipes and adding missing ingredients to a shopping list.
6.  **User Wants to Create a Profile for Preferences and Tips:** Managing user preferences.
7.  **User Wants to View “My Liked Recipes” in Profile:** Accessing and managing liked recipes.
8.  **User Wants to View and Use Soon-to-Expire Food Items:** Receiving expiration alerts and getting recipe suggestions for expiring items.
9.  **User Wants to Report a Bug or Suggest an Improvement:** Providing feedback.
10. **User Wants to Generate a Creative Recipe (AI Mode):** Using the basic creative mode for recipe suggestions.
11. **User Wants to Delete Account and Data:** Account management.
12. **User Wants to View Monthly Dashboard Summary:** Accessing usage summaries.
13. **Yearly Summary:** Accessing yearly usage summaries.
14. **User wants to view shopping list:** Managing the shopping list.
15. **User Interacts with Eco-Facts & Food Stories:** Engaging with environmental content.
16. **User Upcycles a Wasted Food Item:** Receiving upcycling tips.

---

## Non-Functional Requirements

### Performance

The app must feel fast and responsive, with no freezing or crashing. Specific goals include recipe search loading within 2 seconds and a high Lighthouse score (>90).

### Security

User data (email, password, inventory) must be secure, using standard practices like NextAuth.js.

### Scalability

The application should be highly available (e.g., ≥99% uptime) to ensure it is reliable for users.

### Accessibility

The app should be usable by people with disabilities, aiming for WCAG 2.1 AA compliance.

### Aesthetics

The UI must be visually appealing, modern, and "look good", contributing to the playful and inspiring feel.

---

## Implementation Planning

### Epic Breakdown Required

The requirements will be broken down into the following epics for implementation:
*   **Epic: User Authentication & Profile Management**
*   **Epic: Food Inventory Management**
*   **Epic: Recipe Discovery**
*   **Epic: Smart Recipe Suggestions**
*   **Epic: Cooking & Inventory Update**
*   **Epic: Expiration Alerts & Waste Reduction**
*   **Epic: Shopping List Management**

**Next Step:** Run `workflow create-epics-and-stories` to create the implementation breakdown.

---

## References

- Product Brief: C:\Users\tinar\OneDrive\Skrivebord\IBE160 Programmering med KI\SG-Gruppe-Stavanger\docs\product-brief.md
- proposal.md

---

## Next Steps

1. **Epic & Story Breakdown** - Run: `workflow create-epics-and-stories`
2. **UX Design** (if UI) - Run: `workflow ux-design`
3. **Architecture** - Run: `workflow create-architecture`

---

_This PRD captures the essence of ibe160 - The "magic" of this product is in empowering users to feel in control of their food consumption._

_Created through collaborative discovery between  BIP and AI facilitator._
