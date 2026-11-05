import { test, expect } from "@playwright/test";
import sharp from "sharp";
import { decode } from "../src/core/steganography";

test("peta, piksel UTF-8, lencana, dan reset pengunjung", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Bongkar Rahasia/ }),
  ).toBeVisible();
  await page.screenshot({
    path: `test-results/home-${info.project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Mulai Eksplorasi", exact: true })
    .click();
  await expect(page.locator(".mission-station")).toHaveCount(3);
  await page.locator(".mission-station").first().click();
  await page
    .getByLabel("Apa yang ingin kamu sembunyikan?")
    .fill("Halo, éksplorasi NCC!");
  await page
    .getByRole("button", { name: "Sisipkan Pesan", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Lihat Piksel yang Berubah", exact: true })
    .click();
  await page.getByRole("button", { name: "Ungkap Pesan", exact: true }).click();
  await expect(page.locator(".decoded-message")).toContainText(
    "Halo, éksplorasi NCC!",
  );
  await expect(
    page.getByRole("heading", { name: "Pixel Detective", exact: true }),
  ).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Unduh PNG", exact: true }).click(),
  ]);
  const pngPath = await download.path();
  const pixels = await sharp(pngPath!).ensureAlpha().raw().toBuffer();
  expect(decode(new Uint8ClampedArray(pixels))).toBe("Halo, éksplorasi NCC!");
  await page.getByRole("link", { name: "Lihat Lencana", exact: true }).click();
  await expect(page.locator(".badge-card.earned")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".badge-card.earned")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Pengunjung Baru", exact: true })
    .click();
  await page.getByRole("button", { name: "Batal", exact: true }).click();
  await expect(page.locator(".badge-card.earned")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Pengunjung Baru", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Hapus & Mulai Baru", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: /Bongkar Rahasia/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("ncc-digital-detective:v1")),
  ).toBeNull();
  expect(errors).toEqual([]);
});

test("bukti, perbaikan urutan, dan kesimpulan forensik", async ({
  page,
}, info) => {
  await page.goto("/#/misi/jejak");
  for (const id of ["E1", "E2", "E3", "E4"]) {
    const article = page
      .locator(".evidence-file")
      .filter({ has: page.locator(".evidence-number", { hasText: id }) });
    if (
      (await article
        .locator(".evidence-toggle")
        .getAttribute("aria-expanded")) === "false"
    )
      await article.locator(".evidence-toggle").click();
    await article
      .getByRole("button", { name: "Tandai Relevan", exact: true })
      .click();
  }
  await page.getByRole("button", { name: "Naikkan E4", exact: true }).click();
  await page
    .getByRole("button", { name: "Periksa Linimasa", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Periksa waktunya");
  await page.getByRole("button", { name: "Turunkan E4", exact: true }).click();
  await page
    .getByRole("button", { name: "Periksa Linimasa", exact: true })
    .click();
  await page.getByRole("radio", { name: /Pemilik akun pasti/ }).check();
  await page
    .getByRole("button", { name: "Periksa Kesimpulan", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("bukan siapa");
  await page.getByRole("radio", { name: /Berkas berubah melalui/ }).check();
  await page
    .getByRole("button", { name: "Periksa Kesimpulan", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Digital Investigator", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/forensics-${info.project.name}.png`,
    fullPage: true,
  });
});

test("kontrol server dan tantangan berhasil", async ({ page }, info) => {
  await page.clock.install({ time: new Date("2026-11-05T00:00:00Z") });
  await page.goto("/#/misi/server");
  await expect(
    page.getByRole("heading", { name: "Selamatkan Server!", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Jumlah pengguna").fill("70");
  await page
    .getByRole("button", { name: "Menumpuk di Satu Server", exact: true })
    .click();
  await page.waitForTimeout(500);
  await expect(page.locator(".server-metrics").first()).not.toContainText(
    "Semua permintaan tertangani.",
  );
  await page
    .getByRole("button", { name: "Mulai Tantangan", exact: true })
    .click();
  await page.clock.pauseAt(new Date("2026-11-05T00:01:00Z"));
  await page.getByRole("button", { name: "Siap, Mulai!", exact: true }).click();
  await expect(page.locator(".network-panel .status-pill")).toHaveText(
    "30.0 detik",
  );
  await page.clock.runFor(8000);
  await page
    .getByRole("button", { name: "Tambah server", exact: true })
    .click();
  await page.clock.runFor(8000);
  await page
    .getByRole("button", { name: "Tambah server", exact: true })
    .click();
  await page.clock.runFor(8000);
  await page
    .getByRole("button", { name: "Kurangi server", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Kurangi server", exact: true })
    .click();
  await page.clock.runFor(6500);
  await expect(
    page.getByRole("heading", { name: "Cloud Architect", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/server-${info.project.name}.png`,
    fullPage: true,
  });
});

test("fallback storage dan akses keyboard pada petunjuk", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("unavailable");
      },
    });
  });
  await page.goto("/#/misi/piksel");
  await expect(page.getByRole("status").first()).toContainText(
    "Progres hanya tersimpan selama sesi ini.",
  );
  await page.getByRole("button", { name: "Petunjuk", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Petunjuk", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Sisipkan Pesan", exact: true })
    .click();
  await page.getByRole("button", { name: "Ungkap Pesan", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Pixel Detective", exact: true }),
  ).toBeVisible();
});

test("lebar layar, reduced motion, dan rute pendukung", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 430, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/misi",
      "/misi/piksel",
      "/misi/jejak",
      "/misi/server",
      "/lencana",
      "/tentang",
    ]) {
      await page.goto(`/#${route}`);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} @ ${width}`,
      ).toBe(true);
    }
  }
  await page.goto("/#/koordinat-tidak-ada");
  await expect(
    page.getByRole("heading", {
      name: "Koordinat tidak ditemukan.",
      exact: true,
    }),
  ).toBeVisible();
});

test("petunjuk menjeda waktu serta biaya dan memerlukan lanjutkan", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-05T00:00:00Z") });
  await page.goto("/#/misi/server");
  await page
    .getByRole("button", { name: "Mulai Tantangan", exact: true })
    .click();
  await page.clock.pauseAt(new Date("2026-11-05T00:01:00Z"));
  await page.getByRole("button", { name: "Siap, Mulai!", exact: true }).click();
  await page.clock.runFor(1000);
  await expect(page.locator(".network-panel .status-pill")).toHaveText(
    "29.0 detik",
  );
  const budget = page.locator(".server-metrics>div").nth(2).locator("b");
  const before = await budget.textContent();
  await page.getByRole("button", { name: "Petunjuk", exact: true }).click();
  await page.clock.runFor(5000);
  await expect(budget).toHaveText(before!);
  await page.getByRole("button", { name: "Mengerti", exact: true }).click();
  await expect(page.locator(".pause-overlay")).toBeVisible();
  await page.clock.runFor(1000);
  await expect(budget).toHaveText(before!);
  await page
    .locator(".pause-overlay")
    .getByRole("button", { name: "Lanjutkan", exact: true })
    .click();
  await page.clock.runFor(1000);
  await expect(page.locator(".network-panel .status-pill")).toHaveText(
    "28.0 detik",
  );
});
