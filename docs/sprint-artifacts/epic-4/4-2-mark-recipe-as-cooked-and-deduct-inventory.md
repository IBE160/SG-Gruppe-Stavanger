# Story 4.2: Mark Recipe as Cooked and Deduct Inventory

Status: ready-for-dev

## Story

As a user,
I want to mark a recipe as cooked,
so that the used ingredients are automatically removed from my inventory.

## Acceptance Criteria

1.  When a user indicates they have cooked a recipe, the system prompts for confirmation of the ingredients used. (Source: epics.md#Story-4.2)
2.  Upon confirmation, the quantities of the used ingredients are deducted from the user's inventory. (Source: epics.md#Story-4.2)
3.  The inventory deduction is a deliberate, confirmed action, involving a modal confirmation step. (Source: epics.md#Story-4.2, ux-design-specification.md#Inventory-Deduction-Modal)

## Tasks / Subtasks

- [ ] Task: (AC: #1, #2, #3) Implement the "Mark as Cooked" functionality.
    - [ ] Subtask: Create the API endpoint `POST /api/recipes/{id}/cook` to handle the logic for deducting ingredients from the inventory.
    - [ ] Subtask: Develop the "Inventory Deduction Modal" component as specified in the UX design. This modal should list the ingredients of the recipe and allow the user to confirm their usage.
    - [ ] Subtask: Integrate the modal with the recipe details page, triggering it when the user clicks the "I Cooked This" button.
    - [ ] Subtask (Test): Write an integration test for the `POST /api/recipes/{id}/cook` endpoint to ensure it correctly updates inventory quantities in the database.
    - [ ] Subtask (Test): Write a component test for the "Inventory Deduction Modal" to verify its state management and user interactions.
- [ ] Task: (AC: #1, #2, #3, E2E) Write an end-to-end test for the "Mark as Cooked" workflow.
    - [ ] Subtask (Test): The test should simulate a user viewing a recipe, marking it as cooked, confirming the ingredients in the modal, and then verifying that the inventory is correctly updated.

## Dev Notes

- **Relevant architecture patterns and constraints:**
    - API Pattern: RESTful API using Next.js API Routes (Route Handlers). The endpoint `POST /api/recipes/{id}/cook` will be created. ([Source: architecture.md#API-Pattern])
    - Data Persistence: Supabase PostgreSQL will be updated. ([Source: architecture.md#Data-Persistence])
    - Security: The API endpoint must be secured to ensure users can only modify their own inventory. ([Source: architecture.md#Security-Architecture])
- **Source tree components to touch:**
    - `app/api/recipes/[id]/cook/route.ts` (new file for the API endpoint).
    - `app/(main)/recipes/[id]/page.tsx` (to add the "I Cooked This" button).
    - `components/specific/InventoryDeductionModal.tsx` (new component).
    - `lib/db.ts` (to add database update logic).
- **Testing standards summary:** Follow the multi-layered testing strategy (Unit, Integration, E2E) outlined in the architecture. ([Source: architecture.md#Testing-Strategy])

### Project Structure Notes

- The implementation will follow the established project structure. The new API route will be nested under `app/api/recipes/`, and the new specific component will reside in `components/specific/`. No conflicts are anticipated.

### References

- [Source: epics.md#Story-4.2-Mark-Recipe-as-Cooked-and-Deduct-Inventory]
- [Source: PRD.md#FR3.4]
- [Source: architecture.md#API-Contracts]
- [Source: ux-design-specification.md#Inventory-Deduction-Modal]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/4-2-mark-recipe-as-cooked-and-deduct-inventory.context.xml

### Agent Model Used

Gemini 2.5 Pro and Flesh (in #yolo mode)

sm

### Debug Log References

### Completion Notes List

### File List

## Change Log
