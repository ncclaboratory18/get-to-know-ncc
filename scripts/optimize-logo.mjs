import sharp from "sharp";
import { mkdir } from "node:fs/promises";
await mkdir("src/assets", { recursive: true });
await sharp("ncc.png")
  .resize({ width: 640, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile("src/assets/ncc-display.png");
console.log(
  "Salinan logo untuk tampilan tersimpan; sumber ncc.png tetap utuh.",
);
