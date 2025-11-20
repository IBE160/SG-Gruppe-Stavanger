# Epic Technical Specification

**Epic ID:** 005
**Project:** Smart Food & Recipe Platform
**Command:** `/sm epic-tech-content`

## Epic: Flexible Recipe Matching

### Description
Intelligently suggest recipes based on user's pantry, even when missing 1-2 ingredients.

### User Stories
1. STORY-019: Match recipes to pantry ingredients
2. STORY-020: Show missing ingredients count
3. STORY-021: Sort by ingredient match percentage
4. STORY-022: "What Can I Cook" dashboard

### Technical Requirements
- Ingredient matching algorithm
- Fuzzy matching for ingredient names
- Normalization of ingredient terms
- Match percentage calculation

### Dependencies
- Food Inventory (Epic 002)
- Recipe Discovery (Epic 004)

### Acceptance Criteria
- [ ] Recipes show with available/missing ingredients
- [ ] Users see "You need X more ingredients"
- [ ] No "no results" dead ends
- [ ] Matching is accurate with name variations
