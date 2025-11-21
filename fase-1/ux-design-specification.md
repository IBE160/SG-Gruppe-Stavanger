# UX Design Specification

**Project:** Smart Food & Recipe Platform
**Version:** 1.0
**Date:** November 2025
**Designer:** UX Designer Agent

---

## 1. Design Philosophy

### 1.1 Core Principles

1. **Simplicity First**: Reduce cognitive load for daily food management tasks
2. **Progressive Disclosure**: Show essential info upfront, details on demand
3. **Mobile-First**: Optimize for kitchen use (often on phones)
4. **Accessibility**: WCAG 2.1 AA compliance throughout
5. **Delight**: Small interactions that make food management enjoyable

### 1.2 Design Goals

- **Efficiency**: Add item to pantry in <10 seconds
- **Clarity**: Expiration status visible at a glance
- **Motivation**: Encourage waste reduction through positive feedback
- **Trust**: Reliable recipe matching that respects preferences

---

## 2. User Personas

### Primary Persona: "Busy Berit"

- **Age**: 35
- **Occupation**: Working professional
- **Tech Savvy**: Moderate
- **Pain Points**: Forgets what's in fridge, throws away expired food
- **Goal**: Quick dinner planning with what's available
- **Usage Context**: Kitchen, often with messy hands

### Secondary Persona: "Budget Bjørn"

- **Age**: 28
- **Occupation**: Student
- **Tech Savvy**: High
- **Pain Points**: Limited budget, needs to minimize waste
- **Goal**: Maximize value from every grocery purchase
- **Usage Context**: Mobile-first, grocery store

### Tertiary Persona: "Health-Conscious Hilde"

- **Age**: 42
- **Occupation**: Part-time, family focus
- **Tech Savvy**: Moderate
- **Pain Points**: Dietary restrictions, meal variety
- **Goal**: Healthy meals that family will eat
- **Usage Context**: Meal planning sessions, desktop

---

## 3. Information Architecture

### 3.1 Navigation Structure

```
Home (Dashboard)
├── Pantry
│   ├── All Items
│   ├── Expiring Soon
│   ├── Add Item
│   └── Barcode Scanner
├── Recipes
│   ├── Discover
│   ├── By Ingredients
│   ├── Favorites
│   └── Recipe Detail
├── Grocery List
│   ├── Current List
│   └── Generate from Recipe
├── Alerts
│   ├── All Notifications
│   └── Settings
└── Profile
    ├── Preferences
    ├── Dietary Restrictions
    ├── Achievements
    └── Settings
```

### 3.2 User Flows

#### Add Item Flow
1. Open Pantry → Tap "+" button
2. Choose method: Manual / Barcode / Voice
3. Enter/scan item details
4. Set expiration date (smart defaults)
5. Confirm → Success feedback

#### Find Recipe Flow
1. Open Recipes → "By Ingredients" tab
2. System auto-selects pantry items
3. View matching recipes (sorted by match %)
4. Tap recipe → View details
5. Optional: Generate grocery list for missing items

#### Expiration Alert Flow
1. Receive push notification (3 days before)
2. Tap notification → Item detail
3. Options: Use in recipe / Snooze / Dismiss
4. "Use in recipe" → Filtered recipes using that item

---

## 4. Component Library

### 4.1 Color System

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#16A34A` | Primary actions, success states |
| `--color-primary-dark` | `#15803D` | Hover states |
| `--color-secondary` | `#0EA5E9` | Secondary actions, links |
| `--color-warning` | `#F59E0B` | Expiring soon (3-7 days) |
| `--color-danger` | `#EF4444` | Expired, errors |
| `--color-neutral-50` | `#FAFAFA` | Background |
| `--color-neutral-900` | `#171717` | Primary text |

### 4.2 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Inter | 32px | 700 |
| H2 | Inter | 24px | 600 |
| H3 | Inter | 20px | 600 |
| Body | Inter | 16px | 400 |
| Small | Inter | 14px | 400 |
| Caption | Inter | 12px | 400 |

### 4.3 Spacing Scale

```
4px  - xs
8px  - sm
12px - md
16px - lg
24px - xl
32px - 2xl
48px - 3xl
```

### 4.4 Core Components

#### Button
- **Primary**: Green background, white text, rounded-md
- **Secondary**: White background, green border, green text
- **Danger**: Red background, white text
- **States**: Default, Hover, Active, Disabled, Loading

#### Card
- White background
- Shadow-sm, rounded-lg
- Padding: 16px
- Used for: Items, recipes, notifications

#### Input
- Border: neutral-300
- Focus: primary ring
- Error: danger border + message
- Helper text support

#### Badge
- Small pill-shaped indicators
- Colors: Primary, Warning, Danger, Neutral
- Used for: Expiration status, categories, match %

---

## 5. Key Screens

### 5.1 Dashboard (Home)

**Purpose**: Quick overview and primary actions

**Layout**:
- Header with greeting and user avatar
- Quick stats: Items expiring, recipes available
- Action buttons: Add item, Find recipe
- Expiring soon list (top 5)
- Recommended recipes carousel

**Interactions**:
- Pull to refresh
- Tap stat → Navigate to relevant section
- Swipe recipe card → Favorite

### 5.2 Pantry Overview

**Purpose**: Manage all food items

**Layout**:
- Search bar (sticky)
- Filter chips: All, Expiring, Category
- Item cards in grid (mobile: 2-col, desktop: 4-col)
- FAB for add item

**Item Card**:
- Image/icon
- Name (truncate at 2 lines)
- Expiration badge (color-coded)
- Quantity indicator
- Quick actions on long-press

**Interactions**:
- Swipe left to delete
- Tap to view/edit
- Sort by: Name, Expiration, Category
- Multi-select for bulk actions

### 5.3 Add Item Dialog

**Purpose**: Quick item entry

**Layout**:
- Modal/bottom sheet (mobile)
- Tabs: Manual, Barcode, Voice
- Form fields: Name, Category, Quantity, Unit, Expiration
- Smart defaults for expiration based on category
- Save/Cancel buttons

**Interactions**:
- Auto-focus on name field
- Category selection with icons
- Date picker with "quick select" (today, +3d, +7d, +14d)
- Barcode auto-advances to next field

### 5.4 Recipe Browser

**Purpose**: Discover recipes based on available ingredients

**Layout**:
- Toggle: All recipes / By my ingredients
- Filter bar: Cuisine, Diet, Time
- Recipe cards in list
- Match percentage prominently displayed

**Recipe Card**:
- Large image
- Title
- Cook time, servings
- Match % badge
- Missing ingredients indicator
- Favorite button

**Interactions**:
- Infinite scroll
- Filter persistence
- Skeleton loading states
- Empty state with suggestions

### 5.5 Recipe Detail

**Purpose**: View recipe and generate grocery list

**Layout**:
- Hero image
- Title, metadata (time, servings, calories)
- Tab bar: Ingredients, Instructions, Nutrition
- Ingredients with availability indicators
- CTA: Generate grocery list

**Interactions**:
- Scale servings (adjusts quantities)
- Check off completed steps
- Share recipe
- Add to favorites
- "I made this" → Points earned

### 5.6 Grocery List

**Purpose**: Smart shopping list

**Layout**:
- List grouped by store section (Produce, Dairy, etc.)
- Checkbox for each item
- Quantity and unit
- "Add custom item" at bottom
- Clear completed button

**Interactions**:
- Check to mark purchased
- Swipe to remove
- Reorder by drag
- Share list
- Sync across household

### 5.7 Alerts/Notifications

**Purpose**: Manage expiration warnings

**Layout**:
- List of notifications
- Grouped by date
- Unread indicator
- Quick actions inline

**Notification Item**:
- Item icon/image
- "X expires in Y days" message
- Actions: View recipes, Snooze, Dismiss
- Timestamp

---

## 6. Interaction Patterns

### 6.1 Gestures

| Gesture | Action |
|---------|--------|
| Tap | Select, navigate |
| Long press | Context menu, multi-select |
| Swipe left | Delete |
| Swipe right | Complete/favorite |
| Pull down | Refresh |
| Pinch | Zoom (images) |

### 6.2 Feedback

| Action | Feedback |
|--------|----------|
| Button tap | Ripple effect, haptic |
| Item added | Success toast, confetti (occasional) |
| Item deleted | Undo snackbar (5s) |
| Error | Red toast, shake animation |
| Loading | Skeleton screens, not spinners |
| Achievement | Modal celebration |

### 6.3 Transitions

- Page transitions: Slide (horizontal)
- Modal: Slide up (mobile), fade (desktop)
- List items: Stagger fade-in
- Duration: 200-300ms
- Easing: ease-out

---

## 7. Responsive Behavior

### 7.1 Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | <640px | Single column, bottom nav |
| Tablet | 640-1024px | 2-column, side nav |
| Desktop | >1024px | 3-column, side nav, detail panel |

### 7.2 Adaptive Components

- **Navigation**: Bottom bar (mobile) → Side rail (tablet) → Full sidebar (desktop)
- **Cards**: Full width → 2-col grid → 4-col grid
- **Dialogs**: Full screen sheet → Centered modal
- **Tables**: Card view → Full table

---

## 8. Accessibility

### 8.1 Requirements

- Color contrast: 4.5:1 minimum
- Touch targets: 44x44px minimum
- Focus indicators: Visible ring
- Screen reader: Full ARIA support
- Reduced motion: Respect prefers-reduced-motion
- Keyboard: Full navigation support

### 8.2 Testing

- VoiceOver (iOS)
- TalkBack (Android)
- NVDA (Windows)
- Axe DevTools
- Manual keyboard testing

---

## 9. Iconography

Using **Lucide Icons** (consistent with shadcn/ui)

| Icon | Usage |
|------|-------|
| `Plus` | Add item |
| `Scan` | Barcode scanner |
| `Search` | Search |
| `Filter` | Filters |
| `ChefHat` | Recipes |
| `ShoppingCart` | Grocery list |
| `Bell` | Notifications |
| `AlertTriangle` | Warning/expiring |
| `Check` | Complete/success |
| `Trash2` | Delete |
| `Heart` | Favorite |
| `Share` | Share |

---

## 10. Empty States

### No Pantry Items
- Illustration: Empty fridge
- Message: "Your pantry is empty"
- CTA: "Add your first item"

### No Matching Recipes
- Illustration: Chef shrugging
- Message: "No recipes match your ingredients"
- CTA: "Add more items" / "Browse all recipes"

### No Notifications
- Illustration: Happy bell
- Message: "All caught up!"
- Secondary: "We'll notify you when items are expiring"

---

## 11. Implementation Notes

### For Developers

1. Use shadcn/ui components as base
2. Extend with custom variants as needed
3. Follow Tailwind CSS class conventions
4. Test all states: loading, empty, error, success
5. Implement skeleton screens for all async content
6. Use React Query for data fetching patterns

### Component Mapping

| Design | shadcn/ui Component |
|--------|---------------------|
| Primary Button | `Button` |
| Item Card | `Card` |
| Add Item Form | `Dialog` + `Form` |
| Category Select | `Select` |
| Date Picker | `Calendar` + `Popover` |
| Notifications | `Toast` |
| Navigation | Custom (Tailwind) |

---

## 12. Design Files

- **Mockups**: `fase-1/*.html` (7 page mockups)
- **Color Themes**: `fase-1/ux-color-themes.html`
- **Design Directions**: `fase-1/ux-design-directions.html`

---

*This specification serves as the source of truth for UX implementation. Refer to mockups for visual details.*
