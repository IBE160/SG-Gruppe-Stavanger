# User Story Ticket

**Story ID:** 001
**Epic:** Recipe Discovery
**Command:** `/sm *create-story`

## Story
As a user, I want to search for recipes so that I can find meals based on my preferences.

## Acceptance Criteria
- [ ] API endpoint GET /api/recipes/search
- [ ] Query parameter for search text
- [ ] Filter by category, time, ingredients
- [ ] Pagination with limit/offset
- [ ] Returns recipe list with metadata

## Technical Notes
- Use Prisma full-text search
- Implement caching
- Validate input

## Story Points
5

## Status
TODO
