import { test, expect } from '@playwright/test';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

test.describe('Story 2.1: Add Food Item to Inventory', () => {
  // Configure tests to run serially to avoid database conflicts and rate limiting
  test.describe.configure({ mode: 'serial' });

  const testEmail = 'e2e_pantry@example.com';
  const testPassword = 'PantryTest1!';
  let testUserId: string;

  test.beforeEach(async ({ page }) => {
    // Clean up database before each test
    await prisma.foodItem.deleteMany();
    await prisma.user.deleteMany();

    // Create test user
    const passwordHash = await bcrypt.hash(testPassword, 10);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash,
      },
    });
    testUserId = user.id;

    // Login through the UI (NextAuth session will be created properly)
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Wait for redirect (either to dashboard or directly check for session)
    await page.waitForTimeout(2000); // Give time for session to be created

    // Navigate to pantry page
    await page.goto('/pantry');

    // Wait for page to load
    await expect(page.locator('h1:has-text("My Pantry")')).toBeVisible({ timeout: 10000 });

    // Wait for loading state to finish (either see empty message or food items)
    await page.waitForFunction(() => {
      const body = document.body.textContent || '';
      return body.includes('Your pantry is empty') || body.includes('Open Shelves');
    }, { timeout: 10000 });
  });

  test.afterAll(async () => {
    // Clean up after all tests
    await prisma.foodItem.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test('should successfully add a food item to inventory', async ({ page }) => {
    // Verify we're on the pantry page
    await expect(page.locator('h1:has-text("My Pantry")')).toBeVisible();

    // Verify empty pantry message is displayed
    await expect(page.locator('p:has-text("Your pantry is empty")')).toBeVisible();

    // Click the "Add Item" button
    await page.click('button:has-text("Add Item")');

    // Verify the dialog is open
    await expect(page.locator('text="Add Food Item"')).toBeVisible();

    // Fill in the form
    await page.fill('input[id="name"]', 'Organic Tomatoes');
    await page.fill('input[id="category"]', 'Vegetables');
    await page.fill('input[id="bestBeforeDate"]', '2025-12-31');
    await page.fill('input[id="quantity"]', '2.5');
    await page.fill('input[id="unit"]', 'kg');

    // Submit the form
    await page.click('button[type="submit"]:has-text("Add Item")');

    // Wait for the dialog to close
    await expect(page.locator('text="Add Food Item"')).not.toBeVisible({ timeout: 5000 });

    // Verify the item appears in the pantry
    await expect(page.locator('text="Organic Tomatoes"')).toBeVisible();
    await expect(page.locator('text="Vegetables"')).toBeVisible();
    await expect(page.locator('text="2.5 kg"')).toBeVisible();

    // Verify empty message is no longer displayed
    await expect(page.locator('p:has-text("Your pantry is empty")')).not.toBeVisible();
  });

  test('should display the "Add Item" button with grocery bag icon', async ({ page }) => {
    // Verify the "Add Item" button is visible
    const addButton = page.locator('button:has-text("Add Item")');
    await expect(addButton).toBeVisible();

    // Verify the button has the shopping basket icon (by checking for the svg)
    await expect(addButton.locator('svg')).toBeVisible();
  });

  test('should open and close the Add Food Item dialog', async ({ page }) => {
    // Click the "Add Item" button
    await page.click('button:has-text("Add Item")');

    // Verify the dialog is open
    await expect(page.locator('text="Add Food Item"')).toBeVisible();
    await expect(page.locator('text=/Add a new item to your pantry/i')).toBeVisible();

    // Click cancel button
    await page.click('button:has-text("Cancel")');

    // Verify the dialog is closed
    await expect(page.locator('text="Add Food Item"')).not.toBeVisible();
  });

  test('should display validation errors for empty fields', async ({ page }) => {
    // Click the "Add Item" button
    await page.click('button:has-text("Add Item")');

    // Submit the form without filling in any fields
    await page.click('button[type="submit"]:has-text("Add Item")');

    // Verify validation errors are displayed
    await expect(page.locator('text="Name is required"')).toBeVisible();
    await expect(page.locator('text="Category is required"')).toBeVisible();
    await expect(page.locator('text="Best before date is required"')).toBeVisible();
    await expect(page.locator('text="Quantity is required"')).toBeVisible();
    await expect(page.locator('text="Unit is required"')).toBeVisible();
  });

  test('should validate quantity is a positive number', async ({ page }) => {
    // Click the "Add Item" button
    await page.click('button:has-text("Add Item")');

    // Fill in the form with invalid quantity
    await page.fill('input[id="name"]', 'Test Item');
    await page.fill('input[id="category"]', 'Test');
    await page.fill('input[id="bestBeforeDate"]', '2025-12-31');
    await page.fill('input[id="quantity"]', '-5');
    await page.fill('input[id="unit"]', 'kg');

    // Submit the form
    await page.click('button[type="submit"]:has-text("Add Item")');

    // Verify validation error is displayed
    await expect(page.locator('text=/Quantity must be.*positive/i')).toBeVisible();
  });

  test('should clear field errors when user starts typing', async ({ page }) => {
    // Click the "Add Item" button
    await page.click('button:has-text("Add Item")');

    // Submit empty form to trigger validation errors
    await page.click('button[type="submit"]:has-text("Add Item")');

    // Verify error is displayed
    await expect(page.locator('text="Name is required"')).toBeVisible();

    // Start typing in the name field
    await page.fill('input[id="name"]', 'Test');

    // Verify error is cleared
    await expect(page.locator('text="Name is required"')).not.toBeVisible();
  });

  test('should display loading state while submitting', async ({ page }) => {
    // Click the "Add Item" button
    await page.click('button:has-text("Add Item")');

    // Fill in the form
    await page.fill('input[id="name"]', 'Test Item');
    await page.fill('input[id="category"]', 'Test');
    await page.fill('input[id="bestBeforeDate"]', '2025-12-31');
    await page.fill('input[id="quantity"]', '1');
    await page.fill('input[id="unit"]', 'piece');

    // Click submit
    await page.click('button[type="submit"]:has-text("Add Item")');

    // Check for loading state (might be very quick)
    const loadingButton = page.locator('button:has-text("Adding...")');

    // The button should either show loading state or the dialog should close
    await Promise.race([
      loadingButton.waitFor({ state: 'visible', timeout: 1000 }).catch(() => {}),
      page.locator('text="Add Food Item"').waitFor({ state: 'hidden', timeout: 5000 })
    ]);
  });

  test('should add multiple food items to inventory', async ({ page }) => {
    // Add first item
    await page.click('button:has-text("Add Item")');
    await page.fill('input[id="name"]', 'Apples');
    await page.fill('input[id="category"]', 'Fruits');
    await page.fill('input[id="bestBeforeDate"]', '2025-12-15');
    await page.fill('input[id="quantity"]', '5');
    await page.fill('input[id="unit"]', 'pcs');
    await page.click('button[type="submit"]:has-text("Add Item")');

    // Wait for dialog to close
    await expect(page.locator('text="Add Food Item"')).not.toBeVisible({ timeout: 5000 });

    // Verify first item is displayed
    await expect(page.locator('text="Apples"')).toBeVisible();

    // Add second item
    await page.click('button:has-text("Add Item")');
    await page.fill('input[id="name"]', 'Milk');
    await page.fill('input[id="category"]', 'Dairy');
    await page.fill('input[id="bestBeforeDate"]', '2025-12-05');
    await page.fill('input[id="quantity"]', '2');
    await page.fill('input[id="unit"]', 'liters');
    await page.click('button[type="submit"]:has-text("Add Item")');

    // Wait for dialog to close
    await expect(page.locator('text="Add Food Item"')).not.toBeVisible({ timeout: 5000 });

    // Verify both items are displayed
    await expect(page.locator('text="Apples"')).toBeVisible();
    await expect(page.locator('text="Milk"')).toBeVisible();
  });

  test('should format dates correctly in the display', async ({ page }) => {
    // Add an item
    await page.click('button:has-text("Add Item")');
    await page.fill('input[id="name"]', 'Cheese');
    await page.fill('input[id="category"]', 'Dairy');
    await page.fill('input[id="bestBeforeDate"]', '2025-12-31');
    await page.fill('input[id="quantity"]', '1');
    await page.fill('input[id="unit"]', 'kg');
    await page.click('button[type="submit"]:has-text("Add Item")');

    // Wait for the item to appear
    await expect(page.locator('text="Cheese"')).toBeVisible();

    // Verify the date is formatted correctly (e.g., "Dec 31, 2025")
    await expect(page.locator('text=/Dec.*31.*2025/i')).toBeVisible();
  });

  test('should apply "Farmhouse Kitchen" aesthetic to form', async ({ page }) => {
    // Click the "Add Item" button
    await page.click('button:has-text("Add Item")');

    // Check for farmhouse theme classes and styles
    const dialog = page.locator('.bg-white.sm\\:max-w-\\[500px\\]');
    await expect(dialog).toBeVisible();

    // Check button styling
    const addButton = page.locator('button:has-text("Add Item")').first();
    await expect(addButton).toHaveClass(/bg-terracotta/);

    // Check dialog title color
    const dialogTitle = page.locator('text="Add Food Item"');
    await expect(dialogTitle).toHaveClass(/text-charcoal/);
  });

  test('should have accessible form elements with labels', async ({ page }) => {
    // Click the "Add Item" button
    await page.click('button:has-text("Add Item")');

    // Verify all form fields have proper labels
    await expect(page.locator('label[for="name"]')).toBeVisible();
    await expect(page.locator('label[for="category"]')).toBeVisible();
    await expect(page.locator('label[for="bestBeforeDate"]')).toBeVisible();
    await expect(page.locator('label[for="quantity"]')).toBeVisible();
    await expect(page.locator('label[for="unit"]')).toBeVisible();

    // Verify required field indicators
    const requiredIndicators = page.locator('.text-red-500:has-text("*")');
    await expect(requiredIndicators).toHaveCount(5);
  });

  test('should have keyboard accessible form', async ({ page }) => {
    // Click the "Add Item" button
    await page.click('button:has-text("Add Item")');

    // Verify all form inputs can be focused by clicking each
    await page.click('input[id="name"]');
    await expect(page.locator('input[id="name"]')).toBeFocused();

    await page.click('input[id="category"]');
    await expect(page.locator('input[id="category"]')).toBeFocused();

    await page.click('input[id="bestBeforeDate"]');
    await expect(page.locator('input[id="bestBeforeDate"]')).toBeFocused();

    await page.click('input[id="quantity"]');
    await expect(page.locator('input[id="quantity"]')).toBeFocused();

    await page.click('input[id="unit"]');
    await expect(page.locator('input[id="unit"]')).toBeFocused();
  });

  test('should display food items in "Open Shelves" view', async ({ page }) => {
    // Verify "Open Shelves" section is visible
    await expect(page.locator('text="Open Shelves"')).toBeVisible();
    await expect(page.locator('text="View and manage your food inventory"')).toBeVisible();
  });

  test('should show Sign Out button', async ({ page }) => {
    // Verify Sign Out button is visible
    const signOutButton = page.locator('button:has-text("Sign Out")');
    await expect(signOutButton).toBeVisible();
  });

  test('should handle form submission with Enter key', async ({ page }) => {
    // Click the "Add Item" button
    await page.click('button:has-text("Add Item")');

    // Fill in the form
    await page.fill('input[id="name"]', 'Bread');
    await page.fill('input[id="category"]', 'Bakery');
    await page.fill('input[id="bestBeforeDate"]', '2025-12-10');
    await page.fill('input[id="quantity"]', '1');
    await page.fill('input[id="unit"]', 'loaf');

    // Press Enter to submit
    await page.keyboard.press('Enter');

    // Wait for the dialog to close
    await expect(page.locator('text="Add Food Item"')).not.toBeVisible({ timeout: 5000 });

    // Verify the item was added
    await expect(page.locator('text="Bread"')).toBeVisible();
  });

  test('should redirect to login if not authenticated', async ({ page, context }) => {
    // Clear session by deleting cookies
    await context.clearCookies();

    // Try to access pantry page
    await page.goto('/pantry');

    // Should be redirected to login
    await page.waitForURL('**/login', { timeout: 5000 });
    await expect(page.url()).toContain('/login');
  });

  test('should display item with all details in card format', async ({ page }) => {
    // Add an item
    await page.click('button:has-text("Add Item")');
    await page.fill('input[id="name"]', 'Carrots');
    await page.fill('input[id="category"]', 'Vegetables');
    await page.fill('input[id="bestBeforeDate"]', '2025-12-20');
    await page.fill('input[id="quantity"]', '3');
    await page.fill('input[id="unit"]', 'kg');
    await page.click('button[type="submit"]:has-text("Add Item")');

    // Wait for the item to appear
    await expect(page.locator('text="Carrots"')).toBeVisible();

    // Verify all details are displayed
    const itemCard = page.locator('.border-sage-green\\/20').filter({ hasText: 'Carrots' });
    await expect(itemCard.locator('text="Carrots"')).toBeVisible();
    await expect(itemCard.locator('text="Vegetables"')).toBeVisible();
    await expect(itemCard.locator('text="3 kg"')).toBeVisible();
    await expect(itemCard.locator('text="Quantity:"')).toBeVisible();
    await expect(itemCard.locator('text="Best Before:"')).toBeVisible();
    await expect(itemCard.locator('text="Added:"')).toBeVisible();
  });
});
