import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/permissions";
import { getAllPosts, createPost } from "@/lib/services/post.service";
import { postSchema } from "@/lib/validators/post";
import { logActivity } from "@/lib/services/activity.service";
import { handleApiError } from "@/lib/api";

export async function GET(_req: NextRequest) {
  try {
    await requirePermission("manage:content");
    const { posts, total } = await getAllPosts();
    return NextResponse.json({ success: true, data: { posts, total } });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requirePermission("manage:content");
    const body = await req.json();
    const parsed = postSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const post = await createPost(parsed.data, session.user.id);
    await logActivity("CREATE_POST", "Post", { entityId: post.id, userId: session.user.id });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}
