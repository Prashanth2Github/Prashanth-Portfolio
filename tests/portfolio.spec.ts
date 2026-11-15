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
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Software Engineer at Karios/);
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
  expect(body.spec.current.company).toBe("Karios");
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

test.describe("contact form", () => {
  const form = (page: Page) => page.locator("#contact form");

  async function openForm(page: Page) {
    await page.goto("/");
    await form(page).scrollIntoViewIfNeeded();
    await expect(form(page).getByRole("button", { name: "Send Message" })).toBeVisible();
  }

  async function fill(page: Page, v: { name: string; email: string; message: string }) {
    await page.getByLabel("Name", { exact: true }).fill(v.name);
    await page.getByLabel("Email", { exact: true }).fill(v.email);
    await page.getByLabel("Message", { exact: true }).fill(v.message);
  }

  test("validates fields in the browser and sends nothing when invalid", async ({ page }) => {
    let requests = 0;
    await page.route("**/api/contact", (route) => {
      requests++;
      return route.fulfill({ status: 200, json: { ok: true } });
    });
    await openForm(page);

    await form(page).getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
    await expect(page.getByText("Please write a message.")).toBeVisible();
    await expect(page.getByLabel("Name", { exact: true })).toBeFocused();

    await fill(page, { name: "Test Visitor", email: "not-an-email", message: "short" });
    await expect(page.getByText(/valid email address/)).toBeVisible();
    await expect(page.getByText(/at least 10 characters/)).toBeVisible();
    await form(page).getByRole("button", { name: "Send Message" }).click();
    expect(requests).toBe(0);
  });

  test("shows a loading state, blocks duplicates, and confirms only after delivery", async ({ page }) => {
    let requests = 0;
    let body: Record<string, unknown> = {};
    await page.route("**/api/contact", async (route) => {
      requests++;
      body = route.request().postDataJSON();
      await new Promise((r) => setTimeout(r, 800));
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    await openForm(page);
    await fill(page, { name: "Test Visitor", email: "visitor@example.com", message: "Hello Prashanth, this is a test message." });

    const submit = form(page).getByRole("button", { name: "Send Message" });
    await submit.click();
    const sending = form(page).getByRole("button", { name: /Sending/ });
    await expect(sending).toBeDisabled();
    await page.locator("#contact form").evaluate((f: HTMLFormElement) => f.requestSubmit());
    await expect(page.getByText("Thanks — your message is on its way.")).toBeVisible();
    await expect(page.getByText("visitor@example.com")).toBeVisible();
    expect(requests).toBe(1);
    expect(body).toMatchObject({ name: "Test Visitor", email: "visitor@example.com", message: "Hello Prashanth, this is a test message.", website: "" });
  });

  test("shows the server's error and keeps the message when delivery fails", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 502, json: { error: "Your message couldn't be delivered right now." } }),
    );
    await openForm(page);
    await fill(page, { name: "Test Visitor", email: "visitor@example.com", message: "Hello Prashanth, this is a test message." });
    await form(page).getByRole("button", { name: "Send Message" }).click();
    await expect(form(page).getByRole("alert")).toHaveText("Your message couldn't be delivered right now.");
    await expect(page.getByText("Thanks — your message is on its way.")).toHaveCount(0);
    await expect(page.getByLabel("Message", { exact: true })).toHaveValue("Hello Prashanth, this is a test message.");
    await expect(form(page).getByRole("button", { name: "Send Message" })).toBeEnabled();
  });
});

test("contact API rejects invalid and spam submissions before sending", async ({ request }) => {
  const valid = { name: "Test Visitor", email: "visitor@example.com", message: "Hello Prashanth, this is a test.", website: "", elapsed: 5000 };

  const bad = await request.post("/api/contact", { data: { ...valid, email: "nope", message: "" } });
  expect(bad.status()).toBe(422);
  expect((await bad.json()).fields).toMatchObject({ email: expect.any(String), message: expect.any(String) });

  const honeypot = await request.post("/api/contact", { data: { ...valid, website: "https://spam.example" } });
  expect(honeypot.status()).toBe(400);

  const tooFast = await request.post("/api/contact", { data: { ...valid, elapsed: 200 } });
  expect(tooFast.status()).toBe(400);

  const malformed = await request.post("/api/contact", { data: "not json", headers: { "Content-Type": "application/json" } });
  expect(malformed.status()).toBe(400);
});
