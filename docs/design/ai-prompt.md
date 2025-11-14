# UX-Dokumentasjon: ibe160 App

**AI-drevet matsvinn-app med moderne designsystem**

---

## Innholdsfortegnelse

1. [Overordnet konsept](#overordnet-konsept)
2. [Designsystem](#designsystem)
3. [Navigasjonsstruktur](#navigasjonsstruktur)
4. [Sidevisninger og funksjonalitet](#sidevisninger-og-funksjonalitet)
5. [Komponenter](#komponenter)
6. [Interaksjonsmønstre](#interaksjonsmønstre)
7. [Responsivitet](#responsivitet)
8. [Tilgjengelighet](#tilgjengelighet)
9. [Teknisk UX](#teknisk-ux)

---

## Overordnet konsept

### Formål
ibe160 er en **AI-drevet matsvinn-app** som hjelper brukere med å:
- Spore matvarer i kjøleskapet/skapet
- Få AI-baserte oppskriftsforslag
- Redusere matsvinn gjennom smarte varsler
- Planlegge innkjøp effektivt

### Målgruppe
- Miljøbevisste personer
- Studenter og unge voksne som vil spare penger
- Familier som vil redusere matsvinn
- Tech-savvy brukere som liker AI-assistanse

### Design-filosofi
- **Airbnb-inspirert estetikk**: Ren, moderne, luftig
- **Grønn identitet**: Fokus på bærekraft og miljø
- **AI-first**: Fremhev intelligent funksjonalitet
- **Visuelt**: Bilder og farger kommuniserer status

---

## Designsystem

### Fargepalett

#### Primærfarger
```css
/* Grønn - Merkevare og positive handlinger */
--green-50: #f0fdf4
--green-600: #16a34a /* Hovedfarge */
--green-700: #15803d

/* Gradient - AI-funksjonalitet */
--purple-600: #9333ea
--pink-600: #db2777
background: linear-gradient(to right, var(--purple-600), var(--pink-600))
```

#### Statusfarger
```css
/* Friskt (3+ dager) */
--status-fresh: #16a34a (green-600)

/* Advarsel (2-3 dager) */
--status-warning: #ca8a04 (yellow-600)

/* Kritisk (0-1 dag) */
--status-critical: #ea580c (orange-600)

/* Utgått */
--status-expired: #dc2626 (red-600)
```

#### Nøytrale farger
```css
--gray-50: #f9fafb /* Bakgrunn */
--gray-100: #f3f4f6 /* Cards hover */
--gray-200: #e5e7eb /* Borders */
--gray-600: #4b5563 /* Secondary text */
--gray-900: #111827 /* Primary text */
--white: #ffffff /* Cards */
```

### Typografi

#### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

#### Størrelser og vekter
```css
/* Headings */
h1: text-4xl (36px) font-semibold tracking-tight
h2: text-3xl (30px) font-semibold tracking-tight
h3: text-2xl (24px) font-semibold

/* Body */
p: text-base (16px) leading-relaxed
small: text-sm (14px)
tiny: text-xs (12px)

/* Vekter */
font-medium: 500
font-semibold: 600
font-bold: 700
```

### Spacing

#### Container
```css
max-width: 1440px
padding-x: 24px (mobile) → 80px (desktop)
padding-y: 48px
```

#### Gaps og marginer
```css
gap-2: 8px /* Tette elementer */
gap-3: 12px /* Kompakte grupper */
gap-4: 16px /* Standard spacing */
gap-6: 24px /* Card grids */
gap-8: 32px /* Section spacing */
```

### Avrundinger
```css
rounded-lg: 8px /* Små elementer */
rounded-xl: 12px /* Buttons, inputs */
rounded-2xl: 16px /* Cards, dialogs */
rounded-3xl: 24px /* Hero sections */
```

### Skygger
```css
/* Cards */
shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)

/* Hover states */
hover:shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
```

---

## Navigasjonsstruktur

### Sticky Header (Autentiserte sider)

```
┌────────────────────────────────────────────────────────────┐
│ 🥗 ibe160 [Pantry] [Recipes] [Grocery] [Profile] 🚪 │
└────────────────────────────────────────────────────────────┘
```

**Komponenter:**
- Logo: Salat-ikon + "ibe160" tekst
- Navigasjon: Pill-knapper med aktiv state (bg-gray-50)
- Sign out: Ikon + tekst, hover-effekt

**CSS:**
```css
.sticky-header {
position: sticky;
top: 0;
z-index: 50;
background: white;
border-bottom: 1px solid #e5e7eb;
}

.nav-pill {
padding: 8px 16px;
border-radius: 8px;
font-weight: 500;
font-size: 14px;
transition: background-color 150ms;
}

.nav-pill:hover {
background-color: #f9fafb;
}

.nav-pill.active {
background-color: #f3f4f6;
color: #111827;
}
```

### Informasjonsarkitektur

```
Landing Page (Uautentisert)
├── Hero Section
├── Features (AI Search, Expiration Alerts)
└── Footer med modaler

Auth Flow
├── Login
└── Register

Main App (Autentisert)
├── Pantry (Hjem)
│ ├── Add Item Dialog
│ ├── Edit Item Dialog
│ ├── Barcode Scanner
│ └── Confirm Delete Dialog
├── Recipes
│ ├── Text Search
│ ├── Ingredient Search (Pantry)
│ └── AI Search (Gemini)
├── Grocery List
│ └── LocalStorage-basert
├── Profile
│ └── Quick Actions
└── Alerts (Eksponeringsoversikt)
```

---

## Sidevisninger og funksjonalitet

### 1. Landing Page

#### Hero Section
**Layout:** To-kolonners grid (1:1 ratio)

**Venstre kolonne:**
```
[Badge: AI-Powered Food Waste Solution]

Stop wasting food.
Start saving money.

Track your pantry, get AI recipe suggestions,
and reduce food waste.

[Sign in] [Get Started →]
```

**Høyre kolonne:**
```
┌─────────────────────────────────────┐
│ 🥗 Your Pantry │
│ │
│ [🍅 Tomatoes 250g Fresh] │
│ [🥛 Milk 1L 2 days ⚠️] │
│ [🍗 Chicken 500g Fresh] │
│ │
│ [✨ Find Recipes with AI] │
└─────────────────────────────────────┘
[✨ AI Powered badge]
```

**CSS:**
```css
.hero-badge {
display: inline-flex;
align-items: center;
gap: 8px;
padding: 6px 12px;
background: #f3f4f6;
border-radius: 9999px;
font-size: 12px;
font-weight: 500;
}

.hero-title {
font-size: 60px;
line-height: 1.1;
font-weight: 600;
letter-spacing: -0.025em;
color: #111827;
}

.hero-title span {
color: #16a34a; /* Green accent */
}

.hero-card {
background: white;
border: 1px solid #e5e7eb;
border-radius: 24px;
padding: 24px;
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
transition: box-shadow 300ms;
}

.hero-card:hover {
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

#### Feature Sections
**Alternerende layout:**

```
Feature 1 (AI Search):
[Tekst] [Bilde]

Feature 2 (Alerts):
[Bilde] [Tekst]
```

**Komponenter:**
- Badge med ikon (lilla for AI, gul for alerts)
- Stor overskrift (text-3xl/4xl)
- Beskrivende tekst (text-lg)
- Høykvalitetsbilde fra Unsplash
- Gradient bakgrunn på bilder

#### Footer Modaler
**Trigger:** Klikkbare lenker i footer

**Modal innhold:**
- Ikon-header (12x12px rounded-xl bakgrunn)
- Tittel (text-2xl)
- Beskrivelse
- Info-boks med sjekkliste
- X-knapp for å lukke

**Modal design:**
```css
.modal-backdrop {
position: fixed;
inset: 0;
background: rgba(0, 0, 0, 0.5);
z-index: 50;
}

.modal-content {
position: relative;
background: white;
border-radius: 16px;
max-width: 672px;
padding: 24px;
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-info-box {
background: #f0fdf4; /* green-50 */
border: 1px solid #bbf7d0; /* green-200 */
border-radius: 12px;
padding: 16px;
}

.checkmark-item {
display: flex;
align-items: start;
gap: 8px;
}

.checkmark-item svg {
width: 16px;
height: 16px;
margin-top: 2px;
flex-shrink: 0;
}
```

---

### 2. Pantry (Matvareoversikt)

#### Layout
```
┌────────────────────────────────────────────────────────┐
│ Header (Sticky) │
├────────────────────────────────────────────────────────┤
│ │
│ My Pantry │
│ Track your ingredients and reduce food waste │
│ │
│ [✓ Offline-First: React Query enabled] │
│ │
│ 12 items in pantry [📷 Scan] [+ Add Item] │
│ │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ 🍅 │ │ 🥛 │ │ 🍗 │ │
│ │ Tomatoes│ │ Milk │ │ Chicken │ │
│ │ 250g │ │ 1L │ │ 500g │ │
│ │ [Fresh] │ │ [2 days]│ │ [Fresh] │ │
│ │ [✏️] [🗑️]│ │ [✏️] [🗑️]│ │ [✏️] [🗑️]│ │
│ └─────────┘ └─────────┘ └─────────┘ │
│ │
└────────────────────────────────────────────────────────┘
```

#### Pantry Item Card
**Komponenter:**
- Bilde eller emoji (kategori-basert)
- Navn (font-semibold)
- Mengde + enhet (text-sm)
- Status badge (fargekodet)
- Edit/Delete knapper

**Status badges:**
```css
/* Fresh (3+ dager) */
.badge-fresh {
padding: 4px 8px;
background: #dcfce7; /* green-100 */
color: #16a34a; /* green-600 */
border-radius: 9999px;
font-size: 12px;
font-weight: 500;
}

/* Warning (2-3 dager) */
.badge-warning {
background: #fef3c7; /* yellow-100 */
color: #ca8a04; /* yellow-600 */
}

/* Critical (0-1 dag) */
.badge-critical {
background: #fed7aa; /* orange-100 */
color: #ea580c; /* orange-600 */
}

/* Expired */
.badge-expired {
background: #fee2e2; /* red-100 */
color: #dc2626; /* red-600 */
}
```

#### Loading State
**Skeleton placeholders:**
```css
.skeleton {
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
background: #e5e7eb;
border-radius: 8px;
}

@keyframes pulse {
0%, 100% { opacity: 1; }
50% { opacity: 0.5; }
}
```

#### Empty State
```
┌──────────────────┐
│ │
│ 🥗 │
│ │
└──────────────────┘

Your pantry is empty

Add your first ingredient to
start tracking expiration dates!

[📷 Scan Barcode] [+ Add Item]
```

#### Dialogs

**Add Item Dialog:**
```
┌─────────────────────────────────────┐
│ Add Item to Pantry [X] │
├─────────────────────────────────────┤
│ │
│ Name │
│ [_________________________] │
│ │
│ Category │
│ [▼ Select category ] │
│ │
│ Quantity Unit │
│ [______] [▼ g ] │
│ │
│ Best Before Date │
│ [📅 dd/mm/yyyy ] │
│ │
│ [Cancel] [Add Item] │
└─────────────────────────────────────┘
```

**Barcode Scanner:**
- Fullscreen overlay
- Kamera-feed
- Crosshair/scanning guide
- "Close" knapp
- Success/error toast ved scanning

---

### 3. Recipes (Oppskriftssøk)

#### Search Mode Toggle
```
┌─────────────────────────────────────────────────────┐
│ Recipe Browser │
│ Discover recipes with AI, search by name, or use │
│ your pantry │
│ │
│ [🔍 Search by Name] [🛍️ Use My Pantry (12)] [✨ AI Search] │
├─────────────────────────────────────────────────────┤
│ │
│ [Search input eller AI prompt] │
│ │
└─────────────────────────────────────────────────────┘
```

**Mode 1: Text Search**
```
Input:
┌────────────────────────────────────────────┐
│ Search for recipes (e.g., pasta, chicken) │
└────────────────────────────────────────────┘
```

**Mode 2: Ingredient Search**
```
Info box:
┌────────────────────────────────────────────┐
│ ✓ Finding recipes with: │
│ Tomatoes, Milk, Chicken, ... │
└────────────────────────────────────────────┘
```

**Mode 3: AI Search**
```
Input:
┌────────────────────────────────────────────────────┐
│ Ask AI anything... (e.g., 'healthy vegetarian') │
└──────────────────────────────────[✨ Search]──────┘

💡 AI Tips: Ask for recipes based on dietary
preferences, cuisine styles, cooking time, or
specific ingredients. The AI respects your user
preferences automatically!
```

#### Recipe Card
```
┌─────────────────────────┐
│ │
│ [Oppskriftsbilde] │
│ │
├─────────────────────────┤
│ Pasta Carbonara │
│ │
│ 🕐 30 min 👥 4 servings│
│ │
│ [Italian] [Pasta] [Easy]│
│ │
│ [View Recipe →] │
└─────────────────────────┘
```

**Hover effekt:**
```css
.recipe-card {
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.recipe-card:hover {
transform: scale(1.02);
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.recipe-card img {
transition: transform 300ms;
}

.recipe-card:hover img {
transform: scale(1.05);
}
```

#### AI Search Gradient Button
```css
.ai-search-button {
background: linear-gradient(to right, #9333ea, #db2777);
color: white;
padding: 10px 16px;
border-radius: 12px;
font-weight: 600;
display: flex;
align-items: center;
gap: 8px;
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
transition: box-shadow 200ms;
}

.ai-search-button:hover {
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

---

### 4. Grocery (Handleliste)

#### Layout
```
┌────────────────────────────────────────────┐
│ 🛒 Smart Grocery List │
│ Add items, check them off as you shop │
│ │
│ ✓ Smart Shopping: Add items, check them │
│ off, and track your needs! │
│ │
│ Add Item │
│ [e.g., Milk, Eggs, Bread...] [Add] │
│ │
│ ┌─────────────────────────────────────┐ │
│ │ 12 Total │ 8 To Buy │ 4 In Cart │ │
│ └─────────────────────────────────────┘ │
│ │
│ To Buy │
│ [ ] Tomatoes [Remove] │
│ [ ] Milk [Remove] │
│ │
│ In Cart │
│ [✓] Eggs [Remove] │
│ [✓] Bread [Remove] │
│ │
│ [Clear Checked Items (4)] │
└────────────────────────────────────────────┘
```

#### Item States
**Unchecked (To Buy):**
```css
.grocery-item-unchecked {
background: white;
border: 1px solid #e5e7eb;
padding: 12px;
border-radius: 12px;
}

.checkbox-unchecked {
width: 24px;
height: 24px;
border: 2px solid #d1d5db;
border-radius: 6px;
}

.checkbox-unchecked:hover {
border-color: #3b82f6; /* blue-500 */
}
```

**Checked (In Cart):**
```css
.grocery-item-checked {
background: #dcfce7; /* green-50 */
border: 1px solid #bbf7d0; /* green-200 */
padding: 12px;
border-radius: 12px;
}

.checkbox-checked {
width: 24px;
height: 24px;
background: #16a34a; /* green-500 */
border: 2px solid #16a34a;
border-radius: 6px;
color: white;
display: flex;
align-items: center;
justify-content: center;
}

.item-name-checked {
text-decoration: line-through;
color: #6b7280; /* gray-500 */
}
```

---

### 5. Profile

#### Layout
```
┌────────────────────────────────────────┐
│ Profile │
│ Manage your account and preferences │
│ │
│ ┌────────────────────────────────────┐ │
│ │ 👤 Name │ │
│ │ John Doe │ │
│ │ │ │
│ │ ✉️ Email │ │
│ │ john@example.com │ │
│ │ │ │
│ │ Quick Actions │ │
│ │ ┌─────────┐ ┌──────────┐ │ │
│ │ │📦 Pantry│ │👨‍🍳 Recipes│ │ │
│ │ └─────────┘ └──────────┘ │ │
│ │ ┌─────────┐ ┌──────────┐ │ │
│ │ │🛒Grocery│ │🔔 Prefs │ │ │
│ │ └─────────┘ └──────────┘ │ │
│ │ │ │
│ │ [🚪 Sign out] │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

### 6. Alerts (Utløpsvarsler)

#### Dashboard Layout
```
┌────────────────────────────────────────────────┐
│ 🔔 Expiration Alerts │
│ │
│ 📲 Enable browser notifications [Enable] │
│ │
│ ┌─────┐ ┌──────┐ ┌──────┐ ┌─────┐ │
│ │ 5 │ │ 3 │ │ 7 │ │ 12 │ │
│ │Expir│ │Critic│ │Warni │ │Safe │ │
│ └─────┘ └──────┘ └──────┘ └─────┘ │
│ │
│ ⚠️ Expired Items │
│ ┌──────────────────────────────────────────┐ │
│ │ 🍅 Tomatoes Expired 2 days ago 250g │ │
│ └──────────────────────────────────────────┘ │
│ │
│ 🚨 Critical (Use Today!) │
│ ┌──────────────────────────────────────────┐ │
│ │ 🥛 Milk Expires today 1L [Find Recipes]│ │
│ └──────────────────────────────────────────┘ │
│ │
│ ⚠️ Use Soon (2-3 days) │
│ ... │
│ │
│ ✅ Safe Items (3+ days) │
│ ... │
└────────────────────────────────────────────────┘
```

#### Color-coded Sections
```css
/* Expired - Rød */
.alert-expired {
border-left: 4px solid #dc2626; /* red-600 */
background: white;
padding: 24px;
border-radius: 8px;
}

.alert-expired-item {
background: #fee2e2; /* red-50 */
padding: 16px;
border-radius: 8px;
}

/* Critical - Oransje */
.alert-critical {
border-left: 4px solid #ea580c; /* orange-600 */
}

.alert-critical-item {
background: #fed7aa; /* orange-50 */
}

/* Warning - Gul */
.alert-warning {
border-left: 4px solid #ca8a04; /* yellow-600 */
}

.alert-warning-item {
background: #fef3c7; /* yellow-50 */
}

/* Safe - Grønn */
.alert-safe {
border-left: 4px solid #16a34a; /* green-600 */
}

.alert-safe-item {
background: #dcfce7; /* green-50 */
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 12px;
}
```

---

## Komponenter

### Buttons

#### Primary Button (Green)
```css
.btn-primary {
padding: 12px 24px;
background: linear-gradient(to right, #16a34a, #059669);
color: white;
font-weight: 600;
border-radius: 12px;
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
transition: all 200ms;
}

.btn-primary:hover {
background: linear-gradient(to right, #15803d, #047857);
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

#### Secondary Button (White/Gray)
```css
.btn-secondary {
padding: 10px 20px;
background: white;
border: 1px solid #d1d5db;
color: #111827;
font-weight: 500;
border-radius: 12px;
transition: background-color 150ms;
}

.btn-secondary:hover {
background: #f9fafb;
}
```

#### AI Button (Gradient Purple-Pink)
```css
.btn-ai {
padding: 12px 20px;
background: linear-gradient(to right, #9333ea, #db2777);
color: white;
font-weight: 600;
border-radius: 12px;
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
display: flex;
align-items: center;
gap: 8px;
}

.btn-ai:hover {
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
transform: scale(1.02);
}
```

#### Destructive Button (Red)
```css
.btn-destructive {
padding: 12px 24px;
background: #dc2626;
color: white;
font-weight: 600;
border-radius: 12px;
}

.btn-destructive:hover {
background: #b91c1c;
}
```

### Cards

#### Standard Card
```css
.card {
background: white;
border: 1px solid #e5e7eb;
border-radius: 16px;
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
padding: 24px;
transition: box-shadow 200ms;
}

.card:hover {
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

#### Pantry Item Card
```css
.pantry-card {
background: white;
border: 2px solid #e5e7eb;
border-radius: 12px;
padding: 16px;
display: flex;
flex-direction: column;
gap: 12px;
transition: all 200ms;
}

.pantry-card:hover {
border-color: #16a34a;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.pantry-card-image {
width: 100%;
height: 120px;
border-radius: 8px;
object-fit: cover;
}
```

#### Recipe Card
```css
.recipe-card {
background: white;
border: 1px solid #e5e7eb;
border-radius: 16px;
overflow: hidden;
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
cursor: pointer;
}

.recipe-card:hover {
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
transform: scale(1.02);
}

.recipe-card-image {
width: 100%;
height: 224px;
object-fit: cover;
transition: transform 300ms;
}

.recipe-card:hover .recipe-card-image {
transform: scale(1.05);
}

.recipe-card-body {
padding: 24px;
}
```

### Inputs

#### Text Input
```css
.input {
width: 100%;
padding: 12px 16px;
border: 1px solid #d1d5db;
border-radius: 12px;
font-size: 14px;
color: #111827;
transition: all 150ms;
}

.input::placeholder {
color: #9ca3af;
}

.input:focus {
outline: none;
border-color: #111827;
ring: 2px;
ring-color: #111827;
}
```

#### Select Dropdown
```css
.select {
width: 100%;
padding: 12px 16px;
border: 1px solid #d1d5db;
border-radius: 12px;
background: white;
font-size: 14px;
color: #111827;
cursor: pointer;
}

.select:focus {
outline: none;
border-color: #111827;
ring: 2px;
ring-color: #111827;
}
```

### Badges

#### Status Badge (Pantry)
```css
.badge {
padding: 4px 8px;
border-radius: 9999px;
font-size: 12px;
font-weight: 500;
text-align: center;
}

.badge-green {
background: #dcfce7;
color: #16a34a;
}

.badge-yellow {
background: #fef3c7;
color: #ca8a04;
}

.badge-orange {
background: #fed7aa;
color: #ea580c;
}

.badge-red {
background: #fee2e2;
color: #dc2626;
}
```

#### Tag Badge (Recipes)
```css
.tag {
padding: 6px 12px;
background: #f3f4f6;
color: #374151;
font-size: 12px;
border-radius: 9999px;
}
```

### Dialogs/Modals

#### Modal Container
```css
.modal-overlay {
position: fixed;
inset: 0;
background: rgba(0, 0, 0, 0.5);
display: flex;
align-items: center;
justify-content: center;
z-index: 50;
padding: 16px;
}

.modal {
background: white;
border-radius: 16px;
max-width: 600px;
width: 100%;
max-height: 90vh;
overflow-y: auto;
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
position: relative;
}

.modal-header {
display: flex;
justify-content: space-between;
align-items: start;
padding: 24px 24px 16px;
border-bottom: 1px solid #e5e7eb;
}

.modal-body {
padding: 24px;
}

.modal-footer {
padding: 16px 24px;
border-top: 1px solid #e5e7eb;
display: flex;
justify-content: flex-end;
gap: 12px;
}
```

### Toast Notifications

```css
.toast {
position: fixed;
bottom: 24px;
right: 24px;
padding: 16px 24px;
border-radius: 12px;
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
max-width: 400px;
z-index: 100;
animation: slideIn 300ms ease-out;
}

.toast-success {
background: #dcfce7;
border: 1px solid #16a34a;
color: #15803d;
}

.toast-error {
background: #fee2e2;
border: 1px solid #dc2626;
color: #b91c1c;
}

@keyframes slideIn {
from {
transform: translateX(100%);
opacity: 0;
}
to {
transform: translateX(0);
opacity: 1;
}
}
```

### Info Banners

```css
.banner {
padding: 16px;
border-radius: 12px;
border: 1px solid;
font-size: 14px;
display: flex;
align-items: start;
gap: 12px;
}

.banner-green {
background: #dcfce7;
border-color: #bbf7d0;
color: #15803d;
}

.banner-blue {
background: #dbeafe;
border-color: #93c5fd;
color: #1e40af;
}

.banner-purple {
background: #f3e8ff;
border-color: #d8b4fe;
color: #7e22ce;
}

.banner-yellow {
background: #fef3c7;
border-color: #fde047;
color: #854d0e;
}
```

---

## Interaksjonsmønstre

### Hover States

```css
/* Generell hover-effekt for interaktive elementer */
.interactive {
transition: all 200ms ease-out;
}

.interactive:hover {
transform: translateY(-2px);
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Link hover */
.link {
color: #3b82f6;
text-decoration: none;
transition: color 150ms;
}

.link:hover {
color: #2563eb;
text-decoration: underline;
}
```

### Loading States

```css
/* Spinner */
.spinner {
width: 20px;
height: 20px;
border: 2px solid #e5e7eb;
border-top-color: #111827;
border-radius: 50%;
animation: spin 1s linear infinite;
}

@keyframes spin {
to { transform: rotate(360deg); }
}

/* Skeleton */
.skeleton {
background: linear-gradient(
90deg,
#e5e7eb 0%,
#f3f4f6 50%,
#e5e7eb 100%
);
background-size: 200% 100%;
animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
0% { background-position: 200% 0; }
100% { background-position: -200% 0; }
}
```

### Focus States

```css
/* Keyboard focus ring */
.focusable:focus {
outline: none;
ring: 2px;
ring-color: #111827;
ring-offset: 2px;
}

/* Focus-visible (kun ved keyboard) */
.focusable:focus-visible {
outline: 2px solid #111827;
outline-offset: 2px;
}
```

### Empty States

```css
.empty-state {
padding: 48px;
text-align: center;
background: white;
border: 1px solid #e5e7eb;
border-radius: 16px;
}

.empty-state-icon {
width: 80px;
height: 80px;
margin: 0 auto 24px;
background: #f3f4f6;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
}

.empty-state-title {
font-size: 24px;
font-weight: 600;
color: #111827;
margin-bottom: 8px;
}

.empty-state-description {
color: #6b7280;
margin-bottom: 32px;
}
```

### Error States

```css
.error-state {
padding: 32px;
text-align: center;
background: #fee2e2;
border: 1px solid #fecaca;
border-radius: 12px;
}

.error-message {
color: #991b1b;
font-weight: 500;
margin-bottom: 16px;
}
```

---

## Responsivitet

### Breakpoints

```css
/* Mobile First Approach */
/* sm */ @media (min-width: 640px) { }
/* md */ @media (min-width: 768px) { }
/* lg */ @media (min-width: 1024px) { }
/* xl */ @media (min-width: 1280px) { }
/* 2xl */ @media (min-width: 1440px) { }
```

### Grid Layouts

#### Pantry/Recipe Grid
```css
.item-grid {
display: grid;
grid-template-columns: 1fr; /* Mobile */
gap: 24px;
}

@media (min-width: 768px) {
.item-grid {
grid-template-columns: repeat(2, 1fr);
}
}

@media (min-width: 1024px) {
.item-grid {
grid-template-columns: repeat(3, 1fr);
}
}
```

#### Hero Section
```css
.hero {
display: grid;
grid-template-columns: 1fr;
gap: 64px;
}

@media (min-width: 1024px) {
.hero {
grid-template-columns: repeat(2, 1fr);
align-items: center;
}
}
```

### Mobile Navigation

```css
/* På mobile: Hamburger menu eller simplified nav */
@media (max-width: 768px) {
.nav-links {
display: none; /* Skjul full nav */
}

.mobile-menu-button {
display: block;
}
}
```

### Touch Targets

```css
/* Minimum 44x44px for touch-friendly */
.btn-mobile {
min-height: 44px;
min-width: 44px;
padding: 12px 24px;
}
```

---

## Tilgjengelighet

### ARIA Labels

```html
<!-- Buttons -->
<button aria-label="Add item to pantry">
<PlusIcon />
</button>

<!-- Navigation -->
<nav aria-label="Main navigation">
<a href="/pantry" aria-current="page">Pantry</a>
</nav>

<!-- Dialogs -->
<div role="dialog" aria-labelledby="modal-title" aria-modal="true">
<h2 id="modal-title">Add Item</h2>
</div>

<!-- Loading states -->
<div role="status" aria-live="polite">
Loading recipes...
</div>
```

### Keyboard Navigation

```css
/* Skip to content link */
.skip-link {
position: absolute;
top: -40px;
left: 0;
background: #111827;
color: white;
padding: 8px 16px;
z-index: 100;
}

.skip-link:focus {
top: 0;
}
```

### Color Contrast

**WCAG AA compliance:**
- Text (16px+): Minimum 4.5:1 contrast ratio
- Large text (24px+): Minimum 3:1 contrast ratio

**Eksempler:**
```css
/* ✅ Good contrast */
.text-primary {
color: #111827; /* gray-900 */
background: #ffffff;
/* Contrast ratio: 16.8:1 */
}

/* ✅ Good contrast for status */
.badge-warning {
color: #ca8a04; /* yellow-600 */
background: #fef3c7; /* yellow-100 */
/* Contrast ratio: 5.2:1 */
}
```

### Screen Reader Support

```html
<!-- Image alt texts -->
<img src="tomato.jpg" alt="Fresh red tomatoes, 250 grams, expires in 3 days" />

<!-- Form labels -->
<label for="item-name">
Item Name
<span aria-label="required">*</span>
</label>
<input id="item-name" type="text" required />

<!-- Status messages -->
<div role="status" aria-live="polite">
Item added successfully
</div>
```

---

## Teknisk UX

### React Query (Offline-First)

**Stale-While-Revalidate pattern:**
```typescript
const { data, isLoading, error } = useQuery({
queryKey: ['pantry-items'],
queryFn: fetchPantryItems,
staleTime: 5 * 60 * 1000, // 5 minutter
cacheTime: 10 * 60 * 1000, // 10 minutter
})
```

**Optimistic Updates:**
```typescript
const mutation = useMutation({
mutationFn: deleteItem,
onMutate: async (itemId) => {
// Cancel outgoing refetches
await queryClient.cancelQueries(['pantry-items'])

// Snapshot previous value
const previous = queryClient.getQueryData(['pantry-items'])

// Optimistically remove from UI
queryClient.setQueryData(['pantry-items'], (old) =>
old.filter(item => item.id !== itemId)
)

return { previous }
},
onError: (err, itemId, context) => {
// Rollback on error
queryClient.setQueryData(['pantry-items'], context.previous)
},
})
```

### Image Loading

**Progressive enhancement:**
```html
<img
src="low-quality.jpg"
srcset="medium.jpg 768w, high.jpg 1200w"
sizes="(max-width: 768px) 100vw, 50vw"
loading="lazy"
alt="Recipe image"
/>
```

**Fallback strategi:**
```javascript
<img
src={recipe.image}
onError={(e) => {
// Try Unsplash fallback
if (!e.target.dataset.fallbackTried) {
e.target.dataset.fallbackTried = 'true'
e.target.src = getFallbackImage(recipe.title)
} else {
// Show icon instead
e.target.style.display = 'none'
showFallbackIcon()
}
}}
/>
```

### Local Storage (Grocery List)

```typescript
// Save on change
useEffect(() => {
localStorage.setItem('grocery-list', JSON.stringify(items))
}, [items])

// Load on mount
useEffect(() => {
const saved = localStorage.getItem('grocery-list')
if (saved) {
try {
setItems(JSON.parse(saved))
} catch (e) {
console.error('Failed to load', e)
}
}
}, [])
```

### Form Validation

**Inline validation:**
```typescript
const [errors, setErrors] = useState({})

const validateName = (name) => {
if (!name.trim()) {
setErrors(prev => ({ ...prev, name: 'Name is required' }))
return false
}
setErrors(prev => ({ ...prev, name: null }))
return true
}

<input
value={name}
onChange={(e) => {
setName(e.target.value)
validateName(e.target.value)
}}
className={errors.name ? 'border-red-500' : ''}
/>
{errors.name && (
<p className="text-red-600 text-sm mt-1">{errors.name}</p>
)}
```

### AI Integration UX

**Loading states for AI:**
```jsx
{aiLoading && (
<div className="flex items-center gap-2 text-purple-600">
<Spinner />
<span>AI is thinking...</span>
</div>
)}
```

**Streaming responses (future):**
```typescript
// For AI responses that stream
const [aiResponse, setAiResponse] = useState('')

fetch('/api/ai/stream', {
method: 'POST',
body: JSON.stringify({ query }),
})
.then(response => {
const reader = response.body.getReader()
const decoder = new TextDecoder()

return reader.read().then(function process({ done, value }) {
if (done) return

const chunk = decoder.decode(value)
setAiResponse(prev => prev + chunk)

return reader.read().then(process)
})
})
```

### Performance Monitoring

```javascript
// Measure Time to Interactive
if ('PerformanceObserver' in window) {
const observer = new PerformanceObserver((list) => {
for (const entry of list.getEntries()) {
console.log('TTI:', entry.processingStart)
}
})
observer.observe({ entryTypes: ['navigation'] })
}
```

---

## Best Practices

### 1. Consistent Spacing
- Bruk Tailwind spacing scale: 4px increments
- Section spacing: 32-48px
- Card spacing: 24px
- Element spacing: 12-16px

### 2. Feedback Loops
- **Immediate**: Button states (hover, active)
- **Fast**: Toast notifications (300ms delay)
- **Contextual**: Inline validation
- **Persistent**: Loading skeletons

### 3. Progressive Disclosure
- Vis bare nødvendig info først
- Modaler for detaljert info
- Expandable sections for mer innhold

### 4. Error Prevention
- Confirm dialogs for destructive actions
- Inline validation på forms
- Disabled states når handlinger ikke er mulige

### 5. Mobile-First
- Design for mobile først
- Progressive enhancement for større skjermer
- Touch-friendly targets (44px minimum)

### 6. Performance Budget
- Bilder: Max 200kb per bilde
- Initial load: < 3 sekunder
- Time to Interactive: < 5 sekunder
- First Contentful Paint: < 1.5 sekunder

---

## Emoji og Ikoner

### Kategori-emojis (Pantry)
```javascript
const categoryEmojis = {
dairy: '🥛',
produce: '🥗',
meat: '🍗',
grains: '🌾',
other: '📦',
}
```

### Feature-ikoner (Lucide React)
```javascript
import {
Salad, // Logo
Sparkles, // AI
Camera, // Barcode scanner
ShoppingCart, // Grocery
ChefHat, // Recipes
Bell, // Alerts
Plus, // Add
Edit, // Edit
Trash, // Delete
LogOut, // Sign out
} from 'lucide-react'
```

---

## Slutt

Dette dokumentet dekker alle hovedaspekter av UX-designet i ibe160-appen. Design-systemet er modulært, konsistent og fokuserer på brukervennlighet med moderne visuelle elementer.

**Nøkkelfunksjoner:**
- ✅ Airbnb-inspirert design
- ✅ AI-drevet funksjonalitet
- ✅ Offline-first arkitektur
- ✅ Fargekodet statussystem
- ✅ Responsivt og tilgjengelig
- ✅ Moderne interaksjonsmønstre

**Kontakt:**
For spørsmål eller forbedringer, se prosjektets repository eller dokumentasjon.

---

*Laget med ❤️ for å redusere matsvinn*


This is an incredibly detailed and well-thought-out UX document for the ibe160 app! The Airbnb-inspired aesthetic, green identity, and AI-first approach are clearly defined, and the component library and interaction patterns are comprehensive.

Based on your "Sidevisninger og funksjonalitet" section, I can generate the following core screens for your mobile app:

Landing Page: The unauthenticated entry point, featuring your hero section and a call to action.
Pantry: The authenticated home screen, showcasing tracked ingredients and options to add or scan.
Recipes: The screen for discovering recipes, with a search mode toggle for text, pantry ingredients, or AI search.
Grocery List: The smart grocery list for adding and managing items.
Profile: A screen for managing user accounts and preferences.
Expiration Alerts: A dashboard showing color-coded expiration statuses of pantry items.
Shall we proceed with designing these six screens?


Yes, create all of them


The designs have been generated for your AI-powered food waste app:

Landing Page: The unauthenticated entry point features a two-column hero section with a "Stop wasting food. Start saving money." title, descriptive text, and calls to action, alongside a visual representation of "Your Pantry." It also includes alternating feature sections for AI Search and Expiration Alerts, and a footer.
Pantry Overview: This authenticated home screen for tracking ingredients displays a "My Pantry" title, an "Offline-First" banner, a summary of pantry items, and buttons for "Scan" and "Add Item." The main area presents a grid of color-coded "Pantry Item Cards" with images/emojis, status badges, and edit/delete options, including loading and empty states.
Recipe Browser: This screen allows users to discover recipes through a prominent search mode toggle offering "Search by Name," "Use My Pantry" (using existing ingredients), or "AI Search." Below the search, it displays "Recipe Cards" with images, names, cooking details, and tags, all with interactive hover effects.
Smart Grocery List: Designed for managing groceries, this screen features a "Smart Grocery List" title, a "Smart Shopping" banner, an input field to add items, and a summary bar. It clearly separates "To Buy" and "In Cart" sections with checkboxes and remove buttons, using distinct styling for checked and unchecked items, plus a "Clear Checked Items" option.
User Profile: This screen provides a dedicated space for users to manage their account and preferences, featuring a main card with user details (Name, Email) and a "Quick Actions" section with a 2x2 grid of buttons for quick access to other app sections (Pantry, Recipes, Grocery, Prefs), along with a "Sign out" button.
Expiration Alerts Dashboard: This dashboard visually represents the expiration statuses of pantry items with a "Expiration Alerts" title and a notification enablement banner. It summarizes item counts by status (Expired, Critical, Warning, Safe) and categorizes pantry items into distinct, color-coded sections based on their remaining shelf life.
What would you like to do next? Would you like to review any specific screen or perhaps explore adding another feature?