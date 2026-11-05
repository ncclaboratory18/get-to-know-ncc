// PNG RGBA lossless dari buffer sumber; tidak memakai Canvas readback/toBlob.
// IDAT memakai blok DEFLATE tersimpan (tanpa kompresi), cukup ringan untuk
// gambar misi 192 x 192 dan tidak memerlukan library atau layanan eksternal.
const crcTable = Uint32Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit++)
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  return crc >>> 0;
});

function chunk(type: string, data: Uint8Array) {
  const bytes = new Uint8Array(data.length + 12);
  const view = new DataView(bytes.buffer);
  view.setUint32(0, data.length);
  bytes.set(new TextEncoder().encode(type), 4);
  bytes.set(data, 8);
  let crc = 0xffffffff;
  for (const value of bytes.subarray(4, data.length + 8))
    crc = crcTable[(crc ^ value) & 255] ^ (crc >>> 8);
  view.setUint32(bytes.length - 4, (crc ^ 0xffffffff) >>> 0);
  return bytes;
}

function deflateStored(data: Uint8Array) {
  const blocks = Math.ceil(data.length / 65535);
  const bytes = new Uint8Array(data.length + blocks * 5 + 6);
  bytes.set([0x78, 0x01]); // Zlib: DEFLATE, tanpa dictionary.
  let position = 2;
  for (let offset = 0; offset < data.length; offset += 65535) {
    const length = Math.min(65535, data.length - offset);
    bytes[position++] = offset + length === data.length ? 1 : 0;
    bytes[position++] = length & 255;
    bytes[position++] = length >>> 8;
    bytes[position++] = ~length & 255;
    bytes[position++] = (~length >>> 8) & 255;
    bytes.set(data.subarray(offset, offset + length), position);
    position += length;
  }
  let a = 1,
    b = 0;
  for (const value of data) {
    a = (a + value) % 65521;
    b = (b + a) % 65521;
  }
  new DataView(bytes.buffer).setUint32(position, (b * 65536 + a) >>> 0);
  return bytes;
}

export function encodePng(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
): Uint8Array<ArrayBuffer> {
  if (
    !Number.isSafeInteger(width) ||
    !Number.isSafeInteger(height) ||
    width < 1 ||
    height < 1 ||
    rgba.length !== width * height * 4
  )
    throw new Error("Ukuran buffer PNG tidak valid.");
  const header = new Uint8Array(13);
  const view = new DataView(header.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  header[8] = 8;
  header[9] = 6; // 8 bit per kanal, RGBA.
  const stride = width * 4;
  const scanlines = new Uint8Array(height * (stride + 1));
  for (let y = 0; y < height; y++)
    scanlines.set(
      rgba.subarray(y * stride, (y + 1) * stride),
      y * (stride + 1) + 1,
    );
  const chunks = [
    new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateStored(scanlines)),
    chunk("IEND", new Uint8Array()),
  ];
  const png = new Uint8Array(
    chunks.reduce((total, bytes) => total + bytes.length, 0),
  );
  let offset = 0;
  for (const bytes of chunks) {
    png.set(bytes, offset);
    offset += bytes.length;
  }
  return png;
}
