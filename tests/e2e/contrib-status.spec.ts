import { test, expect } from "@playwright/test";
import { waitForAppReady, loadContributionsData } from "./helpers";

test.describe("dynamic PR cards and status indicators", () => {
  test.beforeEach(async ({ page }) => {
    await waitForAppReady(page);
    await page.getByTestId("section-contributions").scrollIntoViewIfNeeded();
  });

  test("merged cards show GitMerge icon and merged status styling", async ({ page }) => {
    const data = loadContributionsData();
    const merged = data.contributions.filter((c) => c.status === "merged");

    expect(merged.length).toBeGreaterThan(0);

    for (const c of merged) {
      const card = page.getByTestId(`contrib-${c.id}`);
      const icon = card.locator(".contrib-icon.status-merged");
      await expect(icon).toBeVisible();
      await expect(icon.locator("svg.lucide-git-merge")).toBeVisible();
      await expect(card.locator(".contrib-status.merged")).toHaveText(c.statusLabel);
    }
  });

  test("open PR cards show GitPullRequest icon and open status styling", async ({ page }) => {
    const data = loadContributionsData();
    const open = data.contributions.filter((c) => c.status === "open");

    expect(open.length).toBeGreaterThan(0);

    for (const c of open) {
      const card = page.getByTestId(`contrib-${c.id}`);
      const icon = card.locator(".contrib-icon.status-open");
      await expect(icon).toBeVisible();
      await expect(icon.locator("svg.lucide-git-pull-request")).toBeVisible();
      await expect(card.locator(".contrib-status.open")).toHaveText(c.statusLabel);
    }
  });

  test("non-merged statuses use pull-request icon", async ({ page }) => {
    const data = loadContributionsData();
    const nonMerged = data.contributions.filter((c) => c.status !== "merged");

    for (const c of nonMerged) {
      const card = page.getByTestId(`contrib-${c.id}`);
      await expect(card.locator("svg.lucide-git-pull-request")).toBeVisible();
      await expect(card.locator("svg.lucide-git-merge")).toHaveCount(0);
    }
  });
});
