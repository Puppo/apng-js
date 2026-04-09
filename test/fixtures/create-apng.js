/**
 * Helpers that build minimal binary PNG / APNG ArrayBuffers for testing.
 *
 * The parser (src/library/parser.js) navigates chunks by length field only and
 * never validates CRC32, so we can use zero-filled CRC bytes to keep the helper
 * simple while still producing structurally valid chunk streams.
 */

// ── CRC32 table ────────────────────────────────────────────────────────────────
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function crc32(bytes) {
  let crc = -1;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

// ── Chunk builder ──────────────────────────────────────────────────────────────
function writeU32(buf, value, offset) {
  buf[offset]     = (value >>> 24) & 0xff;
  buf[offset + 1] = (value >>> 16) & 0xff;
  buf[offset + 2] = (value >>>  8) & 0xff;
  buf[offset + 3] =  value         & 0xff;
}

function makeChunk(type, data) {
  const typeBytes = new TextEncoder().encode(type);
  const crcInput  = new Uint8Array(4 + data.length);
  crcInput.set(typeBytes, 0);
  crcInput.set(data, 4);
  const crcVal = crc32(crcInput);

  const out = new Uint8Array(4 + 4 + data.length + 4);
  writeU32(out, data.length, 0);   // length
  out.set(typeBytes, 4);            // type
  out.set(data, 8);                 // data
  writeU32(out, crcVal, 8 + data.length); // CRC
  return out;
}

function concat(...parts) {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out   = new Uint8Array(total);
  let off = 0;
  for (const p of parts) { out.set(p, off); off += p.length; }
  // Return a fresh ArrayBuffer (Buffer.slice / subarray share memory)
  return out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength);
}

const PNG_SIGNATURE = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// ── Exported helpers ───────────────────────────────────────────────────────────

/**
 * Creates a valid (non-animated) 1×1 PNG ArrayBuffer.
 * Useful for verifying that parseAPNG returns the "not animated" error.
 */
export function createMinimalPNG() {
  // IHDR: 1×1, 8-bit RGB
  const ihdr = new Uint8Array(13);
  writeU32(ihdr, 1, 0); writeU32(ihdr, 1, 4);
  ihdr[8] = 8; ihdr[9] = 2; // bit-depth=8, colour-type=RGB

  // IDAT: zlib-stream for a single 1×1 RGB scanline [filter=0, R=0, G=0, B=0]
  const idat = new Uint8Array([
    0x08, 0xd7, 0x63, 0x60, 0x60, 0x60, 0x00, 0x00, 0x00, 0x04, 0x00, 0x01,
  ]);

  return concat(
    PNG_SIGNATURE,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idat),
    makeChunk('IEND', new Uint8Array(0)),
  );
}

/**
 * Creates a minimal valid 1×1 APNG ArrayBuffer with a single frame.
 * Useful for verifying that parseAPNG returns a proper APNG object.
 */
export function createMinimalAPNG() {
  // IHDR: 1×1, 8-bit RGBA
  const ihdr = new Uint8Array(13);
  writeU32(ihdr, 1, 0); writeU32(ihdr, 1, 4);
  ihdr[8] = 8; ihdr[9] = 6; // bit-depth=8, colour-type=RGBA

  // acTL: 1 frame, loop forever
  const actl = new Uint8Array(8);
  writeU32(actl, 1, 0); // num_frames
  writeU32(actl, 0, 4); // num_plays (0 = infinite)

  // fcTL: frame 0 — 1×1 at (0,0), delay 100ms (1/10)
  const fctl = new Uint8Array(26);
  writeU32(fctl,  0,  0); // sequence_number
  writeU32(fctl,  1,  4); // width
  writeU32(fctl,  1,  8); // height
  writeU32(fctl,  0, 12); // x_offset
  writeU32(fctl,  0, 16); // y_offset
  fctl[20] = 0; fctl[21] = 1;  // delay_num = 1
  fctl[22] = 0; fctl[23] = 10; // delay_den = 10  →  delay = 100 ms
  fctl[24] = 0; // dispose_op = NONE
  fctl[25] = 0; // blend_op  = SOURCE

  // IDAT: zlib-stream for a 1×1 RGBA scanline [filter=0, R=0, G=0, B=0, A=255]
  const idat = new Uint8Array([
    0x08, 0xd7, 0x63, 0x60, 0xf8, 0xcf, 0x00, 0x00, 0x00, 0x82, 0x00, 0x01,
  ]);

  return concat(
    PNG_SIGNATURE,
    makeChunk('IHDR', ihdr),
    makeChunk('acTL', actl),
    makeChunk('fcTL', fctl),
    makeChunk('IDAT', idat),
    makeChunk('IEND', new Uint8Array(0)),
  );
}
