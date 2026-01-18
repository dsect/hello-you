import { test, expect } from '@playwright/test';

test.describe('Supabase Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5174');
  });

  test('should load the app and show Supabase connection test', async ({ page }) => {
    // Check that the app loaded
    await expect(page.locator('h1')).toContainText('Vite + React + Supabase');

    // Wait for loading to complete and database test section to appear
    const dbTestHeading = page.locator('h2').filter({ hasText: 'Database Connection Test' });
    await expect(dbTestHeading).toBeVisible({ timeout: 10000 });

    // Check for success message
    const successMessage = page.locator('p').filter({ hasText: '✅ Connected to Supabase successfully' });
    await expect(successMessage).toBeVisible();
  });

  test('should test data refresh functionality', async ({ page }) => {
    // Wait for initial data to load
    const dbTestHeading = page.locator('h2').filter({ hasText: 'Database Connection Test' });
    await expect(dbTestHeading).toBeVisible({ timeout: 10000 });

    // Check that we have some users loaded
    await expect(page.locator('text=Alice Johnson')).toBeVisible();

    // Click the refresh button
    const refreshButton = page.locator('button:has-text("Refresh Data")');
    await refreshButton.click();

    // Data should still be visible after refresh
    await expect(page.locator('text=Alice Johnson')).toBeVisible();
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

  // Test actual database operations with seeded data
  test('should interact with seeded database data', async ({ page }) => {
    // Wait for the database test section to load
    const dbTestHeading = page.locator('h2').filter({ hasText: 'Database Connection Test' });
    await expect(dbTestHeading).toBeVisible({ timeout: 15000 });

    // Check that seeded users are displayed
    await expect(page.locator('text=Alice Johnson')).toBeVisible();
    await expect(page.locator('text=Bob Smith')).toBeVisible();
    await expect(page.locator('text=Charlie Brown')).toBeVisible();

    // Check that seeded posts are displayed
    await expect(page.locator('text=Welcome Post')).toBeVisible();
    await expect(page.locator('text=Another Post')).toBeVisible();
    await expect(page.locator('text=Third Post')).toBeVisible();

    // Should connect successfully with seeded database
    await expect(page.locator('text=Connected to Supabase successfully')).toBeVisible();
  });
});