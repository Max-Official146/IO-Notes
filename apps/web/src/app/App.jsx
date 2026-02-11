import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { AuthForm } from "../components/auth/AuthForm";
import { SmartCanvas } from "../components/canvas/SmartCanvas";
import { TypedToHandwrittenPanel } from "../components/editor/TypedToHandwrittenPanel";
import { VideoToNotesPanel } from "../components/editor/VideoToNotesPanel";
import { BlockComposer } from "../components/editor/BlockComposer";
import { NotesList } from "../components/notes/NotesList";
import { fetchNotes } from "../features/notes/notesApi";

const mockFolders = [{ id: "1", name: "Class Notes" }, { id: "2", name: "Research" }, { id: "3", name: "Projects" }];

export function App() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchNotes()
      .then(setNotes)
      .catch(() => setNotes([]));
  }, [user]);

  const blocks = useMemo(
    () => [
      { id: "b1", type: "typed", label: "Lecture summary block" },
      { id: "b2", type: "canvas", label: "Handwritten derivation block" },
      { id: "b3", type: "media", label: "Video transcript insight block" },
    ],
    [],
  );

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <AuthForm onAuthenticated={setUser} />
      </main>
    );
  }

  return (
    <main className="flex h-screen overflow-hidden text-slate-900 dark:text-slate-100">
      <Sidebar folders={mockFolders} />
      <section className="flex min-w-0 flex-1 flex-col">
        <Topbar theme={theme} onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))} />
        <div className="grid flex-1 grid-cols-12 gap-4 overflow-auto p-4">
          <div className="col-span-12 space-y-4 xl:col-span-8">
            <SmartCanvas />
            <BlockComposer blocks={blocks} />
          </div>
          <div className="col-span-12 space-y-4 xl:col-span-4">
            <TypedToHandwrittenPanel />
            <VideoToNotesPanel />
            <NotesList notes={notes} />
          </div>
        </div>
      </section>
    </main>
  );
}
