import { test, expect } from "@playwright/test";
import { waitForAppReady, loadContributionsData } from "./helpers";

test.describe("timeline", () => {
  test("renders all timeline entries from JSON", async ({ page }) => {
    const data = loadContributionsData();
    await waitForAppReady(page);
    await page.getByTestId("section-timeline").scrollIntoViewIfNeeded();

    for (const item of data.timeline) {
      await expect(page.getByText(item.title, { exact: true })).toBeVisible();
      await expect(page.getByText(item.description)).toBeVisible();
    }

    await expect(page.locator(".timeline-item")).toHaveCount(data.timeline.length);
  });

  test("PR entries link to upstream pull requests", async ({ page }) => {
    await waitForAppReady(page);
    await page.getByTestId("section-timeline").scrollIntoViewIfNeeded();

    const nmcliLink = page
      .locator(".timeline-item.type-pr")
      .filter({ hasText: "nmcli bond ARP fix" })
      .getByRole("link", { name: "View" });
    await expect(nmcliLink).toHaveAttribute(
      "href",
      "https://github.com/ansible-collections/community.general/pull/12085",
    );

    const iniLink = page
      .locator(".timeline-item.type-pr")
      .filter({ hasText: "ini_file comment deletion fix" })
      .getByRole("link", { name: "View" });
    await expect(iniLink).toHaveAttribute(
      "href",
      "https://github.com/ansible-collections/community.general/pull/12083",
    );
  });

  test("milestone entry has no external link", async ({ page }) => {
    await waitForAppReady(page);
    await page.getByTestId("section-timeline").scrollIntoViewIfNeeded();

    const milestone = page.locator(".timeline-item").filter({ hasText: "OSS hub launched" });
    await expect(milestone.getByRole("link")).toHaveCount(0);
  });

  test("planned entry links to Keycloak issue", async ({ page }) => {
    await waitForAppReady(page);
    await page.getByTestId("section-timeline").scrollIntoViewIfNeeded();

    const planned = page.locator(".timeline-item.type-planned");
    await expect(planned.getByRole("link", { name: "View" })).toHaveAttribute(
      "href",
      "https://github.com/ansible-collections/community.general/issues/11747",
    );
  });

  test("timeline dates are shown for each entry", async ({ page }) => {
    const data = loadContributionsData();
    await waitForAppReady(page);
    await page.getByTestId("section-timeline").scrollIntoViewIfNeeded();

    for (const item of data.timeline) {
      await expect(page.locator(".timeline-date", { hasText: item.date }).first()).toBeVisible();
    }
  });
});
