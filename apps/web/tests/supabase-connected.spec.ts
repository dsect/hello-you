import { test, expect } from "@playwright/test";

test("shows Supabase connection status as Connected", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("supabase-status")).toContainText("Connected");
});

test("can select and save US states", async ({ page }) => {
  await page.goto("/");

  // Wait for connection and states to load
  await expect(page.getByTestId("supabase-status")).toContainText("Connected");
  await expect(page.getByTestId("states-list")).toBeVisible();

  // Select California, Texas, and New York
  await page.getByTestId("state-checkbox-CA").check();
  await page.getByTestId("state-checkbox-TX").check();
  await page.getByTestId("state-checkbox-NY").check();

  // Verify button shows correct count
  await expect(page.getByTestId("save-selections-button")).toContainText(
    "Save 3 Selections",
  );

  // Save selections
  await page.getByTestId("save-selections-button").click();

  // Wait for save to complete and verify selections appear in the list
  await expect(page.locator('[data-state-code="CA"]').first()).toBeVisible();
  await expect(page.locator('[data-state-code="TX"]').first()).toBeVisible();
  await expect(page.locator('[data-state-code="NY"]').first()).toBeVisible();

  // Verify checkboxes are unchecked after save
  await expect(page.getByTestId("state-checkbox-CA")).not.toBeChecked();
  await expect(page.getByTestId("state-checkbox-TX")).not.toBeChecked();
  await expect(page.getByTestId("state-checkbox-NY")).not.toBeChecked();
});
