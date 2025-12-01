# Story 4.4: Instant Idea Generation

Status: ready-for-dev

## Story

As a user,
I want to quickly get a recipe suggestion by typing a few ingredients, without affecting my persistent inventory,
so that I can get an instant meal idea.

## Acceptance Criteria
**Source:** [PRD - FR4.2: Instant Idea Generation](docs/PRD.md#fr42-instant-idea-generation), [Epics - Story 4.4](docs/epics.md#story-44-instant-idea-generation)
1. **Given** I am on the main screen
2. **When** I click the "Instant Idea" button
3. **Then** a prompt appears to enter 2-3 ingredients.
4. **And** an immediate AI-generated recipe suggestion is provided based on my input.
5. **And** this action does not modify my inventory.

## Tasks / Subtasks

- [ ] **Task 1: Ensure Main Screen UI is Ready** (AC: #1)
  - [ ] Verify that the main screen is available and ready for the "Instant Idea" button placement.
- [ ] **Task 2: Create "Instant Idea" Button Component** (AC: #2)
  - [ ] Create a new reusable component for the "Instant Idea" button.
  - [ ] Style the button as a primary call-to-action as per the UX specification.
  - [ ] Place the button on the main dashboard screen.
  - [ ] Add unit tests for the button component.
- [ ] **Task 3: Implement Ingredient Input Modal** (AC: #3)
  - [ ] Create a modal that opens when the "Instant Idea" button is clicked.
  - [ ] The modal should contain a text input field for ingredients and a "Get Idea" button.
  - [ ] Implement a "Live Search" pattern for ingredient input if possible.
  - [ ] Add unit tests for the modal component.
- [ ] **Task 4: Integrate with Gemini API** (AC: #4)
  - [ ] Create a new API route (`/api/recipes/instant-idea`) to handle the request.
  - [ ] This route will call the Google Gemini API with the user-provided ingredients.
  - [ ] The prompt to Gemini should be engineered to return a simple, clear recipe.
  - [ ] Add integration tests for the API route, mocking the Gemini API call.
- [ ] **Task 5: Display AI-Generated Recipe** (AC: #4)
  - [ ] Create a component to display the recipe returned by the Gemini API.
  - [ ] This could be a new modal or a dedicated section on the page.
  - [ ] The display should be clean and easy to read, showing ingredients and instructions.
  - [ ] Add unit tests for the recipe display component.
- [ ] **Task 6: Ensure No Inventory Modification** (AC: #5)
  - [ ] Verify that the "Instant Idea" flow does not interact with the user's inventory data.
  - [ ] Add a test to confirm that no inventory deduction occurs.

## Dev Notes

- **Architecture:** This feature will leverage a new API route in Next.js that communicates with the Google Gemini API. The frontend will consist of a new button and modal component.
- **Source Tree:**
    - `components/specific/InstantIdeaButton.tsx`
    - `components/specific/InstantIdeaModal.tsx`
    - `app/api/recipes/instant-idea/route.ts`
- **Testing:**
    - Unit test the "Instant Idea" button and modal components.
    - Integration test the `/api/recipes/instant-idea` route, mocking the Gemini API call.
    - E2E test the entire flow from clicking the button to seeing a recipe.

### Project Structure Notes

- The new components will be located in `components/specific` as they are unique to this feature.
- The new API route will be located in `app/api/recipes/instant-idea`.

### References

- [PRD - FR4.2: Instant Idea Generation](docs/PRD.md#fr42-instant-idea-generation)
- [Architecture - AI Application Integration](docs/architecture.md#ai-application-integration)
- [UX Design - Instant Idea Button](docs/ux-design-specification.md#novel-ux-patterns)
- [Epics - Story 4.4](docs/epics.md#story-44-instant-idea-generation)

## Dev Agent Record

### Context Reference

- `C:\ibe160\SmartMat\SG-Gruppe-Stavanger\docs\sprint-artifacts\4-4-instant-idea-generation.context.xml`

### Agent Model Used

Gemini 2.5 Pro and Flesh (in #yolo mode)

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2025-12-01: Initial draft validated and corrected.
- 2025-12-01: Story context generated and story marked ready for dev.
