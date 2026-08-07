/**
 * Quote attachment architecture — no actual storage yet.
 * Future providers: S3 | Cloudinary | Azure Blob (via StorageProvider).
 */

export type QuoteAttachmentInput = {
  fileName: string;
  contentType: string;
  size: number;
  /** Optional binary — ignored by stub. */
  data?: Buffer | Uint8Array;
};

export type QuoteAttachmentResult = {
  /** Public URL when storage is enabled; null while stubbed. */
  attachmentUrl: string | null;
  /** True when upload was deferred / not persisted. */
  deferred: boolean;
  provider: string;
};

export interface QuoteAttachmentProvider {
  readonly name: string;
  /**
   * Accept attachment metadata and optionally persist bytes.
   * Stub returns deferred:true without writing files.
   */
  store(input: QuoteAttachmentInput): Promise<QuoteAttachmentResult>;
}

/** Stub provider — does not persist files. Ready to swap for cloud storage. */
export class StubQuoteAttachmentProvider implements QuoteAttachmentProvider {
  readonly name = "stub";

  async store(input: QuoteAttachmentInput): Promise<QuoteAttachmentResult> {
    void input;
    return {
      attachmentUrl: null,
      deferred: true,
      provider: this.name,
    };
  }
}

let cached: QuoteAttachmentProvider | undefined;

export function getQuoteAttachmentProvider(): QuoteAttachmentProvider {
  if (cached) return cached;

  const name = (
    process.env.QUOTE_ATTACHMENT_PROVIDER ?? "stub"
  ).toLowerCase();

  switch (name) {
    case "stub":
      cached = new StubQuoteAttachmentProvider();
      break;
    // Future: case "s3": case "cloudinary": case "azure":
    default:
      cached = new StubQuoteAttachmentProvider();
  }

  return cached;
}
