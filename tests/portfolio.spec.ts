import { expect, test, type Page } from "@playwright/test";

import { credentials } from "../src/content/credentials";
import { sections } from "../src/content/site";

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 700;

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}

test("home renders with identity, metadata and no console errors", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Prashanth Bonkuru" })).toBeVisible();
  await expect(page).toHaveTitle("Prashanth Bonkuru — Software Engineer");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Karios AI/);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  for (const s of sections) await expect(page.locator(`#${s.id}`)).toHaveCount(1);
  await page.waitForTimeout(1500);
  expect(errors).toEqual([]);
});

test("no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("every in-page anchor points at an existing element", async ({ page }) => {
  await page.goto("/");
  const missing = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
      .map((a) => a.getAttribute("href")!.slice(1))
      .filter((id) => id && !document.getElementById(id)),
  );
  expect(missing).toEqual([]);
});

test("résumé, certificates and SEO routes are served", async ({ request }) => {
  const paths = [
    "/resume/Prashanth_Bonkuru_Resume.pdf",
    "/certificates/wyreflow-internship.pdf",
    ...credentials.flatMap((c) => [c.pdf, c.image, c.thumb]),
    "/sitemap.xml",
    "/robots.txt",
    "/opengraph-image",
    "/icon.svg",
  ];
  for (const p of paths) {
    const res = await request.get(p);
    expect(res.status(), p).toBe(200);
  }
  const pdf = await request.get("/resume/Prashanth_Bonkuru_Resume.pdf");
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
});

test("JSON endpoint returns the API view payload", async ({ request }) => {
  const res = await request.get("/v1/engineer/prashanth");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.metadata.name).toBe("Prashanth Bonkuru");
  expect(body.spec.current.company).toBe("Karios AI");
});

test("navigation reaches every section", async ({ page }) => {
  await page.goto("/");
  for (const s of sections) {
    if (isMobile(page)) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.locator("#mobile-menu").getByRole("link", { name: new RegExp(s.label) }).click();
    } else {
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: new RegExp(s.label) }).click();
    }
    await expect(page.locator(`#${s.id}`)).toBeInViewport({ ratio: 0.05, timeout: 5000 });
  }
});

test("command palette performs real actions", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.keyboard.press("Control+k");
  const input = page.getByPlaceholder("Type a command or search…");
  await expect(input).toBeVisible();
  await input.fill("projects");
  await page.keyboard.press("Enter");
  await expect(page.locator("#projects")).toBeInViewport({ ratio: 0.05 });

  await page.keyboard.press("Control+k");
  await input.fill("copy email");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("Email copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("bonkuruprashanth05@gmail.com");

  await page.keyboard.press("Control+k");
  await input.fill("résumé");
  const download = page.waitForEvent("download");
  await page.keyboard.press("Enter");
  expect((await download).suggestedFilename()).toBe("Prashanth_Bonkuru_Resume.pdf");
});

test("Human / API view toggle", async ({ page }) => {
  await page.goto("/");
  if (isMobile(page)) await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("button", { name: "API", exact: true }).first().click();
  await expect(page.getByLabel("JSON response")).toContainText('"Prashanth Bonkuru"');
  await page.getByRole("button", { name: "Back to human view" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Prashanth Bonkuru" })).toBeVisible();
});

test("workstreams expand and collapse", async ({ page }) => {
  await page.goto("/#experience");
  const btn = page.getByRole("button", { name: /Multi-tenant authentication/ });
  await expect(btn).toHaveAttribute("aria-expanded", "false");
  await btn.click();
  await expect(btn).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#ws-auth-panel")).toContainText("Just-In-Time");
});

test("VM migration failure path compensates and rolls back", async ({ page }) => {
  await page.goto("/");
  const sim = page.locator("#sim-migration");
  await sim.scrollIntoViewIfNeeded();
  await sim.getByRole("button", { name: "Reset" }).click();
  await sim.getByRole("button", { name: "Simulate failure" }).click();
  await expect(sim).toContainText("Rolled back · safe", { timeout: 15_000 });
  await expect(sim).toContainText("migration.rolled_back");
});

test("auth flow switches protocol", async ({ page }) => {
  await page.goto("/");
  const sim = page.locator("#sim-auth");
  await sim.scrollIntoViewIfNeeded();
  await sim.getByRole("tab", { name: "SAML" }).click();
  await expect(sim).toContainText("Signed assertion posted");
  await expect(sim).toContainText("Session issued", { timeout: 10_000 });
});

test("config resolution respects priority and never reveals secrets", async ({ page }) => {
  await page.goto("/");
  const sim = page.locator("#sim-config");
  await sim.scrollIntoViewIfNeeded();
  const logLevel = sim.locator("li", { hasText: "log.level" });
  await expect(logLevel).toContainText("debug");
  await sim.getByRole("button", { name: /Runtime/ }).click();
  await expect(logLevel).toContainText("info");
  await sim.getByRole("button", { name: "Reveal secrets" }).click();
  await expect(sim).toContainText("403");
  await expect(sim.locator("li", { hasText: "idp.client_secret" })).toContainText("••••••••");
});

test("skills link to evidence", async ({ page }) => {
  await page.goto("/");
  const skills = page.locator("#skills");
  await skills.scrollIntoViewIfNeeded();
  await skills.getByRole("tab", { name: /Identity & access/ }).click();
  await skills.getByRole("button", { name: "SAML", exact: true }).click();
  await expect(skills.locator("#skill-panel")).toContainText("Multi-tenant authentication");
});

test("certificate viewer opens and closes", async ({ page }) => {
  await page.goto("/");
  await page.locator("#credentials").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "View certificate" }).first().click();
  const dialog = page.getByRole("dialog", { name: /Generative AI Professional/ });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("img")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
