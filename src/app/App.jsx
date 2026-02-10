import { useCallback, useEffect, useMemo, useState } from "react";
import Canvas from "../features/canvas/Canvas";
import NotesList from "../features/notes/NotesList";
import { exportCanvasToPdf } from "../features/export/pdfExport";
import { createNote } from "../models/note";
import AuthPage from "../features/auth/AuthPage";
import {
  fetchCloudNotes,
  getFirebaseInitError,
  isFirebaseEnabled,
  saveNoteToCloud,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
  watchAuthState,
} from "../core/firebase";

const STORAGE_KEY = "notes-pwa-local";

function loadInitialNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
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
  const [user, setUser] = useState(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const firebaseEnabled = isFirebaseEnabled();
  const firebaseError = getFirebaseInitError();

  useEffect(() => {
    const unsubscribe = watchAuthState((nextUser) => {
      setUser(nextUser);
      setAuthResolved(true);
    });
    return () => unsubscribe?.();
  }, []);

  const persist = useCallback((nextNotes) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextNotes));
    setNotes(nextNotes);
  }, []);

  useEffect(() => {
    if (!firebaseEnabled || !user) {
      return;
    }

    fetchCloudNotes(user.uid)
      .then((cloudNotes) => {
        if (cloudNotes.length) {
          persist(cloudNotes);
          setStatus("Loaded cloud notes.");
        }
      })
      .catch((error) => {
        setStatus(error?.message || "Using local notes. Cloud load failed.");
      });
  }, [firebaseEnabled, persist, user]);

  const saveNote = async () => {
    if (!canvasApi?.canvas) {
      return;
    }

    const imageData = canvasApi.canvas.toDataURL("image/png");
    const note = createNote({ id: crypto.randomUUID(), title: title.trim() || "Untitled note", imageData });
    const next = [note, ...notes];
    persist(next);

    if (firebaseEnabled && user) {
      try {
        await saveNoteToCloud({ userId: user.uid, note });
        setStatus("Saved locally + in cloud storage");
      } catch (error) {
        setStatus(error?.message || "Saved locally. Cloud save failed.");
      }
      return;
    }

    setStatus("Saved locally. Sign in to sync cloud storage.");
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

  if (!authResolved) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <h1>Loading...</h1>
          <p className="muted">Checking authentication state.</p>
        </section>
      </main>
    );
  }

  if (!user && !offlineMode) {
    return (
      <AuthPage
        firebaseEnabled={firebaseEnabled}
        firebaseError={firebaseError}
        onSignIn={signInWithEmail}
        onSignUp={signUpWithEmail}
        onContinueOffline={() => setOfflineMode(true)}
      />
    );
  }

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
          {user ? (
            <button type="button" onClick={signOutUser}>
              Sign out
            </button>
          ) : (
            <button type="button" onClick={() => setOfflineMode(false)}>
              Go to sign in
            </button>
          )}
        </div>
        <Canvas onReady={setCanvasApi} />
      </section>

      <aside className="panel">
        <h2>Notes list</h2>
        <p>{noteCountLabel}</p>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Note title" />
        <NotesList notes={notes} onOpen={openNote} />
      </aside>
    </main>
  );
}
