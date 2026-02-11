import { apiClient } from "../../lib/apiClient";

export async function fetchNotes() {
  const { data } = await apiClient.get("/notes");
  return data.notes || [];
}

export async function createNote(payload) {
  const { data } = await apiClient.post("/notes", payload);
  return data.note;
}
