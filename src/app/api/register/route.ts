import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { username } = await req.json();

    if (!username || typeof username !== "string" || username.trim().length < 2) {
      return NextResponse.json({ error: "Username must be at least 2 characters" }, { status: 400 });
    }

    const clean = username.trim().toLowerCase();

    if (!/^[a-z0-9_]+$/.test(clean)) {
      return NextResponse.json({ error: "Username can only contain letters, numbers, and underscores" }, { status: 400 });
    }

    const existing = await User.findOne({ username: clean });
    if (existing) {
      return NextResponse.json({ username: clean, existing: true });
    }

    await User.create({ username: clean });
    return NextResponse.json({ username: clean, existing: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
