import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/permissions";
import { getAllCategories, createCategory } from "@/lib/services/category.service";
import { categorySchema } from "@/lib/validators/category";
import { handleApiError } from "@/lib/api";

export async function GET(_req: NextRequest) {
  try {
    await requirePermission("manage:content");
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission("manage:content");
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const category = await createCategory(parsed.data);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (e: unknown) {
    const msg = (e as Error).message;
    if (msg.includes("Unique constraint")) return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 409 });
    return handleApiError(e);
  }
}
