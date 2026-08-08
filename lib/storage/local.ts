import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  StorageProvider,
  UploadInput,
  UploadResult,
} from "@/lib/storage/types";

const UPLOADS_DIR = "uploads";
const PUBLIC_ROOT = path.join(process.cwd(), "public", UPLOADS_DIR);

function sanitizeSegment(segment: string): string {
  return segment.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-{2,}/g, "-");
}

function extensionFromFileName(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  if (!ext || ext.length > 12) return "";
  return ext;
}

function resolveKeyPath(key: string): string {
  const normalized = key.replace(/^\/+/, "").replace(/\\/g, "/");
  if (
    !normalized ||
    normalized.includes("..") ||
    path.isAbsolute(normalized)
  ) {
    throw new Error("Invalid storage key");
  }

  const absolute = path.resolve(PUBLIC_ROOT, normalized);
  if (
    absolute !== PUBLIC_ROOT &&
    !absolute.startsWith(PUBLIC_ROOT + path.sep)
  ) {
    throw new Error("Invalid storage key");
  }

  return absolute;
}

/**
 * Resolve a public `/uploads/...` relative key to an absolute path under
 * `public/uploads`. Used by the runtime uploads route (Next.js production
 * does not serve files written to `public/` after build).
 */
export function resolveLocalUploadAbsolutePath(key: string): string {
  return resolveKeyPath(key);
}

export class LocalStorageProvider implements StorageProvider {
  async upload(input: UploadInput): Promise<UploadResult> {
    const folder = input.folder
      ? input.folder
          .split(/[/\\]+/)
          .filter(Boolean)
          .map(sanitizeSegment)
          .join("/")
      : "";

    // Prefer MIME-derived extension when provided via contentType mapping
    // in the caller; fall back to a sanitized original extension.
    const fromName = extensionFromFileName(input.fileName);
    const ext = fromName || "";
    const fileName = `${randomUUID()}${ext}`;
    const key = folder ? `${folder}/${fileName}` : fileName;
    const absolutePath = resolveKeyPath(key);

    await mkdir(path.dirname(absolutePath), { recursive: true });

    const buffer = Buffer.isBuffer(input.data)
      ? input.data
      : Buffer.from(input.data);

    await writeFile(absolutePath, buffer);

    return {
      url: this.getPublicUrl(key),
      key,
      contentType: input.contentType,
      size: buffer.byteLength,
    };
  }

  async delete(key: string): Promise<void> {
    const absolutePath = resolveKeyPath(key);
    try {
      await unlink(absolutePath);
    } catch (error) {
      const code =
        typeof error === "object" && error && "code" in error
          ? (error as { code?: string }).code
          : undefined;
      if (code !== "ENOENT") throw error;
    }
  }

  getPublicUrl(key: string): string {
    const normalized = key.replace(/^\/+/, "").replace(/\\/g, "/");
    return `/${UPLOADS_DIR}/${normalized}`;
  }
}
