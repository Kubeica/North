import { LocalStorageProvider } from "@/lib/storage/local";
import type { StorageProvider } from "@/lib/storage/types";

export type { StorageProvider, UploadInput, UploadResult } from "@/lib/storage/types";
export { LocalStorageProvider } from "@/lib/storage/local";

let cachedProvider: StorageProvider | undefined;

/**
 * Resolve the active storage provider from STORAGE_PROVIDER (default: local).
 * Future providers: s3 | cloudinary | azure (quote attachments use a separate stub).
 */
export function getStorageProvider(): StorageProvider {
  if (cachedProvider) return cachedProvider;

  const provider = (process.env.STORAGE_PROVIDER ?? "local").toLowerCase();

  switch (provider) {
    case "local":
      cachedProvider = new LocalStorageProvider();
      break;
    // Future: case "s3": case "cloudinary": case "azure":
    default:
      throw new Error(
        `Unsupported STORAGE_PROVIDER "${provider}". Supported: local`,
      );
  }

  return cachedProvider;
}
