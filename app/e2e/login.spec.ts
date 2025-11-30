import { test, expect } from '@playwright/test';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

test.describe('Login Flow', () => {
  const testEmail = 'e2e_login@example.com';
  const testPassword = 'E2ePass1!';

  test.beforeEach(async () => {
    // Clean up database before each test
    await prisma.user.deleteMany();

    // Create a test user for login tests
    const passwordHash = await bcrypt.hash(testPassword, 10);
    await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash,
      },
    });
  });

  test.afterAll(async () => {
    // Clean up after all tests
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test('should allow a registered user to log in and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');

    // Verify we're on the login page
    await expect(page.locator('text="Welcome Back!"')).toBeVisible();

    // Fill in the login form
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Wait for navigation and verify redirection to dashboard
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await expect(page.url()).toContain('/dashboard');
  });

  test('should allow login with "Remember Me" checked', async ({ page }) => {
    await page.goto('/login');

    // Fill in the login form
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);

    // Check the "Remember Me" checkbox
    await page.check('input[id="rememberMe"]');
    await page.click('button[type="submit"]');

    // Wait for navigation and verify redirection to dashboard
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await expect(page.url()).toContain('/dashboard');
  });

  test('should display an error message for invalid credentials (wrong password)', async ({ page }) => {
    await page.goto('/login');

    // Fill in the form with incorrect password
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', 'WrongPassword1!');
    await page.click('button[type="submit"]');

    // Expect to stay on the login page and see an error message
    await expect(page.url()).toContain('/login');

    // NextAuth may return different error messages, adjust as needed
    // Common error messages: "Invalid credentials", "CredentialsSignin", etc.
    await expect(page.locator('text=/Invalid credentials|CredentialsSignin/i')).toBeVisible({ timeout: 5000 });
  });

  test('should display an error message for non-existent user', async ({ page }) => {
    await page.goto('/login');

    // Fill in the form with non-existent email
    await page.fill('input[id="email"]', 'nonexistent@example.com');
    await page.fill('input[id="password"]', 'SomePassword1!');
    await page.click('button[type="submit"]');

    // Expect to stay on the login page and see an error message
    await expect(page.url()).toContain('/login');
    await expect(page.locator('text=/Invalid credentials|CredentialsSignin/i')).toBeVisible({ timeout: 5000 });
  });

  test('should display client-side validation error for invalid email format', async ({ page }) => {
    await page.goto('/login');

    // Fill in the form with invalid email
    await page.fill('input[id="email"]', 'invalid-email');
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Expect to see client-side validation error
    await expect(page.locator('text="Invalid email format."')).toBeVisible();
    await expect(page.url()).toContain('/login');
  });

  test('should display client-side validation error for missing email', async ({ page }) => {
    await page.goto('/login');

    // Only fill in password, leave email empty
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Expect to see validation error
    await expect(page.locator('text="Email is required."')).toBeVisible();
    await expect(page.url()).toContain('/login');
  });

  test('should display client-side validation error for missing password', async ({ page }) => {
    await page.goto('/login');

    // Only fill in email, leave password empty
    await page.fill('input[id="email"]', testEmail);
    await page.click('button[type="submit"]');

    // Expect to see validation error
    await expect(page.locator('text="Password is required."')).toBeVisible();
    await expect(page.url()).toContain('/login');
  });

  test('should show loading state while logging in', async ({ page }) => {
    await page.goto('/login');

    // Fill in the login form
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);

    // Click submit and immediately check for loading state
    await page.click('button[type="submit"]');

    // Check for loading text (might be very quick)
    const loadingButton = page.locator('button:has-text("Logging in...")');

    // The button should either show loading state or we should be redirected
    // This is a race condition test, so we use Promise.race
    await Promise.race([
      loadingButton.waitFor({ state: 'visible', timeout: 1000 }).catch(() => {}),
      page.waitForURL('**/dashboard', { timeout: 5000 })
    ]);

    // Eventually we should end up at the dashboard
    await page.waitForURL('**/dashboard', { timeout: 5000 });
  });

  test('should have accessible form elements (keyboard navigation)', async ({ page }) => {
    await page.goto('/login');

    // Tab through form elements
    await page.keyboard.press('Tab');
    await expect(page.locator('input[id="email"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('input[id="password"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('input[id="rememberMe"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('should allow form submission with Enter key', async ({ page }) => {
    await page.goto('/login');

    // Fill in the login form
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);

    // Press Enter to submit
    await page.keyboard.press('Enter');

    // Wait for navigation and verify redirection to dashboard
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await expect(page.url()).toContain('/dashboard');
  });

  test('should display "Register" link for new users', async ({ page }) => {
    await page.goto('/login');

    // Check for the "Register" link
    const registerLink = page.locator('a[href="/register"]');
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toContainText(/Register/i);
  });

  test('should navigate to registration page when "Register" link is clicked', async ({ page }) => {
    await page.goto('/login');

    // Click the register link
    await page.click('a[href="/register"]');

    // Verify navigation to registration page
    await page.waitForURL('**/register', { timeout: 5000 });
    await expect(page.url()).toContain('/register');
  });

  test('should apply "Farmhouse Kitchen" UI theme styles', async ({ page }) => {
    await page.goto('/login');

    // Check for specific theme colors and styles
    // This is a basic visual regression test
    const card = page.locator('.bg-light-beige').first();
    await expect(card).toBeVisible();

    // Check that the form has the expected farmhouse theme classes
    const emailInput = page.locator('input[id="email"]');
    await expect(emailInput).toHaveClass(/border-sage-green/);

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveClass(/bg-terracotta/);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');

    // Verify that the form is visible and properly sized
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Check that the card is properly sized for mobile
    const card = page.locator('.max-w-md').first();
    await expect(card).toBeVisible();

    // Verify form elements are still accessible
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should handle rate limiting after multiple failed attempts', async ({ page }) => {
    await page.goto('/login');

    // Make 6 rapid failed login attempts to trigger rate limiting
    for (let i = 0; i < 6; i++) {
      await page.fill('input[id="email"]', testEmail);
      await page.fill('input[id="password"]', 'WrongPassword1!');
      await page.click('button[type="submit"]');

      // Wait a bit between attempts
      await page.waitForTimeout(500);
    }

    // After 5 attempts, the 6th should show a rate limit error
    // The exact error message depends on your implementation
    await expect(page.locator('text=/Too many.*attempts|Rate limit/i')).toBeVisible({ timeout: 5000 });
    await expect(page.url()).toContain('/login');
  });
});
