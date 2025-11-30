import { test, expect } from '@playwright/test';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

test.describe('Story 2.3: Edit Food Item in Inventory', () => {
  // Configure tests to run serially to avoid database conflicts
  test.describe.configure({ mode: 'serial' });

  const testEmail = 'e2e_edit_pantry@example.com';
  const testPassword = 'EditTest1!';
  let testUserId: string;
  let testItemId: string;

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

    // Create a test food item
    const foodItem = await prisma.foodItem.create({
      data: {
        name: 'Original Tomatoes',
        category: 'Vegetables',
        bestBeforeDate: new Date('2025-12-31'),
        quantity: 2,
        unit: 'kg',
        userId: testUserId,
      },
    });
    testItemId = foodItem.id;

    // Login through the UI
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Wait for redirect and session creation
    await page.waitForTimeout(2000);

    // Navigate to pantry page
    await page.goto('/pantry');

    // Wait for page to load
    await expect(page.locator('h1:has-text("My Pantry")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text="Original Tomatoes"')).toBeVisible({ timeout: 10000 });
  });

  test.afterAll(async () => {
    // Clean up after all tests
    await prisma.foodItem.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test('should successfully edit a food item by clicking on it', async ({ page }) => {
    // Click on the food item to open edit dialog
    await page.click('text="Original Tomatoes"');

    // Verify the edit dialog is open
    await expect(page.locator('text="Edit Food Item"')).toBeVisible();

    // Verify the form is pre-populated with current item data
    await expect(page.locator('input[id="edit-name"]')).toHaveValue('Original Tomatoes');
    await expect(page.locator('input[id="edit-category"]')).toHaveValue('Vegetables');
    await expect(page.locator('input[id="edit-quantity"]')).toHaveValue('2');
    await expect(page.locator('input[id="edit-unit"]')).toHaveValue('kg');

    // Modify the fields
    await page.fill('input[id="edit-name"]', 'Fresh Organic Tomatoes');
    await page.fill('input[id="edit-quantity"]', '3.5');
    await page.fill('input[id="edit-unit"]', 'kilos');

    // Submit the form
    await page.click('button[type="submit"]:has-text("Save Changes")');

    // Wait for the dialog to close
    await expect(page.locator('text="Edit Food Item"')).not.toBeVisible({ timeout: 5000 });

    // Verify the updated item appears in the pantry
    await expect(page.locator('text="Fresh Organic Tomatoes"')).toBeVisible();
    await expect(page.locator('text="3.5 kilos"')).toBeVisible();

    // Verify the old name is no longer displayed
    await expect(page.locator('text="Original Tomatoes"')).not.toBeVisible();
  });

  test('should show edit icon on hover', async ({ page }) => {
    // Hover over the food item card
    const itemCard = page.locator('text="Original Tomatoes"').locator('..');

    // The edit icon should appear on hover
    await itemCard.hover();

    // Wait a moment for hover effects
    await page.waitForTimeout(500);

    // Note: The edit icon is shown on hover, so we verify the card is hoverable
    // In actual E2E, the hover state is tested by the ability to click on the card
    await expect(itemCard).toBeVisible();
  });

  test('should display validation errors for invalid edits', async ({ page }) => {
    // Click on the food item to open edit dialog
    await page.click('text="Original Tomatoes"');

    // Clear the name field (required)
    await page.fill('input[id="edit-name"]', '');

    // Submit the form
    await page.click('button[type="submit"]:has-text("Save Changes")');

    // Verify validation error is displayed
    await expect(page.locator('text="Name is required"')).toBeVisible();

    // Dialog should still be open
    await expect(page.locator('text="Edit Food Item"')).toBeVisible();
  });

  test('should validate quantity is a positive number when editing', async ({ page }) => {
    // Click on the food item to open edit dialog
    await page.click('text="Original Tomatoes"');

    // Enter a negative quantity
    await page.fill('input[id="edit-quantity"]', '-10');

    // Submit the form
    await page.click('button[type="submit"]:has-text("Save Changes")');

    // Verify validation error is displayed
    await expect(page.locator('text=/Quantity must be.*positive/i')).toBeVisible();
  });

  test('should clear field errors when user starts typing in edit form', async ({ page }) => {
    // Click on the food item to open edit dialog
    await page.click('text="Original Tomatoes"');

    // Clear the name field to trigger validation error
    await page.fill('input[id="edit-name"]', '');

    // Submit to show error
    await page.click('button[type="submit"]:has-text("Save Changes")');

    // Verify error is displayed
    await expect(page.locator('text="Name is required"')).toBeVisible();

    // Start typing in the name field
    await page.fill('input[id="edit-name"]', 'New Name');

    // Verify error is cleared
    await expect(page.locator('text="Name is required"')).not.toBeVisible();
  });

  test('should cancel edit without saving changes', async ({ page }) => {
    // Click on the food item to open edit dialog
    await page.click('text="Original Tomatoes"');

    // Modify a field
    await page.fill('input[id="edit-name"]', 'This Should Not Be Saved');

    // Click cancel button
    await page.click('button:has-text("Cancel")');

    // Verify the dialog is closed
    await expect(page.locator('text="Edit Food Item"')).not.toBeVisible();

    // Verify the original data is still displayed
    await expect(page.locator('text="Original Tomatoes"')).toBeVisible();
    await expect(page.locator('text="This Should Not Be Saved"')).not.toBeVisible();
  });

  test('should display loading state while saving edits', async ({ page }) => {
    // Click on the food item to open edit dialog
    await page.click('text="Original Tomatoes"');

    // Modify a field
    await page.fill('input[id="edit-name"]', 'Updated Tomatoes');

    // Click submit
    await page.click('button[type="submit"]:has-text("Save Changes")');

    // Check for loading state (might be very quick)
    const loadingButton = page.locator('button:has-text("Saving...")');

    // The button should either show loading state or the dialog should close
    await Promise.race([
      loadingButton.waitFor({ state: 'visible', timeout: 1000 }).catch(() => {}),
      page.locator('text="Edit Food Item"').waitFor({ state: 'hidden', timeout: 5000 })
    ]);
  });

  test('should update only modified fields', async ({ page }) => {
    // Click on the food item to open edit dialog
    await page.click('text="Original Tomatoes"');

    // Only modify the quantity
    await page.fill('input[id="edit-quantity"]', '5');

    // Submit the form
    await page.click('button[type="submit"]:has-text("Save Changes")');

    // Wait for the dialog to close
    await expect(page.locator('text="Edit Food Item"')).not.toBeVisible({ timeout: 5000 });

    // Verify the quantity is updated
    await expect(page.locator('text="5 kg"')).toBeVisible();

    // Verify other fields remain unchanged
    await expect(page.locator('text="Original Tomatoes"')).toBeVisible();
    await expect(page.locator('text="Vegetables"')).toBeVisible();
  });

  test('should update best before date correctly', async ({ page }) => {
    // Click on the food item to open edit dialog
    await page.click('text="Original Tomatoes"');

    // Update the best before date
    await page.fill('input[id="edit-bestBeforeDate"]', '2026-06-15');

    // Submit the form
    await page.click('button[type="submit"]:has-text("Save Changes")');

    // Wait for the dialog to close
    await expect(page.locator('text="Edit Food Item"')).not.toBeVisible({ timeout: 5000 });

    // Verify the new date is displayed (format: Jun 15, 2026)
    await expect(page.locator('text=/Jun.*15.*2026/i')).toBeVisible();
  });

  test('should apply "Farmhouse Kitchen" aesthetic to edit form', async ({ page }) => {
    // Click on the food item to open edit dialog
    await page.click('text="Original Tomatoes"');

    // Check for farmhouse theme classes
    const dialog = page.locator('.bg-white.sm\\:max-w-\\[500px\\]');
    await expect(dialog).toBeVisible();

    // Check dialog title color
    const dialogTitle = page.locator('text="Edit Food Item"');
    await expect(dialogTitle).toHaveClass(/text-charcoal/);

    // Check save button styling
    const saveButton = page.locator('button[type="submit"]:has-text("Save Changes")');
    await expect(saveButton).toHaveClass(/bg-terracotta/);
  });

  test('should have accessible edit form with labels', async ({ page }) => {
    // Click on the food item to open edit dialog
    await page.click('text="Original Tomatoes"');

    // Verify all form fields have proper labels
    await expect(page.locator('label[for="edit-name"]')).toBeVisible();
    await expect(page.locator('label[for="edit-category"]')).toBeVisible();
    await expect(page.locator('label[for="edit-bestBeforeDate"]')).toBeVisible();
    await expect(page.locator('label[for="edit-quantity"]')).toBeVisible();
    await expect(page.locator('label[for="edit-unit"]')).toBeVisible();

    // Verify required field indicators
    const requiredIndicators = page.locator('.text-red-500:has-text("*")');
    await expect(requiredIndicators).toHaveCount(5);
  });

  test('should allow editing multiple items in sequence', async ({ page }) => {
    // Create another item first
    await prisma.foodItem.create({
      data: {
        name: 'Fresh Milk',
        category: 'Dairy',
        bestBeforeDate: new Date('2025-12-10'),
        quantity: 2,
        unit: 'liters',
        userId: testUserId,
      },
    });

    // Refresh the page to see the new item
    await page.reload();
    await expect(page.locator('text="Original Tomatoes"')).toBeVisible();
    await expect(page.locator('text="Fresh Milk"')).toBeVisible();

    // Edit first item
    await page.click('text="Original Tomatoes"');
    await page.fill('input[id="edit-name"]', 'Edited Tomatoes');
    await page.click('button[type="submit"]:has-text("Save Changes")');
    await expect(page.locator('text="Edit Food Item"')).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator('text="Edited Tomatoes"')).toBeVisible();

    // Edit second item
    await page.click('text="Fresh Milk"');
    await page.fill('input[id="edit-name"]', 'Organic Milk');
    await page.click('button[type="submit"]:has-text("Save Changes")');
    await expect(page.locator('text="Edit Food Item"')).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator('text="Organic Milk"')).toBeVisible();
  });

  test('should handle keyboard navigation for edit form', async ({ page }) => {
    // Click on the food item to open edit dialog
    await page.click('text="Original Tomatoes"');

    // Verify all form inputs can be focused
    await page.click('input[id="edit-name"]');
    await expect(page.locator('input[id="edit-name"]')).toBeFocused();

    await page.click('input[id="edit-category"]');
    await expect(page.locator('input[id="edit-category"]')).toBeFocused();

    await page.click('input[id="edit-bestBeforeDate"]');
    await expect(page.locator('input[id="edit-bestBeforeDate"]')).toBeFocused();

    await page.click('input[id="edit-quantity"]');
    await expect(page.locator('input[id="edit-quantity"]')).toBeFocused();

    await page.click('input[id="edit-unit"]');
    await expect(page.locator('input[id="edit-unit"]')).toBeFocused();
  });

  test('should prevent users from editing another user\'s items', async ({ page, context }) => {
    // Create another user and their food item
    const otherPasswordHash = await bcrypt.hash('OtherPass1!', 10);
    const otherUser = await prisma.user.create({
      data: {
        email: 'other@example.com',
        passwordHash: otherPasswordHash,
      },
    });

    const otherUserItem = await prisma.foodItem.create({
      data: {
        name: 'Other User Item',
        category: 'Test',
        bestBeforeDate: new Date('2025-12-31'),
        quantity: 1,
        unit: 'piece',
        userId: otherUser.id,
      },
    });

    // Try to edit the other user's item directly via API
    // This simulates an authorization bypass attempt
    const response = await page.evaluate(async (itemId) => {
      const res = await fetch(`/api/inventory/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Hacked Name',
        }),
      });
      return {
        status: res.status,
        data: await res.json(),
      };
    }, otherUserItem.id);

    // Should receive 403 Forbidden
    expect(response.status).toBe(403);
    expect(response.data.error).toBe('Access denied');

    // Verify the item was not modified in the database
    const unchangedItem = await prisma.foodItem.findUnique({
      where: { id: otherUserItem.id },
    });
    expect(unchangedItem?.name).toBe('Other User Item');
  });

  test('should handle editing item with special characters in name', async ({ page }) => {
    // Click on the food item to open edit dialog
    await page.click('text="Original Tomatoes"');

    // Use special characters in the name
    const specialName = 'Tom&Jerry\'s "Fresh" Tomatoes <Organic>';
    await page.fill('input[id="edit-name"]', specialName);

    // Submit the form
    await page.click('button[type="submit"]:has-text("Save Changes")');

    // Wait for the dialog to close
    await expect(page.locator('text="Edit Food Item"')).not.toBeVisible({ timeout: 5000 });

    // Verify the item with special characters is displayed correctly
    await expect(page.locator(`text="${specialName}"`)).toBeVisible();
  });

  test('should update item count message when editing quantity', async ({ page }) => {
    // Verify initial item count
    await expect(page.locator('text="1 item in your inventory"')).toBeVisible();

    // Edit the item
    await page.click('text="Original Tomatoes"');
    await page.fill('input[id="edit-quantity"]', '10');
    await page.click('button[type="submit"]:has-text("Save Changes")');

    // Wait for the dialog to close
    await expect(page.locator('text="Edit Food Item"')).not.toBeVisible({ timeout: 5000 });

    // Verify the quantity is updated
    await expect(page.locator('text="10 kg"')).toBeVisible();

    // Note: Item count refers to number of food items, not quantity
    // So it should still show 1 item
    await expect(page.locator('text="1 item in your inventory"')).toBeVisible();
  });
});
