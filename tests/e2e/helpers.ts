import type { APIRequestContext } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "../../docs/assets/data/contributions.json");

export type ContributionsData = {
  meta: {
    name: string;
    github: string;
    portfolio: string;
    updated: string;
  };
  stats: {
    activeProjects: number;
    openPRs: number;
    plannedStacks: number;
    unitTests: number;
  };
  contributions: Array<{
    id: string;
    title: string;
    module: string;
    pr: number;
    issue: number;
    statusLabel: string;
    summary: string;
    highlights?: string[];
    links: { pr: string; issue: string };
    deepDive: string;
  }>;
  roadmap: Array<{
    tech: string;
    label: string;
    status: string;
    nextUp: string;
    openPRs: number;
    docs: string;
  }>;
  timeline: Array<{
    title: string;
    date: string;
    type: string;
    link: string | null;
  }>;
};

export function loadContributionsData(): ContributionsData {
  return JSON.parse(readFileSync(DATA_PATH, "utf-8")) as ContributionsData;
}

/** Wait until JS has fetched JSON and rendered dynamic sections. */
export async function waitForAppReady(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.waitForFunction(
    () => document.querySelectorAll("[data-testid^='contrib-']").length >= 2,
    { timeout: 10_000 },
  );
  await expectLoaderHidden(page);
}

async function expectLoaderHidden(page: import("@playwright/test").Page) {
  await page.waitForFunction(
    () => document.querySelector(".page-loader")?.classList.contains("hidden"),
    { timeout: 5_000 },
  );
}

export async function fetchContributionsJson(request: APIRequestContext) {
  const res = await request.get("/assets/data/contributions.json");
  if (!res.ok()) throw new Error(`contributions.json returned ${res.status()}`);
  return (await res.json()) as ContributionsData;
}

/** Clear theme preference so tests start from default dark. */
export async function clearThemeStorage(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.removeItem("oss-theme");
  });
}

export const SECTION_IDS = ["contributions", "roadmap", "timeline"] as const;
