import { test, expect } from "@playwright/test";
import { waitForAppReady, loadContributionsData } from "./helpers";

test.describe("roadmap", () => {
  test("renders all technology stacks from JSON", async ({ page }) => {
    const data = loadContributionsData();
    await waitForAppReady(page);
    await page.getByTestId("section-roadmap").scrollIntoViewIfNeeded();

    for (const r of data.roadmap) {
      const card = page.getByTestId(`roadmap-${r.tech}`);
      await expect(card).toBeVisible();
      await expect(card).toContainText(r.label);
      await expect(card).toContainText(r.nextUp ?? r.label);
    }

    await expect(page.locator(".roadmap-card")).toHaveCount(data.roadmap.length);
  });

  test("filter: All shows every stack", async ({ page }) => {
    const data = loadContributionsData();
    await waitForAppReady(page);
    await page.getByTestId("section-roadmap").scrollIntoViewIfNeeded();

    await page.getByTestId("filter-bar").getByRole("tab", { name: "All" }).click();
    await expect(page.locator(".roadmap-card:not(.hidden-filter)")).toHaveCount(data.roadmap.length);
  });

  test("filter: Active shows only active stacks", async ({ page }) => {
    const data = loadContributionsData();
    const activeCount = data.roadmap.filter((r) => r.status === "active").length;
    await waitForAppReady(page);
    await page.getByTestId("section-roadmap").scrollIntoViewIfNeeded();

    await page.getByTestId("filter-bar").getByRole("tab", { name: "Active" }).click();
    await expect(page.locator(".roadmap-card:not(.hidden-filter)")).toHaveCount(activeCount);
    await expect(page.getByTestId("roadmap-ansible")).toBeVisible();
  });

  test("filter: Planned hides active and placeholder stacks", async ({ page }) => {
    const data = loadContributionsData();
    const plannedCount = data.roadmap.filter((r) => r.status === "planned").length;
    await waitForAppReady(page);
    await page.getByTestId("section-roadmap").scrollIntoViewIfNeeded();

    await page.getByTestId("filter-bar").getByRole("tab", { name: "Planned" }).click();
    await expect(page.locator(".roadmap-card:not(.hidden-filter)")).toHaveCount(plannedCount);
    await expect(page.getByTestId("roadmap-argocd")).toBeVisible();
    await expect(page.getByTestId("roadmap-ansible")).toBeHidden();
  });

  test("filter: Placeholder shows docker, kubernetes, terraform", async ({ page }) => {
    await waitForAppReady(page);
    await page.getByTestId("section-roadmap").scrollIntoViewIfNeeded();

    await page.getByTestId("filter-bar").getByRole("tab", { name: "Placeholder" }).click();

    for (const tech of ["docker", "kubernetes", "terraform"]) {
      await expect(page.getByTestId(`roadmap-${tech}`)).toBeVisible();
    }
    await expect(page.getByTestId("roadmap-ansible")).toBeHidden();
  });

  test("filter tabs update aria-selected", async ({ page }) => {
    await waitForAppReady(page);
    await page.getByTestId("section-roadmap").scrollIntoViewIfNeeded();

    const bar = page.getByTestId("filter-bar");
    await bar.getByRole("tab", { name: "Active" }).click();

    await expect(bar.getByRole("tab", { name: "Active" })).toHaveAttribute("aria-selected", "true");
    await expect(bar.getByRole("tab", { name: "All" })).toHaveAttribute("aria-selected", "false");
  });

  test("docs links point into the GitHub repository", async ({ page }) => {
    const data = loadContributionsData();
    await waitForAppReady(page);
    await page.getByTestId("section-roadmap").scrollIntoViewIfNeeded();

    for (const r of data.roadmap) {
      const card = page.getByTestId(`roadmap-${r.tech}`);
      const docs = card.getByRole("link", { name: "Docs" });
      await expect(docs).toHaveAttribute(
        "href",
        `https://github.com/AsifAd/opensource-contributions/blob/main/${r.docs}`,
      );
    }
  });
});
