const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";
const TOKEN_KEY = "notes-pwa-token";
const USER_KEY = "notes-pwa-user";

function readToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function writeSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.auth ? { Authorization: `Bearer ${readToken()}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export async function signUpWithEmail(email, password) {
  const data = await request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  writeSession(data);
  return data.user;
}

export async function signInWithEmail(email, password) {
  const data = await request("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  writeSession(data);
  return data.user;
}

export function signOutUser() {
  clearSession();
}

export async function fetchNotes() {
  const data = await request("/api/notes", { method: "GET", auth: true });
  return data.notes || [];
}

export async function saveNoteToCloud(note) {
  const data = await request("/api/notes", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ title: note.title, imageData: note.imageData }),
  });
  return data.note;
}

export async function checkBackendHealth() {
  return request("/api/health", { method: "GET" });
}
