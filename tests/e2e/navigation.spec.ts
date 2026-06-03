import { test, expect } from "@playwright/test";
import { waitForAppReady, SECTION_IDS } from "./helpers";

test.describe("navigation", () => {
  test("nav links scroll to matching sections on desktop", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop nav links are in the collapsed mobile menu");

    await waitForAppReady(page);

    const items = [
      { label: "Contributions", id: "contributions" },
      { label: "Roadmap", id: "roadmap" },
    ];

    for (const it of items) {
      const link = page.getByTestId("nav-links").getByRole("link", { name: it.label });
      await expect(link).toBeVisible();
      await link.click();
      await page.waitForTimeout(500);

      const inView = await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight * 0.6 && r.bottom > 0;
      }, it.id);

      expect(inView, `#${it.id} not in viewport after clicking ${it.label}`).toBe(true);
    }
  });

  test("quick jump panel links reach each section", async ({ page }) => {
    await waitForAppReady(page);

    const jumps = [
      { name: "Active PRs", id: "contributions" },
      { name: "Tech roadmap", id: "roadmap" },
    ];

    for (const j of jumps) {
      await page.locator(".quick-nav").getByRole("link", { name: j.name }).click();
      await expect(page.locator(`#${j.id}`)).toBeInViewport({ timeout: 3000 });
    }
  });

  test("external nav links point to portfolio and GitHub", async ({ page }) => {
    await waitForAppReady(page);

    await expect(page.getByRole("link", { name: /Portfolio/i }).first()).toHaveAttribute(
      "href",
      "https://asifad.github.io",
    );
    await expect(page.getByRole("link", { name: "GitHub" }).first()).toHaveAttribute(
      "href",
      "https://github.com/AsifAd",
    );
  });

  test("footer links are present and correct", async ({ page }) => {
    await waitForAppReady(page);

    const footer = page.getByTestId("footer");
    await footer.scrollIntoViewIfNeeded();

    await expect(footer.getByRole("link", { name: "Portfolio" })).toHaveAttribute(
      "href",
      "https://asifad.github.io",
    );
    await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/AsifAd",
    );
    await expect(footer.getByRole("link", { name: "Source" })).toHaveAttribute(
      "href",
      "https://github.com/AsifAd/opensource-contributions",
    );
  });

  test("all main sections exist in the DOM", async ({ page }) => {
    await waitForAppReady(page);

    for (const id of SECTION_IDS) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });
});
