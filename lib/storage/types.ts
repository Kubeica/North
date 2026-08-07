export type UploadInput = {
  /** Original file name, used to derive extension when possible. */
  fileName: string;
  /** Binary contents to persist. */
  data: Buffer | Uint8Array;
  /** MIME type of the file. */
  contentType: string;
  /** Optional subdirectory under the provider root (e.g. "projects"). */
  folder?: string;
};

export type UploadResult = {
  /** Publicly accessible URL for the uploaded file. */
  url: string;
  /** Provider-relative key/path used for deletion. */
  key: string;
  /** MIME type that was stored. */
  contentType: string;
  /** Size in bytes. */
  size: number;
};

export interface StorageProvider {
  upload(input: UploadInput): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getPublicUrl(key: string): string;
}
