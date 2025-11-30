import { test, expect } from '@playwright/test';

// Manual test - open the browser and let me inspect what's happening
test('manual pantry test', async ({ page }) => {
  // Navigate to login
  await page.goto('http://localhost:3000/login');

  // Wait for user to manually login and navigate
  await page.pause(); // This will pause the test so you can manually interact
});
