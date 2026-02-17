import { validateMagicBytes, checkRateLimit } from "@/lib/storage";

describe("validateMagicBytes", () => {
  it("validates JPEG magic bytes", () => {
    const buffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]);
    expect(validateMagicBytes(buffer, "image/jpeg")).toBe(true);
  });

  it("validates PNG magic bytes", () => {
    const buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
    expect(validateMagicBytes(buffer, "image/png")).toBe(true);
  });

  it("validates GIF magic bytes", () => {
    const buffer = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
    expect(validateMagicBytes(buffer, "image/gif")).toBe(true);
  });

  it("validates WebP magic bytes", () => {
    // RIFF....WEBP
    const buffer = Buffer.alloc(12);
    buffer.writeUInt8(0x52, 0); // R
    buffer.writeUInt8(0x49, 1); // I
    buffer.writeUInt8(0x46, 2); // F
    buffer.writeUInt8(0x46, 3); // F
    buffer.writeUInt32LE(0, 4); // file size (placeholder)
    buffer.writeUInt8(0x57, 8); // W
    buffer.writeUInt8(0x45, 9); // E
    buffer.writeUInt8(0x42, 10); // B
    buffer.writeUInt8(0x50, 11); // P
    expect(validateMagicBytes(buffer, "image/webp")).toBe(true);
  });

  it("rejects wrong magic bytes for JPEG", () => {
    const buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47]); // PNG header
    expect(validateMagicBytes(buffer, "image/jpeg")).toBe(false);
  });

  it("rejects wrong magic bytes for PNG", () => {
    const buffer = Buffer.from([0xff, 0xd8, 0xff]); // JPEG header
    expect(validateMagicBytes(buffer, "image/png")).toBe(false);
  });

  it("rejects unsupported mime type", () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00]);
    expect(validateMagicBytes(buffer, "application/pdf")).toBe(false);
  });

  it("rejects buffer too short for type", () => {
    const buffer = Buffer.from([0xff]);
    expect(validateMagicBytes(buffer, "image/jpeg")).toBe(false);
  });

  it("rejects empty buffer", () => {
    const buffer = Buffer.alloc(0);
    expect(validateMagicBytes(buffer, "image/jpeg")).toBe(false);
  });
});

describe("checkRateLimit", () => {
  it("allows first request", () => {
    const userId = `test-user-${Date.now()}-1`;
    expect(checkRateLimit(userId)).toBe(true);
  });

  it("allows up to 10 requests in a minute", () => {
    const userId = `test-user-${Date.now()}-2`;
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit(userId)).toBe(true);
    }
  });

  it("blocks 11th request in a minute", () => {
    const userId = `test-user-${Date.now()}-3`;
    for (let i = 0; i < 10; i++) {
      checkRateLimit(userId);
    }
    expect(checkRateLimit(userId)).toBe(false);
  });

  it("treats different users independently", () => {
    const user1 = `test-user-${Date.now()}-4a`;
    const user2 = `test-user-${Date.now()}-4b`;

    // Exhaust user1's limit
    for (let i = 0; i < 10; i++) {
      checkRateLimit(user1);
    }

    // user2 should still be allowed
    expect(checkRateLimit(user2)).toBe(true);
    // user1 should be blocked
    expect(checkRateLimit(user1)).toBe(false);
  });
});
