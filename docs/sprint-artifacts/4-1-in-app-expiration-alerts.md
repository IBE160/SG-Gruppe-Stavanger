# Story 4.1: In-App Expiration Alerts

Status: pending

## Story

As a **User**,
I want to receive in-app notifications for food items nearing expiration,
so that I can reduce food waste by using items before they expire.

## Acceptance Criteria

*   **Given** I have food items in my inventory with expiration dates,
*   **When** a food item is 2-3 days away from its expiration date,
*   **Then** I receive an in-app notification alerting me about the soon-to-expire item.
*   **And** clicking the notification takes me to a view showing all soon-to-expire items.
*   **And** the notification system is unintrusive but effective (e.g., badge indicator, not blocking modals).
*   **And** notifications are generated automatically by a background process without user action.
*   **And** I can dismiss notifications to clear them from my notification panel.
*   **And** the notification displays relevant information (item name, days until expiration).
*   **And** the notification UI adheres to the "Farmhouse Kitchen" aesthetic and is accessible.

## Tasks / Subtasks

- [ ] **Update Prisma Schema for Notifications (AC: Data model ready)**
  - [ ] Add `Notification` model to Prisma schema
  - [ ] Define fields: id, type, title, message, isRead, priority, relatedItemId, userId, createdAt, expiresAt
  - [ ] Add relation to User model
  - [ ] Add relation to FoodItem model (optional)
  - [ ] Run Prisma migration to create database tables
  - [ ] **Testing:** Verify schema migration successful
- [ ] **Create Expiration Checking Cron Job (AC: Notifications generated automatically)**
  - [ ] Create `/api/cron/check-expiration` GET endpoint
  - [ ] Implement Vercel Cron secret authentication
  - [ ] Query FoodItems where bestBeforeDate is within 2-3 days
  - [ ] Check for existing notifications to avoid duplicates
  - [ ] Create new Notification records for items nearing expiration
  - [ ] Set appropriate type, title, message, and priority
  - [ ] Return summary of notifications created
  - [ ] **Testing:** Unit test expiration detection logic with various dates
- [ ] **Configure Vercel Cron Job (AC: Background process scheduled)**
  - [ ] Create `vercel.json` configuration for cron job
  - [ ] Schedule cron to run daily (or twice daily)
  - [ ] Set up cron secret in Vercel environment variables
  - [ ] Document cron job schedule
  - [ ] **Testing:** Manually trigger cron endpoint and verify execution
- [ ] **Create Notification Fetch API Route (AC: Backend endpoint functional)**
  - [ ] Create `/api/notifications/expiring` GET endpoint
  - [ ] Implement authentication check using NextAuth.js
  - [ ] Query Notifications for current user where isRead is false
  - [ ] Include related FoodItem data in response
  - [ ] Sort by priority and creation date
  - [ ] Support optional query parameters (limit, includeRead)
  - [ ] Return notifications array and unreadCount
  - [ ] **Testing:** Unit test API route with valid/invalid requests
- [ ] **Create Notification Dismiss API Route (AC: User can dismiss notifications)**
  - [ ] Create `/api/notifications/[id]/dismiss` POST endpoint
  - [ ] Implement authentication check
  - [ ] Validate notification ownership (userId match)
  - [ ] Update isRead field to true
  - [ ] Return success message
  - [ ] Handle not found and unauthorized cases
  - [ ] **Testing:** Test dismiss functionality with various scenarios
- [ ] **Create NotificationBadge Component (AC: Visual indicator)**
  - [ ] Create `NotificationBadge` client component
  - [ ] Display unread notification count
  - [ ] Style badge according to "Farmhouse Kitchen" aesthetic
  - [ ] Make badge clickable to open notification panel
  - [ ] Update count in real-time when notifications dismissed
  - [ ] Add accessibility features (aria-labels)
  - [ ] **Testing:** Render component with various counts
- [ ] **Create NotificationPanel Component (AC: Notification display)**
  - [ ] Create `NotificationPanel` client component
  - [ ] Implement dropdown or slide-out panel UI
  - [ ] Display list of notifications with title, message, timestamp
  - [ ] Show related item details (name, expiration date)
  - [ ] Include dismiss button for each notification
  - [ ] Add "View All Expiring Items" link
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] Ensure responsive design
  - [ ] **Testing:** Test panel with various notification types and counts
- [ ] **Create ExpiringItemsList Component (AC: User can view all expiring items)**
  - [ ] Create `ExpiringItemsList` client component
  - [ ] Fetch and display all food items nearing expiration
  - [ ] Show item name, expiration date, days remaining
  - [ ] Add visual urgency indicators (color coding by priority)
  - [ ] Link to inventory detail or edit view
  - [ ] Style according to "Farmhouse Kitchen" aesthetic
  - [ ] Ensure accessibility
  - [ ] **Testing:** Render component with expiring items
- [ ] **Integrate Notification System into App Layout (AC: Notifications accessible app-wide)**
  - [ ] Add NotificationBadge to main navigation or header
  - [ ] Set up notification data fetching on app load
  - [ ] Implement polling or periodic refresh for new notifications
  - [ ] Handle notification click navigation
  - [ ] Ensure consistent placement across pages
  - [ ] **Testing:** Navigate app and verify badge always visible
- [ ] **Implement Notification Click Navigation (AC: Clicking notification navigates correctly)**
  - [ ] Add click handler to notification items
  - [ ] Navigate to ExpiringItemsList view or specific item
  - [ ] Pass relevant context (item ID, filter parameters)
  - [ ] Close notification panel after navigation
  - [ ] **Testing:** Click notifications and verify navigation
- [ ] **Optimize Performance (AC: Notifications load quickly)**
  - [ ] Implement efficient database queries with indexes
  - [ ] Cache notification data appropriately
  - [ ] Optimize cron job for large inventories
  - [ ] Measure notification fetch time (<500ms target)
  - [ ] **Testing:** Performance test with various data volumes
- [ ] **Ensure Accessibility (AC: UI accessible)**
  - [ ] Test keyboard navigation for notification panel
  - [ ] Verify screen reader compatibility
  - [ ] Ensure sufficient color contrast for urgency indicators
  - [ ] Add appropriate ARIA labels and roles
  - [ ] **Testing:** Accessibility audit with automated tools and manual testing

## Dev Notes

### Relevant architecture patterns and constraints
*   Scheduled background jobs using Vercel Cron Jobs.
*   Next.js API Routes for notification CRUD operations.
*   Client-server architecture with real-time UI updates.
*   Prisma ORM for database interactions.
*   NextAuth.js for authentication and authorization.
*   Component-based architecture with shadcn/ui.
*   "Farmhouse Kitchen" aesthetic using Tailwind CSS.
*   Performance optimization targeting <500ms notification fetch time.
*   Notification generation must avoid duplicates.
*   Time-based queries requiring careful date comparison logic.

### Source tree components to touch
*   `prisma/schema.prisma` - Add Notification model
*   `app/api/cron/check-expiration/route.ts` - Expiration checking cron job
*   `app/api/notifications/expiring/route.ts` - Notification fetch endpoint
*   `app/api/notifications/[id]/dismiss/route.ts` - Dismiss endpoint
*   `components/notifications/NotificationBadge.tsx` - Badge component
*   `components/notifications/NotificationPanel.tsx` - Panel component
*   `components/notifications/ExpiringItemsList.tsx` - Expiring items view
*   `app/layout.tsx` - Integrate notification badge in layout
*   `vercel.json` - Cron job configuration
*   `lib/expiration-checker.ts` - Expiration checking logic (optional service layer)

### Testing standards summary
*   **Unit Tests:** Expiration detection logic, date calculations, API route validation, component rendering, notification duplicate prevention.
*   **Integration Tests:** Cron job with database, API routes with authentication, notification creation and dismissal flow.
*   **End-to-End (E2E) Tests:** Complete flow from cron job execution to user viewing and dismissing notifications.
*   **Performance Tests:** Notification fetch time (<500ms), cron job execution time (<60s for large datasets).
*   **UI/UX Tests:** Visual aesthetic, notification badge placement, panel usability, responsiveness, accessibility (WCAG 2.1 AA).
*   **Edge Case Tests:** Items expiring today, tomorrow, in 2 days, in 3 days (boundary testing), empty inventory, duplicate notification prevention, concurrent notification creation.
*   **Security Testing:** Cron endpoint protection, authentication on all routes, user isolation, authorization for dismissal.

### Project Structure Notes

This story establishes the foundation for waste reduction features by implementing the notification system. It requires scheduled background jobs (Vercel Cron) and integration with the inventory system from Epic 2. The expiration checking logic must be efficient and accurate, especially as the user base and inventory sizes grow.

### References

*   **Epics:** `docs/epics.md#Epic-4`
*   **PRD:** `docs/PRD.md#FR-005.1`
*   **Architecture:** `docs/architecture.md#Backend-Architecture` (Cron Jobs)
*   **UX Design Specification:** `docs/ux-design-specification.md#Notification-Components`
*   **Epic Technical Specification (Epic 4):** `docs/sprint-artifacts/tech-spec-epic-4.md#Story-4.1`

## Dev Agent Record

### Context Reference

*   4-1-in-app-expiration-alerts.context.xml

### Agent Model Used

### Debug Log References

### Completion Notes
**Completed:**
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing, cron job scheduled and tested

### Completion Notes List

### File List
*   `docs/sprint-artifacts/4-1-in-app-expiration-alerts.md` (created)

### Change Log

- Initialized: 2025-12-01
