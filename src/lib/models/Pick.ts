import mongoose from "mongoose";

const PickSchema = new mongoose.Schema({
  username: { type: String, required: true, lowercase: true },
  picks: {
    type: Map,
    of: String,
    required: true,
  },
  submittedAt: { type: Date, default: Date.now },
});

PickSchema.index({ username: 1 }, { unique: true });

export default mongoose.models.Pick || mongoose.model("Pick", PickSchema);
