import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/permissions";
import { deleteMedia } from "@/lib/services/media.service";

interface RouteContext { params: { id: string } }

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    await requirePermission("manage:content");
    await deleteMedia(params.id);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = (e as Error).message;
    if (msg === "Unauthorized") return NextResponse.json({ success: false, error: msg }, { status: 401 });
    if (msg === "Media not found") return NextResponse.json({ success: false, error: msg }, { status: 404 });
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
