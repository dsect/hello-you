import { test, expect } from "@playwright/test";

test("Supabase connection status is Connected", async ({ page }) => {
  await page.goto("http://localhost:5174/");
  await expect(
    page.locator("text=Supabase connection status: Connected"),
  ).toBeVisible();
});
