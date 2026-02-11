import { apiClient } from "../../lib/apiClient";

export async function videoToNotes({ file, youtubeUrl }) {
  const form = new FormData();
  if (file) {
    form.append("file", file);
  }
  if (youtubeUrl) {
    form.append("youtubeUrl", youtubeUrl);
  }

  const { data } = await apiClient.post("/media/video-to-notes", form);
  return data;
}
