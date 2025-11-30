import { test, expect } from '@playwright/test';
// import { getPrismaClient } from './helpers/db'; // Import prisma helper

// const prisma = getPrismaClient();

test.describe('Registration Flow', () => {
  test.beforeEach(async () => {
    // Clean up database before each test to ensure a fresh state
    // In a real application, you might have a dedicated test database
    // or a specific API endpoint to trigger test data cleanup.
    // For now, we delete all users.
    // TODO: Fix Prisma Client initialization in test environment
    // await prisma.user.deleteMany();
  });

  test('should allow a new user to register and redirect to dashboard', async ({ page }) => {
    await page.goto('/register');

    // Fill in the registration form with unique email to avoid conflicts
    const timestamp = Date.now();
    await page.fill('input[id="email"]', `e2e_test_${timestamp}@example.com`);
    await page.fill('input[id="password"]', 'E2ePass1!'); // Matches server-side complexity
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard (with increased timeout for async operations)
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Verify we're on the dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test.skip('should display an error message if registration fails due to existing email', async ({ page }) => {
    // TODO: Re-enable this test once Prisma Client is working in test environment
    // Pre-register a user directly in the database
    // await prisma.user.create({
    //   data: {
    //     email: 'e2e_existing@example.com',
    //     passwordHash: 'hashedpassword', // Hashed dummy password
    //   },
    // });

    await page.goto('/register');

    // Attempt to register with the existing email
    await page.fill('input[id="email"]', 'e2e_existing@example.com');
    await page.fill('input[id="password"]', 'ExistingPass1!');
    await page.click('button[type="submit"]');

    // Expect to stay on the registration page and see an error message
    await expect(page.url()).toContain('/register');
    await expect(page.locator('text="User with this email already exists"')).toBeVisible();
  });

  test('should display client-side validation error for invalid email format', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[id="email"]', 'invalid-email');
    await page.fill('input[id="password"]', 'ValidPass1!');
    await page.click('button[type="submit"]'); // Attempt to submit to trigger validation

    await expect(page.locator('text="Invalid email format."')).toBeVisible();
    await expect(page.url()).toContain('/register'); // Should remain on registration page
    await expect(page.locator('text="Registration successful!"')).not.toBeVisible();
  });

  test('should display client-side validation error for weak password', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[id="email"]', 'valid@example.com');
    await page.fill('input[id="password"]', 'weak'); // Weak password
    await page.click('button[type="submit"]'); // Attempt to submit to trigger validation

    await expect(page.locator('text="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."')).toBeVisible();
    await expect(page.url()).toContain('/register'); // Should remain on registration page
    await expect(page.locator('text="Registration successful!"')).not.toBeVisible();
  });
});
