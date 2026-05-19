import { test, expect } from "@playwright/test";
import { waitForAppReady } from "./helpers";

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("hamburger opens and closes the nav menu", async ({ page }) => {
    await waitForAppReady(page);

    const toggle = page.getByRole("button", { name: "Toggle menu" });
    const navLinks = page.getByTestId("nav-links");

    await expect(navLinks).not.toHaveClass(/open/);
    await toggle.click();
    await expect(navLinks).toHaveClass(/open/);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await navLinks.getByRole("link", { name: "Timeline" }).click();
    await expect(navLinks).not.toHaveClass(/open/);
  });

  test("mobile user can reach contributions via nav", async ({ page }) => {
    await waitForAppReady(page);

    await page.getByRole("button", { name: "Toggle menu" }).click();
    await page.getByTestId("nav-links").getByRole("link", { name: "Contributions" }).click();
    await page.waitForTimeout(500);

    const inView = await page.evaluate(() => {
      const el = document.getElementById("contributions");
      if (!el) return false;
      return el.getBoundingClientRect().top < window.innerHeight * 0.7;
    });
    expect(inView).toBe(true);
  });

  test("theme toggle works on mobile", async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem("oss-theme"));
    await waitForAppReady(page);

    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});
