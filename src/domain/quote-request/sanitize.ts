/** Strip control characters and normalize whitespace for persisted text. */
export function sanitizeText(value: string, maxLength?: number): string {
  let next = value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (maxLength != null && next.length > maxLength) {
    next = next.slice(0, maxLength);
  }

  return next;
}

export function sanitizeMultiline(value: string, maxLength?: number): string {
  let next = value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();

  if (maxLength != null && next.length > maxLength) {
    next = next.slice(0, maxLength);
  }

  return next;
}
