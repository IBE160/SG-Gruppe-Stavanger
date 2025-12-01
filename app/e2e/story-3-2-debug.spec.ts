import { test, expect } from '@playwright/test';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

test.describe('Story 3-2: Debug Test', () => {
  const testEmail = `recipe-debug-${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  test('Debug: What does the recipe detail page show?', async ({ page }) => {
    // Create and login user
    await prisma.user.deleteMany({
      where: { email: { startsWith: 'recipe-debug-' } }
    });

    const passwordHash = await bcrypt.hash(testPassword, 10);
    const user = await prisma.user.create({
      data: { email: testEmail, passwordHash },
    });

    // Login
    await page.goto('/login');
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    console.log('\n📸 Navigating to recipe detail page...');

    // Navigate to recipe detail
    await page.goto('/recipes/715538');
    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'test-results/recipe-detail-page.png', fullPage: true });
    console.log('✅ Screenshot saved: test-results/recipe-detail-page.png');

    // Get page content
    const pageText = await page.textContent('body');
    console.log('\n📄 Page content preview:');
    console.log(pageText?.substring(0, 500));

    // Check for errors
    const errorMessage = await page.locator('text=/error|failed|not found/i').first().textContent().catch(() => null);
    if (errorMessage) {
      console.log(`\n❌ Error found: ${errorMessage}`);
    }

    // Check what's actually rendered
    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();
    const buttonCount = await page.locator('button').count();

    console.log(`\n🔍 Elements found:`);
    console.log(`   - H1 elements: ${h1Count}`);
    console.log(`   - H2 elements: ${h2Count}`);
    console.log(`   - Buttons: ${buttonCount}`);

    // Get all headings
    if (h1Count > 0) {
      for (let i = 0; i < h1Count; i++) {
        const h1Text = await page.locator('h1').nth(i).textContent();
        console.log(`   - H1 #${i + 1}: "${h1Text}"`);
      }
    }

    // Check for loading state
    const isLoading = await page.locator('text=/loading/i').isVisible().catch(() => false);
    console.log(`   - Loading indicator visible: ${isLoading}`);

    // Check network requests
    console.log('\n🌐 Waiting for any pending network requests...');
    await page.waitForLoadState('networkidle');
    console.log('✅ Network idle reached');

    // Cleanup
    await prisma.user.delete({ where: { id: user.id } });
  });
});
