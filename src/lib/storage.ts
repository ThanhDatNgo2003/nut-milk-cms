import { writeFile, unlink, mkdir, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "5242880", 10); // 5MB

const ALLOWED_TYPES_STR =
  process.env.ALLOWED_TYPES || "image/jpeg,image/png,image/webp,image/gif";

const ALLOWED_TYPES = ALLOWED_TYPES_STR.split(",").map((t) => t.trim());

/* ------------------------------------------------------------------ */
/*  Magic byte signatures for file type validation                     */
/* ------------------------------------------------------------------ */

const MAGIC_BYTES: Record<string, { offset: number; bytes: number[] }[]> = {
  "image/jpeg": [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }],
  "image/png": [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47] }],
  "image/webp": [
    // RIFF....WEBP
    { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] },
    { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] },
  ],
  "image/gif": [
    // GIF87a or GIF89a
    { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] },
  ],
};

/* ------------------------------------------------------------------ */
/*  Rate limiting (in-memory, per user)                                */
/* ------------------------------------------------------------------ */

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max uploads per window

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Validate file content against magic byte signatures */
export function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return false;

  for (const sig of signatures) {
    if (buffer.length < sig.offset + sig.bytes.length) return false;
    const matches = sig.bytes.every(
      (byte, i) => buffer[sig.offset + i] === byte
    );
    if (!matches) return false;
  }
  return true;
}

/** Sanitise a filename: remove special chars, prevent directory traversal */
function sanitizeFilename(name: string): string {
  return name
    .replace(/\.\./g, "") // prevent traversal
    .replace(/[/\\]/g, "") // remove path separators
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

/** Map mime type to extension */
function extFromType(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  return map[mimeType] || ".jpg";
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export interface SaveFileResult {
  filename: string;
  url: string;
  size: number;
}

/**
 * Save an uploaded File to the local uploads directory.
 *
 * - Validates mime type (declared + magic bytes)
 * - Validates file size
 * - Generates a unique, sanitised filename
 */
export async function saveFile(file: File): Promise<SaveFileResult> {
  // --- type check ---
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new StorageError(
      `Invalid file type "${file.type}". Allowed: ${ALLOWED_TYPES.join(", ")}`,
      400
    );
  }

  // --- size check ---
  if (file.size > MAX_FILE_SIZE) {
    throw new StorageError(
      `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`,
      413
    );
  }

  // --- read buffer ---
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // --- magic byte check ---
  if (!validateMagicBytes(buffer, file.type)) {
    throw new StorageError(
      "File content does not match declared type. Possible spoofed file.",
      400
    );
  }

  // --- ensure directory ---
  await mkdir(UPLOAD_DIR, { recursive: true });

  // --- generate unique filename ---
  const timestamp = Date.now();
  const hash = crypto.randomBytes(6).toString("hex");
  const ext = extFromType(file.type);
  const safeName = sanitizeFilename(
    path.basename(file.name, path.extname(file.name))
  );
  const filename = safeName
    ? `${timestamp}-${hash}-${safeName}${ext}`
    : `${timestamp}-${hash}${ext}`;

  // --- write ---
  const filepath = path.join(UPLOAD_DIR, filename);
  await writeFile(filepath, buffer);

  return {
    filename,
    url: getFileUrl(filename),
    size: file.size,
  };
}

/**
 * Delete a file from the uploads directory.
 *
 * Silently succeeds if the file doesn't exist.
 */
export async function deleteFile(filename: string): Promise<void> {
  // Prevent directory traversal
  const safe = path.basename(filename);
  const filepath = path.join(UPLOAD_DIR, safe);

  try {
    await unlink(filepath);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      throw new StorageError("Failed to delete file", 500);
    }
  }
}

/**
 * Get the public URL for a filename.
 */
export function getFileUrl(filename: string): string {
  const safe = path.basename(filename);
  return `/uploads/${safe}`;
}

/**
 * List all files in the uploads directory.
 */
export async function listFiles(): Promise<string[]> {
  if (!existsSync(UPLOAD_DIR)) return [];
  const entries = await readdir(UPLOAD_DIR);
  return entries.filter((f) => !f.startsWith("."));
}

/* ------------------------------------------------------------------ */
/*  Custom error class                                                 */
/* ------------------------------------------------------------------ */

export class StorageError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "StorageError";
    this.status = status;
  }
}

export { UPLOAD_DIR, MAX_FILE_SIZE, ALLOWED_TYPES };
