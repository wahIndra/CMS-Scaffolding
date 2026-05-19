import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/permissions";
import { uploadFile, getAllMedia } from "@/lib/services/media.service";

export async function GET(_req: NextRequest) {
  try {
    await requirePermission("manage:content");
    const { items, total } = await getAllMedia();
    return NextResponse.json({ success: true, data: { items, total } });
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requirePermission("manage:content");
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json({ success: false, error: "No files provided" }, { status: 400 });
    }

    const results = await Promise.all(
      files.map((file) => uploadFile(file, session.user.id))
    );

    return NextResponse.json({ success: true, data: results }, { status: 201 });
  } catch (e: unknown) {
    const msg = (e as Error).message;
    if (msg === "Unauthorized") return NextResponse.json({ success: false, error: msg }, { status: 401 });
    if (msg.includes("exceeds") || msg.includes("not allowed")) {
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
