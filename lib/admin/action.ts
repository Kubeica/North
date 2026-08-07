export type ActionResult<T = undefined> =
  | { ok: true; data: T; message?: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string>;
    };

export function actionOk<T = undefined>(
  data?: T,
  message?: string,
): ActionResult<T> {
  return { ok: true, data: data as T, message };
}

export function actionError(
  error: string,
  fieldErrors?: Record<string, string>,
): ActionResult<never> {
  return { ok: false, error, fieldErrors };
}

export function zodFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in fieldErrors)) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export function parseBoolean(value: FormDataEntryValue | null): boolean {
  if (value == null) return false;
  const v = String(value).toLowerCase();
  return v === "true" || v === "on" || v === "1";
}

export function parseOptionalString(
  value: FormDataEntryValue | null,
): string | undefined {
  if (value == null) return undefined;
  const s = String(value).trim();
  return s.length ? s : undefined;
}
