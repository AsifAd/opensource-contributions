import { test, expect } from "@playwright/test";
import { waitForAppReady } from "./helpers";

test.describe("responsive search trigger", () => {
  test.beforeEach(async ({ page }) => {
    await waitForAppReady(page);
  });

  test("mobile shows Search without ⌘K in hero", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await expect(page.getByTestId("hero-search-trigger")).toBeVisible();
    await expect(page.locator(".cmd-kbd-hint")).toBeHidden();
    await expect(page.getByTestId("command-trigger")).toBeVisible();
    await expect(page.getByTestId("command-trigger").locator(".nav-search-kbd")).toBeHidden();
  });

  test("mobile search opens command palette", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await page.getByTestId("hero-search-trigger").click();
    await expect(page.getByTestId("spotlight-input")).toBeVisible();

    await page.keyboard.press("Escape");
    await page.getByTestId("command-trigger").click();
    await expect(page.getByTestId("spotlight-input")).toBeVisible();
  });

  test("desktop shows ⌘K hint in hero eyebrow", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    await expect(page.locator(".cmd-kbd-hint")).toBeVisible();
    await expect(page.getByTestId("command-trigger")).toContainText("⌘K");
  });
});
