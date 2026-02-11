import { Router } from "express";
import { ocrImage, summarizeTranscript, typedToHandwritten } from "../controllers/ai.controller.js";
import { authGuard } from "../middleware/auth.js";

export const aiRouter = Router();

aiRouter.use(authGuard);
aiRouter.post("/summarize", summarizeTranscript);
aiRouter.post("/ocr", ocrImage);
aiRouter.post("/handwriting", typedToHandwritten);
