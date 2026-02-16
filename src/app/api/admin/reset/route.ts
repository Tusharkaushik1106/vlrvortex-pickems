import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import Pick from "@/lib/models/Pick";
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

export async function POST(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { target } = await req.json();

    if (target === "entries") {
      await User.deleteMany({});
      await Pick.deleteMany({});
      return NextResponse.json({ success: true, message: "All users and picks deleted" });
    }

    if (target === "results") {
      await MatchResult.deleteMany({});
      return NextResponse.json({ success: true, message: "All match results deleted" });
    }

    return NextResponse.json({ error: "Invalid target. Use 'entries' or 'results'" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
