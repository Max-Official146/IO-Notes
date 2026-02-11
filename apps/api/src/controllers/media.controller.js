import fs from "node:fs";
import { uploadToCloudinary } from "../services/storage/cloudinary.service.js";
import { transcribeAudio } from "../services/ai/whisper.service.js";
import { summarizeText } from "../services/ai/openai.service.js";

export async function uploadMedia(req, res, next) {
  try {
    const filePath = req.file?.path;
    if (!filePath) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const upload = await uploadToCloudinary(filePath, "auto");
    res.status(201).json({ media: upload });
  } catch (error) {
    next(error);
  }
}

export async function videoToNotes(req, res, next) {
  try {
    const filePath = req.file?.path;
    const youtubeUrl = req.body?.youtubeUrl;

    if (!filePath && !youtubeUrl) {
      res.status(400).json({ error: "Upload a video/audio file or send youtubeUrl" });
      return;
    }

    const transcript = filePath
      ? await transcribeAudio(filePath)
      : `YouTube transcription pipeline TODO for URL: ${youtubeUrl}`;

    const summary = await summarizeText({ text: transcript, format: "outline" });

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ transcript, summary });
  } catch (error) {
    next(error);
  }
}
