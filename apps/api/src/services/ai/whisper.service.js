import OpenAI from "openai";
import { env } from "../../config/env.js";

const client = new OpenAI({ apiKey: env.openAiApiKey });

export async function transcribeAudio(filePath) {
  if (!env.openAiApiKey) {
    return "[Transcription disabled] Add OPENAI_API_KEY to enable Whisper transcription.";
  }

  const response = await client.audio.transcriptions.create({
    model: "whisper-1",
    file: await import("node:fs").then((fs) => fs.createReadStream(filePath)),
  });

  return response.text || "";
}
