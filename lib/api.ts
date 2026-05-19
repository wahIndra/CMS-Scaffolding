import { NextResponse } from "next/server";

/**
 * Maps thrown errors from requirePermission / services to appropriate HTTP responses.
 * Use as the final fallback in every API route catch block.
 */
export function handleApiError(e: unknown): NextResponse {
  const msg = (e as Error).message;
  if (msg === "Unauthorized") return NextResponse.json({ success: false, error: msg }, { status: 401 });
  if (msg === "Forbidden") return NextResponse.json({ success: false, error: msg }, { status: 403 });
  return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
}
