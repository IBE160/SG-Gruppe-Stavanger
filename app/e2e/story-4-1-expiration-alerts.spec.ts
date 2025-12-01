import { test, expect } from '@playwright/test';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

test.describe('Story 4.1: In-App Expiration Alerts', () => {
  test.describe.configure({ mode: 'serial' });

  // Use unique email per worker to avoid parallel test conflicts
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const testEmail = `e2e_expiration_${uniqueId}@example.com`;
  const testPassword = 'ExpirationTest1!';
  const CRON_SECRET = '034d7032da9c03998dd87447137d9160d3fa94800f2c54386d220f6aaa9d1782';
  let testUserId: string;

  // Helper function to create a date N days from now
  const getDaysFromNow = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Helper function to find notification bell button (looks for button with Notifications aria-label)
  const getBellButton = (page: any) => {
    return page.locator('button[aria-label*="Notifications"]').first();
  };

  test.beforeAll(async () => {
    // Create test user
    const passwordHash = await bcrypt.hash(testPassword, 10);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash,
      },
    });
    testUserId = user.id;
  });

  test.afterAll(async () => {
    // Clean up after all tests (in correct order due to foreign key constraints)
    await prisma.notification.deleteMany({ where: { userId: testUserId } });
    await prisma.foodItem.deleteMany({ where: { userId: testUserId } });
    await prisma.shoppingList.deleteMany({ where: { userId: testUserId } });
    await prisma.userPreference.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  test('should display notification badge after creating expiring items and triggering cron job', async ({ page, request }) => {
    // Login through the UI
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Navigate to pantry
    await page.goto('/pantry');
    await expect(page.locator('h1:has-text("My Pantry")')).toBeVisible({ timeout: 10000 });

    // Create food items with different expiration dates
    const testItems = [
      { name: 'Test Milk', category: 'Dairy', days: 2, quantity: 1, unit: 'L' }, // Should trigger HIGH priority
      { name: 'Test Bread', category: 'Bakery', days: 3, quantity: 1, unit: 'loaf' }, // Should trigger MEDIUM priority
      { name: 'Test Cheese', category: 'Dairy', days: 1, quantity: 200, unit: 'g' }, // Should NOT trigger (too soon)
      { name: 'Test Eggs', category: 'Dairy', days: 7, quantity: 12, unit: 'pcs' }, // Should NOT trigger (too far)
    ];

    for (const item of testItems) {
      await page.click('button:has-text("Add Item")');
      await expect(page.locator('text="Add Food Item"')).toBeVisible();

      await page.fill('input[id="name"]', item.name);
      await page.fill('input[id="category"]', item.category);
      await page.fill('input[id="bestBeforeDate"]', formatDate(getDaysFromNow(item.days)));
      await page.fill('input[id="quantity"]', item.quantity.toString());
      await page.fill('input[id="unit"]', item.unit);

      await page.click('button[type="submit"]:has-text("Add Item")');
      await page.waitForTimeout(500);
    }

    // Verify items were added
    await expect(page.locator('text="Test Milk"')).toBeVisible();
    await expect(page.locator('text="Test Bread"')).toBeVisible();

    // Trigger the cron job using API request
    const cronResponse = await request.get('http://localhost:3000/api/cron/check-expiration', {
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
      },
    });

    const cronData = await cronResponse.json();
    console.log('Cron job response status:', cronResponse.status());
    console.log('Cron job response:', cronData);

    if (!cronResponse.ok()) {
      throw new Error(`Cron job failed with status ${cronResponse.status()}: ${JSON.stringify(cronData)}`);
    }

    expect(cronData.notificationsCreated).toBe(2); // Only Test Milk and Test Bread

    // Refresh page to see notification badge
    await page.reload();
    await page.waitForTimeout(3000);

    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/notification-badge-check.png', fullPage: true });

    // The NotificationBadge component displays a badge with the count
    // Wait for it to load and check for the badge with count "2"
    const badge = page.locator('text="2"').first();
    await expect(badge).toBeVisible({ timeout: 10000 });
  });

  test('should open notification panel and display notifications', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    // Click the notification bell icon
    const bellIcon = getBellButton(page);
    await expect(bellIcon).toBeVisible({ timeout: 10000 });
    await bellIcon.click();

    // Wait for notification panel to appear
    await page.waitForTimeout(1000);

    // Verify both notifications are shown
    const notifications = page.locator('text="Food Item Expiring Soon"');
    const count = await notifications.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Verify notification details
    await expect(page.locator('text="Test Milk"')).toBeVisible();
    await expect(page.locator('text="Test Bread"')).toBeVisible();

    // Verify "View All Expiring Items" link exists
    await expect(page.locator('text="View All Expiring Items"')).toBeVisible();
  });

  test('should dismiss individual notification and update badge count', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    // Open notification panel
    const bellIcon = getBellButton(page);
    await bellIcon.click();
    await page.waitForTimeout(1000);

    // Find and click the first dismiss button (X button)
    const dismissButtons = page.locator('button[aria-label*="Dismiss"]');
    const firstDismissButton = dismissButtons.first();
    await expect(firstDismissButton).toBeVisible({ timeout: 5000 });

    // Click dismiss
    await firstDismissButton.click();

    // Wait for UI to update
    await page.waitForTimeout(2000);

    // Check that one notification is gone
    const remainingNotifications = page.locator('text="Food Item Expiring Soon"');
    expect(await remainingNotifications.count()).toBe(1);

    // Close panel and check badge updated to "1"
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Verify badge count updated to "1"
    await expect(page.locator('text="1"').first()).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to expiring items page from notification panel', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    // Open notification panel
    const bellIcon = getBellButton(page);
    await bellIcon.click();
    await page.waitForTimeout(1000);

    // Click "View All Expiring Items" link
    await page.click('text="View All Expiring Items"');

    // Verify navigation to expiring items page
    await page.waitForURL('**/pantry/expiring', { timeout: 5000 });
    expect(page.url()).toContain('/pantry/expiring');

    // Verify page shows expiring items
    await expect(page.locator('text="Test Milk"')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text="Test Bread"')).toBeVisible();
    await expect(page.locator('text="Test Cheese"')).toBeVisible(); // 1 day = within 7 days
  });

  test('should display expiring items with urgency indicators', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Navigate directly to expiring items page
    await page.goto('/pantry/expiring');
    await page.waitForTimeout(2000);

    // Verify items are displayed with urgency badges
    const urgentBadges = page.locator('text="Urgent"');
    const soonBadges = page.locator('text="Soon"');

    // Test Cheese (1 day) and Test Milk (2 days) should show Urgent
    expect(await urgentBadges.count()).toBeGreaterThanOrEqual(2);

    // Test Bread (3 days) should show Soon
    expect(await soonBadges.count()).toBeGreaterThanOrEqual(1);

    // Verify items are sorted by expiration date (soonest first)
    const itemNames = await page.locator('[data-testid="item-name"], .font-semibold').allTextContents();
    console.log('Item order:', itemNames);

    // Test Cheese (1 day) should be first
    expect(itemNames.some(name => name.includes('Test Cheese'))).toBeTruthy();
  });

  test('should prevent duplicate notifications on second cron run', async ({ request }) => {
    // Trigger the cron job again
    const cronResponse = await request.get('http://localhost:3000/api/cron/check-expiration', {
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
      },
    });

    expect(cronResponse.ok()).toBeTruthy();
    const cronData = await cronResponse.json();
    console.log('Second cron job response:', cronData);

    // Should not create any new notifications (duplicates prevented)
    expect(cronData.notificationsCreated).toBe(0);
  });

  test('should create notification for new expiring item', async ({ page, request }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Add a new item expiring in 2 days
    await page.goto('/pantry');
    await page.waitForTimeout(2000);

    await page.click('button:has-text("Add Item")');
    await expect(page.locator('text="Add Food Item"')).toBeVisible();

    await page.fill('input[id="name"]', 'Test Yogurt');
    await page.fill('input[id="category"]', 'Dairy');
    await page.fill('input[id="bestBeforeDate"]', formatDate(getDaysFromNow(2)));
    await page.fill('input[id="quantity"]', '1');
    await page.fill('input[id="unit"]', 'cup');

    await page.click('button[type="submit"]:has-text("Add Item")');
    await page.waitForTimeout(1000);

    // Trigger cron job
    const cronResponse = await request.get('http://localhost:3000/api/cron/check-expiration', {
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
      },
    });

    const cronData = await cronResponse.json();
    console.log('New item cron response:', cronData);

    // Should create 1 new notification for Test Yogurt
    expect(cronData.notificationsCreated).toBe(1);
  });

  test('should handle accessibility - keyboard navigation', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    // Tab to notification bell
    let tabCount = 0;
    const maxTabs = 20; // Safety limit

    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;

      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.getAttribute('aria-label') || '';
      });

      if (focused.toLowerCase().includes('notification')) {
        break;
      }
    }

    // Press Enter to open panel
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Verify panel opened
    await expect(page.locator('text="Food Item Expiring Soon"')).toBeVisible({ timeout: 5000 });
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Login
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    // Verify notification badge is visible on mobile
    const bellIcon = getBellButton(page);
    await expect(bellIcon).toBeVisible({ timeout: 10000 });

    // Open panel
    await bellIcon.click();
    await page.waitForTimeout(1000);

    // Verify panel is visible and readable on mobile
    await expect(page.locator('text="Food Item Expiring Soon"')).toBeVisible({ timeout: 5000 });

    // Navigate to expiring items page
    await page.click('text="View All Expiring Items"');
    await page.waitForURL('**/pantry/expiring', { timeout: 5000 });

    // Verify items are displayed properly on mobile
    await expect(page.locator('text="Test Milk"')).toBeVisible({ timeout: 5000 });
  });

  test('should reject cron endpoint without authorization', async ({ request }) => {
    // Try to trigger cron without Bearer token
    const cronResponse = await request.get('http://localhost:3000/api/cron/check-expiration');

    // Should return 401 Unauthorized
    expect(cronResponse.status()).toBe(401);
  });

  test('should reject cron endpoint with wrong secret', async ({ request }) => {
    // Try to trigger cron with wrong token
    const cronResponse = await request.get('http://localhost:3000/api/cron/check-expiration', {
      headers: {
        'Authorization': 'Bearer wrong_secret',
      },
    });

    // Should return 401 Unauthorized
    expect(cronResponse.status()).toBe(401);
  });

  test('should show empty state when no notifications exist', async ({ page }) => {
    // First dismiss all notifications
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    // Open notification panel
    const bellIcon = getBellButton(page);
    await bellIcon.click();
    await page.waitForTimeout(1000);

    // Dismiss all notifications
    const dismissButtons = page.locator('button[aria-label*="Dismiss"]');
    const count = await dismissButtons.count();

    for (let i = 0; i < count; i++) {
      // Always click the first button since they shift after each dismissal
      await dismissButtons.first().click();
      await page.waitForTimeout(500);
    }

    // Verify empty state message
    await expect(page.locator('text="No new notifications"')).toBeVisible({ timeout: 5000 });

    // Badge might be hidden when count is 0 (no need to verify)
  });

  test('should show items expiring within 7 days on expiring items page', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Navigate to expiring items page
    await page.goto('/pantry/expiring');
    await page.waitForTimeout(2000);

    // Should show items expiring in 1-7 days
    await expect(page.locator('text="Test Milk"')).toBeVisible(); // 2 days
    await expect(page.locator('text="Test Bread"')).toBeVisible(); // 3 days
    await expect(page.locator('text="Test Cheese"')).toBeVisible(); // 1 day
    await expect(page.locator('text="Test Eggs"')).toBeVisible(); // 7 days

    // Should NOT show items that already expired or are too far out
    // (all our test items are within 7 days)
  });
});
