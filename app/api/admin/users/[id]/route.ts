import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/permissions";
import { getUserById, updateUser, deleteUser } from "@/lib/services/user.service";
import { updateUserSchema } from "@/lib/validators/user";
import { handleApiError } from "@/lib/api";

interface RouteContext { params: { id: string } }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await requirePermission("manage:users");
    const user = await getUserById(params.id);
    if (!user) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    await requirePermission("manage:users");
    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    const user = await updateUser(params.id, parsed.data);
    return NextResponse.json({ success: true, data: user });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await requirePermission("manage:users");
    if (params.id === session.user.id) {
      return NextResponse.json({ success: false, error: "Cannot delete own account" }, { status: 400 });
    }
    await deleteUser(params.id);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}
