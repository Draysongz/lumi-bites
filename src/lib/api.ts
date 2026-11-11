import { NextResponse } from "next/server";

/** Map our auth helper errors to HTTP responses. */
export function handleApiError(err: unknown): NextResponse<{ error: string }> {
  if (err instanceof Error) {
    switch (err.message) {
      case "UNAUTHENTICATED":
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
      case "FORBIDDEN":
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      case "NOT_FOUND":
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      case "CONFLICT":
        return NextResponse.json({ error: "Already exists" }, { status: 409 });
      default:
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }
  return NextResponse.json({ error: "Internal error" }, { status: 500 });
}
