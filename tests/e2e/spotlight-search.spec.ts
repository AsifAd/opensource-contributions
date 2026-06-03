import { test, expect } from "@playwright/test";
import { waitForAppReady } from "./helpers";

test.describe("spotlight search", () => {
  test.beforeEach(async ({ page }) => {
    await waitForAppReady(page);
    await page.keyboard.press(process.platform === "darwin" ? "Meta+k" : "Control+k");
    await expect(page.getByTestId("spotlight-panel")).toBeVisible();
  });

  test("finds contribution by module name", async ({ page }) => {
    await page.getByTestId("spotlight-input").fill("ini_file");
    await expect(page.getByRole("option", { name: /ini_file/i }).first()).toBeVisible();
  });

  test("finds roadmap stack by technology", async ({ page }) => {
    await page.getByTestId("spotlight-input").fill("argocd");
    await expect(page.getByRole("option", { name: /Argo CD/i }).first()).toBeVisible();
  });
});
