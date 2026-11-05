import { expect, it } from "vitest";
import sharp from "sharp";
import { encodePng } from "./png";
import { encode, decode, makeImage } from "./steganography";

it("PNG mempertahankan seluruh byte RGBA dan pesan melintasi beberapa blok DEFLATE", async () => {
  const source = encode(makeImage(0), "Pesan éksperimen Brave — tetap utuh!");
  const png = encodePng(source, 192, 192);
  const { data, info } = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  expect(info.width).toBe(192);
  expect(info.height).toBe(192);
  const restored = new Uint8ClampedArray(data);
  expect(restored).toEqual(source);
  expect(decode(restored)).toBe("Pesan éksperimen Brave — tetap utuh!");
});

it("menolak ukuran PNG yang tidak sesuai buffer", () => {
  expect(() => encodePng(new Uint8ClampedArray(4), 0, 1)).toThrow();
  expect(() => encodePng(new Uint8ClampedArray(4), 2, 1)).toThrow();
});
