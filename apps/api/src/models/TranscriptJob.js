import mongoose from "mongoose";

const transcriptJobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sourceType: { type: String, enum: ["upload", "youtube"], required: true },
    sourceUrl: { type: String, default: "" },
    status: { type: String, enum: ["queued", "processing", "done", "failed"], default: "queued" },
    transcript: { type: String, default: "" },
    summary: { type: String, default: "" },
    errorMessage: { type: String, default: "" },
  },
  { timestamps: true },
);

export const TranscriptJob = mongoose.model("TranscriptJob", transcriptJobSchema);
