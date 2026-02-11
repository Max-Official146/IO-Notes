export default function NoteCard({ note, onOpen }) {
  const date = new Date(note.createdAt).toLocaleString();
  return (
    <div className="note-card">
      <strong>{note.title}</strong>
      <p>{date}</p>
      <button type="button" onClick={() => onOpen(note)}>
        Open
      </button>
    </div>
  );
}
