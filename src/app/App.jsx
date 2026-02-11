import { useCallback, useMemo, useState } from "react";
import { ref, uploadString } from "firebase/storage";
import Canvas from "../features/canvas/Canvas";
import NotesList from "../features/notes/NotesList";
import { exportCanvasToPdf } from "../features/export/pdfExport";
import { createNote } from "../models/note";
import { ensureAnonymousSession, storage } from "../core/firebase";

// ...rest of code
const STORAGE_KEY = "notes-pwa-local";

function loadInitialNotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default function App() {
  const [canvasApi, setCanvasApi] = useState(null);
  const [title, setTitle] = useState("Untitled note");
  const [notes, setNotes] = useState(loadInitialNotes);
  const [status, setStatus] = useState("Ready");

  const persist = useCallback((nextNotes) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextNotes));
    setNotes(nextNotes);
  }, []);

  const saveNote = async () => {
    if (!canvasApi?.canvas) {
      return;
    }

    const imageData = canvasApi.canvas.toDataURL("image/png");
    const note = createNote({ id: crypto.randomUUID(), title, imageData });
    const next = [note, ...notes];
    persist(next);

    try {
      await ensureAnonymousSession();
      const cloudRef = ref(storage, `notes/${note.id}.png`);
      await uploadString(cloudRef, imageData, "data_url");
      setStatus("Saved locally + uploaded to Firebase Storage");
    } catch {
      setStatus("Saved locally. Add Firebase env vars to enable cloud upload.");
    }
  };

  const openNote = (note) => {
    if (!canvasApi?.canvas) {
      return;
    }
    const img = new Image();
    img.onload = () => {
      const ctx = canvasApi.canvas.getContext("2d");
      ctx.clearRect(0, 0, canvasApi.canvas.width, canvasApi.canvas.height);
      ctx.drawImage(img, 0, 0, canvasApi.canvas.width, canvasApi.canvas.height);
    };
    img.src = note.imageData;
  };

  const noteCountLabel = useMemo(() => `${notes.length} note${notes.length === 1 ? "" : "s"}`, [notes]);

  return (
    <main className="app">
      <section className="panel">
        <h1>My Notes</h1>
        <p>{status}</p>
        <div className="controls">
          <button type="button" onClick={() => canvasApi?.clear()}>
            Clear
          </button>
          <button type="button" onClick={saveNote}>
            Save note
          </button>
          <button type="button" onClick={() => canvasApi?.canvas && exportCanvasToPdf(canvasApi.canvas)}>
            Export PDF
          </button>
          <button type="button" onClick={() => document.documentElement.requestFullscreen?.()}>
            Fullscreen
          </button>
        </div>
        <Canvas onReady={setCanvasApi} />
      </section>

      <aside className="panel">
        <h2>Notes list</h2>
        <p>{noteCountLabel}</p>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
        <NotesList notes={notes} onOpen={openNote} />
      </aside>
    </main>
  );
}
