export interface Team {
  seed: number;
  name: string;
  shortName: string;
}

export interface Match {
  id: string;
  round: number;
  position: number;
  teamA: Team | null;
  teamB: Team | null;
  feedsInto: string | null;
  feedsSlot: "A" | "B" | null;
}

export const TEAMS: Record<number, Team> = {
  1: { seed: 1, name: "Pibble Army", shortName: "PBL" },
  2: { seed: 2, name: "Tesseract", shortName: "TSR" },
  3: { seed: 3, name: "Gooner Gundas", shortName: "GG" },
  4: { seed: 4, name: "Team Frag Esports", shortName: "FRAG" },
  5: { seed: 5, name: "Invincibles", shortName: "INV" },
  6: { seed: 6, name: "Khatti Mithai", shortName: "KM" },
  7: { seed: 7, name: "Vortex", shortName: "VTX" },
  8: { seed: 8, name: "Majestic Moggers", shortName: "MM" },
  9: { seed: 9, name: "The Wizards", shortName: "WIZ" },
  10: { seed: 10, name: "Slayers", shortName: "SLY" },
  11: { seed: 11, name: "SNS", shortName: "SNS" },
  12: { seed: 12, name: "Hawk Tuah Diddy Rizz Sigma", shortName: "HTDRS" },
  13: { seed: 13, name: "Team Avyukt", shortName: "AVY" },
  14: { seed: 14, name: "Invincibles 2", shortName: "INV2" },
};

// Round 1: First Round (6 matches)
// Round 2: Quarter-Finals (4 matches)
// Round 3: Semi-Finals (2 matches)
// Round 4: Finals (1 match)

export const MATCHES: Match[] = [
  // ===== FIRST ROUND (Round 1) =====
  // Top half
  { id: "r1m1", round: 1, position: 0, teamA: TEAMS[9], teamB: TEAMS[8], feedsInto: "r2m1", feedsSlot: "B" },
  { id: "r1m2", round: 1, position: 1, teamA: TEAMS[5], teamB: TEAMS[12], feedsInto: "r2m2", feedsSlot: "A" },
  { id: "r1m3", round: 1, position: 2, teamA: TEAMS[13], teamB: TEAMS[4], feedsInto: "r2m2", feedsSlot: "B" },
  // Bottom half
  { id: "r1m4", round: 1, position: 3, teamA: TEAMS[3], teamB: TEAMS[14], feedsInto: "r2m3", feedsSlot: "A" },
  { id: "r1m5", round: 1, position: 4, teamA: TEAMS[11], teamB: TEAMS[6], feedsInto: "r2m3", feedsSlot: "B" },
  { id: "r1m6", round: 1, position: 5, teamA: TEAMS[7], teamB: TEAMS[10], feedsInto: "r2m4", feedsSlot: "A" },

  // ===== QUARTER-FINALS (Round 2) =====
  { id: "r2m1", round: 2, position: 0, teamA: TEAMS[1], teamB: null, feedsInto: "r3m1", feedsSlot: "A" }, // #1 Pibble Army vs Winner(r1m1)
  { id: "r2m2", round: 2, position: 1, teamA: null, teamB: null, feedsInto: "r3m1", feedsSlot: "B" },       // Winner(r1m2) vs Winner(r1m3)
  { id: "r2m3", round: 2, position: 2, teamA: null, teamB: null, feedsInto: "r3m2", feedsSlot: "A" },       // Winner(r1m4) vs Winner(r1m5)
  { id: "r2m4", round: 2, position: 3, teamA: null, teamB: TEAMS[2], feedsInto: "r3m2", feedsSlot: "B" }, // Winner(r1m6) vs #2 Tesseract

  // ===== SEMI-FINALS (Round 3) =====
  { id: "r3m1", round: 3, position: 0, teamA: null, teamB: null, feedsInto: "r4m1", feedsSlot: "A" },
  { id: "r3m2", round: 3, position: 1, teamA: null, teamB: null, feedsInto: "r4m1", feedsSlot: "B" },

  // ===== FINALS (Round 4) =====
  { id: "r4m1", round: 4, position: 0, teamA: null, teamB: null, feedsInto: null, feedsSlot: null },
];

export const ROUND_NAMES: Record<number, string> = {
  1: "FIRST ROUND",
  2: "QUARTER-FINALS",
  3: "SEMI-FINALS",
  4: "FINALS",
};
