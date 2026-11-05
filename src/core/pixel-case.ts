import { encode, makeImage } from "./steganography";

export const CASE_SIZE = 192;
export const caseImages = ["Kota Terhubung", "Gelombang Digital", "Mosaik Lab"];

export function createPixelCase(kind = 0) {
  if (!Number.isInteger(kind) || kind < 0 || kind >= caseImages.length)
    throw new Error("Gambar kasus tidak dikenal.");
  const original = makeImage(kind, CASE_SIZE);
  const code = ["NCC-742", "NCC-318", "NCC-596"][kind];
  const encoded = encode(
    original,
    `Berkas NCC ditemukan! Kode akses: ${code}. Sampai jumpa di laboratorium digital.`,
  );
  return { original, encoded };
}

export function findChangedPixel(
  original: Uint8ClampedArray,
  encoded: Uint8ClampedArray,
) {
  const index = encoded.findIndex((v, i) => i % 4 !== 3 && v !== original[i]);
  if (index === -1)
    throw new Error("Tidak ditemukan perubahan pada kanal RGB.");
  const pixel = Math.floor(index / 4);
  return { x: pixel % CASE_SIZE, y: Math.floor(pixel / CASE_SIZE) };
}

// Kode pembuka berasal dari pesan yang telah dibaca dari piksel.
export function matchesAccessCode(decodedMessage: string, answer: string) {
  const code = /Kode akses:\s*(NCC-\d{3})\b/i.exec(decodedMessage)?.[1];
  return !!code && answer.trim().toUpperCase() === code.toUpperCase();
}
