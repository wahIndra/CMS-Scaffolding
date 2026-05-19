import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/permissions";
import { getPostById, updatePost, deletePost } from "@/lib/services/post.service";
import { postSchema } from "@/lib/validators/post";
import { logActivity } from "@/lib/services/activity.service";
import { handleApiError } from "@/lib/api";

interface RouteContext { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await requirePermission("manage:content");
    const body = await req.json();
    const parsed = postSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const post = await updatePost(params.id, parsed.data);
    await logActivity("UPDATE_POST", "Post", { entityId: params.id, userId: session.user.id });

    return NextResponse.json({ success: true, data: post });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await requirePermission("manage:content");
    await deletePost(params.id);
    await logActivity("DELETE_POST", "Post", { entityId: params.id, userId: session.user.id });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = (e as Error).message;
    if (msg === "Unauthorized") return NextResponse.json({ success: false, error: msg }, { status: 401 });
    if (msg === "Forbidden") return NextResponse.json({ success: false, error: msg }, { status: 403 });
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
