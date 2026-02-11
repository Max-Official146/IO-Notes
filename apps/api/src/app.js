import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes.js";
import { notesRouter } from "./routes/notes.routes.js";
import { aiRouter } from "./routes/ai.routes.js";
import { mediaRouter } from "./routes/media.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "20mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "smartnotes-api" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/notes", notesRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/media", mediaRouter);

  app.use(errorHandler);

  return app;
}
