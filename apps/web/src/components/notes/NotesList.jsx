export function NotesList({ notes }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Your Notes</h3>
      <ul className="space-y-2">
        {notes.map((note) => (
          <li key={note._id || note.id} className="rounded-md border border-slate-200 p-2 text-sm dark:border-slate-700">
            <p className="font-medium">{note.title}</p>
            <p className="text-xs text-slate-500">Updated: {new Date(note.updatedAt || Date.now()).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
