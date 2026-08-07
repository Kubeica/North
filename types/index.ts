import type { Role } from "@/lib/permissions";
import type { Locale } from "@/lib/i18n/config";

export type { Locale } from "@/lib/i18n/config";
export type { Role, Permission } from "@/lib/permissions";

/** Authenticated CMS user carried on the session. */
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AppSession = {
  user: SessionUser;
  expires: string;
};

export type LocalizedString = {
  ar: string;
  en: string;
};

export type Direction = "rtl" | "ltr";

export type ProjectStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ON_HOLD";

export type MessageStatus = "UNREAD" | "READ" | "ARCHIVED";

export type QuoteRequestStatus =
  | "NEW"
  | "IN_REVIEW"
  | "CONTACTED"
  | "WON"
  | "LOST"
  | "ARCHIVED";

export type StorageProviderName = "local" | "s3" | "cloudinary" | "azure";

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type ApiErrorBody = {
  error: string;
  details?: unknown;
};

export type WithLocale = {
  locale: Locale;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR";
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactActionState = {
  ok: boolean;
  error?: "validation" | "rateLimited" | "server";
  fieldErrors?: Partial<
    Record<"name" | "email" | "phone" | "company" | "subject" | "message", string>
  >;
};

export type QuoteRequestActionState = {
  ok: boolean;
  error?: "validation" | "rateLimited" | "spam" | "server";
  fieldErrors?: Partial<
    Record<
      | "company"
      | "name"
      | "email"
      | "phone"
      | "projectType"
      | "budget"
      | "location"
      | "timeline"
      | "message"
      | "attachment",
      string
    >
  >;
};
