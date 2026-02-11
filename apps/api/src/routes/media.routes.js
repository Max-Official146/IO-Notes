import { Router } from "express";
import multer from "multer";
import { uploadMedia, videoToNotes } from "../controllers/media.controller.js";
import { authGuard } from "../middleware/auth.js";

const upload = multer({ dest: "tmp/uploads" });

export const mediaRouter = Router();

mediaRouter.use(authGuard);
mediaRouter.post("/upload", upload.single("file"), uploadMedia);
mediaRouter.post("/video-to-notes", upload.single("file"), videoToNotes);
