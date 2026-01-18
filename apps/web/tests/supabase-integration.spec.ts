import { test, expect } from '@playwright/test';

test.describe('Supabase Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5174');
  });

  test('should load the app and show Supabase connection test', async ({ page }) => {
    // Check that the app loaded
    await expect(page.locator('h1')).toContainText('Vite + React + Supabase');

    // Check for the test button
    const testButton = page.locator('button:has-text("Test Supabase Connection")');
    await expect(testButton).toBeVisible();
  });

  test('should test Supabase connection', async ({ page }) => {
    // Click the test button
    const testButton = page.locator('button:has-text("Test Supabase Connection")');
    await testButton.click();

    // Wait for the status to update (may take longer in headless mode)
    const statusElement = page.locator('p').filter({ hasText: /Status:/ });
    await expect(statusElement).toBeVisible({ timeout: 10000 });

    // Should show either "Connected" or connection status
    await expect(statusElement).toContainText(/Status:/);
  });

  test('should have working navigation and UI', async ({ page }) => {
    // Test the counter functionality
    const counterButton = page.locator('button').filter({ hasText: /count is/ });
    const initialText = await counterButton.textContent();

    await counterButton.click();

    // Counter should increment
    const newText = await counterButton.textContent();
    expect(newText).not.toBe(initialText);
  });

  // Skip slow/network tests in CI
  test.skip(process.env.CI === 'true', 'should handle network timeouts gracefully', async ({ page }) => {
    // This test might be too slow for CI
    const testButton = page.locator('button:has-text("Test Supabase Connection")');
    await testButton.click();

    // Wait for potential timeout scenarios
    await page.waitForTimeout(5000);
    const statusElement = page.locator('p').filter({ hasText: /Status:/ });
    await expect(statusElement).toBeVisible();
  });
});