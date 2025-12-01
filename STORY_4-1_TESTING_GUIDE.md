# Story 4.1: In-App Expiration Alerts - Testing Guide

**Status:** Ready for Testing
**Date:** 2025-12-01

## Prerequisites

✅ Database migration completed
✅ Prisma Client generated
✅ All code implemented
⚠️ CRON_SECRET environment variable (required for testing)

## Setup for Testing

### 1. Set Environment Variable

Generate and set the CRON_SECRET for testing:

```bash
# Generate a secure random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to your .env.local file
echo "CRON_SECRET=<paste-the-generated-secret-here>" >> app/.env.local
```

### 2. Restart Development Server

After adding the environment variable:

```bash
cd app
npm run dev
```

## Test Scenarios

### Test 1: Create Test Food Items

Create food items with expiration dates 2-3 days in the future to trigger notifications.

**Steps:**
1. Log in to the application
2. Navigate to "My Pantry"
3. Click "Add Food Item"
4. Add items with these expiration dates:
   - **Item 1**: Name: "Test Milk", Expires: 2 days from today
   - **Item 2**: Name: "Test Bread", Expires: 3 days from today
   - **Item 3**: Name: "Test Cheese", Expires: 1 day from today (should NOT trigger)
   - **Item 4**: Name: "Test Eggs", Expires: 7 days from today (should NOT trigger)

**Expected:** Items appear in your pantry

### Test 2: Manually Trigger Cron Job

Test the expiration checking cron job manually:

```bash
# Get your CRON_SECRET from .env.local
CRON_SECRET=<your-secret-here>

# Trigger the cron endpoint (Windows PowerShell)
curl -X GET http://localhost:3000/api/cron/check-expiration `
  -H "Authorization: Bearer $CRON_SECRET"

# Or (Windows CMD)
curl -X GET http://localhost:3000/api/cron/check-expiration ^
  -H "Authorization: Bearer YOUR_CRON_SECRET_HERE"

# Or (Git Bash / Linux / Mac)
curl -X GET http://localhost:3000/api/cron/check-expiration \
  -H "Authorization: Bearer $CRON_SECRET"
```

**Expected Response:**
```json
{
  "message": "Expiration check completed",
  "notificationsCreated": 2,
  "usersNotified": 1
}
```

**Expected:** 2 notifications created (for Test Milk and Test Bread, but NOT for Test Cheese or Test Eggs)

### Test 3: View Notifications in UI

**Steps:**
1. Refresh the page (or navigate to any main page: Dashboard, Pantry, Recipes)
2. Look at the top-right corner for the bell icon
3. Check the notification badge

**Expected:**
- Bell icon visible with red badge showing "2"
- Badge shows unread notification count

### Test 4: Open Notification Panel

**Steps:**
1. Click the bell icon
2. Panel should slide out/appear

**Expected:**
- Notification panel opens
- Shows 2 notifications
- Each notification displays:
  - Title: "Food Item Expiring Soon"
  - Message with item name and days until expiration
  - Item details (name, expiration date)
  - Dismiss button (X)
  - Timestamp ("Just now" or time ago)
- Color coding by priority:
  - Orange/Red border for Test Milk (2 days = HIGH priority)
  - Yellow border for Test Bread (3 days = MEDIUM priority)
- "View All Expiring Items" link at bottom

### Test 5: Dismiss Individual Notification

**Steps:**
1. In the notification panel, click the X button on one notification

**Expected:**
- Notification disappears from panel
- Badge count updates to "1"
- Notification marked as read in database

### Test 6: View All Expiring Items

**Steps:**
1. In notification panel, click "View All Expiring Items"

**Expected:**
- Navigates to `/pantry/expiring`
- Shows all items expiring within 7 days
- Displays:
  - Test Milk (Urgent badge, red border)
  - Test Bread (Soon badge, orange border)
  - Test Cheese (Urgent badge, red border)
  - Items sorted by expiration date (soonest first)
- Each item shows:
  - Name, category, quantity
  - Days until expiration
  - Expiration date
  - "View Details" link

### Test 7: Dismiss All Notifications

**Steps:**
1. Open notification panel
2. Dismiss all remaining notifications

**Expected:**
- Badge disappears when count reaches 0
- Panel shows "No new notifications" message

### Test 8: Duplicate Prevention

**Steps:**
1. Run the cron job again (same curl command from Test 2)

**Expected Response:**
```json
{
  "message": "Expiration check completed",
  "notificationsCreated": 0,
  "usersNotified": 0
}
```

**Expected:** No duplicate notifications created

### Test 9: New Item Triggers Notification

**Steps:**
1. Add a new food item with expiration date 2 days from now
2. Run cron job again

**Expected:**
- 1 new notification created for the new item
- Badge shows "1" (if all previous notifications were dismissed)

### Test 10: Notification Auto-Refresh

**Steps:**
1. Keep a page open for 5+ minutes
2. Create a new expiring item via another browser/tab
3. Run cron job
4. Wait for auto-refresh (polls every 5 minutes)

**Expected:**
- Badge count updates automatically after 5 minutes
- No page refresh needed

## API Testing

### Test API Endpoints Directly

#### 1. Get Notifications
```bash
# Requires authentication - test in browser console or with session cookie
fetch('/api/notifications/expiring')
  .then(r => r.json())
  .then(console.log)
```

**Expected Response:**
```json
{
  "notifications": [
    {
      "id": "...",
      "type": "EXPIRATION_WARNING",
      "title": "Food Item Expiring Soon",
      "message": "Your Test Milk expires in 2 days...",
      "isRead": false,
      "priority": "HIGH",
      "relatedItem": {
        "id": "...",
        "name": "Test Milk",
        "bestBeforeDate": "2025-12-03T00:00:00.000Z"
      },
      "createdAt": "..."
    }
  ],
  "unreadCount": 2
}
```

#### 2. Dismiss Notification
```bash
# In browser console, replace NOTIFICATION_ID
const notificationId = 'YOUR_NOTIFICATION_ID_HERE';

fetch(`/api/notifications/${notificationId}/dismiss`, {
  method: 'POST'
})
  .then(r => r.json())
  .then(console.log);
```

**Expected Response:**
```json
{
  "message": "Notification dismissed successfully",
  "notificationId": "..."
}
```

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab to notification bell icon
- [ ] Press Enter/Space to open panel
- [ ] Tab through notifications
- [ ] Tab to dismiss buttons
- [ ] Press Enter to dismiss
- [ ] Tab to "View All" link
- [ ] Press Escape to close panel

### Screen Reader Testing
- [ ] Bell icon has descriptive aria-label
- [ ] Badge count announced
- [ ] Panel has proper role="dialog"
- [ ] Notification content is readable
- [ ] Dismiss buttons have aria-labels

### Visual Testing
- [ ] Color contrast meets WCAG AA standards
- [ ] Priority colors are distinguishable
- [ ] Text is readable at all sizes
- [ ] Icons have sufficient size

## Responsive Testing

Test on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

**Check:**
- Notification bell positioned correctly
- Panel doesn't overflow screen
- Notifications are readable
- Touch targets are large enough (44px minimum)

## Performance Testing

### 1. Notification Fetch Time
```bash
# In browser DevTools Network tab
# Filter by: /api/notifications/expiring
# Check response time
```

**Target:** < 500ms

### 2. Cron Job Execution Time

Create 50+ food items and run cron job:

**Target:** < 60 seconds for up to 10,000 items

## Edge Cases

### Test Edge Cases:
- [ ] No food items in inventory
- [ ] No expiring items
- [ ] Item expires exactly today
- [ ] Item expires exactly tomorrow
- [ ] Item expired yesterday (should not notify)
- [ ] Very long item names (truncation)
- [ ] Special characters in item names
- [ ] User with no notifications
- [ ] User with 100+ notifications

## Security Testing

### Authentication
- [ ] Cron endpoint rejects requests without Bearer token
- [ ] Cron endpoint rejects incorrect Bearer token
- [ ] Notification API rejects unauthenticated requests
- [ ] Dismiss API validates notification ownership
- [ ] Users can't access other users' notifications

### Authorization
```bash
# Try to dismiss another user's notification
# Should return 401 Unauthorized
```

## Database Verification

Check that the database is properly updated:

```javascript
// In browser console (after authentication)
// Or in Node.js with Prisma Client

// Check notifications were created
await prisma.notification.findMany({
  where: { userId: 'YOUR_USER_ID' },
  include: { relatedItem: true }
})

// Check isRead status after dismissal
await prisma.notification.findUnique({
  where: { id: 'NOTIFICATION_ID' }
})
```

## Troubleshooting

### Issue: Badge doesn't show up
- Check browser console for errors
- Verify user is authenticated
- Check if notifications exist in database
- Try hard refresh (Ctrl+Shift+R)

### Issue: Cron job returns 401
- Verify CRON_SECRET is set in environment
- Check Authorization header format: `Bearer YOUR_SECRET`
- Restart dev server after adding environment variable

### Issue: No notifications created
- Verify food items expire in 2-3 days (not 1 day, not 4+ days)
- Check date calculations
- Look for errors in server logs
- Verify items belong to logged-in user

### Issue: Duplicate notifications
- Check database for existing notifications
- Verify duplicate prevention logic
- Clear test notifications and try again

## Success Criteria

Story 4.1 is considered successfully tested when:

- ✅ Notifications are created for items expiring in 2-3 days
- ✅ No notifications for items outside this window
- ✅ Badge displays correct unread count
- ✅ Panel shows all notifications with correct data
- ✅ Individual dismissal works
- ✅ Navigation to expiring items page works
- ✅ Duplicate prevention works
- ✅ Auto-refresh updates badge (5 min interval)
- ✅ All accessibility checks pass
- ✅ Responsive design works on all screen sizes
- ✅ Performance targets met (<500ms fetch, <60s cron)
- ✅ Security validations pass
- ✅ Edge cases handled gracefully

## Next Steps After Testing

1. Document any bugs found
2. Fix critical issues
3. Deploy to staging/production
4. Configure Vercel cron job for production
5. Monitor cron job logs in Vercel dashboard
6. Mark Story 4.1 as COMPLETE

---

**Testing Guide Version:** 1.0
**Created:** 2025-12-01
**Story:** 4.1 - In-App Expiration Alerts
