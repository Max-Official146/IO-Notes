import { Router } from "express";
import { createNote, listNotes, updateNote } from "../controllers/notes.controller.js";
import { authGuard } from "../middleware/auth.js";

export const notesRouter = Router();

notesRouter.use(authGuard);
notesRouter.get("/", listNotes);
notesRouter.post("/", createNote);
notesRouter.patch("/:noteId", updateNote);
