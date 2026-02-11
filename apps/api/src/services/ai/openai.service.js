import OpenAI from "openai";
import { env } from "../../config/env.js";

const client = new OpenAI({ apiKey: env.openAiApiKey });

export async function summarizeText({ text, format = "bullet" }) {
  if (!env.openAiApiKey) {
    return {
      summary: "[AI disabled] Add OPENAI_API_KEY to enable summarization.",
      sections: [],
    };
  }

  const prompt = [
    "You are SmartNotes AI.",
    "Create concise structured study notes from the transcript.",
    `Output style: ${format}`,
    "Return JSON with keys: summary (string), sections (array of {heading, points[]}).",
    text,
  ].join("\n\n");

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  const content = response.output_text || "";
  try {
    return JSON.parse(content);
  } catch {
    return { summary: content, sections: [] };
  }
}
