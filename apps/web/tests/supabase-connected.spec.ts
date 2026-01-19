import { test, expect } from "@playwright/test";

test("shows Supabase connection status as Connected", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("supabase-status")).toContainText("Connected");
});
