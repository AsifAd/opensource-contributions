import { test, expect } from "@playwright/test";
import { loadContributionsData } from "./helpers";

/** Timeline lives in contributions.json for workflow/docs; it is not rendered on the public page. */
test.describe("timeline data", () => {
  test("contributions.json keeps timeline entries for changelog workflow", () => {
    const data = loadContributionsData();
    expect(data.timeline.length).toBeGreaterThanOrEqual(4);

    const types = new Set(data.timeline.map((t) => t.type));
    expect(types.has("pr")).toBe(true);
    expect(types.has("milestone")).toBe(true);
  });

  test("PR timeline entries include upstream links", () => {
    const data = loadContributionsData();
    const prEntries = data.timeline.filter((t) => t.type === "pr" && t.link);

    expect(prEntries.length).toBeGreaterThan(0);
    for (const item of prEntries) {
      expect(item.link).toMatch(/^https:\/\/github\.com\//);
    }
  });

  test("milestone entries may omit external links", () => {
    const data = loadContributionsData();
    const milestone = data.timeline.find((t) => t.title.includes("OSS hub launched"));
    expect(milestone).toBeTruthy();
    expect(milestone!.link).toBeNull();
  });
});
