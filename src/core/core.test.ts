import { describe, expect, it } from "vitest";
import {
  byteLength,
  capacity,
  decode,
  encode,
  makeImage,
} from "./steganography";
import { checkTimeline } from "./forensics";
import {
  initialServer,
  resizeServers,
  serverPresentation,
  stepServer,
} from "./server";
import {
  createPixelCase,
  findChangedPixel,
  matchesAccessCode,
  CASE_SIZE,
} from "./pixel-case";

describe("kasus pesan rahasia", () => {
  it.each([0, 1, 2])(
    "gambar kasus %i menyimpan kode dan petunjuk nyata",
    (kind) => {
      const { original, encoded } = createPixelCase(kind);
      const message = decode(encoded);
      const code = /NCC-\d{3}/.exec(message)![0];
      expect(matchesAccessCode(message, code.toLowerCase())).toBe(true);
      expect(matchesAccessCode(message, "NCC-000")).toBe(false);
      const point = findChangedPixel(original, encoded);
      const index = (point.y * CASE_SIZE + point.x) * 4;
      const changes = [0, 1, 2].filter(
        (c) => original[index + c] !== encoded[index + c],
      );
      expect(changes.length).toBeGreaterThan(0);
      for (const channel of changes)
        expect(original[index + channel] ^ encoded[index + channel]).toBe(1);
    },
  );
  it("tidak menerima kode tanpa pesan valid atau petunjuk tanpa perubahan", () => {
    expect(matchesAccessCode("Tidak ada kode", "NCC-742")).toBe(false);
    expect(() => findChangedPixel(makeImage(0), makeImage(0))).toThrow();
  });
});

describe("steganografi nyata", () => {
  it.each(["Halo NCC!", "Halo, éksplorasi NCC! — aman ✓", "日本語"])(
    "round-trip UTF-8: %s",
    (text) => {
      const image = makeImage(0);
      const original = image.slice();
      const encoded = encode(image, text);
      expect(decode(encoded.slice())).toBe(text);
      expect(image).toEqual(original);
      image.forEach((value, i) =>
        expect(
          i % 4 === 3
            ? encoded[i] === value
            : Math.abs(encoded[i] - value) <= 1,
        ).toBe(true),
      );
    },
  );
  it("menegakkan batas byte dan validasi header/panjang/UTF-8", () => {
    const image = makeImage(2, 16);
    const max = capacity(image);
    expect(decode(encode(image, "a".repeat(max)))).toBe("a".repeat(max));
    expect(() => encode(image, "a".repeat(max + 1))).toThrow();
    expect(() => encode(image, "   ")).toThrow();
    expect(byteLength("é")).toBe(2);
    const encoded = encode(image, "a");
    encoded[0] ^= 1;
    expect(() => decode(encoded)).toThrow();
    const invalidLength = encode(image, "a");
    for (let bit = 32; bit < 64; bit++)
      invalidLength[Math.floor(bit / 3) * 4 + (bit % 3)] |= 1;
    expect(() => decode(invalidLength)).toThrow("Panjang");
    const invalidUtf = encode(image, "a");
    for (let bit = 64; bit < 72; bit++)
      invalidUtf[Math.floor(bit / 3) * 4 + (bit % 3)] |= 1;
    expect(() => decode(invalidUtf)).toThrow("UTF-8");
  });
});
describe("kasus forensik", () => {
  it("menerima tepat empat bukti relevan terurut", () => {
    expect(checkTimeline(["E1", "E2", "E3", "E4"])).toBeNull();
    expect(checkTimeline(["E2", "E1", "E3", "E4"])).toMatch(/waktu/);
    expect(checkTimeline(["E1", "E2", "E3", "E5"])).toMatch(/E5/);
    expect(checkTimeline(["E1", "E2"])).not.toBeNull();
  });
});
describe("simulasi server", () => {
  it("kapasitas penuh belum overload dan server tanpa kiriman tidak diberi alarm", () => {
    const full = stepServer(initialServer(), 0.1, false, 40);
    expect(serverPresentation(full, 0)).toMatchObject({
      overloaded: false,
      label: "SIBUK",
    });
    const single = stepServer(
      { ...initialServer(), distribution: "single" },
      0.1,
      false,
      100,
    );
    expect(serverPresentation(single, 0).overloaded).toBe(true);
    expect(serverPresentation(single, 1)).toMatchObject({
      overloaded: false,
      label: "STABIL",
      incoming: 0,
    });
  });
  it("alarm tetap aktif selama ada antrean dan pulih setelah antrean habis", () => {
    const pending = { ...initialServer(), queues: [2, 0], users: 0 };
    expect(serverPresentation(pending, 0).overloaded).toBe(true);
    const recovered = stepServer(pending, 0.2, false, 0);
    expect(serverPresentation(recovered, 0).overloaded).toBe(false);
  });
  it("mengukur beban dari antrean yang diproses pada langkah itu", () => {
    const cleared = stepServer(
      { ...resizeServers(initialServer(), 1), queues: [1] },
      0.1,
      false,
      0,
    );
    expect(cleared.queues).toEqual([0]);
    expect(cleared.loads).toEqual([0.5]);
    expect(stepServer(initialServer(), 1, false, 30).loads).toEqual([
      0.75, 0.75,
    ]);
  });
  it("mengubah antrean sesuai kapasitas dan distribusi", () => {
    const one = resizeServers(initialServer(), 1);
    expect(stepServer(one, 1, false, 30).queues[0]).toBe(10);
    expect(stepServer(initialServer(), 1, false, 30).queues).toEqual([0, 0]);
    expect(
      stepServer({ ...initialServer(), distribution: "single" }, 1, false, 30)
        .queues,
    ).toEqual([10, 0]);
    expect(
      resizeServers({ ...initialServer(), queues: [5, 15] }, 1).queues,
    ).toEqual([20]);
  });
  it("strategi acuan menang dengan biaya 84", () => {
    let s = initialServer();
    for (let tick = 0; tick < 300; tick++) {
      if (tick === 80) s = resizeServers(s, 3);
      if (tick === 160) s = resizeServers(s, 4);
      if (tick === 240) s = resizeServers(s, 2);
      s = stepServer(s, 0.1, true);
    }
    expect(s.status).toBe("won");
    expect(s.budget).toBeCloseTo(6);
    expect(s.goodTime).toBeCloseTo(30);
    expect(s.queues.every((q) => q === 0)).toBe(true);
  });
  it("empat server kehabisan saldo dan dua server gagal karena antrean", () => {
    let expensive = resizeServers(initialServer(), 4),
      overloaded = initialServer();
    for (let tick = 0; tick < 300; tick++) {
      expensive = stepServer(expensive, 0.1, true);
      overloaded = stepServer(overloaded, 0.1, true);
    }
    expect(expensive.status).toBe("lost");
    expect(expensive.time).toBeCloseTo(22.5);
    expect(expensive.budget).toBeCloseTo(0);
    expect(overloaded.status).toBe("lost");
    expect(overloaded.budget).toBeCloseTo(30);
  });
});
