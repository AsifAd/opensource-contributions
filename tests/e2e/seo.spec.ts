import { test, expect } from "@playwright/test";
import { waitForAppReady, fetchContributionsJson } from "./helpers";

test.describe("SEO and assets", () => {
  test("has descriptive meta tags for sharing", async ({ page }) => {
    await waitForAppReady(page);

    const description = await page.locator('meta[name="description"]').getAttribute("content");
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute("content");

    expect(description?.length ?? 0).toBeGreaterThan(40);
    expect(ogTitle).toMatch(/Asif Draxi/);
    expect(ogDesc?.length ?? 0).toBeGreaterThan(30);
  });

  test("contributions.json is served and valid", async ({ request }) => {
    const data = await fetchContributionsJson(request);

    expect(data.contributions.length).toBeGreaterThanOrEqual(2);
    expect(data.roadmap.length).toBe(7);
    expect(data.timeline.length).toBeGreaterThanOrEqual(4);
    expect(data.stats.openPRs).toBe(2);
    expect(data.meta.portfolio).toBe("https://asifad.github.io");
  });

  test("main CSS and JS assets return 200", async ({ request }) => {
    for (const path of ["/assets/css/main.css", "/assets/js/main.js"]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
    }
  });

  test("html lang attribute is set", async ({ page }) => {
    await waitForAppReady(page);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("CTA section links to repository and portfolio", async ({ page }) => {
    await waitForAppReady(page);

    await page.getByRole("link", { name: "View repository" }).scrollIntoViewIfNeeded();
    await expect(page.getByRole("link", { name: "View repository" })).toHaveAttribute(
      "href",
      "https://github.com/AsifAd/opensource-contributions",
    );
    await expect(page.getByRole("link", { name: "Portfolio" }).last()).toHaveAttribute(
      "href",
      "https://asifad.github.io",
    );
  });
});
