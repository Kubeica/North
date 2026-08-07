/**
 * Future-ready notification contracts.
 * Providers: SMTP | Resend | SendGrid | SES (not wired yet).
 */

export type QuoteRequestNotificationPayload = {
  id: string;
  company: string;
  name: string;
  email: string;
  phone?: string | null;
  projectType: string;
  budget?: string | null;
  location?: string | null;
  timeline?: string | null;
  message: string;
  createdAt: Date;
};

export interface NotificationProvider {
  readonly name: string;
  notifyQuoteRequestReceived(
    payload: QuoteRequestNotificationPayload,
  ): Promise<void>;
}
