import { useState } from "react";
import { videoToNotes } from "../../features/video/videoApi";

export function VideoToNotesPanel() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");

  const convert = async () => {
    const result = await videoToNotes({ youtubeUrl });
    setTranscript(result.transcript || "");
    setSummary(typeof result.summary === "string" ? result.summary : JSON.stringify(result.summary));
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Video → Notes</h3>
      <input
        value={youtubeUrl}
        onChange={(event) => setYoutubeUrl(event.target.value)}
        placeholder="Paste YouTube URL"
        className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
      />
      <button type="button" onClick={convert} className="mt-2 rounded-md bg-slate-900 px-3 py-1 text-sm text-white dark:bg-slate-100 dark:text-slate-900">
        Convert to Notes
      </button>
      <div className="mt-3 grid gap-2 text-xs text-slate-500">
        <p><strong>Transcript:</strong> {transcript}</p>
        <p><strong>Summary:</strong> {summary}</p>
      </div>
    </section>
  );
}
