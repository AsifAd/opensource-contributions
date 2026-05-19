import { test, expect } from "@playwright/test";
import { waitForAppReady, loadContributionsData, SECTION_IDS } from "./helpers";

test.describe("homepage", () => {
  test("loads without console errors and renders all sections", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await waitForAppReady(page);

    await expect(page).toHaveTitle(/Asif Draxi.*OSS Contributions/i);

    for (const id of SECTION_IDS) {
      const section = page.getByTestId(`section-${id}`);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }

    await expect(page.getByTestId("section-hero")).toBeVisible();
    await expect(page.getByTestId("section-stats")).toBeVisible();
    await expect(page.getByTestId("footer")).toBeVisible();

    expect(consoleErrors, `Console errors:\n${consoleErrors.join("\n")}`).toEqual([]);
  });

  test("hero shows live status from JSON stats", async ({ page }) => {
    const data = loadContributionsData();
    await waitForAppReady(page);

    const status = page.getByTestId("hero-status");
    await expect(status).toContainText(`${data.stats.openPRs} open PR`);
    await expect(status).toContainText("Ansible active");
  });

  test("hero primary CTA links to contributions section", async ({ page }) => {
    await waitForAppReady(page);

    await page.getByRole("link", { name: "View contributions" }).click();
    await page.waitForTimeout(400);

    const inView = await page.evaluate(() => {
      const el = document.getElementById("contributions");
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.5 && r.bottom > 0;
    });
    expect(inView).toBe(true);
  });

  test("page loader hides after content is ready", async ({ page }) => {
    await page.goto("/");
    const loader = page.locator(".page-loader");
    await expect(loader).toBeVisible();
    await page.waitForFunction(
      () => document.querySelector(".page-loader")?.classList.contains("hidden"),
    );
    await expect(loader).toHaveClass(/hidden/);
  });
});
