import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/permissions";
import { getAllUsers, createUser } from "@/lib/services/user.service";
import { createUserSchema } from "@/lib/validators/user";
import { handleApiError } from "@/lib/api";

export async function GET(_req: NextRequest) {
  try {
    await requirePermission("manage:users");
    const { users, total } = await getAllUsers();
    return NextResponse.json({ success: true, data: { users, total } });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission("manage:users");
    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const user = await createUser(parsed.data);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (e: unknown) {
    const msg = (e as Error).message;
    if (msg.includes("Unique constraint")) return NextResponse.json({ success: false, error: "Email already in use" }, { status: 409 });
    return handleApiError(e);
  }
}
