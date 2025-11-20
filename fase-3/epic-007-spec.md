# Epic Technical Specification

**Epic ID:** 007
**Project:** Smart Food & Recipe Platform
**Command:** `/sm epic-tech-content`

## Epic: Expiration Alerts

### Description
In-app notifications for food items nearing expiration (2-3 days before).

### User Stories
1. STORY-028: Check expiration dates daily
2. STORY-029: Display notification badge
3. STORY-030: Expiring items list view
4. STORY-031: Mark notification as read

### Technical Requirements
- Scheduled expiration checks
- Notification system
- Badge counter UI
- Notification Prisma model

### Dependencies
- Food Inventory (Epic 002)
- User authentication (Epic 001)

### Acceptance Criteria
- [ ] Alerts trigger 2-3 days before expiration
- [ ] Badge shows count of expiring items
- [ ] Users can view expiring items list
- [ ] Notifications can be dismissed
