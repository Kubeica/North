"use server";

import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/client-ip";
import { contactRateLimitConfig } from "@/lib/security/env-limits";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/lib/validation/contact";
import { contactService } from "@/src/domain/contact/service";
import type { ContactActionState } from "@/types";

export async function submitContactMessage(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    company: String(formData.get("company") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactActionState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors!)) {
        fieldErrors[key as keyof ContactFormInput] = issue.message;
      }
    }
    return { ok: false, error: "validation", fieldErrors };
  }

  try {
    const { max, windowMs } = contactRateLimitConfig();
    const ip = await getClientIp();
    const rate = await checkRateLimit(`contact:${ip}`, max, windowMs);
    if (!rate.success) {
      return { ok: false, error: "rateLimited" };
    }

    await contactService.submitContact(parsed.data);

    return { ok: true };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[contact] submit failed:", error);
    }
    return { ok: false, error: "server" };
  }
}
