import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/permissions";
import { updateCategory, deleteCategory } from "@/lib/services/category.service";
import { categorySchema } from "@/lib/validators/category";
import { handleApiError } from "@/lib/api";

interface RouteContext { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    await requirePermission("manage:content");
    const body = await req.json();
    const parsed = categorySchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Validation failed" }, { status: 400 });
    }

    const category = await updateCategory(params.id, parsed.data);
    return NextResponse.json({ success: true, data: category });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    await requirePermission("manage:content");
    await deleteCategory(params.id);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = (e as Error).message;
    if (msg === "Unauthorized") return NextResponse.json({ success: false, error: msg }, { status: 401 });
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
