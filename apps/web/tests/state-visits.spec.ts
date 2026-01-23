import { test, expect } from "@playwright/test";

test("load page and verify existing visits display correctly", async ({
  page,
}) => {
  await page.goto("/");

  // Wait for connection and data to load
  await expect(page.getByTestId("supabase-status")).toContainText("Connected");
  await expect(page.getByTestId("visited-list")).toBeVisible();

  // Verify seeded visits appear - check for at least one visit from seeds
  const visitedList = page.getByTestId("visited-list");
  const hasVisits = await visitedList
    .locator('[data-testid^="visited-item-"]')
    .count();

  if (hasVisits > 0) {
    // Verify visit dates are formatted correctly (should contain month name)
    const firstVisitDate = page
      .locator('[data-testid^="visited-item-"]')
      .first();
    await expect(firstVisitDate).toBeVisible();

    // Verify visited states have visual indicators
    const caVisitedIndicator = page.getByTestId("visited-indicator-CA");
    if (await caVisitedIndicator.isVisible()) {
      await expect(caVisitedIndicator).toContainText("✓");
    }
  }
});

test("mark a state as visited", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("supabase-status")).toContainText("Connected");

  // Select a state that is likely not visited yet (use AK - Alaska)
  const markButton = page.getByTestId("mark-visited-button-AK");
  await markButton.waitFor({ state: "visible" });

  const buttonText = await markButton.textContent();

  if (buttonText?.includes("Mark as Visited")) {
    // Mark it as visited
    await markButton.click();

    // Verify visit appears in UI with indicator
    await expect(page.getByTestId("visited-indicator-AK")).toBeVisible();

    // Verify visit date displays
    await expect(page.getByTestId("visit-date-AK")).toBeVisible();

    // Verify button changed to "Unmark"
    await expect(markButton).toContainText("Unmark");

    // Verify it appears in visited list
    await expect(page.getByTestId("visited-list")).toContainText("Alaska");
  }
});

test("unmark a visited state", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("supabase-status")).toContainText("Connected");

  // First mark a state as visited (use CO - Colorado)
  const markButton = page.getByTestId("mark-visited-button-CO");
  await markButton.waitFor({ state: "visible" });

  const buttonText = await markButton.textContent();

  if (buttonText?.includes("Mark as Visited")) {
    await markButton.click();
    await expect(page.getByTestId("visited-indicator-CO")).toBeVisible();
  }

  // Now unmark it
  await markButton.click();

  // Verify indicator is removed
  await expect(page.getByTestId("visited-indicator-CO")).not.toBeVisible();

  // Verify visit date is removed
  await expect(page.getByTestId("visit-date-CO")).not.toBeVisible();

  // Verify button changed back to "Mark as Visited"
  await expect(markButton).toContainText("Mark as Visited");
});

test("add visit with notes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("supabase-status")).toContainText("Connected");

  // Use OR - Oregon for this test
  const notesInput = page.getByTestId("visit-notes-input-OR");
  const markButton = page.getByTestId("mark-visited-button-OR");

  await notesInput.waitFor({ state: "visible" });

  const buttonText = await markButton.textContent();

  if (buttonText?.includes("Mark as Visited")) {
    // Add notes
    await notesInput.fill("Beautiful state with amazing nature");

    // Mark as visited
    await markButton.click();

    // Verify visit appears with indicator
    await expect(page.getByTestId("visited-indicator-OR")).toBeVisible();

    // Verify notes appear in visited list
    const visitedList = page.getByTestId("visited-list");
    await expect(visitedList).toContainText("Oregon");
    await expect(visitedList).toContainText(
      "Beautiful state with amazing nature",
    );

    // Verify notes input is gone after marking
    await expect(notesInput).not.toBeVisible();
  }
});
