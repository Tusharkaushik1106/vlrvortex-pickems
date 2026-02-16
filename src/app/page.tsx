"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MATCHES, TEAMS, ROUND_NAMES, type Team, type Match } from "@/lib/bracketData";

// ─── Particle Background ────────────────────────────────────────
function ParticleBackground() {
  const particles = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      w: (i * 7 + 3) % 5 + 2,
      h: (i * 11 + 5) % 4 + 2,
      color: i % 3 === 0
        ? "rgba(255, 69, 0, 0.5)"
        : i % 3 === 1
          ? "rgba(255, 215, 0, 0.35)"
          : "rgba(255, 107, 53, 0.35)",
      left: ((i * 37 + 13) % 100),
      top: ((i * 53 + 7) % 100),
      dur: (i % 5) + 4,
      delay: (i % 7) * 0.3,
      yOff: ((i * 3) % 30) + 10,
    }))
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.current.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.w,
            height: p.h,
            background: p.color,
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{
            y: [0, -p.yOff, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#FF4500]/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FFD700]/6 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#FF6B35]/5 rounded-full blur-[120px]" />
    </div>
  );
}

// ─── Register Modal ──────────────────────────────────────────────
function RegisterModal({
  onRegister,
  loading,
  error,
}: {
  onRegister: (name: string) => void;
  loading: boolean;
  error: string;
}) {
  const [name, setName] = useState("");

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-[#1E1E38] to-[#14142A] border border-[#FF4500]/20 rounded-3xl p-8 w-full max-w-md mx-4 relative overflow-hidden shadow-2xl"
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Decorative glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FF4500]/20 rounded-full blur-[60px]" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#FFD700]/15 rounded-full blur-[50px]" />

        <div className="relative z-10">
          {/* Logo */}
          <motion.div
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
          >
            <Image src="/vlr.png" alt="VLR Vortex" width={80} height={80} className="drop-shadow-[0_0_15px_rgba(255,69,0,0.4)]" />
          </motion.div>

          <motion.h2
            className="text-4xl font-black text-center mb-1"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-[#FF4500] via-[#FF6B35] to-[#FFD700] bg-clip-text text-transparent">
              VLR VORTEX
            </span>
          </motion.h2>
          <motion.p
            className="text-[#A0A0B8] text-center mb-8 text-xs tracking-[0.4em] font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            TOURNAMENT PICKEMS
          </motion.p>

          <motion.p
            className="text-[#A0A0B8] text-center mb-6 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Enter your username to make your predictions
          </motion.p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) onRegister(name.trim());
            }}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter username..."
                className="w-full bg-[#0A0A0F]/80 border-2 border-[#252542] rounded-xl px-4 py-3.5 text-white placeholder-[#6B6B80] focus:border-[#FF4500] focus:shadow-[0_0_20px_rgba(255,69,0,0.15)] focus:outline-none transition-all mb-4 text-lg"
                autoFocus
                maxLength={20}
              />
            </motion.div>
            {error && (
              <motion.p
                className="text-[#FF3366] text-sm mb-3 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}
            <motion.button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-3.5 rounded-xl font-black text-lg bg-gradient-to-r from-[#FF4500] to-[#FFD700] text-[#0A0A0F] disabled:opacity-30 transition-all tracking-wide"
              whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(255,69,0,0.4)" }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {loading ? "LOADING..." : "LET'S GO"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Pickem Counter ──────────────────────────────────────────────
function PickemCounter({ count }: { count: number }) {
  return (
    <motion.div
      className="flex items-center gap-3 bg-[#1A1A2E]/80 backdrop-blur border border-[#FF4500]/15 rounded-xl px-5 py-2.5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="w-2.5 h-2.5 rounded-full bg-[#00FF88] animate-pulse shadow-[0_0_10px_rgba(0,255,136,0.5)]" />
      <span className="text-[#A0A0B8] text-xs font-bold tracking-wider">PICKEMS</span>
      <motion.span
        key={count}
        className="text-2xl font-black bg-gradient-to-r from-[#FFD700] to-[#FF6B35] bg-clip-text text-transparent"
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {count}
      </motion.span>
    </motion.div>
  );
}

// ─── Team Slot ───────────────────────────────────────────────────
function TeamSlot({
  team,
  isPicked,
  isCorrect,
  isWrong,
  isLocked,
  onClick,
  side,
}: {
  team: Team | null;
  isPicked: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  isLocked: boolean;
  onClick: () => void;
  side: "A" | "B";
}) {
  if (!team) {
    return (
      <div
        className={`flex items-center gap-2.5 px-3 py-2.5 bg-[#0A0A0F]/40 border border-[#252542]/40 opacity-50
          ${side === "A" ? "rounded-t-lg border-b-0" : "rounded-b-lg"}`}
      >
        <span className="w-7 h-7 rounded-md bg-[#252542]/40 flex items-center justify-center text-[10px] text-[#6B6B80] font-bold">
          ?
        </span>
        <span className="text-[#6B6B80] text-xs italic">TBD</span>
      </div>
    );
  }

  let borderClass = "border-[#252542]/60 hover:border-[#FF4500]/50 hover:bg-[#FF4500]/5";
  let seedClass = "bg-[#252542] text-[#A0A0B8]";
  let nameClass = "text-[#A0A0B8]";

  if (isCorrect) {
    borderClass = "border-[#00FF88] bg-[#00FF88]/10 shadow-[0_0_15px_rgba(0,255,136,0.15)]";
    seedClass = "bg-[#00FF88] text-[#0A0A0F]";
    nameClass = "text-[#00FF88]";
  } else if (isWrong) {
    borderClass = "border-[#FF3366] bg-[#FF3366]/8";
    seedClass = "bg-[#FF3366] text-white";
    nameClass = "text-[#FF3366]";
  } else if (isPicked) {
    borderClass = "border-[#FF4500] bg-[#FF4500]/10 shadow-[0_0_15px_rgba(255,69,0,0.15)]";
    seedClass = "bg-gradient-to-br from-[#FF4500] to-[#FF6B35] text-white";
    nameClass = "text-white";
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={isLocked && !isPicked}
      className={`
        flex items-center gap-2.5 px-3 py-2.5 border-2 transition-all w-full text-left
        ${side === "A" ? "rounded-t-lg border-b" : "rounded-b-lg"}
        ${borderClass}
        ${isLocked && !isPicked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
      whileHover={!isLocked || isPicked ? { scale: 1.02, x: 3 } : {}}
      whileTap={!isLocked || isPicked ? { scale: 0.98 } : {}}
    >
      <span className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${seedClass}`}>
        {team.seed}
      </span>
      <span className={`text-xs font-bold truncate flex-1 ${nameClass}`}>
        {team.name}
      </span>
      {isPicked && !isCorrect && !isWrong && (
        <motion.span
          className="text-[#FF4500] text-sm shrink-0"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 10 }}
        >
          &#10003;
        </motion.span>
      )}
      {isCorrect && (
        <motion.span
          className="text-[#00FF88] text-sm font-bold shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1] }}
        >
          &#10003;
        </motion.span>
      )}
      {isWrong && (
        <motion.span
          className="text-[#FF3366] text-sm font-bold shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1] }}
        >
          &#10007;
        </motion.span>
      )}
    </motion.button>
  );
}

// ─── Match Card ──────────────────────────────────────────────────
function MatchCard({
  match,
  resolvedTeamA,
  resolvedTeamB,
  pickedTeam,
  officialWinner,
  onPick,
  delay,
  submitted,
}: {
  match: Match;
  resolvedTeamA: Team | null;
  resolvedTeamB: Team | null;
  pickedTeam: string | null;
  officialWinner: string | null;
  onPick: (matchId: string, teamName: string) => void;
  delay: number;
  submitted: boolean;
}) {
  const isPickedA = pickedTeam === resolvedTeamA?.name;
  const isPickedB = pickedTeam === resolvedTeamB?.name;
  const isCorrectA = officialWinner != null && isPickedA && officialWinner === resolvedTeamA?.name;
  const isCorrectB = officialWinner != null && isPickedB && officialWinner === resolvedTeamB?.name;
  const isWrongA = officialWinner != null && isPickedA && officialWinner !== resolvedTeamA?.name;
  const isWrongB = officialWinner != null && isPickedB && officialWinner !== resolvedTeamB?.name;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
    >
      <div className="text-[9px] font-bold text-[#6B6B80] mb-1 tracking-wider pl-1">
        {match.id.toUpperCase().replace("R", "R").replace("M", " - M")}
      </div>
      <TeamSlot
        team={resolvedTeamA}
        isPicked={isPickedA}
        isCorrect={isCorrectA}
        isWrong={isWrongA}
        isLocked={submitted || !resolvedTeamA}
        onClick={() => resolvedTeamA && onPick(match.id, resolvedTeamA.name)}
        side="A"
      />
      <TeamSlot
        team={resolvedTeamB}
        isPicked={isPickedB}
        isCorrect={isCorrectB}
        isWrong={isWrongB}
        isLocked={submitted || !resolvedTeamB}
        onClick={() => resolvedTeamB && onPick(match.id, resolvedTeamB.name)}
        side="B"
      />
    </motion.div>
  );
}

// ─── Bracket with CSS connectors ─────────────────────────────────
const MATCH_H = 70;       // height of one match (2 team slots)
const MATCH_W = 210;      // width of a match card
const COL_GAP = 60;       // horizontal gap between rounds
const LABEL_H = 18;       // match id label above each card
const PAIR_GAP = 40;      // gap between two matches in the same pair (feeding same QF)
const GROUP_GAP = 55;     // gap between different groups
const HALF_GAP = 75;      // gap between top half and bottom half

function Bracket({
  picks,
  officialResults,
  onPick,
  submitted,
}: {
  picks: Record<string, string>;
  officialResults: Record<string, string>;
  onPick: (matchId: string, teamName: string) => void;
  submitted: boolean;
}) {
  const resolveTeams = useCallback((): Record<string, { teamA: Team | null; teamB: Team | null }> => {
    const resolved: Record<string, { teamA: Team | null; teamB: Team | null }> = {};
    for (const m of MATCHES) {
      resolved[m.id] = { teamA: m.teamA, teamB: m.teamB };
    }
    for (const m of MATCHES) {
      const pick = picks[m.id];
      if (pick && m.feedsInto) {
        const pickedTeam = Object.values(TEAMS).find((t) => t.name === pick) || null;
        if (m.feedsSlot === "A") {
          resolved[m.feedsInto] = { ...resolved[m.feedsInto], teamA: pickedTeam };
        } else {
          resolved[m.feedsInto] = { ...resolved[m.feedsInto], teamB: pickedTeam };
        }
      }
    }
    return resolved;
  }, [picks]);

  const resolved = resolveTeams();

  const matchBlock = MATCH_H + LABEL_H; // total height of one match card with label

  // ── R1 positions: grouped by which QF they feed into ──
  // Group A (top): r1m1 alone → feeds QF1 (with bye team #1)
  // Group B: r1m2 + r1m3 → both feed QF2
  // --- half gap ---
  // Group C: r1m4 + r1m5 → both feed QF3
  // Group D (bottom): r1m6 alone → feeds QF4 (with bye team #2)

  let y = 0;
  const r1m1Y = y;                                       // Group A: r1m1
  y += matchBlock + GROUP_GAP;
  const r1m2Y = y;                                       // Group B: r1m2
  y += matchBlock + PAIR_GAP;
  const r1m3Y = y;                                       //          r1m3
  y += matchBlock + HALF_GAP;
  const r1m4Y = y;                                       // Group C: r1m4
  y += matchBlock + PAIR_GAP;
  const r1m5Y = y;                                       //          r1m5
  y += matchBlock + GROUP_GAP;
  const r1m6Y = y;                                       // Group D: r1m6

  const center = (y1: number, y2: number) => (y1 + y2) / 2;
  const mid = (yPos: number) => yPos + matchBlock / 2;   // vertical center of a match

  // ── R2 positions: centered between their feeder matches ──
  const r2m1Y = center(mid(r1m1Y), mid(r1m1Y)) - matchBlock / 2;                // QF1: aligned with r1m1 (bye)
  const r2m2Y = center(mid(r1m2Y), mid(r1m3Y)) - matchBlock / 2;                // QF2: between r1m2 & r1m3
  const r2m3Y = center(mid(r1m4Y), mid(r1m5Y)) - matchBlock / 2;                // QF3: between r1m4 & r1m5
  const r2m4Y = center(mid(r1m6Y), mid(r1m6Y)) - matchBlock / 2;                // QF4: aligned with r1m6 (bye)

  // ── R3 positions: centered between QF pairs ──
  const r3m1Y = center(mid(r2m1Y), mid(r2m2Y)) - matchBlock / 2;                // SF1: between QF1 & QF2
  const r3m2Y = center(mid(r2m3Y), mid(r2m4Y)) - matchBlock / 2;                // SF2: between QF3 & QF4

  // ── R4 position: centered between semis ──
  const r4m1Y = center(mid(r3m1Y), mid(r3m2Y)) - matchBlock / 2;                // Finals

  const allYs: Record<string, number> = {
    r1m1: r1m1Y, r1m2: r1m2Y, r1m3: r1m3Y,
    r1m4: r1m4Y, r1m5: r1m5Y, r1m6: r1m6Y,
    r2m1: r2m1Y, r2m2: r2m2Y, r2m3: r2m3Y, r2m4: r2m4Y,
    r3m1: r3m1Y, r3m2: r3m2Y,
    r4m1: r4m1Y,
  };

  const roundX = (round: number) => (round - 1) * (MATCH_W + COL_GAP);

  const getMatchesForRound = (round: number) =>
    MATCHES.filter((m) => m.round === round).sort((a, b) => a.position - b.position);

  const totalHeight = r1m6Y + matchBlock + 20;

  // Build connector lines data
  type Line = { x1: number; y1: number; x2: number; y2: number };
  const lines: Line[] = [];

  for (const m of MATCHES) {
    if (!m.feedsInto) continue;
    const fromX = roundX(m.round) + MATCH_W;
    const fromY = allYs[m.id] + LABEL_H + MATCH_H / 2;
    const toX = roundX(m.round + 1);
    const toY = allYs[m.feedsInto] + LABEL_H + (m.feedsSlot === "A" ? MATCH_H * 0.3 : MATCH_H * 0.7);

    const midX = (fromX + toX) / 2;
    lines.push({ x1: fromX, y1: fromY, x2: midX, y2: fromY });
    lines.push({ x1: midX, y1: fromY, x2: midX, y2: toY });
    lines.push({ x1: midX, y1: toY, x2: toX, y2: toY });
  }

  return (
    <div className="overflow-x-auto pb-4">
      {/* Round labels */}
      <div className="flex mb-2" style={{ paddingLeft: 2 }}>
        {[1, 2, 3, 4].map((round) => (
          <motion.div
            key={round}
            className="text-[10px] font-black tracking-[0.15em] text-[#FF4500] px-3 py-1.5 rounded-full bg-[#FF4500]/8 border border-[#FF4500]/15 text-center"
            style={{ width: MATCH_W, marginRight: COL_GAP, flexShrink: 0 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: round * 0.15 }}
          >
            {ROUND_NAMES[round]}
          </motion.div>
        ))}
        <motion.div
          className="text-[10px] font-black tracking-[0.15em] text-[#FFD700] px-3 py-1.5 rounded-full bg-[#FFD700]/8 border border-[#FFD700]/15 text-center"
          style={{ width: MATCH_W, flexShrink: 0 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          CHAMPION
        </motion.div>
      </div>

      <div className="relative" style={{ height: totalHeight, minWidth: 5 * (MATCH_W + COL_GAP) }}>
        {/* SVG connector lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
          {lines.map((line, i) => (
            <motion.line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgba(255, 69, 0, 0.25)"
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.02, duration: 0.4 }}
            />
          ))}
        </svg>

        {/* Matches */}
        {[1, 2, 3, 4].map((round) =>
          getMatchesForRound(round).map((match, idx) => (
            <div
              key={match.id}
              className="absolute"
              style={{
                left: roundX(round),
                top: allYs[match.id],
                width: MATCH_W,
              }}
            >
              <MatchCard
                match={match}
                resolvedTeamA={resolved[match.id]?.teamA}
                resolvedTeamB={resolved[match.id]?.teamB}
                pickedTeam={picks[match.id] || null}
                officialWinner={officialResults[match.id] || null}
                onPick={onPick}
                delay={round * 0.15 + idx * 0.08}
                submitted={submitted}
              />
            </div>
          ))
        )}

        {/* Champion slot */}
        <motion.div
          className="absolute"
          style={{
            left: roundX(5),
            top: allYs["r4m1"],
            width: MATCH_W,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          <div className="rounded-xl border-2 border-[#FFD700]/30 bg-gradient-to-br from-[#FFD700]/10 via-[#1A1A2E] to-[#FF4500]/5 p-5 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/5 to-transparent animate-shimmer" />
            {picks["r4m1"] ? (
              <motion.div
                className="relative z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >
                <div className="text-[#FFD700] text-3xl mb-2">&#9813;</div>
                <div className="text-white font-black text-sm mb-1">{picks["r4m1"]}</div>
                {officialResults["r4m1"] && (
                  <div className={`text-xs mt-1 font-bold ${officialResults["r4m1"] === picks["r4m1"] ? "text-[#00FF88]" : "text-[#FF3366]"}`}>
                    {officialResults["r4m1"] === picks["r4m1"] ? "CORRECT!" : `Winner: ${officialResults["r4m1"]}`}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="relative z-10">
                <div className="text-[#6B6B80] text-3xl mb-2">&#9813;</div>
                <div className="text-[#6B6B80] text-xs italic">Pick the champion</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Connector line from finals to champion */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
          <motion.line
            x1={roundX(4) + MATCH_W}
            y1={allYs["r4m1"] + LABEL_H + MATCH_H / 2}
            x2={roundX(5)}
            y2={allYs["r4m1"] + LABEL_H + MATCH_H / 2}
            stroke="rgba(255, 215, 0, 0.3)"
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [officialResults, setOfficialResults] = useState<Record<string, string>>({});
  const [pickCount, setPickCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showRegister, setShowRegister] = useState(true);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("vlr_username");
    if (saved) {
      setUsername(saved);
      setShowRegister(false);
    }
  }, []);

  useEffect(() => {
    if (!username || initialized.current) return;
    initialized.current = true;

    Promise.all([
      fetch(`/api/picks?username=${username}`).then((r) => r.json()),
      fetch("/api/admin/results").then((r) => r.json()),
      fetch("/api/stats").then((r) => r.json()),
    ]).then(([pickData, resultData, statsData]) => {
      if (pickData.picks) {
        setPicks(pickData.picks);
        setSubmitted(true);
      }
      if (resultData.results) setOfficialResults(resultData.results);
      if (statsData.count != null) setPickCount(statsData.count);
    }).catch(() => {});
  }, [username]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [resultData, statsData] = await Promise.all([
          fetch("/api/admin/results").then((r) => r.json()),
          fetch("/api/stats").then((r) => r.json()),
        ]);
        if (resultData.results) setOfficialResults(resultData.results);
        if (statsData.count != null) setPickCount(statsData.count);
      } catch {}
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (name: string) => {
    setRegLoading(true);
    setRegError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name }),
      });
      const data = await res.json();
      if (data.error) {
        setRegError(data.error);
      } else {
        localStorage.setItem("vlr_username", data.username);
        setUsername(data.username);
        setShowRegister(false);
      }
    } catch {
      setRegError("Network error, try again");
    }
    setRegLoading(false);
  };

  const handlePick = (matchId: string, teamName: string) => {
    if (submitted) return;
    setPicks((prev) => {
      const next = { ...prev };
      if (next[matchId] === teamName) {
        delete next[matchId];
        clearDownstream(matchId, next);
      } else {
        if (next[matchId]) {
          clearDownstream(matchId, next);
        }
        next[matchId] = teamName;
      }
      return next;
    });
  };

  const clearDownstream = (matchId: string, picksObj: Record<string, string>) => {
    const match = MATCHES.find((m) => m.id === matchId);
    if (!match?.feedsInto) return;
    delete picksObj[match.feedsInto];
    clearDownstream(match.feedsInto, picksObj);
  };

  const totalMatchCount = MATCHES.length;

  const handleSubmit = async () => {
    if (!username) return;

    if (Object.keys(picks).length < totalMatchCount) {
      setSaveMsg("Pick a winner for every match!");
      setTimeout(() => setSaveMsg(""), 3000);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, picks }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setPickCount((c) => c + 1);
        setSaveMsg("Picks submitted!");
      } else {
        setSaveMsg(data.error || "Error saving picks");
      }
    } catch {
      setSaveMsg("Network error, try again");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("vlr_username");
    setUsername(null);
    setPicks({});
    setSubmitted(false);
    setShowRegister(true);
    initialized.current = false;
  };

  const pickedCount = Object.keys(picks).length;
  const progress = Math.round((pickedCount / totalMatchCount) * 100);

  return (
    <main className="min-h-screen relative">
      <ParticleBackground />

      <AnimatePresence>
        {showRegister && (
          <RegisterModal onRegister={handleRegister} loading={regLoading} error={regError} />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        className="relative z-20 border-b border-[#FF4500]/10 bg-[#0E0E1A]/80 backdrop-blur-xl"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="max-w-[1500px] mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.03 }}>
            <Image src="/vlr.png" alt="VLR Vortex" width={44} height={44} className="drop-shadow-[0_0_10px_rgba(255,69,0,0.3)]" />
            <div>
              <h1 className="text-xl font-black tracking-wide leading-none">
                VLR <span className="bg-gradient-to-r from-[#FF4500] to-[#FFD700] bg-clip-text text-transparent">VORTEX</span>
              </h1>
              <p className="text-[9px] text-[#6B6B80] tracking-[0.35em] font-bold uppercase">
                Tournament Pickems
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-3 flex-wrap">
            <PickemCounter count={pickCount} />

            {username && (
              <motion.div
                className="flex items-center gap-3 bg-[#1A1A2E]/80 backdrop-blur border border-[#252542] rounded-xl px-4 py-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF4500] to-[#FFD700] flex items-center justify-center text-xs font-black text-[#0A0A0F]">
                  {username[0].toUpperCase()}
                </div>
                <span className="text-sm font-bold text-white">{username}</span>
                <button
                  onClick={handleLogout}
                  className="text-[#6B6B80] hover:text-[#FF3366] text-xs transition-colors font-medium"
                >
                  logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1500px] mx-auto px-4 pt-6 pb-32">
        {/* Progress Bar */}
        {!submitted && username && (
          <motion.div className="mb-6 max-w-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#A0A0B8] text-xs font-bold tracking-wider">
                PICKS: {pickedCount} / {totalMatchCount}
              </span>
              <span className="text-[#FF4500] text-xs font-black">{progress}%</span>
            </div>
            <div className="h-2.5 bg-[#1A1A2E] rounded-full overflow-hidden border border-[#252542]/50">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF4500] via-[#FF6B35] to-[#FFD700] rounded-full shadow-[0_0_10px_rgba(255,69,0,0.3)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {submitted && (
          <motion.div className="mb-6 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-[#00FF88]/10 border border-[#00FF88]/25 rounded-xl px-6 py-2.5 text-[#00FF88] text-sm font-bold shadow-[0_0_20px_rgba(0,255,136,0.1)]">
              <span className="text-base">&#10003;</span> Picks locked in! Results update live.
            </div>
          </motion.div>
        )}

        <Bracket picks={picks} officialResults={officialResults} onPick={handlePick} submitted={submitted} />
      </div>

      {/* Submit Button */}
      {username && !submitted && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/95 to-transparent pt-10 pb-6"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-md mx-auto px-4 flex flex-col items-center gap-2">
            {saveMsg && (
              <motion.p
                className={`text-sm font-bold ${saveMsg.includes("submitted") ? "text-[#00FF88]" : "text-[#FF3366]"}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {saveMsg}
              </motion.p>
            )}
            <motion.button
              onClick={handleSubmit}
              disabled={saving || pickedCount < totalMatchCount}
              className={`
                w-full py-4 rounded-2xl font-black text-lg tracking-wide transition-all relative overflow-hidden
                ${pickedCount >= totalMatchCount
                  ? "bg-gradient-to-r from-[#FF4500] via-[#FF6B35] to-[#FFD700] text-[#0A0A0F] shadow-[0_0_30px_rgba(255,69,0,0.3)]"
                  : "bg-[#252542] text-[#6B6B80] cursor-not-allowed"
                }
              `}
              whileHover={pickedCount >= totalMatchCount ? { scale: 1.03, boxShadow: "0 0 50px rgba(255,69,0,0.4)" } : {}}
              whileTap={pickedCount >= totalMatchCount ? { scale: 0.97 } : {}}
            >
              {pickedCount >= totalMatchCount && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              )}
              <span className="relative z-10">
                {saving ? "SUBMITTING..." : pickedCount >= totalMatchCount ? "SUBMIT PICKS" : `PICK ${totalMatchCount - pickedCount} MORE`}
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </main>
  );
}
