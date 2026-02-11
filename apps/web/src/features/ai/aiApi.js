import { apiClient } from "../../lib/apiClient";

export async function summarizeTranscript(text) {
  const { data } = await apiClient.post("/ai/summarize", { text, format: "outline" });
  return data;
}

export async function convertTypedToHandwriting(text, style) {
  const { data } = await apiClient.post("/ai/handwriting", { text, style });
  return data;
}
