# Epic Technical Specification

**Epic ID:** 006
**Project:** Smart Food & Recipe Platform
**Command:** `/sm epic-tech-content`

## Epic: Smart Grocery List

### Description
Automatically generate shopping lists for recipes, excluding items already in pantry.

### User Stories
1. STORY-023: Generate list from recipe
2. STORY-024: Exclude pantry items
3. STORY-025: Combine multiple recipes
4. STORY-026: Edit/customize shopping list
5. STORY-027: Export/share shopping list

### Technical Requirements
- Recipe ingredient parsing
- Pantry comparison logic
- List aggregation and deduplication
- Export functionality

### Dependencies
- Food Inventory (Epic 002)
- Recipe Discovery (Epic 004)

### Acceptance Criteria
- [ ] Lists exclude items user already has
- [ ] Multiple recipes combine correctly
- [ ] Users can edit generated lists
- [ ] Lists can be exported/shared
