import mongoose from "mongoose";

const noteBlockSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["typed", "canvas", "media"], required: true },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 300 },
    height: { type: Number, default: 200 },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: true },
);

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null, index: true },
    title: { type: String, default: "Untitled" },
    blocks: { type: [noteBlockSchema], default: [] },
    tags: { type: [String], default: [] },
    previewImageUrl: { type: String, default: "" },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Note = mongoose.model("Note", noteSchema);
