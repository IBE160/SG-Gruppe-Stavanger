# ibe160 - Product Requirements Document

**Author:** BIP
**Date:** 2025-11-18
**Version:** 1.0

---

## Executive Summary

This project will create a mobile-responsive web application designed to help users reduce food waste and discover meal inspiration. It achieves this by providing intelligent kitchen inventory management, sending alerts for expiring items, and offering personalized recipe suggestions based on the user's available ingredients and dietary preferences.

### What Makes This Special

The core magic of this platform is turning potential waste into inspiration. Users will experience a "wow" moment when they receive personalized, actionable recipe suggestions based on the ingredients they already have, especially those nearing expiration. This transforms the problem of "what do I do with this?" into a creative and satisfying cooking experience.

---

## Project Classification

**Technical Type:** Web App
**Domain:** General / Consumer
**Complexity:** Low

This project is a standard consumer-facing web application. The domain is considered low-complexity, as it does not involve specialized regulatory, scientific, or financial knowledge, allowing development to proceed with standard best practices.

### Domain Context

The 'General / Consumer' domain indicates that this application is built for a broad audience of everyday users, not for a specialized professional field. This implies:
- Users will have a wide range of technical skills, from novice to expert.
- The app must be intuitive and require no special training.
- The context is the home kitchen, and the problems are universal (food waste, meal planning).

---

## Design Philosophy

### The 'Intelligent Assistant' and The 'Instant Tool'

During our analysis, we identified two competing user needs: the long-term desire for an 'intelligent assistant' to manage their kitchen, and the immediate need for an 'instant tool' to solve tonight's dinner problem.

Our strategy is to **embrace both**.

The core of our application remains the 'Intelligent Assistant'—a robust system for inventory management that provides proactive, intelligent recommendations. This is our path to long-term user retention and deep value.

However, we will also include an 'Instant Tool' as a key feature of the MVP. An 'Instant Idea' button will always be available, allowing any user to get an immediate recipe suggestion with zero friction. This serves three purposes:
1.  It solves the user's immediate problem.
2.  It acts as a low-risk 'demo' of our powerful AI capabilities.
3.  It neutralizes the threat from simpler, single-purpose competitors.

Our hypothesis is that the 'Instant Tool' will be the gateway that encourages users to adopt the 'Intelligent Assistant'.

---

## Success Criteria

Success for this product is defined by user love and effortless engagement. We will know we have won when users seamlessly integrate the app into their daily routine.

This looks like:
- **Rapid Time-to-Value:** The majority of new users get their first meaningful recipe suggestion within 5 minutes of signing up.
- **Sustained Engagement & Trust:** A significant percentage of users are not just adding items after one week, but are also successfully **cooking recipes** suggested by the platform, indicating their trust in its inventory accuracy.
- **Reliable Inspiration:** The platform consistently delivers high-quality, relevant recipe suggestions in under 2 seconds.
- **Actionable Nudges:** A measurable percentage of expiration alerts lead to a user viewing or cooking a suggested recipe within 24 hours.
- **Future Vision - Measured Impact:** While not an MVP metric, our long-term success will be measured by the tangible impact we have, such as a user-visible dashboard showing 'food saved from waste' or 'money saved'.

### Key Assumptions & Risks
- **Assumption:** Users are willing to manually input inventory for the benefit of personalized recipes.
    - **Risk:** High friction leads to user drop-off.
    - **Prevention:** The user's first experience must deliver value in under 5 minutes. Onboarding will be deferred, and the initial focus will be on getting the user their first recipe suggestion as quickly as possible. The item entry process must be optimized for speed.

- **Assumption:** The external recipe API (Spoonacular) is reliable and performs well.
    - **Risk:** API downtime or latency directly impacts our core user experience.
    - **Prevention:** The technical plan must include a robust caching strategy and a fallback offline dataset to ensure the app remains functional even if the API fails.

- **Assumption:** Alerts about expiring food will motivate users to act.
    - **Risk:** Users experience 'notification fatigue' and ignore generic alerts.
    - **Prevention:** Notifications must be actionable and inspirational, directly linking the expiring item to a simple, immediate solution (i.e., a list of recipes).

### Business Metrics

To ensure a high-quality service that encourages user retention, we will measure success against the following technical and performance targets:

- **Service Reliability:** >=99% uptime across all services (Vercel + Supabase).
- **Performance:** Recipe search results are delivered to the user in under 1 second.
- **Quality:** The front-end maintains a Google Lighthouse score of over 90, ensuring a fast and accessible experience.
- **Accessibility:** The application is fully responsive and functional across all major modern desktop and mobile browsers.

### Metric Integrity (Anti-Gaming)

To ensure our metrics reflect true user value and not just vanity numbers, we will adhere to the following principles:

- **Meaningful Suggestions:** A 'meaningful' recipe suggestion must contain at least 3 ingredients. The success of our 'Time-to-Value' metric will be measured by the user's interaction with this first suggestion (e.g., clicking to view details), not just its appearance.
- **Deliberate Actions:** The 'I Cooked This' action will be a deliberate flow. It will confirm which ingredients are being deducted, preventing accidental confirmations and ensuring data quality. We will also monitor for 'negative signals', such as a user immediately re-adding an ingredient that was just deducted.
- **Balanced Notifications:** The success of 'Actionable Nudges' will be balanced against the notification disable rate. We will bundle alerts ('3 items are expiring soon') and prioritize them to avoid overwhelming the user.

---

## Product Scope

### MVP - Minimum Viable Product

The MVP focuses on delivering the core value proposition: reducing food waste and inspiring cooking through intelligent inventory management.

- **User Authentication:** Secure registration and login (NextAuth.js).
- **Food Inventory Management:** Users can manually add, view, edit, and delete food items with quantities and expiration dates.
- **Recipe Database Integration:** Browse, search, and view recipes from the Spoonacular API.
- **Smart Recipe Suggestions:** Generate recipe suggestions based on the user's current inventory.
- **Automatic Inventory Update:** Deduct ingredients from inventory when a recipe is marked as used.
- **Expiration Alerts & Recommendations:** In-app notifications for items nearing expiration (2-3 days prior), with direct recipe suggestions using those items.
- **'Instant Idea' Button:** A prominent button on the main screen that allows a user to type in 2-3 ingredients and get an instant AI-generated recipe, without touching their persistent inventory.

### Growth Features (Post-MVP)

Features planned for post-MVP development, focusing on enhanced personalization, discovery, and convenience:

- **User Preferences & Dietary Profiles:** Allow users to save dietary restrictions, allergies, and preferred cuisines for more tailored suggestions.
- **Recipe Tagging & Advanced Filters:** Implement robust filtering options by nutrition, difficulty, meal type, and other criteria.
- **Creative Mode – Ingredient Substitution:** Simple AI-powered suggestions for common ingredient swaps (e.g., using GPT).
- **AI-Enhanced Search:** Utilize embeddings for smarter, semantic recipe matching (e.g., "healthy chicken" finds similar dishes).
- **Smart Shopping Suggestions:** Recommend items based on cooking history, consumption patterns, and expiring ingredients.
- **Nutritional Analysis:** Display detailed nutrition facts for recipes and suggest healthier alternatives.

### Vision (Future)

The long-term vision for the platform involves highly intelligent, proactive assistance that deeply integrates with the user's lifestyle:

- **Advanced Smart Substitution:** Proactive suggestions for ingredient substitutions (e.g., "You're missing basil — try parsley instead," or suggesting alternatives based on dietary needs).
- **AI-Driven Recipe Regeneration:** The ability to regenerate recipes with specific constraints (e.g., "Make it cheaper / faster / healthier," or adapting to available kitchen equipment).
- **Proactive Meal Planning:** AI-driven meal plans that adapt to inventory, preferences, and upcoming expiration dates.
- **Tangible Impact Dashboard:** A user-facing dashboard that visually represents the user's positive impact, such as 'food saved from waste (in kg)' or 'money saved (in local currency)'.

---

## Domain-Specific Requirements

While the domain is not complex, there are several considerations unique to home cooking and inventory management that the system must handle gracefully:

- **Ingredient Normalization:** The system must account for variations in ingredient names (e.g., 'tomato' vs. 'tomatoes', singular vs. plural, common abbreviations). A normalization layer will be required to ensure accurate recipe matching.
- **Unit of Measurement:** The system must handle a variety of units (e.g., grams, ounces, cups, individual items) and allow for sensible conversions or aggregations where possible.
- **Data Quality:** As all inventory data is user-entered, the system must be resilient to human error and provide simple mechanisms for correction (e.g., easy editing and deletion of items).

---

## Innovation & Novel Patterns

While the core MVP is grounded in established patterns, the Growth and Vision features introduce innovative elements that are part of a growing industry trend towards AI-assisted cooking and sustainability.

The primary innovation lies in combining several user needs into a single, seamless loop:
1.  **Inventory Awareness:** Knowing what a user has.
2.  **Problem Awareness:** Knowing which items are nearing expiration.
3.  **Creative Solution:** Providing AI-driven creative ideas ('Creative Mode') that use those specific ingredients, going beyond standard database lookups.

This challenges the assumption that users always want to follow a rigid recipe, and instead empowers them to be creative with what they already own, which is a more sustainable and economically sound approach.

### Validation Approach

The success of these innovative features will be validated through a combination of qualitative and quantitative measures post-launch:

- **Adoption Rate:** What percentage of active users engage with the 'Creative Mode' or AI-enhanced search features?
- **User Satisfaction:** Direct user feedback and ratings on the quality and creativity of the AI-generated suggestions.
- **Goal Completion:** Do users who engage with these features report a higher rate of using up their expiring ingredients compared to those who do not?
- **Fallback Analysis:** The core value of the application is not dependent on the success of these AI features. The standard recipe suggestion mechanism serves as a robust fallback.

---

## Web App Specific Requirements

As a modern web application, the following requirements are critical to ensure a high-quality user experience.

- **Architecture:** The application will be built using the Next.js App Router, leveraging Server-Side Rendering (SSR) and Server Components for optimal performance and a modern development experience.
- **Browser Support:** The application must be fully functional and responsive on the latest versions of all major modern desktop and mobile browsers (Chrome, Firefox, Safari, Edge).
- **Performance:** The application must achieve a Google Lighthouse score of over 90 for Performance, Accessibility, Best Practices, and SEO. This ensures a fast, accessible, and discoverable product.
- **Accessibility:** The application will adhere to Web Content Accessibility Guidelines (WCAG) 2.1 AA compliance goals. This includes providing proper ARIA labels, ensuring keyboard navigation is seamless, and maintaining sufficient color contrast.
- **SEO:** While not a primary driver for a logged-in experience, the public-facing pages (landing page, recipe discovery) should be optimized for search engines to aid in discoverability.

---

## User Experience Principles

The user experience should feel effortless, encouraging, and clean. It should empower users to feel good about reducing waste and discovering new meals, never making them feel like they are doing a chore.

- **Effortless:** The path from signing up to getting the first recipe suggestion should be incredibly short. Adding items to the inventory must be a fast, low-friction process.
- **Encouraging:** The app's tone should be positive and celebratory. It should celebrate when a user saves an item from going to waste and make them feel creative and resourceful.
- **Clean & Modern:** The UI, based on Tailwind CSS and shadcn/ui, should be minimal, uncluttered, and visually pleasing, allowing the user to focus on the task at hand without distraction.

### Key Interactions

The success of the UX hinges on the seamless execution of these key user flows:

1.  **The 'Add Item' Flow:** The process of adding a new food item to the inventory must be as fast and painless as possible.
2.  **The 'What Can I Cook?' Flow:** The transition from viewing the inventory to seeing a list of relevant, appealing recipes should feel magical and instantaneous.
3.  **The 'Expiration Alert' Flow:** The journey from receiving an expiration notification to viewing a list of recipes that use that item must be direct and require minimal taps.

---

## Functional Requirements

This section breaks down the product's functionality into specific requirements, organized by capability.

### 1. User & Profile Management

- **FR1.1 - User Registration:** A new user can create an account using an email address and password.
  - **Acceptance Criteria:**
    - User provides a valid email and a password meeting minimum strength requirements.
    - A verification email is sent to the user's email address.
    - The user's account is created in the database but remains inactive until verified.
    - The user is automatically logged in after clicking the verification link.

- **FR1.2 - User Login:** A registered user can log in using their email and password.
  - **Acceptance Criteria:**
    - User enters correct credentials and is granted access.
    - User enters incorrect credentials and is shown a clear error message.
    - A 'Forgot Password' link is available.

- **FR1.3 - User Logout:** A logged-in user can log out of their account.
  - **Acceptance Criteria:**
    - The user's session is terminated.
    - The user is redirected to the public landing page.

- **FR1.4 - User Onboarding (Post-MVP):** After first login and experiencing the core app, the user is prompted to provide preferences.
  - **Acceptance Criteria:**
    - A one-time, dismissible prompt encourages the user to set dietary restrictions and favorite cuisines.
    - These preferences are saved to the user's profile and can be updated at any time.
    - This flow is intentionally deferred to prioritize 'Rapid Time-to-Value'.

### 2. Inventory Management

- **FR2.1 - Add Food Item:** A user can manually add a food item to their inventory.
  - **Acceptance Criteria:**
    - The user must provide a name, quantity, unit, and expiration date for each item.
    - The item appears in the user's inventory list immediately after being added.
    - The process is optimized for speed to meet the 'Rapid Time-to-Value' success criterion.

- **FR2.2 - View Inventory:** A user can view all items in their inventory.
  - **Acceptance Criteria:**
    - The inventory list displays the name, quantity, unit, and expiration date for each item.
    - Items are sorted by expiration date, with the soonest-expiring items at the top.

- **FR2.3 - Edit Food Item:** A user can edit the details of an existing food item.
  - **Acceptance Criteria:**
    - User can update the name, quantity, unit, and expiration date.
    - Changes are reflected in the inventory list immediately.

- **FR2.4 - Delete Food Item:** A user can delete an item from their inventory.
  - **Acceptance Criteria:**
    - A confirmation prompt is displayed before deletion.
    - The item is permanently removed from the inventory list upon confirmation.

### 3. Recipe Discovery & Interaction

- **FR3.1 - Get Recipe Suggestions:** The system suggests recipes based on the user's inventory.
  - **Acceptance Criteria:**
    - The system generates at least 3 recipe suggestions if there are sufficient ingredients.
    - Suggestions are prioritized based on ingredients that are nearing their expiration date.
    - The suggestions are 'meaningful' (contain at least 3 ingredients).

- **FR3.2 - Search Recipes:** A user can search for recipes from the Spoonacular API.
  - **Acceptance Criteria:**
    - Search results are displayed clearly with images and titles.
    - Search performance meets the <1 second target defined in the Business Metrics.

- **FR3.3 - View Recipe Details:** A user can view the full details of a recipe.
  - **Acceptance Criteria:**
    - The view includes ingredients, instructions, cooking time, and servings.

- **FR3.4 - Mark Recipe as Cooked:** A user can indicate they have cooked a recipe.
  - **Acceptance Criteria:**
    - The system prompts the user to confirm which ingredients from their inventory were used.
    - Upon confirmation, the quantities of the used ingredients are automatically deducted from the user's inventory.
    - This action is 'deliberate' to ensure data quality, as per the Metric Integrity principles.

### 4. Notifications

- **FR4.1 - Expiration Alerts:** The system notifies the user about items nearing expiration.
  - **Acceptance Criteria:**
    - An in-app notification is generated for items expiring in the next 2-3 days.
    - The notification is 'actionable', directly linking the user to a list of recipes that use the expiring item.
    - The frequency and bundling of notifications are managed to avoid 'notification fatigue', as per the Metric Integrity principles.

---

## Non-Functional Requirements

### Performance

- **API Response Time:** All API endpoints (excluding external Spoonacular calls) must respond within 200ms under normal load.
- **Recipe Search Results:** Recipe search results must be delivered to the user in under 1 second.
- **Page Load Times:** All critical user-facing pages must achieve a Google Lighthouse Performance score of over 90.
- **Scalability:** The application architecture must support scaling to 10,000 concurrent users without significant degradation in performance.

### Security

- **User Authentication:** Implement secure user registration and login using NextAuth.js, including password hashing and secure session management.
- **Data Privacy:** Adhere to GDPR-like principles, ensuring user data is protected and users have the right to delete their accounts and associated data at any time.
- **Access Control:** Implement robust access control mechanisms to ensure users can only access and modify their own data.
- **API Security:** All API endpoints must be secured against common web vulnerabilities (e.g., SQL injection, XSS) and enforce proper authentication and authorization.

### Scalability

- **Horizontal Scaling:** The architecture (Next.js on Vercel, Supabase PostgreSQL) must support horizontal scaling to accommodate a growing user base and increasing data volume.
- **Database Performance:** The database schema and queries must be optimized for performance and scalability, utilizing indexing and efficient data retrieval strategies.
- **API Rate Limits:** Implement rate limiting for external API calls (e.g., Spoonacular) to manage usage and prevent service interruptions.

### Accessibility

- **WCAG Compliance:** The application will aim for WCAG 2.1 AA compliance, ensuring it is usable by individuals with disabilities.
- **Keyboard Navigation:** All interactive elements must be navigable and operable via keyboard.
- **ARIA Labels:** Implement appropriate ARIA labels for screen readers to convey meaning and context.
- **Color Contrast:** Maintain sufficient color contrast ratios to ensure readability for users with visual impairments.

### Integration

- **Spoonacular API:** Integrate with the Spoonacular API for recipe data, ensuring efficient and reliable data retrieval.
- **Supabase:** Utilize Supabase for database management (PostgreSQL) and authentication services (NextAuth.js integration).
- **Vercel:** Deploy the frontend and API routes to Vercel for continuous deployment and hosting.



---

## Implementation Planning

This document outlines the requirements for a mobile-responsive web app designed to help users reduce food waste and discover meal inspiration through intelligent inventory management.

**Vision:** To create a seamless experience that turns potential food waste into a creative and satisfying cooking opportunity.

**Success Criteria:** Success is defined by rapid user adoption, sustained engagement (measured by both activity and trust), reliable performance, and the effectiveness of our actionable notifications.

**Scope:**
- **MVP:** Focuses on the core loop of manual inventory entry, recipe suggestions from Spoonacular, and expiration alerts.
- **Growth:** Will introduce AI-powered features for greater personalization and convenience.
- **Vision:** Aims for a proactive, intelligent kitchen assistant that provides a tangible measure of the user's positive impact.

**Requirements:** We have defined 12 functional requirements across 4 capabilities (User Management, Inventory, Recipe Discovery, Notifications) and 5 categories of non-functional requirements (Performance, Security, Scalability, Accessibility, Integration).

**Next Step:** The next step is to break down these requirements into implementable epics and stories.

---

## References

- Product Brief: proposal.md

---

## Next Steps

1. **Epic & Story Breakdown** - Run: `workflow epics-stories`
2. **UX Design** (if UI) - Run: `workflow ux-design`
3. **Architecture** - Run: `workflow create-architecture`

---

_This PRD captures the essence of ibe160 - turning potential waste into inspiration_

_Created through collaborative discovery between BIP and AI facilitator._
