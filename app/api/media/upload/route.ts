import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/session";
import { can } from "@/lib/permissions";
import { DomainError } from "@/src/domain/shared/errors";
import { mediaService } from "@/src/domain/media/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!can(user.role, "media:write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  try {
    const media = await mediaService.createFromUpload({
      actor: { userId: user.id },
      file,
      altAr: String(formData.get("altAr") ?? "") || null,
      altEn: String(formData.get("altEn") ?? "") || null,
    });

    return NextResponse.json({
      id: media.id,
      url: media.url,
      fileName: media.fileName,
      mimeType: media.mimeType,
      size: media.size,
    });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (process.env.NODE_ENV === "development") {
      console.error("[media/upload]", error);
    }
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
