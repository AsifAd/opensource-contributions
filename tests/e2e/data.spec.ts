import { test, expect } from "@playwright/test";
import { waitForAppReady, loadContributionsData } from "./helpers";

test.describe("data integrity", () => {
  test("rendered contributions match contributions.json", async ({ page, request }) => {
    const fileData = loadContributionsData();
    const apiData = await (async () => {
      const res = await request.get("/assets/data/contributions.json");
      return res.json();
    })();

    expect(apiData.contributions).toEqual(fileData.contributions);

    await waitForAppReady(page);

    for (const c of fileData.contributions) {
      const card = page.getByTestId(`contrib-${c.id}`);
      await expect(card).toContainText(c.title);
      await expect(card).toContainText(c.summary.slice(0, 40));
    }
  });

  test("roadmap open PR counts match JSON", async ({ page }) => {
    const data = loadContributionsData();
    await waitForAppReady(page);
    await page.getByTestId("section-roadmap").scrollIntoViewIfNeeded();

    for (const r of data.roadmap) {
      const card = page.getByTestId(`roadmap-${r.tech}`);
      const label = r.openPRs === 1 ? "1 open PR" : `${r.openPRs} open PRs`;
      await expect(card).toContainText(label);
    }
  });

  test("handles JSON fetch failure gracefully without crashing page shell", async ({ page }) => {
    await page.route("**/assets/data/contributions.json", (route) => route.abort());

    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await page.waitForTimeout(800);

    await expect(page.getByTestId("section-hero")).toBeVisible();
    await expect(page.locator("#contributions-grid")).toBeEmpty();
    expect(errors.some((e) => e.toLowerCase().includes("fail") || e.includes("contributions"))).toBeTruthy();
  });
});
