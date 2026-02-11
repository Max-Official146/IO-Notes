import { z } from "zod";
import { Note } from "../models/Note.js";

const blockSchema = z.object({
  type: z.enum(["typed", "canvas", "media"]),
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  content: z.any().optional(),
});

const noteSchema = z.object({
  title: z.string().optional(),
  folderId: z.string().nullable().optional(),
  blocks: z.array(blockSchema).optional(),
  tags: z.array(z.string()).optional(),
  previewImageUrl: z.string().optional(),
});

export async function createNote(req, res, next) {
  try {
    const input = noteSchema.parse(req.body);
    const note = await Note.create({ ...input, userId: req.user.userId });
    res.status(201).json({ note });
  } catch (error) {
    next(error);
  }
}

export async function listNotes(req, res, next) {
  try {
    const notes = await Note.find({ userId: req.user.userId, isArchived: false }).sort({ updatedAt: -1 });
    res.json({ notes });
  } catch (error) {
    next(error);
  }
}

export async function updateNote(req, res, next) {
  try {
    const input = noteSchema.parse(req.body);
    const note = await Note.findOneAndUpdate(
      { _id: req.params.noteId, userId: req.user.userId },
      input,
      { new: true },
    );
    res.json({ note });
  } catch (error) {
    next(error);
  }
}
