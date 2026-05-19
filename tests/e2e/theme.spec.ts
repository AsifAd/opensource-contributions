import { test, expect } from "@playwright/test";
import { waitForAppReady, clearThemeStorage } from "./helpers";

test.describe("theme toggle", () => {
  test("defaults to dark mode with no stored preference", async ({ page }) => {
    await clearThemeStorage(page);
    await waitForAppReady(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("toggling switches data-theme between dark and light", async ({ page }) => {
    await clearThemeStorage(page);
    await waitForAppReady(page);

    const toggle = page.getByTestId("theme-toggle");
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("light mode uses a paper-toned background", async ({ page }) => {
    await clearThemeStorage(page);
    await waitForAppReady(page);

    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.waitForTimeout(500);

    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const m = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    expect(m, `expected rgb() but got ${bg}`).not.toBeNull();
    if (m) {
      const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
      expect(r).toBeGreaterThan(230);
      expect(g).toBeGreaterThan(230);
      expect(b).toBeGreaterThan(220);
    }
  });

  test("theme choice persists across reloads", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("oss-theme"));
    await page.reload();
    await page.waitForFunction(
      () => document.querySelectorAll("[data-testid^='contrib-']").length >= 2,
    );

    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.reload();
    await page.waitForFunction(
      () => document.querySelectorAll("[data-testid^='contrib-']").length >= 2,
    );
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("toggle exposes an accessible label", async ({ page }) => {
    await clearThemeStorage(page);
    await waitForAppReady(page);

    const toggle = page.getByTestId("theme-toggle");
    const label = await toggle.getAttribute("aria-label");
    expect(label).toMatch(/switch to (light|dark) mode/i);
  });

  test("theme-color meta updates when switching themes", async ({ page }) => {
    await clearThemeStorage(page);
    await waitForAppReady(page);

    const meta = page.locator('meta[name="theme-color"]');
    const darkColor = await meta.getAttribute("content");
    expect(darkColor).toBeTruthy();

    await page.getByTestId("theme-toggle").click();
    await page.waitForTimeout(300);

    const lightColor = await meta.getAttribute("content");
    expect(lightColor).toBeTruthy();
    expect(lightColor).not.toBe(darkColor);
  });
});
