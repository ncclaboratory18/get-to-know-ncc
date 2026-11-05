import { test, expect } from "@playwright/test";

test("ilustrasi bidang dan karier mengubah konten lewat klik dan keyboard", async ({
  page,
}, info) => {
  await page.goto("/");
  const section = page.locator(".ncc-exploration");
  await expect(
    section.getByRole("heading", { name: "Belajar apa di NCC?", exact: true }),
  ).toBeVisible();
  const fields = section.getByRole("group", {
    name: "Peta interaktif bidang belajar NCC",
    exact: true,
  });
  for (const [name, text] of [
    ["Jaringan", "komputer dan HP"],
    ["Keamanan", "melindungi data"],
    ["Cloud", "server dan aplikasi"],
    ["Forensik", "jejak kejahatan siber"],
  ]) {
    await fields
      .getByRole("button", { name: `${name}: jelajahi bidang`, exact: true })
      .click();
    await expect(section.locator(".learning-copy h3")).toHaveText(name);
    await expect(section.locator(".learning-copy")).toContainText(text);
    await expect(
      fields.getByRole("button", {
        name: `${name}: jelajahi bidang`,
        exact: true,
      }),
    ).toHaveAttribute("aria-pressed", "true");
  }
  const network = fields.getByRole("button", {
    name: "Jaringan: jelajahi bidang",
    exact: true,
  });
  await network.focus();
  await page.keyboard.press("Enter");
  await expect(section.locator(".learning-copy h3")).toHaveText("Jaringan");
  await section
    .getByRole("group", {
      name: "Konsol interaktif prospek karier NCC",
      exact: true,
    })
    .getByRole("button", { name: "Cloud Engineer: lihat prospek", exact: true })
    .click();
  await expect(section.locator(".career-visual h3")).toHaveText(
    "Cloud Engineer",
  );
  await expect(section.locator(".career-row.selected")).toContainText(
    "mengoptimalkan biaya",
  );
  await section
    .locator(".career-list")
    .getByRole("button", { name: "02 Site Reliability Engineer", exact: true })
    .click();
  await expect(section.locator(".career-row.selected")).toContainText(
    "ketersediaan layanan",
  );
  await section
    .locator(".career-list")
    .getByRole("button", { name: "03 Security Engineer", exact: true })
    .click();
  await expect(section.locator(".career-visual h3")).toHaveText(
    "Security Engineer",
  );
  await expect(section.locator(".career-row.selected")).toContainText(
    "penetration testing",
  );
  const career = section.getByRole("button", {
    name: "Network Administrator: lihat prospek",
    exact: true,
  });
  await career.focus();
  await page.keyboard.press("Space");
  await expect(section.locator(".career-visual h3")).toHaveText(
    "Network Administrator",
  );
  await section.screenshot({
    path: `test-results/ncc-exploration-${info.project.name}.png`,
  });
});

test("section Safari Lab responsif dan tetap interaktif saat reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/tentang");
  const section = page.locator(".ncc-exploration");
  await expect(
    section.getByRole("heading", { name: "Belajar apa di NCC?", exact: true }),
  ).toBeVisible();
  for (const width of [360, 430, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const hotspot = section.getByRole("button", {
      name: "Cloud Engineer: lihat prospek",
      exact: true,
    });
    const bounds = await hotspot.boundingBox();
    expect(bounds!.width).toBeGreaterThanOrEqual(44);
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  }
  await section
    .getByRole("button", { name: "Keamanan: jelajahi bidang", exact: true })
    .click();
  await expect(section.locator(".learning-copy h3")).toHaveText("Keamanan");
  await expect(section.locator("animateMotion")).toHaveCount(0);
});
