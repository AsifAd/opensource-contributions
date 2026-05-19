import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("renders all dynamic sections with prefers-reduced-motion", async ({ page }) => {
  await page.goto("/");

  await page.waitForFunction(
    () => document.querySelectorAll("[data-testid^='contrib-']").length >= 2,
    { timeout: 10_000 },
  );

  await expect(page.getByTestId("section-hero")).toBeVisible();
  await expect(page.getByTestId("section-contributions")).toBeVisible();
  await expect(page.getByTestId("section-roadmap")).toBeVisible();
  await expect(page.getByTestId("section-timeline")).toBeVisible();

  await expect(page.getByTestId("contrib-ini-file-11919")).toBeVisible();
  await expect(page.getByTestId("roadmap-ansible")).toBeVisible();
});
