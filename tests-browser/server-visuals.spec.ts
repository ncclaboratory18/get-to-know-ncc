import { test, expect } from "@playwright/test";

test("overload menandai server yang menerima paket dan pulih setelah antrean habis", async ({
  page,
}, info) => {
  await page.clock.install({ time: new Date("2026-11-05T00:00:00Z") });
  await page.goto("/#/misi/server");
  await expect(page.locator(".network-health")).toContainText(
    "Jaringan stabil",
  );
  await page.clock.pauseAt(new Date("2026-11-05T00:01:00Z"));
  await page.getByLabel("Jumlah pengguna").fill("70");
  await page
    .getByRole("button", { name: "Menumpuk di Satu Server", exact: true })
    .click();
  await page.clock.runFor(1100);
  await expect(page.locator(".network-health")).toContainText(
    "1 server overload",
  );
  await expect(page.locator(".server-load-card").first()).toHaveClass(
    /is-overloaded/,
  );
  await expect(page.locator(".server-load-card").nth(1)).not.toHaveClass(
    /is-overloaded/,
  );
  await expect(page.locator(".server-load-card").nth(1)).toContainText(
    "STABIL",
  );
  await expect(page.locator(".server-canvas")).toHaveAttribute(
    "aria-label",
    /Server 1: OVERLOAD/,
  );
  await expect(page.locator(".packet-legend")).toContainText("Paket berjalan");
  await expect(page.locator(".packet-legend")).toContainText("Paket mengantre");
  await page
    .locator(".network-panel")
    .screenshot({
      path: `test-results/server-overload-${info.project.name}.png`,
    });
  await page.getByLabel("Jumlah pengguna").fill("0");
  await page.clock.runFor(4000);
  await expect(page.locator(".network-health")).toContainText(
    "Jaringan stabil",
  );
  await expect(page.locator(".server-load-card.is-overloaded")).toHaveCount(0);
});

test("indikator overload tetap jelas tanpa animasi dan tidak overflow pada HP", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install({ time: new Date("2026-11-05T00:00:00Z") });
  await page.goto("/#/misi/server");
  await expect(page.getByLabel("Jumlah pengguna")).toBeVisible();
  await page.clock.pauseAt(new Date("2026-11-05T00:01:00Z"));
  await page.getByLabel("Jumlah pengguna").fill("100");
  await page.clock.runFor(1000);
  await expect(page.locator(".network-health")).toContainText(
    "2 server overload",
  );
  await expect(page.locator(".server-load-card.is-overloaded")).toHaveCount(2);
  for (const width of [360, 430, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page
    .locator(".network-panel")
    .screenshot({
      path: `test-results/server-overload-reduced-${info.project.name}.png`,
    });
});
