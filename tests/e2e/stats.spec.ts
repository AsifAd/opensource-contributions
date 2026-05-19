import { test, expect } from "@playwright/test";
import { waitForAppReady, loadContributionsData } from "./helpers";

test.describe("stats", () => {
  test("stat cards show correct labels", async ({ page }) => {
    await waitForAppReady(page);

    const stats = page.getByTestId("section-stats");
    await expect(stats.getByText("Active stack")).toBeVisible();
    await expect(stats.getByText("Open PRs")).toBeVisible();
    await expect(stats.getByText("Tech stacks")).toBeVisible();
    await expect(stats.getByText("Unit tests")).toBeVisible();
  });

  test("counters animate to values from JSON", async ({ page }) => {
    const data = loadContributionsData();
    await waitForAppReady(page);

    await page.getByTestId("section-stats").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    const cards = page.locator(".stat-card");
    await expect(cards.nth(0).locator(".stat-value")).toHaveText(String(data.stats.activeProjects));
    await expect(cards.nth(1).locator(".stat-value")).toHaveText(String(data.stats.openPRs));
    await expect(cards.nth(2).locator(".stat-value")).toHaveText(String(data.roadmap.length));
    await expect(cards.nth(3).locator(".stat-value")).toHaveText(`${data.stats.unitTests}+`);
  });

  test("hero status reflects open PR count from stats", async ({ page }) => {
    const data = loadContributionsData();
    await waitForAppReady(page);

    await expect(page.getByTestId("hero-status")).toContainText(String(data.stats.openPRs));
  });

  test("last updated footer date is formatted from meta.updated", async ({ page }) => {
    const data = loadContributionsData();
    await waitForAppReady(page);

    const expected = new Date(data.meta.updated).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    await expect(page.locator("#last-updated")).toHaveText(expected);
  });
});
