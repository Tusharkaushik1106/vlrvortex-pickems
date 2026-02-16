"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MATCHES, ROUND_NAMES, TEAMS, type Team } from "@/lib/bracketData";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [pickCount, setPickCount] = useState(0);
  const [resetting, setResetting] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("vlr_admin_token");
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/results")
      .then((r) => r.json())
      .then((d) => { if (d.results) setResults(d.results); });
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { if (d.count != null) setPickCount(d.count); });
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("vlr_admin_token", data.token);
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch {
      setLoginError("Network error");
    }
  };

  const setWinner = async (matchId: string, winner: string) => {
    if (!token) return;
    setSaving(matchId);
    try {
      await fetch("/api/admin/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ matchId, winner }),
      });
      setResults((prev) => ({ ...prev, [matchId]: winner }));
    } catch {}
    setSaving(null);
  };

  const clearResult = async (matchId: string) => {
    // We'll just set to empty to "clear" - or we could add a DELETE endpoint
    // For now, just remove from local state; the admin can re-set
    setResults((prev) => {
      const next = { ...prev };
      delete next[matchId];
      return next;
    });
  };

  // Resolve teams based on official results for later rounds
  const resolveTeam = (matchId: string, slot: "A" | "B"): Team | null => {
    const match = MATCHES.find((m) => m.id === matchId);
    if (!match) return null;

    if (slot === "A" && match.teamA) return match.teamA;
    if (slot === "B" && match.teamB) return match.teamB;

    // Find the feeder match
    const feeder = MATCHES.find((m) => m.feedsInto === matchId && m.feedsSlot === slot);
    if (!feeder) return null;

    // Check if feeder has a result
    const winnerName = results[feeder.id];
    if (!winnerName) return null;

    return Object.values(TEAMS).find((t) => t.name === winnerName) || null;
  };

  const handleLogout = () => {
    localStorage.removeItem("vlr_admin_token");
    setToken(null);
  };

  const handleReset = async (target: "entries" | "results") => {
    if (!token) return;
    setResetting(target);
    try {
      await fetch("/api/admin/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ target }),
      });
      if (target === "entries") {
        setPickCount(0);
      } else {
        setResults({});
      }
    } catch {}
    setResetting(null);
    setConfirmReset(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <motion.div
          className="bg-[#1A1A2E] border border-[#252542] rounded-2xl p-8 w-full max-w-md mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-black text-center mb-6 text-white">
            VLR VORTEX <span className="text-[#FF4500]">ADMIN</span>
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-[#0A0A0F] border-2 border-[#252542] rounded-xl px-4 py-3 text-white placeholder-[#6B6B80] focus:border-[#FF4500] focus:outline-none transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#0A0A0F] border-2 border-[#252542] rounded-xl px-4 py-3 text-white placeholder-[#6B6B80] focus:border-[#FF4500] focus:outline-none transition-colors"
            />
            {loginError && (
              <p className="text-[#FF3366] text-sm text-center">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-[#FF4500] to-[#FF6B35] text-white hover:opacity-90 transition"
            >
              LOGIN
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const rounds = [1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Header */}
      <header className="border-b border-[#252542] bg-[#1A1A2E]/60 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF4500] to-[#FFD700] flex items-center justify-center font-black text-lg text-[#0A0A0F]">
              A
            </div>
            <div>
              <h1 className="text-lg font-black">VLR VORTEX <span className="text-[#FF4500]">ADMIN</span></h1>
              <p className="text-[10px] text-[#A0A0B8] tracking-widest">RESULT MANAGEMENT</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#A0A0B8]">
              <span className="text-[#FFD700] font-bold">{pickCount}</span> picks submitted
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-[#FF3366] hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-[#A0A0B8] text-sm mb-6">
          Click a team to set them as the winner. Results are immediately saved and visible to all users.
        </p>

        {/* Reset Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {confirmReset === "entries" ? (
            <div className="flex items-center gap-2 bg-[#FF3366]/10 border border-[#FF3366]/30 rounded-xl px-4 py-2.5">
              <span className="text-[#FF3366] text-sm font-bold">Delete all users & picks?</span>
              <button
                onClick={() => handleReset("entries")}
                disabled={resetting === "entries"}
                className="px-3 py-1 rounded-lg bg-[#FF3366] text-white text-xs font-bold hover:bg-[#FF3366]/80 transition"
              >
                {resetting === "entries" ? "DELETING..." : "YES, DELETE"}
              </button>
              <button
                onClick={() => setConfirmReset(null)}
                className="px-3 py-1 rounded-lg bg-[#252542] text-[#A0A0B8] text-xs font-bold hover:bg-[#252542]/80 transition"
              >
                CANCEL
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset("entries")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#FF3366]/30 bg-[#FF3366]/5 text-[#FF3366] text-sm font-bold hover:bg-[#FF3366]/10 transition"
            >
              <span>&#128465;</span> Delete All Users & Picks
            </button>
          )}

          {confirmReset === "results" ? (
            <div className="flex items-center gap-2 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-xl px-4 py-2.5">
              <span className="text-[#FF6B35] text-sm font-bold">Delete all match results?</span>
              <button
                onClick={() => handleReset("results")}
                disabled={resetting === "results"}
                className="px-3 py-1 rounded-lg bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#FF6B35]/80 transition"
              >
                {resetting === "results" ? "DELETING..." : "YES, DELETE"}
              </button>
              <button
                onClick={() => setConfirmReset(null)}
                className="px-3 py-1 rounded-lg bg-[#252542] text-[#A0A0B8] text-xs font-bold hover:bg-[#252542]/80 transition"
              >
                CANCEL
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset("results")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#FF6B35]/30 bg-[#FF6B35]/5 text-[#FF6B35] text-sm font-bold hover:bg-[#FF6B35]/10 transition"
            >
              <span>&#128465;</span> Delete All Match Results
            </button>
          )}
        </div>

        {rounds.map((round) => {
          const matches = MATCHES.filter((m) => m.round === round).sort((a, b) => a.position - b.position);
          return (
            <div key={round} className="mb-10">
              <h2 className="text-[#FF4500] font-black text-sm tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-[#FF4500]" />
                {ROUND_NAMES[round]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((match) => {
                  const teamA = resolveTeam(match.id, "A");
                  const teamB = resolveTeam(match.id, "B");
                  const winner = results[match.id];
                  const isSaving = saving === match.id;

                  return (
                    <motion.div
                      key={match.id}
                      className="bg-[#1A1A2E] border border-[#252542] rounded-xl p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] text-[#6B6B80] font-mono">{match.id.toUpperCase()}</span>
                        {winner && (
                          <button
                            onClick={() => clearResult(match.id)}
                            className="text-[10px] text-[#FF3366] hover:text-white transition"
                          >
                            CLEAR
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {[teamA, teamB].map((team, idx) => {
                          const isWinner = winner === team?.name;
                          return (
                            <button
                              key={idx}
                              onClick={() => team && setWinner(match.id, team.name)}
                              disabled={!team || isSaving}
                              className={`
                                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 transition-all text-left
                                ${isWinner
                                  ? "border-[#00FF88] bg-[#00FF88]/10"
                                  : "border-[#252542] hover:border-[#FF4500]/40"
                                }
                                ${!team ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                              `}
                            >
                              <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black ${isWinner ? "bg-[#00FF88] text-black" : "bg-[#252542] text-[#A0A0B8]"}`}>
                                {team?.seed || "?"}
                              </span>
                              <span className={`text-sm font-semibold ${isWinner ? "text-[#00FF88]" : "text-[#A0A0B8]"}`}>
                                {team?.name || "TBD"}
                              </span>
                              {isWinner && (
                                <span className="ml-auto text-[#00FF88]">&#10003;</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {isSaving && (
                        <div className="text-center mt-2 text-[10px] text-[#FF4500]">Saving...</div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
