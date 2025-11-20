# Epic Technical Specification

**Epic ID:** 008
**Project:** Smart Food & Recipe Platform
**Command:** `/sm epic-tech-content`

## Epic: Recipe for Expiring Items

### Description
Suggest recipes that prioritize using ingredients close to expiration.

### User Stories
1. STORY-032: Prioritize expiring ingredients in matching
2. STORY-033: "Use It Or Lose It" recipe section
3. STORY-034: Confirm ingredient usage after cooking
4. STORY-035: Deduct used ingredients from pantry

### Technical Requirements
- Expiration-weighted matching algorithm
- Confirmation dialog for ingredient deduction
- Inventory update logic
- Success feedback UI

### Dependencies
- Expiration Alerts (Epic 007)
- Flexible Recipe Matching (Epic 005)

### Acceptance Criteria
- [ ] Expiring items are prioritized in suggestions
- [ ] Users confirm before ingredients are deducted
- [ ] Pantry updates accurately after cooking
- [ ] Feedback: "You saved X items from waste"
