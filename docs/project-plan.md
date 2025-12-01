# Project Plan

## Instruksjoner

1. Der hvor det står {prompt / user-input-file}, kan dere legge inn en egen prompt eller filnavn for å gi ekstra instruksjoner. Hvis dere ikke ønsker å legge til ekstra instruksjoner, kan dere bare fjerne denne delen.
2. Hvis jeg har skrevet noe der allerede, f.eks. "Root Cause Analysis and Solution Design for Player Inactivity", så kan dere bytte ut min prompt med deres egen.


## Fase 0

- [x] /run-agent-task analyst *workflow-init
  - [x] File: bmm-workflow-status.yaml
- [x] Brainstorming
  - [x] /run-agent-task analyst *brainstorm "Root Cause Analysis and Solution Design for Player Inactivity"
    - [x] File: brainstorming-session-results-date.md
  - [x] /run-agent-task analyst *brainstorm "User Flow Deviations & Edge Cases"
    - [x] File: brainstorming-session-results-date.md
  - [x] /run-agent-task analyst *brainstorm "Brainstorm what it means to have a paid user"
    - [x] File: brainstorming-session-results-date.md
- [ ] Research
  - [x] /run-agent-task analyst *research "Which AI library should we use for orchestrating LLM interactions?"
    - [x] File: research-technical-date.md
- [x] Product Brief
  - [x] /run-agent-task analyst *product-brief "Read the two brainstorming sessions the research session and the @proposal.md file, and create a product brief for the project."
    - [x] File: product-brief.md

## Fase 1

- [x] Planning
  - [x] /run-agent-task pm *prd
  - [x] /run-agent-task pm *validate-prd
  - [x] /run-agent-task ux-designer *create-ux-design {prompt / user-input-file}
    - [x] File: ux-design-specification.md
    - [x] File: ux-color-themes.html
    - [x] File: ux-design-directions.html
  - [x] /run-agent-task ux-designer *validate-ux-design {prompt / user-input-file}

## Fase 2

- [x] Solutioning
  - [x] /run-agent-task architect *create-architecture {prompt / user-input-file}
    - [x] File: architecture.md
  - [x] /run-agent-task pm *create-epics-and-stories {prompt / user-input-file}
    - [x] File: epics.md
  - [x] /run-agent-task tea *test-design {prompt / user-input-file}
  - [x] /run-agent-task architect *solutioning-gate-check {prompt / user-input-file}

## Fase 3

- [ ] Implementation
  - [x] /run-agent-task sm *sprint-planning {prompt / user-input-file}
    - [x] File: sprint-artifacts/sprint-status.yaml
  - foreach epic in sprint planning:
    - [ ] /run-agent-task sm create-epic-tech-context {prompt / user-input-file}
      - [x] File: sprint-artifacts/tech-spec-epic-1.md
      - [x] File: sprint-artifacts/tech-spec-epic-2.md
      - [x] File: sprint-artifacts/tech-spec-epic-3.md
      - [x] File: sprint-artifacts/tech-spec-epic-4.md
    - [ ] /run-agent-task sm validate-epic-tech-context {prompt / user-input-file}
    - [x] epic 1 story
      - [x] File: validation-report-2025-11-28_20-00-00-.md (for epic 1)
      - [ ] File: validation-report{{epic_2}}.md
      - [ ] File: validation-report{{epic_3}}.md
      - [ ] File: validation-report{{epic_4}}.md
    - [ ] epic story 2
      - [ ] File: validation-report2025-11-29.md
      - [ ] File: validation-report{{epic_2}}.md
      - [ ] File: validation-report{{epic_2}}.md
      - [ ] File: validation-report{{epic_2}}.md
    - [ ] epic story 3
      - [ ] File: validation-report{{epic_2}}.md
      - [ ] File: validation-report{{epic_2}}.md
      - [ ] File: validation-report{{epic_2}}.md
      - [ ] File: validation-report{{epic_2}}.md
    - [ ] epic story 4
      - [ ] File: validation-report{{epic_2}}.md
      - [ ] File: validation-report{{epic_2}}.md
      - [ ] File: validation-report{{epic_2}}.md
      - [ ] File: validation-report{{epic_2}}.md
    - foreach story in epic:
      - [ ] /run-agent-task sm *create-story {prompt / user-input-file}
      - [x] Epic 1 story
        - [x] File: sprint-artifacts/1-1-project-initialization.md
        - [x] File: sprint-artifacts/1-2-database-setup.md
        - [x] File: sprint-artifacts/1-3-user-registration.md
        - [x] File: sprint-artifacts/1-4-user-login.md
        - [x] File: sprint-artifacts/1-5-user-logout.md
      - [x] Epic 2 story
        - [x] File: sprint-artifacts/2-1-add-food-item.md
        - [x] File: sprint-artifacts/2-2-view-inventory.md
        - [x] File: sprint-artifacts/2-3-edit-food-item.md
        - [x] File: sprint-artifacts/2-4-delete-food-item.md
      - [x] Epic 3 story
        - [x] File: sprint-artifacts/3-1-search-recipes.md
        - [x] File: sprint-artifacts/3-2-view-recipe-details.md
      - [ ] Epic 4 story
        - [x] File: sprint-artifacts/4-1-get-smart-recipe-suggestions.md
        - [x] File: sprint-artifacts/4-2-mark-recipe-as-cooked-and-deduct-inventory.md
        - [ ] File: sprint-artifacts/4-3-expiration-alerts.md
        - [ ] File: sprint-artifacts/4-4-instant-idea-generation.md
        - [ ] File: sprint-artifacts/{{story_key}}.md
      - [ ] /run-agent-task sm *validate-create-story {prompt / user-input-file}
      - [ ] /run-agent-task sm *create-story-context {prompt / user-input-file}
      - [x] Epic 1 context
        - [x] File: sprint-artifacts/1-1-project-initialization.context.xml
        - [x] File: sprint-artifacts/1-2-database-setup.context.xml
        - [x] File: sprint-artifacts/1-3-user-registration.context.xml
        - [x] File: sprint-artifacts/1-4-user-login.context.xml
        - [x] File: sprint-artifacts/1-5-user-logout.context.xml
      - [x] Epic 2 context
        - [x] File: sprint-artifacts/2-1-add-food-item.context.xml
        - [x] File: sprint-artifacts/2-2-view-inventory.context.xml
        - [x] File: sprint-artifacts/2-3-edit-food-item.context.xml
        - [x] File: sprint-artifacts/2-4-delete-food-item.context.xml
      - [x] Epic 3 context
        - [x] File: sprint-artifacts/3-1-search-recipes.context.xml
        - [x] File: sprint-artifacts/3-2-view-recipe-details.context.xml
      - [ ] Epic 4 context
        - [x] File: sprint-artifacts/4-1-get-smart-recipe-suggestions.context.xml
        - [x] File: sprint-artifacts/4-2-mark-recipe-as-cooked-and-deduct-inventory.context.xml
        - [ ] File: sprint-artifacts/4-3-expiration-alert.context.xml
        - [ ] File: sprint-artifacts/4-4-instant-idea-generation.context.xml
        - [ ] File: sprint-artifacts/{{story_key}}.context.xml
      - [ ] /run-agent-task sm *validate-story-context {prompt / user-input-file}
      - [ ] /run-agent-task sm *story-ready-for-dev {prompt / user-input-file}
      while code-review != approved:
        - [ ] /run-agent-task dev *develop-story {prompt / user-input-file}
        - [ ] /run-agent-task dev *code-review {prompt / user-input-file}
      - [ ] /run-agent-task dev *story-done {prompt / user-input-file}
      - [ ] /run-agent-task sm *test-review {prompt / user-input-file}
    - [ ] /run-agent-task sm *epic-retrospective {prompt / user-input-file}





## BMAD workflow

<img src="images/bmad-workflow.svg" alt="BMAD workflow">