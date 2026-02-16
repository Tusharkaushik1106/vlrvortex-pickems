import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Pick from "@/lib/models/Pick";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const count = await Pick.countDocuments();
    return NextResponse.json({ count });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
