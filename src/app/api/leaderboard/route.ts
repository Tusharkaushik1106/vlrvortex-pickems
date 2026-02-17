import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Pick from "@/lib/models/Pick";
import MatchResult from "@/lib/models/MatchResult";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    const [allPicks, allResults] = await Promise.all([
      Pick.find({}),
      MatchResult.find({}),
    ]);

    // Build results map: matchId -> winner name
    const resultsMap: Record<string, string> = {};
    allResults.forEach((r) => {
      resultsMap[r.matchId] = r.winner;
    });

    const totalDecided = Object.keys(resultsMap).length;

    // Calculate points for each user
    const leaderboard = allPicks.map((pick) => {
      let points = 0;
      let correct = 0;
      let wrong = 0;

      const userPicks: Record<string, string> = {};
      pick.picks.forEach((value: string, key: string) => {
        userPicks[key] = value;
      });

      for (const [matchId, winner] of Object.entries(resultsMap)) {
        if (userPicks[matchId]) {
          if (userPicks[matchId] === winner) {
            points += 1;
            correct += 1;
          } else {
            wrong += 1;
          }
        }
      }

      return {
        username: pick.username as string,
        points,
        correct,
        wrong,
        total: Object.keys(userPicks).length,
      };
    });

    // Sort by points descending, then by correct descending
    leaderboard.sort((a, b) => b.points - a.points || b.correct - a.correct);

    return NextResponse.json({ leaderboard, totalDecided });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
