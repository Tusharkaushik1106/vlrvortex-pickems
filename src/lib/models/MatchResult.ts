import mongoose from "mongoose";

const MatchResultSchema = new mongoose.Schema({
  matchId: { type: String, required: true, unique: true },
  winner: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.MatchResult || mongoose.model("MatchResult", MatchResultSchema);
