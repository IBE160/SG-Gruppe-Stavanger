# Story 4.3: Expiration Alerts

Status: ready-for-dev

## Story

As a user,
I want to receive alerts for items nearing expiration,
so that I can use them before they go to waste.

## Acceptance Criteria

1. Given I have items in my inventory with expiration dates, when items are 2-3 days from expiring, then I receive an in-app notification. (FR4.1)
2. The notification directly links to recipes using those expiring items (Expiration-to-Inspiration Loop, per UX). (FR4.1, UX)
3. Notifications are bundled to avoid fatigue (per UX and PRD). (FR4.1, UX, PRD)

## Tasks / Subtasks

- [ ] Implement backend logic for expiration detection (AC: 1)
  - [ ] Set up `PG Cron` job to periodically check for expiring items.
  - [ ] Implement Supabase function to identify expiring items.
  - [ ] Integrate with Supabase Realtime to push notifications to frontend.
- [ ] Implement `GET /api/notifications` API endpoint (AC: 1)
  - [ ] Define API route in `app/api/notifications/route.ts`.
  - [ ] Fetch expiring items from Supabase.
- [ ] Implement frontend notification display (AC: 1)
  - [ ] Integrate with Supabase Realtime client on frontend.
  - [ ] Display in-app notifications on the dashboard.
  - [ ] Create `ActionableAlertCard` component per UX design.
- [ ] Link notifications to relevant recipes (AC: 2)
  - [ ] Modify notification payload to include recipe IDs or links.
  - [ ] Implement navigation from `ActionableAlertCard` to recipe details.
- [ ] Implement notification bundling logic (AC: 3)
  - [ ] Group multiple expiring items into a single notification.
  - [ ] Define bundling rules (e.g., daily digest).
- [ ] Write unit and integration tests for expiration detection and notification API (AC: 1)
- [ ] Write unit and integration tests for recipe linking in notifications (AC: 2)
- [ ] Write unit and integration tests for notification bundling logic (AC: 3)
- [ ] Write E2E tests for the complete notification flow, covering all acceptance criteria (AC: 1, 2, 3)
## Dev Notes

- **Relevant architecture patterns and constraints**:
  - Notifications: Frontend components for in-app alerts, PG Cron for triggering alerts, Supabase Realtime for pushing alerts, Resend for email notifications, and Supabase's built-in email for authentication-related emails. [Source: docs/architecture.md#fr-category-to-architecture-mapping]
  - Background Jobs: PG Cron in Supabase for handling database-related background tasks like checking expiration dates. [Source: docs/architecture.md#decision-summary]
  - Real-time Features: Supabase Realtime for real-time features for expiration alerts and live inventory updates. [Source: docs/architecture.md#decision-summary]
  - API Endpoint: `GET /api/notifications` to get all notifications for the authenticated user. [Source: docs/architecture.md#api-endpoint-overview]

- **Source tree components to touch**:
  - Frontend: `app/(main)/dashboard/` (for displaying alerts), `components/specific/ActionableAlertCard.tsx` (per UX).
  - Backend (Next.js API Routes): `app/api/notifications/route.ts` (for `GET /api/notifications`).
  - Database: Supabase functions/triggers for PG Cron, Supabase Realtime setup.

- **Testing standards summary**:
  - Unit Tests: For API routes (`app/api/notifications/route.ts`) and database functions/triggers related to notifications.
  - Integration Tests: Verify interaction between API, database, and real-time features.
  - E2E Tests: Validate the user flow of receiving and interacting with expiration alerts in the UI.
  - Refer to `architecture.md` for overall Testing Strategy.

### Project Structure Notes

- **API Endpoint:** `app/api/notifications/route.ts` will implement the `GET /api/notifications` endpoint.
- **Frontend Components:**
  - Display of alerts on the dashboard: Likely in `app/(main)/dashboard/page.tsx`.
  - Specific UI component for an alert card: `components/specific/ActionableAlertCard.tsx` (per UX).
- **Backend Logic:** Supabase client interaction, PG Cron setup, and Realtime subscriptions will be handled within `lib/db.ts` or a dedicated `lib/notifications.ts` module.
- **Database Schema:** Modifications to existing inventory tables for expiration dates, or new tables for notification preferences/logs, will adhere to `snake_case` naming and RLS best practices.
- **UI/UX Patterns:** Will follow "Expiration-to-Inspiration Loop" and "Actionable Alert Card" as described in `ux-design-specification.md`.


### References

- [Source: docs/PRD.md#fr41---expiration-alerts]
- [Source: docs/epics.md#story-43-expiration-alerts]
- [Source: docs/ux-design-specification.md#22-novel-ux-patterns]
- [Source: docs/architecture.md#fr-category-to-architecture-mapping]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/4-3-expiration-alerts.context.xml

### Agent Model Used

Gemini-CLI

### Debug Log References

### Completion Notes List

### File List

## Change Log

- **2025-12-01**: Story drafted with initial acceptance criteria and tasks.

## Story

As a user,
I want to receive alerts for items nearing expiration,
so that I can use them before they go to waste.

## Acceptance Criteria

1. Given I have items in my inventory with expiration dates, when items are 2-3 days from expiring, then I receive an in-app notification. (FR4.1)
2. The notification directly links to recipes using those expiring items (Expiration-to-Inspiration Loop, per UX). (FR4.1, UX)
3. Notifications are bundled to avoid fatigue (per UX and PRD). (FR4.1, UX, PRD)

## Tasks / Subtasks

- [ ] Implement backend logic for expiration detection (AC: 1)
  - [ ] Set up `PG Cron` job to periodically check for expiring items.
  - [ ] Implement Supabase function to identify expiring items.
  - [ ] Integrate with Supabase Realtime to push notifications to frontend.
- [ ] Implement `GET /api/notifications` API endpoint (AC: 1)
  - [ ] Define API route in `app/api/notifications/route.ts`.
  - [ ] Fetch expiring items from Supabase.
- [ ] Implement frontend notification display (AC: 1)
  - [ ] Integrate with Supabase Realtime client on frontend.
  - [ ] Display in-app notifications on the dashboard.
  - [ ] Create `ActionableAlertCard` component per UX design.
- [ ] Link notifications to relevant recipes (AC: 2)
  - [ ] Modify notification payload to include recipe IDs or links.
  - [ ] Implement navigation from `ActionableAlertCard` to recipe details.
- [ ] Implement notification bundling logic (AC: 3)
  - [ ] Group multiple expiring items into a single notification.
  - [ ] Define bundling rules (e.g., daily digest).
- [ ] Write unit and integration tests for expiration detection and notification API (AC: 1)
- [ ] Write unit and integration tests for recipe linking in notifications (AC: 2)
- [ ] Write unit and integration tests for notification bundling logic (AC: 3)
- [ ] Write E2E tests for the complete notification flow, covering all acceptance criteria (AC: 1, 2, 3)
## Dev Notes

- **Relevant architecture patterns and constraints**:
  - Notifications: Frontend components for in-app alerts, PG Cron for triggering alerts, Supabase Realtime for pushing alerts, Resend for email notifications, and Supabase's built-in email for authentication-related emails. [Source: docs/architecture.md#fr-category-to-architecture-mapping]
  - Background Jobs: PG Cron in Supabase for handling database-related background tasks like checking expiration dates. [Source: docs/architecture.md#decision-summary]
  - Real-time Features: Supabase Realtime for real-time features for expiration alerts and live inventory updates. [Source: docs/architecture.md#decision-summary]
  - API Endpoint: `GET /api/notifications` to get all notifications for the authenticated user. [Source: docs/architecture.md#api-endpoint-overview]

- **Source tree components to touch**:
  - Frontend: `app/(main)/dashboard/` (for displaying alerts), `components/specific/ActionableAlertCard.tsx` (per UX).
  - Backend (Next.js API Routes): `app/api/notifications/route.ts` (for `GET /api/notifications`).
  - Database: Supabase functions/triggers for PG Cron, Supabase Realtime setup.

- **Testing standards summary**:
  - Unit Tests: For API routes (`app/api/notifications/route.ts`) and database functions/triggers related to notifications.
  - Integration Tests: Verify interaction between API, database, and real-time features.
  - E2E Tests: Validate the user flow of receiving and interacting with expiration alerts in the UI.
  - Refer to `architecture.md` for overall Testing Strategy.

### Project Structure Notes

- **API Endpoint:** `app/api/notifications/route.ts` will implement the `GET /api/notifications` endpoint.
- **Frontend Components:**
  - Display of alerts on the dashboard: Likely in `app/(main)/dashboard/page.tsx`.
  - Specific UI component for an alert card: `components/specific/ActionableAlertCard.tsx` (per UX).
- **Backend Logic:** Supabase client interaction, PG Cron setup, and Realtime subscriptions will be handled within `lib/db.ts` or a dedicated `lib/notifications.ts` module.
- **Database Schema:** Modifications to existing inventory tables for expiration dates, or new tables for notification preferences/logs, will adhere to `snake_case` naming and RLS best practices.
- **UI/UX Patterns:** Will follow "Expiration-to-Inspiration Loop" and "Actionable Alert Card" as described in `ux-design-specification.md`.


### References

- [Source: docs/PRD.md#fr41---expiration-alerts]
- [Source: docs/epics.md#story-43-expiration-alerts]
- [Source: docs/ux-design-specification.md#22-novel-ux-patterns]
- [Source: docs/architecture.md#fr-category-to-architecture-mapping]

## Dev Agent Record

### Context Reference

### Agent Model Used

Gemini 2.5 Pro and Flesh (in #yolo mode)

### Debug Log References

### Completion Notes List

### File List

## Change Log

- **2025-12-01**: Story drafted with initial acceptance criteria and tasks.
