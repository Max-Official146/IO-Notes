export function createNote({ id, title, imageData, createdAt = Date.now() }) {
  return { id, title, imageData, createdAt };
}
