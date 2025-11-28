# ibe160 UX Design Specification

_Created on 2025-11-24 by BIP_
_Last Updated on 2025-11-28_

---

## Executive Summary

**Project:** You're building "ibe160," a mobile-responsive web app to help users reduce food waste. It will feature smart kitchen inventory management, expiration alerts, and personalized recipe suggestions. A key feature is the "Instant Idea" button for quick, frictionless recipe discovery.

**Target Users:** The app is for busy individuals and families who want to waste less and find meal inspiration easily.

---

## 1. Design System Foundation

### 1.1 Design System Choice

**System:** shadcn/ui
**Version:** Latest (as of project start)
**Rationale:** The decision to use **shadcn/ui** is based on its perfect alignment with the project's core goals. Its "copy-paste" philosophy provides complete ownership and control over the UI components. Built on Tailwind CSS and Radix UI, it offers excellent performance, accessibility, and seamless integration, supporting a "clean & modern" UI.

---

## 2. Core User Experience

### 2.1 Defining Experience

The core of the application revolves around effortless inventory management and immediate, actionable inspiration. The experience is guided by the principles: **Speed is Magical**, **Intelligent Assistant**, and **Creative & Inspired**. The app's core magic is that **"It's the app that turns my leftover food into amazing meals."**

### 2.2 Novel UX Patterns

The primary novel pattern is the **Expiration-to-Inspiration Loop**. This transforms the negative experience of seeing food expire into a positive, actionable task.
* **Pattern:** A persistent, contextual alert (e.g., "3 items expiring soon") on the Dashboard directly links to an auto-generated list of "Waste-Saving Recipes" that exclusively use the expiring items.
* **Instant Idea Button (FR4.2):** A dedicated, always-accessible primary button/modal for zero-friction recipe generation.

---

## 3. Visual Foundation & Aesthetics

### 3.1 Color System

**Chosen Theme: 1. Fresh & Organic (Green)**
**Rationale:** This theme is chosen because the refreshing green color (`#22c55e`) immediately conveys a sense of **freshness** and **health**, aligning with the app's goals.

**Core Palette (Tailwind/Hex):**
The palette has been expanded to include a full range of shades for both light and dark modes, based on the latest design sketches.

| Name | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| **Primary** | `#22c55e` | `#22c55e` | Main CTAs, active states, highlights. |
| Primary-Foreground | `#000000` | `#000000` | Text on primary backgrounds. |
| **Background** | `#f8fafc` | `#121212` | Main page background. |
| **Surface** | `#ffffff` | `#1E1E1E` | Card backgrounds, headers, modals. |
| **Border** | `#F0F0F0` | `#2C2C2C` | Dividers and component borders. |
| **Foreground (Text)**| `#333333` | `#E0E0E0` | Primary text color. |
| **Subtext** | `#666666` | `#A0A0A0` | Secondary or muted text. |
| **Destructive** | `#ef4444` | `#ef4444` | Delete actions, urgent alerts. |
| **Warning** | `#fb923c` | `#fb923c` | Non-urgent alerts (e.g., "expiring soon"). |

**Interactive Visualizations:**

- Color Theme Explorer: [ux-color-themes.html](./ux-color-themes.html)

### 3.2 Typography System

* **Font Family:** The font family is standardized to **Inter** across the application for a consistent, modern, and highly legible appearance.
* **Icon Library:** The **Material Symbols Outlined** library will be used for all icons to ensure visual consistency.
* **Scale:** Utilize a modular scale (e.g., 1.25, Major Third) for headings (H1: 2.5rem, H2: 2.0rem, H3: 1.5rem, Body: 1.0rem).
* **Font Weights:** Use **400 (Regular)** for body text and **600 (Semi-Bold)** for all headings. H1 may optionally use 700.
* **Line Heights:** The standard line height for body text is **1.5**. Headings use a tighter line height of **1.25**.

---

## 4. Design Direction

### 4.1 Chosen Design Approach

**Chosen Direction: Direction 1: The Dashboard (Mobile-First)**
**Rationale:** The Dashboard direction is selected because it best supports the core objective of being an **"Intelligent Assistant."** The design has been updated to a **mobile-first** approach, aligning with the latest sketches. This ensures the most critical information is immediately accessible on the primary user device.
* **Layout Pattern (Mobile):** A main content area that aggregates critical, actionable cards: 1) **Expiring Soon** alerts, 2) **Recipe Suggestions**, and 3) **Your Impact** stats. Navigation is handled by a fixed bottom bar.
* **Layout Pattern (Desktop):** The layout expands for larger screens, potentially including a persistent left sidebar for navigation while retaining the card-based dashboard.
* **Visual Style:** Clean, modern, and information-rich to keep core tasks efficient.

---

## 5. User Journey Flows

*(This section remains unchanged as the core flows are still valid.)*

---

## 6. Component Library

### 6.1 Component Strategy

All standard `shadcn/ui` components are required. The following custom components are defined based on the latest sketches.

**Custom/Key Components:**
* **Quick-Add Input:** A highly customized input for parsing food item details from a single string.
* **Inventory Deduction Modal:** A custom modal to confirm ingredient deduction after cooking.
* **Actionable Alert Card:** A Dashboard card for alerts (e.g., Expiring Soon) with color-coding.
* **Recipe Card:** Displays a recipe image, title, and cooking time. Now includes a prominent **"Uses expiring" tag** with an icon to connect to the inventory.
* **Shopping List:** An integrated component on the inventory page allowing users to add, check off, and remove items from a shopping list.
* **Your Impact Card:** A dashboard card displaying user stats for food and money saved.
* **Profile Page:** A dedicated screen that includes:
    * User avatar and information header.
    * sections for account settings, preferences, and app information.
    * A prominent logout button.

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules
* **Button Hierarchy:** Primary (Green), Secondary (Neutral/White), Destructive (Red).
* **Feedback Patterns:** Use **Toast Notifications** for non-blocking feedback and **Modals** for blocking actions.
* **Modal Patterns:** Default modal size is **Medium (600px)**. Can be dismissed with **Esc** or outside click unless the action is destructive.
* **Empty States:** Display a friendly illustration and a Primary CTA.
* **Search Patterns:** Use **Live Search** with immediate results.
* **Navigation Patterns:** **Fixed Bottom Bar** on mobile and a **Fixed Left Sidebar** on desktop.
* **Expiration Color-Coded Border:** A new pattern for the inventory list. A colored left border on an item indicates its expiration status (e.g., red for today, orange for soon). This provides a quick visual cue.

---

## 8. Responsive Design & Accessibility

*(This section remains largely unchanged but is reinforced by the mobile-first design direction.)*

### 8.1 Responsive Strategy
The application adheres to a **Mobile-First** approach while maintaining full support and usability on PC/Desktop.
* **WCAG Compliance:** WCAG 2.1 AA is the goal.
* **Breakpoints:** Standard Tailwind/shadcn breakpoints.
* **Touch Targets:** Minimum touch target size on mobile must be **44x44px**.
* **Navigation Adaptation:** Fixed Bottom Bar on mobile (SM/MD) and Fixed Left Sidebar on desktop (LG+).

---

## 9. Implementation Guidance

*(This section remains unchanged.)*

---

## Appendix

### Related Documents
- Product Requirements: `docs/PRD.md`
- Product Brief: `docs/product-brief-ibe160-2025-11-14.md`
- New Design Sketches: `docs/stitch/`

### Core Interactive Deliverables
- **Color Theme Visualizer**: docs/ux-color-themes.html
- **Design Direction Mockups**: docs/ux-design-directions.html

---

### Version History

| Date | Version | Changes | Author |
|---|---|---|---|
| 2025-11-24 | 1.0 | Initial UX Design Specification | BIP |
| 2025-11-24 | 1.1 | Updated with final user choices for Color Theme and Design Direction. | Gemini |
| 2025-11-25 | 1.2 | Finalized specs for Typography, Modals, Error Handling, etc. | Gemini |
| **2025-11-28** | **2.0** | **MAJOR UPDATE: Aligned spec with new design sketches. Updated color system (light/dark modes), typography (standardized on Inter), design direction (mobile-first), and added new components (Shopping List, Profile Page, etc.).** | **Gemini** |

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._
