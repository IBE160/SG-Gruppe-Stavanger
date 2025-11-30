import { test, expect } from '@playwright/test';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

test('debug pantry page', async ({ page }) => {
  // Clean up database
  await prisma.foodItem.deleteMany();
  await prisma.user.deleteMany();

  // Create test user
  const testEmail = 'debug@example.com';
  const testPassword = 'Debug123!';
  const passwordHash = await bcrypt.hash(testPassword, 10);
  await prisma.user.create({
    data: {
      email: testEmail,
      passwordHash,
    },
  });

  // Login through the UI
  await page.goto('/login');
  await page.fill('input[id="email"]', testEmail);
  await page.fill('input[id="password"]', testPassword);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // Navigate to pantry page
  await page.goto('/pantry');

  // Wait for the page to fully load
  await page.waitForLoadState('networkidle');

  // Take a screenshot
  await page.screenshot({ path: 'pantry-debug.png', fullPage: true });

  // Get the full page content
  const pageContent = await page.content();
  console.log('=== PAGE CONTENT ===');
  console.log(pageContent);

  // Get visible text
  const bodyText = await page.locator('body').textContent();
  console.log('=== VISIBLE TEXT ===');
  console.log(bodyText);

  // Pause for manual inspection
  await page.pause();
});
