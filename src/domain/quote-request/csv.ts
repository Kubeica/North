import type { QuoteRequest } from "@prisma/client";

/** Escape a CSV cell (RFC 4180-style). */
function csvCell(value: string | null | undefined): string {
  const raw = value ?? "";
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

/**
 * CSV export architecture for quote requests.
 * Produces a downloadable string; callers decide transport (download / email).
 */
export function quoteRequestsToCsv(rows: QuoteRequest[]): string {
  const header = [
    "id",
    "company",
    "name",
    "email",
    "phone",
    "projectType",
    "budget",
    "location",
    "timeline",
    "message",
    "attachmentUrl",
    "status",
    "notes",
    "createdAt",
    "updatedAt",
  ];

  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.id,
        row.company,
        row.name,
        row.email,
        row.phone,
        row.projectType,
        row.budget,
        row.location,
        row.timeline,
        row.message,
        row.attachmentUrl,
        row.status,
        row.notes,
        row.createdAt.toISOString(),
        row.updatedAt.toISOString(),
      ]
        .map((cell) => csvCell(cell == null ? "" : String(cell)))
        .join(","),
    ),
  ];

  return lines.join("\n");
}
