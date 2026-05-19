import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest) {
  try {
    await requirePermission("view:dashboard");

    const [posts, pages, media, users] = await Promise.all([
      db.post.count(),
      db.page.count(),
      db.media.count(),
      db.user.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: { posts, pages, media, users },
    });
  } catch (e: unknown) {
    const msg = (e as Error).message;
    if (msg === "Unauthorized") return NextResponse.json({ success: false, error: msg }, { status: 401 });
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
