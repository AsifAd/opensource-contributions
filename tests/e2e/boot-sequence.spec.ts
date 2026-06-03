import { test, expect } from "@playwright/test";

export const OSS_BOOT_LINES = [
  "> Booting system... [OK]",
  "> Fetching upstream PRs... [OK]",
  "> Resolving dependencies... [OK]",
  "> Systems nominal.",
] as const;

test.describe("terminal boot sequence loader", () => {
  test("shows loader, prints lines sequentially, then hides without blocking clicks", async ({
    page,
  }) => {
    await page.goto("/");

    const loader = page.locator("#page-loader");
    await expect(loader).toBeVisible();

    const bootText = page.locator("#boot-text");
    let previousCount = 0;

    for (const line of OSS_BOOT_LINES) {
      await expect
        .poll(async () => bootText.locator("div").count(), { timeout: 8_000 })
        .toBeGreaterThan(previousCount);
      await expect(bootText).toContainText(line);
      previousCount += 1;
    }

    await page.waitForFunction(
      () => document.querySelector("#page-loader")?.classList.contains("hidden"),
      { timeout: 8_000 },
    );
    await expect(loader).toHaveClass(/hidden/);

    await page.getByTestId("nav-links").getByRole("link", { name: "Contributions" }).click();
    await page.waitForTimeout(400);

    const inView = await page.evaluate(() => {
      const el = document.getElementById("contributions");
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.5 && r.bottom > 0;
    });
    expect(inView).toBe(true);
  });
});
