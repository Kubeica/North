import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { resolveLocalUploadAbsolutePath } from "@/lib/storage/local";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
};

function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

/**
 * Serve runtime local uploads at `/uploads/*`.
 *
 * Next.js production static serving only indexes `public/` at build time, so
 * files written after deploy (Docker volume) are not served as static assets
 * and would otherwise fall through to `[locale]` → not-found. Storage still
 * writes to `public/uploads`; this route only reads those files.
 */
async function serveUpload(_request: Request, context: RouteContext) {
  const { path: segments } = await context.params;
  if (!segments?.length) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const key = segments.map(decodeURIComponent).join("/");

  let absolutePath: string;
  try {
    absolutePath = resolveLocalUploadAbsolutePath(key);
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const body = await readFile(absolutePath);
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentTypeFor(absolutePath),
        "Content-Length": String(fileStat.size),
        // UUID filenames from local storage are immutable once written.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}

export async function GET(request: Request, context: RouteContext) {
  return serveUpload(request, context);
}

export async function HEAD(request: Request, context: RouteContext) {
  const response = await serveUpload(request, context);
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  });
}
