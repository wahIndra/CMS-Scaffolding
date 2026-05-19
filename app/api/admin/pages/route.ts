import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/permissions";
import { getAllPages, createPage } from "@/lib/services/page.service";
import { pageSchema } from "@/lib/validators/page";
import { logActivity } from "@/lib/services/activity.service";
import { handleApiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const session = await requirePermission("manage:content");
    const { pages, total } = await getAllPages();
    return NextResponse.json({ success: true, data: { pages, total } });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requirePermission("manage:content");
    const body = await req.json();
    const parsed = pageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const page = await createPage(parsed.data);
    await logActivity("CREATE_PAGE", "Page", { entityId: page.id, userId: session.user.id });

    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}
