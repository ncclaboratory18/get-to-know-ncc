import { test, expect } from "@playwright/test";
import { decode } from "../src/core/steganography";
import sharp from "sharp";

test("misi dan eksperimen tetap bekerja saat pembacaan Canvas diberi noise privasi", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const read = CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = function (
      sx,
      sy,
      sw,
      sh,
      settings,
    ) {
      const image = read.call(this, sx, sy, sw, sh, settings);
      for (let i = 0; i < image.data.length; i++)
        if (i % 4 !== 3) image.data[i] ^= 1;
      return image;
    };
    const exportBlob = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (callback, type, quality) {
      const copy = document.createElement("canvas");
      copy.width = this.width;
      copy.height = this.height;
      const ctx = copy.getContext("2d")!;
      ctx.drawImage(this, 0, 0);
      ctx.putImageData(ctx.getImageData(0, 0, copy.width, copy.height), 0, 0);
      exportBlob.call(copy, callback, type, quality);
    };
  });
  await page.goto("/#/misi/piksel");
  await page
    .getByRole("button", { name: "Cari Petunjuk Piksel", exact: true })
    .click();
  await page.getByRole("button", { name: "Paling kanan", exact: true }).click();
  await page
    .getByRole("button", { name: "Baca Pesan Tersembunyi", exact: true })
    .click();
  await expect(page.locator(".case-secret")).toContainText("Kode akses:");
  const code = /NCC-\d{3}/.exec(
    await page.locator(".case-secret").innerText(),
  )![0];
  await page.getByLabel("Kode akses berkas").fill(code);
  await page.getByRole("button", { name: "Buka Berkas", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Pixel Detective", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Sembunyikan Pesanmu Sendiri", exact: true })
    .click();
  await page
    .getByLabel("Apa yang ingin kamu sembunyikan?")
    .fill("Pesan éksperimen Brave — tetap utuh!");
  await page
    .getByRole("button", { name: "Sisipkan Pesan", exact: true })
    .click();
  await page.getByRole("button", { name: "Ungkap Pesan", exact: true }).click();
  await expect(page.locator(".pixel-workshop .decoded-message")).toContainText(
    "Pesan éksperimen Brave — tetap utuh!",
  );
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Unduh PNG", exact: true }).click(),
  ]);
  const path = await download.path();
  const rgba = await sharp(path!).ensureAlpha().raw().toBuffer();
  expect(decode(new Uint8ClampedArray(rgba))).toBe(
    "Pesan éksperimen Brave — tetap utuh!",
  );
});

test("pesan tetap terbaca saat berganti tampilan, mengulang, dan memilih semua gambar", async ({
  page,
}) => {
  await page.goto("/#/misi/piksel");
  for (const image of ["Kota Terhubung", "Gelombang Digital", "Mosaik Lab"]) {
    await page.getByRole("button", { name: image, exact: true }).click();
    for (let attempt = 0; attempt < 2; attempt++) {
      await page
        .getByRole("button", { name: "Cari Petunjuk Piksel", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Paling kanan", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Gambar Asli", exact: true })
        .click();
      const data = await page
        .locator(".case-image-stage canvas")
        .last()
        .evaluate((el) =>
          Array.from(
            (el as HTMLCanvasElement)
              .getContext("2d")!
              .getImageData(0, 0, 192, 192).data,
          ),
        );
      // Diagnostik: Brave dapat menambahkan noise pada readback ini.
      // Keberhasilan permainan harus bergantung pada piksel sumber, bukan
      // hasil API Canvas yang diubah oleh proteksi privasi.
      let canvasReadback: string;
      try {
        canvasReadback = decode(new Uint8ClampedArray(data));
      } catch (error) {
        canvasReadback = (error as Error).message;
      }
      await test.info().attach(`canvas-readback-${image}-${attempt}.json`, {
        body: JSON.stringify({ image, attempt, canvasReadback }),
        contentType: "application/json",
      });
      await page
        .getByRole("button", { name: "Baca Pesan Tersembunyi", exact: true })
        .click();
      await expect(page.locator(".case-secret")).toContainText("Kode akses:");
      await expect(
        page.locator(".pixel-case-board .feedback"),
      ).not.toContainText("Penanda pesan NCC tidak ditemukan");
      const code = /NCC-\d{3}/.exec(
        await page.locator(".case-secret").innerText(),
      )![0];
      await page.getByLabel("Kode akses berkas").fill(code);
      await page
        .getByRole("button", { name: "Buka Berkas", exact: true })
        .click();
      await expect(
        page.getByRole("heading", { name: "Pixel Detective", exact: true }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Mulai Ulang", exact: true })
        .click();
    }
  }
});

test("pembaca pulih setelah bitmap Canvas tampilan dibersihkan browser", async ({
  page,
}) => {
  await page.goto("/#/misi/piksel");
  await page
    .getByRole("button", { name: "Cari Petunjuk Piksel", exact: true })
    .click();
  await page.getByRole("button", { name: "Paling kanan", exact: true }).click();
  // Menyetel ulang ukuran bitmap meniru kehilangan backing store Canvas.
  await page
    .locator(".case-image-stage canvas")
    .last()
    .evaluate((el) => {
      const canvas = el as HTMLCanvasElement;
      canvas.width = canvas.width;
    });
  await page
    .getByRole("button", { name: "Baca Pesan Tersembunyi", exact: true })
    .click();
  await expect(page.locator(".case-secret")).toContainText("Kode akses:");
});
