const HEADER = new Uint8Array([78, 67, 67, 49]);
export const byteLength = (text: string) =>
  new TextEncoder().encode(text).length;
export const capacity = (rgba: Uint8ClampedArray) =>
  Math.max(0, Math.floor(((rgba.length / 4) * 3) / 8) - 8);

export function encode(
  rgba: Uint8ClampedArray,
  text: string,
): Uint8ClampedArray {
  const payload = new TextEncoder().encode(text);
  if (!text.trim()) throw new Error("Tulis pesan terlebih dahulu.");
  if (payload.length > capacity(rgba))
    throw new Error("Pesan melebihi kapasitas gambar.");
  const data = new Uint8Array(payload.length + 8);
  data.set(HEADER);
  new DataView(data.buffer).setUint32(4, payload.length, false);
  data.set(payload, 8);
  const output = new Uint8ClampedArray(rgba);
  for (let bit = 0; bit < data.length * 8; bit++) {
    const index = Math.floor(bit / 3) * 4 + (bit % 3);
    output[index] =
      (output[index] & 254) | ((data[bit >> 3] >> (7 - (bit % 8))) & 1);
  }
  return output;
}

export function decode(rgba: Uint8ClampedArray): string {
  const available = Math.floor(((rgba.length / 4) * 3) / 8);
  if (available < 8) throw new Error("Gambar terlalu kecil untuk format NCC.");
  const read = (start: number, count: number) => {
    const bytes = new Uint8Array(count);
    for (let b = 0; b < count * 8; b++) {
      const bit = start * 8 + b;
      const index = Math.floor(bit / 3) * 4 + (bit % 3);
      bytes[b >> 3] |= (rgba[index] & 1) << (7 - (b % 8));
    }
    return bytes;
  };
  const header = read(0, 8);
  if (!HEADER.every((v, i) => header[i] === v))
    throw new Error("Penanda pesan NCC tidak ditemukan.");
  const length = new DataView(header.buffer).getUint32(4, false);
  if (!length || length > available - 8)
    throw new Error("Panjang pesan tidak valid.");
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(read(8, length));
  } catch {
    throw new Error("Data pesan bukan UTF-8 yang valid.");
  }
}

export function makeImage(kind: number, size = 192): Uint8ClampedArray {
  const colors = [
    [8, 6, 19],
    [14, 29, 90],
    [41, 58, 129],
    [72, 118, 184],
    [169, 156, 213],
    [229, 214, 247],
    [255, 59, 134],
  ];
  const pixels = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      let c = 0;
      if (kind === 0) {
        c = 1;
        const buildings = [58, 86, 44, 106, 72, 96, 50, 118];
        const block = Math.floor(x / 24);
        if (y > size - buildings[block % 8]) c = 2;
        if (
          y > size - buildings[block % 8] + 8 &&
          x % 24 > 6 &&
          x % 24 < 12 &&
          y % 14 < 5
        )
          c = 4;
        if ((x - 146) ** 2 + (y - 37) ** 2 < 17 ** 2) c = 6;
        if (y > size - 12) c = 3;
      } else if (kind === 1) {
        const wave = Math.sin(x / 18) * 20;
        c = y > size / 2 + wave ? 2 : 1;
        if (Math.abs(y - size / 2 - wave) < 3) c = 6;
        if (Math.abs(y - size / 2 - Math.cos(x / 23) * 35) < 2) c = 4;
        if (x % 24 === 0 || y % 24 === 0) c = 3;
      } else {
        c = ((Math.floor(x / 24) + Math.floor(y / 24)) % 5) + 1;
        if (x % 24 < 2 || y % 24 < 2) c = 0;
        if ((x - 96) ** 2 + (y - 96) ** 2 < 30 ** 2) c = 6;
      }
      const i = (y * size + x) * 4;
      pixels.set([...colors[c], 255], i);
    }
  return pixels;
}
