import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/permissions";
import { getAllSettings, updateSettings } from "@/lib/services/settings.service";
import { siteSettingsSchema } from "@/lib/validators/settings";

export async function GET(_req: NextRequest) {
  try {
    await requirePermission("manage:content");
    const settings = await getAllSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission("manage:content");
    const body = await req.json();
    const parsed = siteSettingsSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    await updateSettings(parsed.data as Record<string, string>);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = (e as Error).message;
    if (msg === "Unauthorized") return NextResponse.json({ success: false, error: msg }, { status: 401 });
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
