import type {
  NotificationProvider,
  QuoteRequestNotificationPayload,
} from "@/src/domain/notification/types";

/**
 * No-op provider — persists nothing and sends no email.
 * Swap for SMTP / Resend / SendGrid / SES when ready.
 */
export class NoopNotificationProvider implements NotificationProvider {
  readonly name = "noop";

  async notifyQuoteRequestReceived(
    payload: QuoteRequestNotificationPayload,
  ): Promise<void> {
    void payload;
    // Intentionally empty — architecture placeholder.
  }
}
