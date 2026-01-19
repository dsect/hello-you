import { test, expect } from "@playwright/test";

test("shows Supabase connection status as Connected", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText(/Supabase connection status: Connected/i),
  ).toBeVisible();
});
