import { NextRequest, NextResponse } from "next/server";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
const UPLOAD_TOKEN = (process.env.UPLOAD_TOKEN || "").trim();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const headers: HeadersInit = {};
    if (UPLOAD_TOKEN) {
      headers["X-Api-Key"] = UPLOAD_TOKEN;
    }

    const res = await fetch(`${API_BASE}/api/runs`, {
      method: "POST",
      headers,
      body: formData,
    });

    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { error: text || `HTTP ${res.status}` },
        { status: res.status }
      );
    }

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
