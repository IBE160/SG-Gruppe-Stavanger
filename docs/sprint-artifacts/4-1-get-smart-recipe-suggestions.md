# Story 4.1: Get Smart Recipe Suggestions

Status: ready-for-dev

## Story

As a user,
I want to receive recipe suggestions based on my current inventory,
so that I can cook with ingredients I already have, especially those nearing expiration.

## Acceptance Criteria

1.  The system generates at least 3 recipe suggestions if there are sufficient ingredients. (Source: tech-spec-epic-4.md#FR3.1-AC1)
2.  Suggestions are prioritized based on ingredients that are nearing their expiration date. (Source: tech-spec-epic-4.md#FR3.1-AC2)
3.  The suggestions are 'meaningful' (contain at least 3 ingredients). (Source: tech-spec-epic-4.md#FR3.1-AC3)
4.  Each recipe card indicates if it "Uses expiring" items. (Source: tech-spec-epic-4.md#FR3.1-AC4)

## Tasks / Subtasks

- [ ] Task: (AC: #1, #2, #3) Implement API endpoint for smart recipe suggestions (`GET /api/recipes/suggestions`).
    - [ ] Subtask: Integrate with Spoonacular API for recipe data.
    - [ ] Subtask: Implement logic to prioritize suggestions based on expiring ingredients.
    - [ ] Subtask: Ensure suggestions are 'meaningful' (>=3 ingredients) and at least 3 are returned if possible.
    - [ ] Subtask (Test): Write unit test to verify that the suggestion logic correctly prioritizes expiring items.
    - [ ] Subtask (Test): Write integration test for the `GET /api/recipes/suggestions` endpoint to check for correct data structure and adherence to ACs #1 and #3.
- [ ] Task: (AC: #4) Implement UI component for displaying recipe suggestions.
    - [ ] Subtask: Design and implement the Recipe Card component.
    - [ ] Subtask: Add "Uses expiring" tag to recipe cards.
    - [ ] Subtask: Integrate with the `/api/recipes/suggestions` endpoint.
    - [ ] Subtask (Test): Write a component test using React Testing Library to verify the "Uses expiring" tag appears when the data requires it.
- [ ] Task: (AC: #1, #2, #3, #4, E2E) Write an end-to-end test for the smart suggestions workflow.
    - [ ] Subtask (Test): Create a test that simulates a user with expiring inventory, navigates to the suggestions page, and asserts that prioritized, meaningful suggestions are displayed correctly.

## Dev Notes

- **Relevant architecture patterns and constraints:**
    - API Pattern: RESTful API using Next.js API Routes (Route Handlers) ([Source: architecture.md#API-Pattern])
    - AI Application Integration: Spoonacular API for core recipe data ([Source: architecture.md#AI-Application-Integration])
    - Performance Optimization: Next.js caching, database indexing ([Source: architecture.md#Performance-Optimization])
    - Search: PostgreSQL Full-Text Search (FTS) for efficient recipe search ([Source: architecture.md#Search])
- **Source tree components to touch:**
    - `app/(main)/recipes/suggestions/page.tsx` for the suggestions UI.
    - `app/api/recipes/suggestions/route.ts` for the API endpoint.
    - `components/specific/RecipeCard.tsx` (new component/update existing).
    - `lib/api.ts` for Spoonacular API client.
    - `lib/db.ts` for database interactions (if needed for inventory querying).
- **Testing standards summary:** Multi-layered strategy including Unit Tests (`Jest`, `React Testing Library`), Integration Tests (API routes, database interactions), and End-to-End (E2E) Tests (`Playwright`, `Cypress`), focusing on user-centric scenarios. ([Source: architecture.md#Testing-Strategy])

### Project Structure Notes

- Alignment with unified project structure: `app/(main)/recipes/` for UI, `app/api/recipes/` for API, `components/specific/` for custom UI, `lib/` for utilities.

### References

- [Source: tech-spec-epic-4.md]
- [Source: PRD.md#FR3.1]
- [Source: epics.md#Story-4.1-Get-Smart-Recipe-Suggestions]
- [Source: architecture.md#API-Pattern]
- [Source: architecture.md#AI-Application-Integration]
- [Source: architecture.md#Performance-Optimization]
- [Source: architecture.md#Search]
- [Source: architecture.md#Testing-Strategy]
- [Source: ux-design-specification.md#Recipe-Card]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/4-1-get-smart-recipe-suggestions.context.xml`

### Agent Model Used

sm

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-30: Initial draft by `sm` agent.
- 2025-11-30: Updated by `sm` agent to address validation feedback. Added tech spec citation, detailed testing subtasks, explicit AC-to-Task mapping, and Change Log.
- 2025-11-30: Updated by `sm` agent to add explicit AC references to E2E task for improved traceability.
