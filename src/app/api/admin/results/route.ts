import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MatchResult from "@/lib/models/MatchResult";

function verifyAdmin(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  try {
    const decoded = Buffer.from(auth.replace("Bearer ", ""), "base64").toString();
    const [username, password] = decoded.split(":");
    return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    await dbConnect();
    const results = await MatchResult.find({});
    const resultsMap: Record<string, string> = {};
    results.forEach((r) => {
      resultsMap[r.matchId] = r.winner;
    });
    return NextResponse.json({ results: resultsMap });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { matchId, winner } = await req.json();

    if (!matchId || !winner) {
      return NextResponse.json({ error: "matchId and winner required" }, { status: 400 });
    }

    await MatchResult.findOneAndUpdate(
      { matchId },
      { matchId, winner, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
