import { NextRequest, NextResponse } from "next/server";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
const UPLOAD_TOKEN = (process.env.UPLOAD_TOKEN || "").trim();

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headers: HeadersInit = {};
    if (UPLOAD_TOKEN) {
      headers["X-Api-Key"] = UPLOAD_TOKEN;
    }

    const res = await fetch(`${API_BASE}/api/runs/${params.id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: text || `HTTP ${res.status}` },
        { status: res.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
