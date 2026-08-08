import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { GET } from "@/app/uploads/[...path]/route";

const mediaDir = path.join(process.cwd(), "public", "uploads", "media");
const jpgName = "6618e06b-a09b-45b4-bfe1-4be777903dc0.jpg";
const pngName = "566194d0-3a4a-4772-b08a-f9198b792650.png";

describe("GET /uploads/[...path]", () => {
  beforeAll(async () => {
    await mkdir(mediaDir, { recursive: true });
    await writeFile(path.join(mediaDir, jpgName), Buffer.from([0xff, 0xd8, 0xff, 0xd9]));
    await writeFile(
      path.join(mediaDir, pngName),
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
  });

  afterAll(async () => {
    await rm(path.join(mediaDir, jpgName), { force: true });
    await rm(path.join(mediaDir, pngName), { force: true });
  });

  it("serves uploaded jpg/png with 200", async () => {
    const jpg = await GET(new Request("http://localhost/uploads/media/" + jpgName), {
      params: Promise.resolve({ path: ["media", jpgName] }),
    });
    expect(jpg.status).toBe(200);
    expect(jpg.headers.get("Content-Type")).toBe("image/jpeg");

    const png = await GET(new Request("http://localhost/uploads/media/" + pngName), {
      params: Promise.resolve({ path: ["media", pngName] }),
    });
    expect(png.status).toBe(200);
    expect(png.headers.get("Content-Type")).toBe("image/png");
  });

  it("returns 404 for missing files and traversal", async () => {
    const missing = await GET(new Request("http://localhost/uploads/media/missing.jpg"), {
      params: Promise.resolve({ path: ["media", "missing.jpg"] }),
    });
    expect(missing.status).toBe(404);

    const traversal = await GET(new Request("http://localhost/uploads/../package.json"), {
      params: Promise.resolve({ path: ["..", "package.json"] }),
    });
    expect(traversal.status).toBe(404);
  });
});
