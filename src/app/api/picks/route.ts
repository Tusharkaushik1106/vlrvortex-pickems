import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Pick from "@/lib/models/Pick";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const username = req.nextUrl.searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    const pick = await Pick.findOne({ username: username.toLowerCase() });
    if (!pick) {
      return NextResponse.json({ picks: null });
    }

    const picksObj: Record<string, string> = {};
    pick.picks.forEach((value: string, key: string) => {
      picksObj[key] = value;
    });

    return NextResponse.json({ picks: picksObj, submittedAt: pick.submittedAt });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { username, picks } = await req.json();

    if (!username || !picks || typeof picks !== "object") {
      return NextResponse.json({ error: "Username and picks required" }, { status: 400 });
    }

    const clean = username.trim().toLowerCase();

    await Pick.findOneAndUpdate(
      { username: clean },
      { username: clean, picks: new Map(Object.entries(picks)), submittedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
