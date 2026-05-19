import { test, expect } from "@playwright/test";
import { waitForAppReady, loadContributionsData } from "./helpers";

test.describe("contributions", () => {
  test("renders one card per contribution from JSON", async ({ page }) => {
    const data = loadContributionsData();
    await waitForAppReady(page);

    await page.getByTestId("section-contributions").scrollIntoViewIfNeeded();

    for (const c of data.contributions) {
      const card = page.getByTestId(`contrib-${c.id}`);
      await expect(card).toBeVisible();
      await expect(card).toContainText(c.title);
      await expect(card).toContainText(c.module);
      await expect(card).toContainText(c.statusLabel);
    }

    await expect(page.locator(".contrib-card")).toHaveCount(data.contributions.length);
  });

  test("each card links to PR, issue, and deep dive", async ({ page }) => {
    const data = loadContributionsData();
    await waitForAppReady(page);
    await page.getByTestId("section-contributions").scrollIntoViewIfNeeded();

    for (const c of data.contributions) {
      const card = page.getByTestId(`contrib-${c.id}`);

      const prLink = card.getByRole("link", { name: `PR #${c.pr}` });
      await expect(prLink).toHaveAttribute("href", c.links.pr);
      await expect(prLink).toHaveAttribute("target", "_blank");

      const issueLink = card.getByRole("link", { name: `Issue #${c.issue}` });
      await expect(issueLink).toHaveAttribute("href", c.links.issue);

      const diveLink = card.getByRole("link", { name: "Deep dive" });
      await expect(diveLink).toHaveAttribute("href", new RegExp(c.deepDive.replace(/\./g, "\\.")));
    }
  });

  test("highlights render as tags on each card", async ({ page }) => {
    const data = loadContributionsData();
    await waitForAppReady(page);
    await page.getByTestId("section-contributions").scrollIntoViewIfNeeded();

    for (const c of data.contributions) {
      const card = page.getByTestId(`contrib-${c.id}`);
      for (const tag of c.highlights ?? []) {
        await expect(card.locator(".contrib-tag", { hasText: tag })).toBeVisible();
      }
    }
  });

  test("ini_file PR card links to community.general #12083", async ({ page }) => {
    await waitForAppReady(page);
    await page.getByTestId("section-contributions").scrollIntoViewIfNeeded();

    const card = page.getByTestId("contrib-ini-file-11919");
    await expect(card.getByRole("link", { name: "PR #12083" })).toHaveAttribute(
      "href",
      "https://github.com/ansible-collections/community.general/pull/12083",
    );
  });

  test("nmcli PR card links to community.general #12085", async ({ page }) => {
    await waitForAppReady(page);
    await page.getByTestId("section-contributions").scrollIntoViewIfNeeded();

    const card = page.getByTestId("contrib-nmcli-11588");
    await expect(card.getByRole("link", { name: "PR #12085" })).toHaveAttribute(
      "href",
      "https://github.com/ansible-collections/community.general/pull/12085",
    );
  });
});
