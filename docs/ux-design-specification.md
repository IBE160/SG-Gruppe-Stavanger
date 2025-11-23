# ibe160 UX Design Specification

_Created on lørdag 22. november 2025 by BIP_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

Project: A mobile-responsive web application called "Smart Food & Recipe Platform" designed to help users reduce food waste, manage kitchen inventory intelligently, and discover personalized meal inspiration. It aims for a fun, inspiring, and effortless user experience.

Target Users: Primarily busy individuals and families focused on reducing waste and efficient meal planning. Secondary targets include budget-conscious students/professionals and environmentally conscious consumers.

---

## 1. Design System Foundation

### 1.1 Design System Choice

**Design System:** **shadcn/ui** with Radix UI Primitives.

**Rationale:** The "Farmhouse Kitchen" theme requires a completely custom visual identity. A traditional, opinionated design system like Material UI would conflict with our "naive" and tactile aesthetic. `shadcn/ui` provides a library of unstyled, accessible, and composable components built on Radix UI. This approach gives us the structural foundation and accessibility of a best-in-class component library without forcing any specific visual style, allowing us to fully implement our unique design vision.

---

## 2. Core User Experience

### 2.1 Defining Experience

The core user experience is defined by a highly immersive and tactile interaction with a "Farmhouse Kitchen" environment. Users will primarily engage through clicking, dragging, and visual manipulation rather than extensive form filling. The application intelligently adapts its interface and presented information to the user's current "mode" (e.g., "Unloading Groceries," "What's for Dinner?"), embodying context-aware minimalism and providing intuitive guidance towards the next logical step. The main Pantry View, leveraging "The Open Shelves" approach, encapsulates this tactile and visually rich interaction.

### 2.2 Novel UX Patterns

The application introduces several novel UX patterns designed to enhance user engagement and simplify complex tasks:

*   **Contextual Modes:** The UI dynamically transforms based on the user's anticipated needs, presenting tailored experiences such as "Unloading Groceries" (quick-add interface), "What's for Dinner?" (recipe inspiration), and "Sunday Planning" (weekly overview).
*   **Tactile Inventory Management:** Replacing traditional form-based data entry with direct manipulation. Users interact with charming, "naive" style icons of ingredients, dragging and dropping them into a visual "Open Shelves" pantry.
*   **"Kitchen Diary" Profile Page:** The user profile is reimagined as a celebratory scrapbook or corkboard, showcasing "Food Memories," "Favorite Recipes," and "Achievements" (e.g., "No-Waste Week" badges), fostering emotional attachment rather than functional configuration.
*   **Detailed Recipe View:** A comprehensive view displaying the full recipe, including all ingredients, detailed instructions, and nutritional information. This view serves as the primary entry point after selecting a recipe, allowing users to review the entire recipe at once. From here, users can optionally activate a "Cooking Mode" for a simplified, step-by-step experience.

---

## 3. Visual Foundation

### 3.1 Color System

**Theme:** The "Farmhouse Kitchen"

A hybrid theme that combines the grounded, earthy feel of "Heirloom Garden" with the comforting, nostalgic charm of "Blue Plate Special." The style is a unique blend of folk-art botanicals and the clean, simple lines of a 1950s children's book, with a strong focus on tactile details and textures.

**Color Palette:**
*   **Primary Backgrounds:** Light Beige (`#F2E8CF`)
*   **Pattern & Accent Color:** Cornflower Blue (`#93C5FD`)
*   **Highlight & Call-to-Action:** Terracotta (`#E07A5F`)
*   **Supporting Color:** Sage Green (`#B2AC88`)
*   **Text & Dark Elements:** Charcoal (`#3D405B`)

**Typography:**
*   **Headings:** "Chewy" - A friendly, rounded font with a naive, charming character.
*   **Body & UI Text:** "Nunito" - A highly readable but soft, rounded sans-serif that complements the heading font.

**Spacing & Layout:**
*   A generous 8-pixel grid system is used to ensure a calm, uncluttered layout, giving the detailed illustrations and UI elements ample room to breathe.

**Interactive Visualizations:**

- Color Theme Explorer: [ux-color-themes.html](./ux-color-themes.html)

---

## 4. Design Direction

### 4.1 Chosen Design Approach

**Chosen Direction:** Direction A: "The Open Shelves"

This direction creates a highly immersive and tactile experience for the main Pantry View, directly supporting the core principles of playful interaction, context-aware minimalism, and a cozy aesthetic.

**Key Characteristics:**
*   **The View:** Users look directly into a beautifully illustrated, rustic pantry with open wooden shelves, filled with charming, "naive" style icons representing their ingredients. This provides a comprehensive, at-a-glance overview of the inventory.
*   **Interaction:** Inventory management becomes a direct manipulation experience. Users drag and drop new ingredient icons onto shelves and drag them off into a "recipe basket" or "waste bin" icon when used.
*   **Navigation:** "Modes" and key functionalities are integrated organically into the kitchen environment. For instance, clicking a vintage recipe box on the counter leads to recipe suggestions, a grocery bag icon triggers the "add items" flow, and a calendar hanging on the wall opens meal planning.
*   **Rationale:** This approach fosters a strong sense of ownership and engagement, turning routine tasks into a delightful and intuitive game that feels natural and familiar within the "Farmhouse Kitchen" theme.

**Interactive Mockups:**

- Design Direction Showcase: [ux-design-directions.html](./ux-design-directions.html)

---

## 5. User Journey Flows

### 5.1 Critical User Paths

Conceptual user journeys are designed to be seamless, intuitive, and engaging, guided by the principles of context-aware minimalism and playful interaction.

**1. Landing Page / Onboarding:**
*   **Goal:** Invite new users into the "Farmhouse Kitchen" and encourage initial engagement.
*   **Flow:** Full-screen immersive illustration of the kitchen with a single, enticing call to action: "Open Your Pantry." Clicking this initiates a streamlined onboarding or direct access to the Pantry View.

**2. Inventory Management (Pantry View - "The Open Shelves"):**
*   **Goal:** Allow users to easily view, add, and manage their food inventory in a tactile, visual manner.
*   **Flow:** Users are presented with "The Open Shelves" view of their pantry.
    *   **Adding Items:** Users drag illustrated ingredient icons onto shelves (or click a "grocery bag" icon for suggestions/search).
    *   **Using Items:** Users drag items off shelves into a "recipe basket" (for cooking) or "waste bin" (for disposal tracking).
    *   **Navigation:** Intuitive clicks on kitchen objects (e.g., recipe box, calendar) lead to relevant "modes" or functionalities.

**3. Recipe Discovery & Cooking (Recipe Page):**
*   **Goal:** Provide personalized recipe inspiration and guide users through cooking with minimal friction.
*   **Flow:**
    *   **Discovery:** From the Pantry View, clicking a "recipe box" opens a curated selection of recipes based on available ingredients or expiring items, presented as charming recipe cards.
    *   **Viewing Recipe:** Clicking a recipe card shows a "Detailed Recipe View" displaying all ingredients (with available ingredients checked) and full instructions. Missing ingredients are clickable to add to a shopping list.
    *   **Cooking Mode (Optional):** From the Detailed Recipe View, users can optionally activate a simplified, full-screen "Cooking Mode" with large text and a "Next Step" button for hands-free progression through instructions during cooking.

**4. Personal Progress & Reflection (Profile Page - "Kitchen Diary"):**
*   **Goal:** Offer users a rewarding space to view their achievements and personal culinary journey.
*   **Flow:** Accessed via a subtle icon (e.g., a "kitchen diary" on a shelf), this page presents a visual scrapbook of "Favorite Recipes," "Food Memories" (attached to ingredients), and gamified "Achievements" (e.g., badges for waste reduction), making it a personal and inspiring space.

---

## 6. Component Library

### 6.1 Component Strategy

The component strategy is to use the unstyled `shadcn/ui` primitives for foundational elements (dialogs, inputs, buttons, etc.) and build a custom library of specialized components to bring the "Farmhouse Kitchen" experience to life.

**Foundational Components (from shadcn/ui):**
*   Button (styled to have a "bakelite" feel)
*   Dialog / Drawer (for quick-add flows)
*   Input (for the rare cases of text entry)
*   Tooltip
*   Tabs
*   Checkbox (styled as hand-drawn)

**Custom High-Level Components:**
*   **`PantryShelf`:** The core component for the "Open Shelves" view, handling the layout and drag-and-drop functionality of ingredients.
*   **`IngredientIcon`:** The visual, interactive representation of a food item, with states for normal, expiring, and selected.
*   **`KitchenObjectNav`:** The context-aware navigation elements that appear as objects in the kitchen (e.g., Recipe Box, Grocery Bag, Wall Calendar).
*   **`RecipeCard`:** The vintage-styled component for displaying recipes, featuring an interactive ingredient checklist.
*   **`CookingMode`:** The full-screen, tap-to-advance view for recipe instructions, designed for hands-free use.
*   **`ScrapbookView`:** The component for the "Kitchen Diary" profile page, designed to look like a corkboard with pinned "memories" and "achievements."

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules

To ensure a cohesive and predictable user experience, the following patterns will be applied consistently across the application.

**Button Hierarchy:**
*   **Primary Action:** A tactile, "bakelite" style button using the `Terracotta` color. Reserved for the single, most important action on a screen (e.g., "Open Your Pantry," "Start Cooking").
*   **Secondary Action:** A softer button style using the `Cornflower Blue` pattern. Used for important, but not primary, actions (e.g., "Add to Shopping List").
*   **Tertiary Action:** A simple text link in `Charcoal`. Used for less critical actions (e.g., "View Details").
*   **Destructive Action:** A muted red text link with an undo option, avoiding alarming visuals.

**Feedback Patterns:**
*   **Success:** Feedback is gentle and integrated. A successful action (e.g., adding an item) is confirmed with a brief, satisfying sparkle animation on the item itself.
*   **Error:** Errors are communicated softly. A form error might trigger a subtle shake animation, with a helpful message appearing in a soft red color.
*   **Loading:** Loading states are represented by a charming, non-intrusive animation, such as a pot gently simmering on a stove, relevant to the kitchen theme.

**Form Patterns:**
*   In the rare cases where text input is required, forms will use floating labels that are initially inside the input field and move above it on focus, maintaining a clean look. Validation occurs on submit to prevent user distraction.

**Modal Patterns:**
*   Modals will be used sparingly to avoid disrupting the immersive experience. When necessary, they will appear as a themed element, such as a page torn from a rustic notepad or a small wooden sign.

**Empty State Patterns:**
*   Empty states are an opportunity for delight. An empty pantry will feature a whimsical illustration (e.g., a mouse peeking from a corner) with a friendly call to action ("Time to stock the shelves!"). An empty recipe search will show a creative suggestion to "Try searching for eggs!".

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

### 8.1 Responsive Strategy

The "Farmhouse Kitchen" experience will adapt gracefully across devices, prioritizing usability while retaining its charm.

*   **Desktop (Large Screens):** The full, immersive "Farmhouse Kitchen" diorama is displayed, with all interactive kitchen objects (pantry, recipe box, calendar) visible. The "Open Shelves" pantry can be seen in its entirety.
*   **Tablet (Medium Screens):** The view remains immersive but simplifies. Non-essential decorative elements may be reduced, and navigation objects might be arranged more vertically to accommodate a narrower viewport.
*   **Mobile (Small Screens):** To ensure usability, the experience shifts from an immersive diorama to a "focused" view.
    *   The default view might be a single, scrollable pantry shelf or a focused list of expiring items.
    *   The main kitchen view is accessible, but not the primary interface.
    *   Navigation collapses into a simple, bottom-tab-bar with themed icons (e.g., a pantry icon, a recipe book icon, a shopping list icon), providing quick access to the main "modes."

### 8.2 Accessibility Strategy

The application will adhere to **WCAG 2.1 Level AA** standards to ensure it is usable by people with a wide range of disabilities.

**Key Requirements:**
*   **Color Contrast:** All text and critical UI elements will meet a minimum AA contrast ratio. The chosen palette (`Charcoal` on `Light Beige`) provides a strong foundation for this.
*   **Keyboard Navigation:** All functionality will be accessible via keyboard. This includes a keyboard-alternative for the drag-and-drop inventory management (e.g., using arrow keys to select and the spacebar to "pick up" and "place" items).
*   **Screen Reader Support (ARIA):** All visual elements will have descriptive `aria-label`s. For example, an ingredient icon will be announced as "Apple, expires in 3 days," and interactive objects like the recipe box will be announced as "Recipe Box, button."
*   **Focus Indicators:** A clear, visible focus state (e.g., a thick, friendly `Cornflower Blue` ring) will be present on all interactive elements.
*   **Reduced Motion:** All non-essential animations (e.g., swaying curtains, simmering pot) will be disabled if the user has a "prefers reduced motion" setting enabled in their system preferences.

---

## 9. Implementation Guidance

### 9.1 Completion Summary

The UX Design Specification is now complete. Through a collaborative, design-thinking-focused process, we have defined a comprehensive and unique user experience for the "Smart Food & Recipe Platform."

**What we created together:**

*   **A Unique Vision:** The "Farmhouse Kitchen" theme, built on a "naive," detailed, and tactile design philosophy.
*   **A Clear Design Direction:** The "Open Shelves" concept was chosen for the core Pantry View, emphasizing direct manipulation and visual delight.
*   **A Solid Foundation:** We've defined the color palette, typography, component strategy, and UX patterns to ensure a cohesive and consistent experience.
*   **A Human-Centered Plan:** We've outlined intuitive user journeys and a responsive, accessible strategy to ensure the app is a joy for all users, on all devices.

**Your Final Deliverables:**
*   **UX Design Specification:** `ux-design-specification.md` (This document)
*   **Conceptual Color Themes:** `ux-color-themes.html`
*   **Conceptual Design Directions:** `ux-design-directions.html`

**What Happens Next:**
This specification provides a clear and actionable foundation for the next phases of development.
*   **High-Fidelity Mockups:** A UI designer can now use this specification to create high-fidelity mockups in a tool like Figma.
*   **Development:** The development team can begin building the custom components and implementing the user journeys with clear guidance on behavior, styling, and interaction.
*   **Validation:** The final design and implementation should be validated against the `checklist.md` for this workflow to ensure all UX goals have been met.

---

## Appendix

### Related Documents

- Product Requirements: `PRD.md`
- Product Brief: `product-brief.md`
- Brainstorming: `fase-1-analysis/brainstorming-session-results-onsdag 5. november 2025.md`

### Core Interactive Deliverables

This UX Design Specification was created through visual collaboration:

- **Color Theme Visualizer**: C:\Users\tinar\OneDrive\Skrivebord\IBE160 Programmering med KI\SG-Gruppe-Stavanger\docs/ux-color-themes.html
  - Interactive HTML showing all color theme options explored
  - Live UI component examples in each theme
  - Side-by-side comparison and semantic color usage

- **Design Direction Mockups**: C:\Users\tinar\OneDrive\Skrivebord\IBE160 Programmering med KI\SG-Gruppe-Stavanger\docs/ux-design-directions.html
  - Interactive HTML with 6-8 complete design approaches
  - Full-screen mockups of key screens
  - Design philosophy and rationale for each direction

### Optional Enhancement Deliverables

_This section will be populated if additional UX artifacts are generated through follow-up workflows._

<!-- Additional deliverables added here by other workflows -->

### Next Steps & Follow-Up Workflows

This UX Design Specification can serve as input to:

- **Wireframe Generation Workflow** - Create detailed wireframes from user flows
- **Figma Design Workflow** - Generate Figma files via MCP integration
- **Interactive Prototype Workflow** - Build clickable HTML prototypes
- **Component Showcase Workflow** - Create interactive component library
- **AI Frontend Prompt Workflow** - Generate prompts for v0, Lovable, Bolt, etc.
- **Solution Architecture Workflow** - Define technical architecture with UX context

### Version History

| Date     | Version | Changes                         | Author | 
| -------- | ------- | ------------------------------- | ------ | 
| lørdag 22. november 2025 | 1.0     | Initial UX Design Specification | BIP | 

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._
