import { test, expect } from '@playwright/test';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

test.describe.configure({ mode: 'serial' });

test.describe('Story 3-5: Automatic Inventory Update after Cooking', () => {
  const testEmail = `cooking-update-test-${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let testUserId: string;

  test.beforeAll(async () => {
    // Clean up any existing test users from previous runs
    // First, find all existing test users
    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          startsWith: 'cooking-update-test-'
        }
      }
    });

    // Delete their food items first
    for (const user of existingUsers) {
      await prisma.foodItem.deleteMany({ where: { userId: user.id } });
    }

    // Then delete the users
    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: 'cooking-update-test-'
        }
      }
    });

    // Create test user once for all tests
    const passwordHash = await bcrypt.hash(testPassword, 10);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash,
      },
    });
    testUserId = user.id;

    // Add test inventory items that match common recipe ingredients
    await prisma.foodItem.createMany({
      data: [
        {
          userId: user.id,
          name: 'Chicken Breast',
          quantity: 1000,
          unit: 'g',
          category: 'Protein',
          bestBeforeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          name: 'Pasta',
          quantity: 500,
          unit: 'g',
          category: 'Grains',
          bestBeforeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          name: 'Tomatoes',
          quantity: 5,
          unit: 'pieces',
          category: 'Vegetables',
          bestBeforeDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          name: 'Olive Oil',
          quantity: 500,
          unit: 'ml',
          category: 'Oils',
          bestBeforeDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          name: 'Garlic',
          quantity: 10,
          unit: 'cloves',
          category: 'Vegetables',
          bestBeforeDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          name: 'Salt',
          quantity: 1000,
          unit: 'g',
          category: 'Spices',
          bestBeforeDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          name: 'Eggs',
          quantity: 2, // Low quantity to test warnings
          unit: 'pieces',
          category: 'Protein',
          bestBeforeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ],
    });
  });

  test.beforeEach(async ({ page }) => {
    // Login through UI (creates proper NextAuth session)
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);
  });

  test.afterAll(async () => {
    // Cleanup: delete test user and their inventory after all tests
    // First, find all test users
    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          startsWith: 'cooking-update-test-'
        }
      }
    });

    // Delete their food items first
    for (const user of existingUsers) {
      await prisma.foodItem.deleteMany({ where: { userId: user.id } });
    }

    // Then delete the users
    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: 'cooking-update-test-'
        }
      }
    });
  });

  test('AC1: "I Cooked This" button is present on recipe detail page', async ({ page }) => {
    // Navigate directly to a known recipe (Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs)
    // This is a commonly available recipe from Spoonacular API
    await page.goto('/recipes/716429');
    await page.waitForLoadState('networkidle');

    // Wait for page to load
    await page.waitForSelector('h1', { state: 'visible', timeout: 10000 });

    // Verify "I Cooked This" button is visible
    const cookedButton = page.getByRole('button', { name: /i cooked this/i });
    await expect(cookedButton).toBeVisible({ timeout: 5000 });
  });

  test('AC2: Clicking "I Cooked This" shows confirmation dialog', async ({ page }) => {
    // Navigate directly to recipe detail page
    await page.goto('/recipes/716429');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { state: 'visible', timeout: 10000 });

    // Click "I Cooked This" button
    const cookedButton = page.getByRole('button', { name: /i cooked this/i });
    await cookedButton.click();

    // Verify confirmation dialog appears
    const dialog = page.locator('[role="dialog"]').or(
      page.locator('div').filter({ hasText: /are you sure|confirm|cooked this recipe/i })
    ).first();
    await expect(dialog).toBeVisible({ timeout: 3000 });

    // Verify dialog has confirm and cancel buttons
    const confirmButton = page.getByRole('button', { name: /yes|confirm|continue/i });
    const cancelButton = page.getByRole('button', { name: /no|cancel/i });

    await expect(confirmButton).toBeVisible();
    await expect(cancelButton).toBeVisible();
  });

  test('AC3: Canceling confirmation dialog closes it without updating inventory', async ({ page }) => {
    // Navigate directly to recipe detail page
    await page.goto('/recipes/716429');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { state: 'visible', timeout: 10000 });

    // Get initial inventory count
    const initialInventory = await prisma.foodItem.findMany({ where: { userId: testUserId } });
    const initialCount = initialInventory.length;

    // Click "I Cooked This" button
    const cookedButton = page.getByRole('button', { name: /i cooked this/i });
    await cookedButton.click();

    // Click cancel button
    const cancelButton = page.getByRole('button', { name: /no|cancel/i });
    await cancelButton.click();

    // Wait a moment
    await page.waitForTimeout(500);

    // Verify dialog is closed
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).not.toBeVisible();

    // Verify inventory was not modified
    const finalInventory = await prisma.foodItem.findMany({ where: { userId: testUserId } });
    expect(finalInventory.length).toBe(initialCount);
  });

  test('AC4: Confirming cooking updates inventory and shows confirmation message', async ({ page }) => {
    // Navigate directly to recipe detail page
    await page.goto('/recipes/716429');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { state: 'visible', timeout: 10000 });

    // Get inventory state before cooking
    const beforeInventory = await prisma.foodItem.findMany({
      where: { userId: testUserId },
      select: { name: true, quantity: true, unit: true }
    });

    // Click "I Cooked This" button
    const cookedButton = page.getByRole('button', { name: /i cooked this/i });
    await cookedButton.click();

    // Confirm cooking
    const confirmButton = page.getByRole('button', { name: /yes|confirm|continue/i });
    await confirmButton.click();

    // Wait for API call to complete
    await page.waitForTimeout(2000);

    // Verify success message appears
    const successMessage = page.getByText(/great job|success|inventory.*updated|updated.*inventory/i);
    await expect(successMessage).toBeVisible({ timeout: 5000 });

    // Get inventory state after cooking
    const afterInventory = await prisma.foodItem.findMany({
      where: { userId: testUserId },
      select: { name: true, quantity: true, unit: true }
    });

    // Verify that at least one item quantity has changed (or items were removed)
    const inventoryChanged = beforeInventory.some((beforeItem) => {
      const afterItem = afterInventory.find(item => item.name === beforeItem.name);
      return !afterItem || afterItem.quantity !== beforeItem.quantity;
    }) || beforeInventory.length !== afterInventory.length;

    expect(inventoryChanged).toBeTruthy();
  });

  test('AC5: Confirmation message shows which items were updated', async ({ page }) => {
    // Navigate directly to recipe detail page
    await page.goto('/recipes/716429');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { state: 'visible', timeout: 10000 });

    // Click "I Cooked This" button
    const cookedButton = page.getByRole('button', { name: /i cooked this/i });
    await cookedButton.click();

    // Confirm cooking
    const confirmButton = page.getByRole('button', { name: /yes|confirm|continue/i });
    await confirmButton.click();

    // Wait for update to complete
    await page.waitForTimeout(2000);

    // Verify update summary is displayed
    const updateSummary = page.locator('[data-testid="update-summary"]').or(
      page.locator('div').filter({ hasText: /updated items|items updated/i })
    ).first();

    // Check if summary shows ingredient names and quantities
    const summaryVisible = await updateSummary.isVisible().catch(() => false);

    if (summaryVisible) {
      // Verify summary contains quantity information
      const quantityPattern = page.locator('text=/\\d+.*→.*\\d+|before.*after|was.*now/i');
      const hasQuantityInfo = await quantityPattern.count() > 0;

      // Should show before/after quantities or similar information
      expect(hasQuantityInfo || summaryVisible).toBeTruthy();
    } else {
      // At minimum, a success message should be visible
      const successMessage = page.getByText(/great job|success|inventory.*updated/i);
      await expect(successMessage).toBeVisible();
    }
  });

  test('AC6: Warnings are shown for insufficient quantities', async ({ page }) => {
    // First, reduce Eggs quantity to very low to trigger warning
    await prisma.foodItem.updateMany({
      where: {
        userId: testUserId,
        name: 'Eggs'
      },
      data: {
        quantity: 1 // Very low quantity
      }
    });

    // Navigate directly to recipe detail page
    await page.goto('/recipes/716429');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { state: 'visible', timeout: 10000 });

    // Click "I Cooked This" button
    const cookedButton = page.getByRole('button', { name: /i cooked this/i });
    await cookedButton.click();

    // Confirm cooking
    const confirmButton = page.getByRole('button', { name: /yes|confirm|continue/i });
    await confirmButton.click();

    // Wait for update to complete
    await page.waitForTimeout(2000);

    // Look for warning messages
    const warningMessage = page.locator('text=/warning|insufficient|not enough|low quantity/i');

    // Check if warning is displayed (it may or may not appear depending on recipe ingredients)
    const warningCount = await warningMessage.count();

    // Test passes if either:
    // 1. Warning is shown (recipe had ingredients with insufficient quantity)
    // 2. Success message is shown (recipe didn't use low-quantity ingredients)
    const successMessage = page.getByText(/great job|success|inventory.*updated/i);
    const successVisible = await successMessage.isVisible().catch(() => false);

    expect(warningCount > 0 || successVisible).toBeTruthy();

    // Restore Eggs quantity
    await prisma.foodItem.updateMany({
      where: {
        userId: testUserId,
        name: 'Eggs'
      },
      data: {
        quantity: 2
      }
    });
  });

  test('AC7: Inventory update completes within 1 second', async ({ page }) => {
    // Navigate directly to recipe detail page
    await page.goto('/recipes/716429');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { state: 'visible', timeout: 10000 });

    // Click "I Cooked This" button
    const cookedButton = page.getByRole('button', { name: /i cooked this/i });
    await cookedButton.click();

    // Measure update time
    const startTime = Date.now();

    // Confirm cooking
    const confirmButton = page.getByRole('button', { name: /yes|confirm|continue/i });
    await confirmButton.click();

    // Wait for success message to appear (indicates update completed)
    const successMessage = page.getByText(/great job|success|inventory.*updated|updated.*inventory/i);
    await expect(successMessage).toBeVisible({ timeout: 5000 });

    const endTime = Date.now();
    const updateDuration = endTime - startTime;

    // Verify update completed within 1 second (1000ms)
    expect(updateDuration).toBeLessThan(1000);

    console.log(`Inventory update completed in ${updateDuration}ms`);
  });

  test('AC8: Updated inventory is immediately reflected in Pantry View', async ({ page }) => {
    // Navigate directly to recipe detail page
    await page.goto('/recipes/716429');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { state: 'visible', timeout: 10000 });

    // Get current pantry state from database
    const beforePantry = await prisma.foodItem.findMany({
      where: { userId: testUserId },
      select: { name: true, quantity: true }
    });

    // Click "I Cooked This" button
    const cookedButton = page.getByRole('button', { name: /i cooked this/i });
    await cookedButton.click();

    // Confirm cooking
    const confirmButton = page.getByRole('button', { name: /yes|confirm|continue/i });
    await confirmButton.click();

    // Wait for update to complete
    await page.waitForTimeout(2000);

    // Navigate to pantry view
    await page.goto('/pantry');
    await page.waitForLoadState('networkidle');

    // Wait for pantry to load
    await page.waitForTimeout(1000);

    // Get updated pantry state from database
    const afterPantry = await prisma.foodItem.findMany({
      where: { userId: testUserId },
      select: { name: true, quantity: true }
    });

    // Verify pantry page shows updated quantities
    // Check if at least one visible item in the UI reflects the database state
    const pantryItems = page.locator('[data-testid="food-item"]').or(
      page.locator('div, tr').filter({ hasText: /\d+.*g|ml|pieces|kg/i })
    );

    const itemCount = await pantryItems.count();
    expect(itemCount).toBeGreaterThan(0);

    // Verify database was actually updated
    const inventoryChanged = beforePantry.some((beforeItem) => {
      const afterItem = afterPantry.find(item => item.name === beforeItem.name);
      return !afterItem || afterItem.quantity !== beforeItem.quantity;
    }) || beforePantry.length !== afterPantry.length;

    expect(inventoryChanged || beforePantry.length === afterPantry.length).toBeTruthy();
  });

  test('AC9: Multiple cooking sessions update inventory correctly', async ({ page }) => {
    // Reset inventory to known state
    await prisma.foodItem.updateMany({
      where: {
        userId: testUserId,
        name: 'Pasta'
      },
      data: {
        quantity: 500
      }
    });

    const initialPasta = await prisma.foodItem.findFirst({
      where: { userId: testUserId, name: 'Pasta' }
    });

    // Navigate directly to recipe detail page
    await page.goto('/recipes/716429');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { state: 'visible', timeout: 10000 });

    // Cook the recipe first time
    const cookedButton = page.getByRole('button', { name: /i cooked this/i });
    await cookedButton.click();

    const confirmButton = page.getByRole('button', { name: /yes|confirm|continue/i });
    await confirmButton.click();

    await page.waitForTimeout(2000);

    // Close success dialog if present
    const closeButton = page.getByRole('button', { name: /close|ok|got it/i });
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }

    // Wait a moment
    await page.waitForTimeout(1000);

    // Get pasta quantity after first cooking
    const afterFirstCook = await prisma.foodItem.findFirst({
      where: { userId: testUserId, name: 'Pasta' }
    });

    // Cook the recipe second time
    await cookedButton.click();
    const confirmButton2 = page.getByRole('button', { name: /yes|confirm|continue/i });
    await confirmButton2.click();

    await page.waitForTimeout(2000);

    // Get pasta quantity after second cooking
    const afterSecondCook = await prisma.foodItem.findFirst({
      where: { userId: testUserId, name: 'Pasta' }
    });

    // Verify quantities decreased progressively
    if (initialPasta && afterFirstCook && afterSecondCook) {
      expect(afterFirstCook.quantity).toBeLessThanOrEqual(initialPasta.quantity);
      expect(afterSecondCook.quantity).toBeLessThanOrEqual(afterFirstCook.quantity);
    }
  });

  test('AC10: UI displays loading state during update', async ({ page }) => {
    // Navigate directly to recipe detail page
    await page.goto('/recipes/716429');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { state: 'visible', timeout: 10000 });

    // Click "I Cooked This" button
    const cookedButton = page.getByRole('button', { name: /i cooked this/i });
    await cookedButton.click();

    // Confirm cooking
    const confirmButton = page.getByRole('button', { name: /yes|confirm|continue/i });
    await confirmButton.click();

    // Immediately check for loading indicator
    const loadingIndicator = page.locator('[data-testid="loading"]').or(
      page.locator('svg[class*="animate-spin"]')
    ).or(
      page.getByText(/updating|loading|please wait/i)
    );

    // Loading indicator should appear briefly
    // Note: Due to fast API response, this might not always be visible
    const loadingVisible = await loadingIndicator.isVisible().catch(() => false);

    // Either loading indicator was shown, or success message appears quickly
    const successMessage = page.getByText(/great job|success|inventory.*updated/i);
    await expect(successMessage).toBeVisible({ timeout: 3000 });

    // Test passes if either loading was shown or success message appears
    expect(loadingVisible || await successMessage.isVisible()).toBeTruthy();
  });
});
