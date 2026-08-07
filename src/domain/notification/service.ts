import { NoopNotificationProvider } from "@/src/domain/notification/noop-provider";
import type {
  NotificationProvider,
  QuoteRequestNotificationPayload,
} from "@/src/domain/notification/types";

let cachedProvider: NotificationProvider | undefined;

function getNotificationProvider(): NotificationProvider {
  if (cachedProvider) return cachedProvider;

  const name = (process.env.NOTIFICATION_PROVIDER ?? "noop").toLowerCase();

  switch (name) {
    case "noop":
      cachedProvider = new NoopNotificationProvider();
      break;
    // Future: case "resend": case "sendgrid": case "ses": case "smtp":
    default:
      cachedProvider = new NoopNotificationProvider();
  }

  return cachedProvider;
}

export const notificationService = {
  async notifyQuoteRequestReceived(payload: QuoteRequestNotificationPayload) {
    const provider = getNotificationProvider();
    await provider.notifyQuoteRequestReceived(payload);
  },
};
