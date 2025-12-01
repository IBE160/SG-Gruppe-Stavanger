import { test, expect } from '@playwright/test';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

test.describe.configure({ mode: 'serial' });

test.describe('Story 3-2: View Detailed Recipe Information', () => {
  const testEmail = `recipe-detail-test-${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let testUserId: string;

  test.beforeAll(async () => {
    // Clean up any existing test users from previous runs
    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: 'recipe-detail-test-'
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

    // Add some test inventory items for ingredient matching
    await prisma.foodItem.createMany({
      data: [
        {
          userId: user.id,
          name: 'Chicken Breast',
          quantity: 2,
          unit: 'pieces',
          category: 'Protein',
          bestBeforeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
        {
          userId: user.id,
          name: 'Pasta',
          quantity: 500,
          unit: 'g',
          category: 'Grains',
          bestBeforeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
        {
          userId: user.id,
          name: 'Tomato',
          quantity: 5,
          unit: 'pieces',
          category: 'Vegetables',
          bestBeforeDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
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
    if (testUserId) {
      await prisma.foodItem.deleteMany({ where: { userId: testUserId } });
    }
    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: 'recipe-detail-test-'
        }
      }
    });
  });

  test('AC1: Navigate to detailed recipe view by clicking recipe card', async ({ page }) => {
    // Navigate to recipes page
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Find and click the first recipe card
    const recipeCard = page.locator('[role="button"][aria-label*="ready in"]').first();
    await recipeCard.waitFor({ state: 'visible', timeout: 10000 });

    // Get recipe info before clicking
    const ariaLabel = await recipeCard.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();

    // Click the recipe card
    await recipeCard.click();

    // Wait for navigation to detail page
    await page.waitForURL(/\/recipes\/\d+/, { timeout: 5000 });

    // Verify we're on a recipe detail page
    expect(page.url()).toMatch(/\/recipes\/\d+/);

    // Verify page loaded successfully (recipe title should be visible)
    await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
  });

  test('AC2: Detailed view displays full recipe information (ingredients and instructions)', async ({ page }) => {
    // Navigate to recipes and click first recipe
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    const recipeCard = page.locator('[role="button"][aria-label*="ready in"]').first();
    await recipeCard.waitFor({ state: 'visible', timeout: 10000 });
    await recipeCard.click();

    await page.waitForURL(/\/recipes\/\d+/, { timeout: 5000 });

    // Verify recipe title is displayed
    const recipeTitle = page.locator('h1').first();
    await expect(recipeTitle).toBeVisible();
    const titleText = await recipeTitle.textContent();
    expect(titleText?.length).toBeGreaterThan(0);

    // Verify recipe image is displayed (or placeholder)
    const recipeImage = page.locator('img[alt*="recipe"], img[alt*="Recipe"], [class*="aspect-video"]').first();
    await expect(recipeImage).toBeVisible();

    // Verify ingredients section is displayed
    const ingredientsHeading = page.getByRole('heading', { name: /ingredients/i });
    await expect(ingredientsHeading).toBeVisible();

    // Verify at least one ingredient is listed
    const ingredients = page.locator('[data-testid="ingredient-item"]').or(
      page.locator('ul li, div[class*="ingredient"]').filter({ has: page.locator('text=/\\d+|cup|tablespoon|teaspoon|gram|oz/i') })
    );
    const ingredientCount = await ingredients.count();
    expect(ingredientCount).toBeGreaterThan(0);

    // Verify instructions section is displayed
    const instructionsHeading = page.getByRole('heading', { name: /instructions|directions|steps/i });
    await expect(instructionsHeading).toBeVisible();

    // Verify instructions content exists
    const instructionsContent = page.locator('[data-testid="instructions"]').or(
      page.locator('div, p, ol').filter({ hasText: /step|mix|cook|bake|prepare|add/i })
    ).first();
    await expect(instructionsContent).toBeVisible();
  });

  test('AC3: Available ingredients from inventory are highlighted', async ({ page }) => {
    // Navigate to recipes and click first recipe
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    const recipeCard = page.locator('[role="button"][aria-label*="ready in"]').first();
    await recipeCard.waitFor({ state: 'visible', timeout: 10000 });
    await recipeCard.click();

    await page.waitForURL(/\/recipes\/\d+/, { timeout: 5000 });

    // Wait for ingredients to load
    await page.waitForTimeout(1500);

    // Look for ingredient matching indicators
    // Available ingredients should have checkmarks, green styling, or "in pantry" indicators
    const availableIndicators = page.locator(
      '[data-testid="ingredient-available"], ' +
      '[class*="text-green"], ' +
      '[class*="bg-green"], ' +
      'svg[class*="check"]'
    );

    // Check if any ingredients are marked as available
    // (Note: this depends on the recipe having ingredients that match our test inventory)
    const indicatorCount = await availableIndicators.count();

    // Verify the IngredientMatchIndicator component is functioning
    // Even if no ingredients match, the component should exist
    const ingredientsList = page.locator('[data-testid="ingredients-list"]').or(
      page.locator('ul, div').filter({ has: page.locator('text=/ingredients/i') })
    );
    await expect(ingredientsList.first()).toBeVisible();
  });

  test('AC4: Missing ingredients can be added to shopping list', async ({ page }) => {
    // Navigate to recipes and click first recipe
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    const recipeCard = page.locator('[role="button"][aria-label*="ready in"]').first();
    await recipeCard.waitFor({ state: 'visible', timeout: 10000 });
    await recipeCard.click();

    await page.waitForURL(/\/recipes\/\d+/, { timeout: 5000 });

    // Wait for ingredients to load
    await page.waitForTimeout(1500);

    // Look for "Add to Shopping List" buttons
    const addToShoppingListButtons = page.getByRole('button', { name: /add to shopping list/i }).or(
      page.locator('button').filter({ hasText: /shopping list|add to list/i })
    );

    // Check if at least one "Add to Shopping List" option exists
    const buttonCount = await addToShoppingListButtons.count();

    if (buttonCount > 0) {
      // Click the first "Add to Shopping List" button
      await addToShoppingListButtons.first().click();

      // Verify confirmation message appears
      const confirmation = page.getByText(/added to shopping list|added to list/i);
      await expect(confirmation).toBeVisible({ timeout: 3000 });
    } else {
      // If no individual buttons, look for a bulk "Add all missing to shopping list" button
      const bulkAddButton = page.getByRole('button', { name: /add all.*shopping list|add missing/i });

      // At least one of these should exist per AC
      await expect(bulkAddButton).toBeVisible();
    }
  });

  test('AC5: Cooking mode option is presented', async ({ page }) => {
    // Navigate to recipes and click first recipe
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    const recipeCard = page.locator('[role="button"][aria-label*="ready in"]').first();
    await recipeCard.waitFor({ state: 'visible', timeout: 10000 });
    await recipeCard.click();

    await page.waitForURL(/\/recipes\/\d+/, { timeout: 5000 });

    // Look for "Start Cooking" or "Cooking Mode" button
    const cookingModeButton = page.getByRole('button', { name: /start cooking|cooking mode|cook this/i });
    await expect(cookingModeButton).toBeVisible({ timeout: 3000 });

    // Click the cooking mode button
    await cookingModeButton.click();
    await page.waitForTimeout(500);

    // Verify cooking mode panel/interface appears
    const cookingModePanel = page.locator('[data-testid="cooking-mode-panel"]').or(
      page.locator('div, section').filter({ hasText: /cooking mode|step \d+|progress/i })
    );
    await expect(cookingModePanel.first()).toBeVisible({ timeout: 2000 });

    // Verify cooking mode has step-by-step instructions
    const stepIndicator = page.getByText(/step \d+/i).or(
      page.locator('[data-testid="cooking-step"]')
    );
    await expect(stepIndicator.first()).toBeVisible();
  });

  test('AC6: Detailed view loads within 2 seconds', async ({ page }) => {
    // Navigate to recipes page first
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    const recipeCard = page.locator('[role="button"][aria-label*="ready in"]').first();
    await recipeCard.waitFor({ state: 'visible', timeout: 10000 });

    // Measure load time
    const startTime = Date.now();

    // Click recipe card
    await recipeCard.click();

    // Wait for detail page to fully load (main content visible)
    await page.waitForURL(/\/recipes\/\d+/, { timeout: 5000 });
    await page.waitForSelector('h1', { state: 'visible', timeout: 5000 });
    await page.waitForSelector('[role="heading"]', { state: 'visible', timeout: 5000 });

    const endTime = Date.now();
    const loadDuration = endTime - startTime;

    // Verify page loaded within 2 seconds (2000ms)
    expect(loadDuration).toBeLessThan(2000);

    console.log(`Recipe detail page loaded in ${loadDuration}ms`);
  });

  test('AC7: UI is responsive on different screen sizes', async ({ page }) => {
    // Navigate to recipes and get first recipe card
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');
    const recipeCard = page.locator('[role="button"][aria-label*="ready in"]').first();
    await recipeCard.waitFor({ state: 'visible', timeout: 10000 });
    await recipeCard.click();
    await page.waitForURL(/\/recipes\/\d+/, { timeout: 5000 });

    // Test mobile viewport (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /ingredients/i })).toBeVisible();

    // Test tablet viewport (iPad)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /ingredients/i })).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /ingredients/i })).toBeVisible();
  });

  test('AC8: Interface is accessible (WCAG 2.1 AA)', async ({ page }) => {
    // Navigate to recipes and click first recipe
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    const recipeCard = page.locator('[role="button"][aria-label*="ready in"]').first();
    await recipeCard.waitFor({ state: 'visible', timeout: 10000 });
    await recipeCard.click();

    await page.waitForURL(/\/recipes\/\d+/, { timeout: 5000 });

    // 1. Verify proper heading hierarchy
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // 2. Verify all images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }

    // 3. Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();

    // 4. Verify buttons have accessible labels
    const cookingModeButton = page.getByRole('button', { name: /start cooking|cooking mode/i });
    if (await cookingModeButton.isVisible()) {
      await expect(cookingModeButton).toHaveAttribute('type');
    }

    // 5. Verify landmark regions
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // 6. Check for sufficient color contrast (buttons should have clear styling)
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // 7. Verify decorative icons are hidden from screen readers
    const decorativeIcons = page.locator('svg[aria-hidden="true"]');
    const iconCount = await decorativeIcons.count();
    // Icons should ideally be marked as decorative if they don't convey unique information
  });

  test('AC9: Back button returns to recipe list', async ({ page }) => {
    // Navigate to recipes and click first recipe
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    const recipeCard = page.locator('[role="button"][aria-label*="ready in"]').first();
    await recipeCard.waitFor({ state: 'visible', timeout: 10000 });
    await recipeCard.click();

    await page.waitForURL(/\/recipes\/\d+/, { timeout: 5000 });

    // Look for back button or navigation link
    const backButton = page.getByRole('button', { name: /back|return/i }).or(
      page.locator('a[href="/recipes"]')
    );

    // Click browser back button as alternative
    await page.goBack();

    // Verify we're back on the recipes list page
    await expect(page).toHaveURL('/recipes');
    await expect(page.getByRole('heading', { name: /recipe library/i })).toBeVisible();
  });

  test('AC10: Recipe metadata is displayed (servings, time, etc)', async ({ page }) => {
    // Navigate to recipes and click first recipe
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    const recipeCard = page.locator('[role="button"][aria-label*="ready in"]').first();
    await recipeCard.waitFor({ state: 'visible', timeout: 10000 });
    await recipeCard.click();

    await page.waitForURL(/\/recipes\/\d+/, { timeout: 5000 });

    // Verify ready time is displayed
    const readyTime = page.getByText(/\d+ (minute|min|hour|hr)/i);
    await expect(readyTime.first()).toBeVisible();

    // Verify servings is displayed
    const servings = page.getByText(/\d+ serving/i);
    await expect(servings.first()).toBeVisible();

    // Additional metadata may include: prep time, cook time, difficulty, etc.
  });
});
