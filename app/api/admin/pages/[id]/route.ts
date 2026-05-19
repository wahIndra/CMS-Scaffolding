import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/permissions";
import { getPageById, updatePage, deletePage } from "@/lib/services/page.service";
import { pageSchema } from "@/lib/validators/page";
import { logActivity } from "@/lib/services/activity.service";
import { handleApiError } from "@/lib/api";

interface RouteContext {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await requirePermission("manage:content");
    const page = await getPageById(params.id);
    if (!page) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: page });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await requirePermission("manage:content");
    const body = await req.json();
    const parsed = pageSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const page = await updatePage(params.id, parsed.data);
    await logActivity("UPDATE_PAGE", "Page", { entityId: params.id, userId: session.user.id });

    return NextResponse.json({ success: true, data: page });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await requirePermission("manage:content");
    await deletePage(params.id);
    await logActivity("DELETE_PAGE", "Page", { entityId: params.id, userId: session.user.id });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}
