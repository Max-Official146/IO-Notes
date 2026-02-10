import NoteCard from "./NoteCard";

export default function NotesList({ notes, onOpen }) {
  if (!notes.length) {
    return <p>No notes yet. Save one from the canvas.</p>;
  }

  return notes.map((note) => <NoteCard key={note.id} note={note} onOpen={onOpen} />);
}
