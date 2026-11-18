import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/api";
import { uploadFile } from "@/lib/storage";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/admin/upload — upload an image to Neon Object Storage (lumi-bucket).
 * Accepts multipart/form-data with a `file` field; optional `folder` (default "dishes").
 * Returns { url, key } where url is a permanent public URL (bucket is public-read).
 */
export async function POST(req: Request) {
  try {
    await requireAdmin();

    const form = await req.formData();
    const file = form.get("file");
    const folder = (form.get("folder") as string) || "dishes";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 413 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const { key, url } = await uploadFile(folder, file.name, buf, file.type);

    return NextResponse.json({ url, key });
  } catch (err) {
    return handleApiError(err);
  }
}
