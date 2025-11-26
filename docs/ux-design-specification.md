# ibe160 UX Design Specification

_Created on 2025-11-24 by BIP_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

**Project:** You're building "ibe160," a mobile-responsive web app to help users reduce food waste. It will feature smart kitchen inventory management, expiration alerts, and personalized recipe suggestions powered by the Spoonacular API. A key feature is the "Instant Idea" button for quick, frictionless recipe discovery.

**Target Users:** The app is for busy individuals and families who want to waste less and find meal inspiration easily.

---

## 1. Design System Foundation

### 1.1 Design System Choice

**System:** shadcn/ui
**Version:** Latest (as of project start)
**Rationale:** The decision to use **shadcn/ui** is based on its perfect alignment with the project's core goals. Its "copy-paste" philosophy provides complete ownership and control over the UI components, which is essential for creating a unique and highly polished user experience. Built on Tailwind CSS and Radix UI, it offers excellent performance, first-class accessibility, and seamless integration with Next.js. This choice directly supports the design principle of a "clean & modern" UI and gives us the flexibility to build a truly "Creative and Inspired" application without being constrained by a rigid design language.

---

## 2. Core User Experience

### 2.1 Defining Experience

The core of the application revolves around effortless inventory management and immediate, actionable inspiration. The experience is guided by the principles: **Speed is Magical** (low friction for input), **Intelligent Assistant** (proactive guidance), and **Creative & Inspired** (fun and welcoming). The app's core magic is that **"It's the app that turns my leftover food into amazing meals."**

### 2.2 Novel UX Patterns
**{{novel_ux_patterns}}**
The primary novel pattern is the **Expiration-to-Inspiration Loop**. This transforms the negative experience of seeing food expire into a positive, actionable task.
* **Pattern:** A persistent, contextual alert (e.g., "3 items expiring soon") on the Dashboard directly links to an auto-generated list of "Waste-Saving Recipes" that exclusively use the expiring items. This transforms a negative alert into a creative opportunity.
* **Instant Idea Button (FR4.2):** A dedicated, always-accessible primary button/modal for zero-friction recipe generation without having to navigate inventory first. It acts as a low-risk, immediate demonstration of the app's core AI/matching capabilities.

---

## 3. Visual Foundation & Aesthetics

### 3.1 Color System
**{{visual_foundation}}**
**Chosen Theme: 1. Fresh & Organic (Green)**
**Rationale:** This theme is chosen because the refreshing green color (`#22c55e`) immediately conveys a sense of **freshness** and **health** to the user. This design decision aligns with the goal of encouraging users to cook with fresh ingredients, reinforcing the sense of making something 'fresh yourself'.

**Core Palette (Tailwind/Hex):**
| Name | Color | Usage |
|---|---|---|
| Primary | `#22c55e` | All primary actions, success states, main CTA buttons ("Add Item", "Find Recipe", "I Cooked This"). |
| Primary-Foreground | `#f0fdf4` | Text on Primary background (Light color for good contrast). |
| Secondary | `#f1f5f9` | Background for secondary buttons, subtle dividers. |
| Accent | `#a3e635` | Used for positive reinforcement, "fresh" indicators, and secondary success states. |
| Destructive | `#ef4444` | Exclusively for 'Delete' actions and high-urgency Expiration Alerts. |

**Interactive Visualizations:**

- Color Theme Explorer: [ux-color-themes.html](./ux-color-themes.html)

### 3.2 Typography System

* **Font Family:** Use a modern, highly legible sans-serif stack (e.g., Inter or system default like "Segoe UI" / "Roboto").
* **Scale:** Utilize a modular scale (e.g., 1.25, Major Third) for headings (H1: 2.5rem, H2: 2.0rem, H3: 1.5rem, Body: 1.0rem) to maintain hierarchy.
* **Font Weights:** Use **400 (Regular)** for body text and **600 (Semi-Bold)** for all headings. H1 may optionally use 700 for a stronger hierarchy.
* **Line Heights:** The standard line height for body text is **1.5**. Headings use a tighter line height of **1.25**.

### 3.3 Spacing & Layout System

* **System:** Based on a 4px or 8px grid system to ensure vertical and horizontal rhythm.
* **Margin/Padding Scale:** Use Tailwind CSS default scale (e.g., `p-1` = 4px, `p-4` = 16px).
* **Container Widths:** Default main content container is 1024px on Desktop (lg breakpoint), collapsing to 100% fluid width on smaller screens (sm/md).

---

## 4. Design Direction

### 4.1 Chosen Design Approach
**{{design_direction_decision}}**
**Chosen Direction: Direction 1: The Dashboard**
**Rationale:** The Dashboard direction is selected because it best supports the core objective of being an **"Intelligent Assistant"** that provides **"Immediate Value"**. This layout is optimal for PC/Desktop use. The assistant should be present and helpful directly on the dashboard with expiring food, low stock, and recipe help.
* **Layout Pattern:** A persistent left sidebar for main navigation (on desktop/PC) and a central content area that uses a grid.
* **Information Hierarchy:** The main view aggregates critical, actionable cards: 1) **Expiring Soon** alerts, 2) **Recipe Suggestions**, and 3) the **Instant Idea** button. This ensures users do not have to drill down into menus to find the most important information.
* **Visual Style:** Clean, modern, and information-rich (balanced density) to keep the core inventory management efficient.

**Interactive Mockups:**

- Design Direction Showcase: [ux-design-directions.html](./ux-design-directions.html)

---

## 5. User Journey Flows

### 5.1 Critical User Paths
**{{user_journey_flows}}**
*The following critical flows are accepted by the user for implementation:*

**Flow 1: The 'Quick-Add Item' Flow (FR2.1)**
* **Goal:** User quickly logs a new food item into their inventory with minimal friction.
* **Trigger:** Click on the prominent "Add Item" button (Primary color CTA).
* **Steps:** 1. User clicks "Add Item." 2. A large, non-blocking **Modal/Flyout** appears with optimized input fields. 3. User clicks "Save Item" (Primary button).
* **Success State:** Immediate, non-blocking **Toast Notification** appears: *"Tomatoes added successfully!"*
* **Failure State:** On save failure (e.g., server error or validation failure), display a **Destructive Toast Notification** ("Save failed: Check connection and try again") and keep the Modal open so the user can retry without losing input.

**Flow 2: The 'I Cooked This' (Inventory Deduction) Flow (FR3.4)**
* **Goal:** Accurately deduct used ingredients from inventory after a recipe is cooked, maintaining data integrity.
* **Trigger:** User clicks the "I Cooked This!" button on a recipe details page.
* **Steps:** 1. The **Confirmation Modal** appears. 2. Modal lists all ingredients and their quantities required by the recipe that are currently in the user's inventory. 3. User is prompted to confirm the deduction, with the ability to **manually adjust** or **exclude** items. 4. User clicks "Confirm Deduction" (Primary button).
* **Success State:** Full-screen celebratory message or persistent toast: *"Nice work! You just saved 2 items from going to waste."*

---

## 6. Component Library

### 6.1 Component Strategy
**{{component_library_strategy}}**
All standard `shadcn/ui` components are required (Buttons, Forms, Cards, Modals, Tabs, Navigation/Sidebar, Toast Notifications).

**Custom/Key Components:**
* **Quick-Add Input:** A highly customized input field designed for intelligent parsing of a food item's name, quantity, unit, and date from a single string or via highly optimized sequential fields.
* **Inventory Deduction Modal:** A custom modal that clearly lists ingredients to be deducted (with quantities) for confirmation (FR3.4), including manual adjustment options.
* **Actionable Alert Card:** A Dashboard card optimized for alerts (e.g., Expiring Soon), using color-coding (`Destructive`/`Accent`) and a prominent link to a filtered action page.

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules
**{{ux_pattern_decisions}}**
* **Button Hierarchy:** Primary (Green: Save, Add, Go), Secondary (Neutral/White: Cancel, Dismiss), Destructive (Red: Delete, Remove). Primary button is always right-aligned in forms/modals.
* **Feedback Patterns:** Use **Toast Notifications** for non-blocking success/error feedback. Use **Modals** for blocking, critical actions.
* **Modal Patterns:**
    * **Size:** The default modal size is **Medium (600px)**. Use Small (400px) for simple confirmation dialogs and Large (800px) for data-heavy or complex layouts.
    * **Dismissal:** Modals can be dismissed using **Esc** or by clicking outside, except for destructive or irreversible actions, where outside-click dismissal must be disabled.
    * **Focus:** On open, focus moves automatically to the primary action or the first input field. On close, focus returns to the element that triggered the modal.
* **Empty States:** Empty states display a friendly illustration and a Primary CTA labeled **"Add Your First Item!"**, optionally supported by a short explanatory subtitle.
* **Search Patterns:** All inventory and recipe searches must use **Live Search** with immediate, filtered results to maximize the "Speed is Magical" principle.
* **Navigation Patterns:** Fixed left sidebar for main navigation (on desktop/PC). Collapsible, icon-based **Fixed Bottom Bar** navigation (on mobile).

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy
**{{responsive_accessibility_strategy}}**
The application adheres to a **Mobile-First** approach while maintaining full support and usability on PC/Desktop.

* **WCAG Compliance:** WCAG 2.1 AA Compliance is the goal.
* **Breakpoints:** Standard Tailwind/shadcn breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px).
* **Touch Targets:** Minimum touch target size on mobile must be **44x44px** (WCAG guideline).
* **Navigation Adaptation:**
    * **Desktop/PC (LG+):** Fixed Left Sidebar Navigation (Direction 1: The Dashboard).
    * **Mobile (SM/MD):** Fixed Bottom Bar Navigation.
* **Accessibility:** **Color Contrast:** All text must meet AA contrast ratios. **Keyboard:** Full keyboard navigation support with clearly defined focus states. **ARIA:** Proper ARIA labels must be implemented.
* **Alt Text Strategy:** All non-decorative images must have descriptive `alt` text. Decorative images must have `alt=""`.

---

## 9. Implementation Guidance

### 9.1 Completion Summary

**{{completion_summary}}**
The UX Design Specification is now **100% complete**, with all critical interaction patterns, visual foundation, and component details defined. The design is now fully aligned with the **Fresh & Organic** theme and the **Dashboard** layout. All gaps identified in the last validation report have been addressed by defining typography weights, line heights, modal behavior, empty states, and detailed failure handling. The final file is ready to serve as the single source of truth for the next phase.

**Next Steps:** The primary next step is to initiate the **Solution Architecture Workflow** to define the technical implementation based on this completed UX design.

---

## Appendix

### Related Documents

- Product Requirements: `docs/PRD.md`
- Product Brief: `docs/product-brief-ibe160-2025-11-14.md`
- Brainstorming: `docs/fase-1-analys-silger/bmm-brainstorming-session-2025-11-14.md`

### Core Interactive Deliverables

- **Color Theme Visualizer**: docs/ux-color-themes.html
- **Design Direction Mockups**: docs/ux-design-directions.html

### Next Steps & Follow-Up Workflows

This UX Design Specification can serve as input to:

- **Solution Architecture Workflow** - Define technical architecture with UX context (Recommended Next Step).
- **Wireframe Generation Workflow** - Create detailed wireframes from user flows.
- **Figma Design Workflow** - Generate Figma files via MCP integration.

### Version History

| Date | Version | Changes | Author |
|---|---|---|---|
| 2025-11-24 | 1.0 | Initial UX Design Specification | BIP |
| 2025-11-24 | 1.1 | Updated with final user choices for Color Theme (Fresh & Organic) and Design Direction (The Dashboard). | Gemini |
| **2025-11-25** | **1.2** | **FINALIZED: Added detailed specifications for Typography (Weights/Line Heights), Modal Behavior (Size/Dismissal), Error Handling (Destructive Toast), Empty States, and Accessibility (Touch Targets/Alt Text).** | **Gemini** |

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._