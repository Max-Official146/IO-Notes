# Notes PWA (Own Backend)

A handwritten notes PWA using React + Canvas with a custom Node.js backend (no Firebase).

## What changed
- Email/password auth is handled by the local backend.
- Notes are saved in backend JSON storage (`server/data`).
- App still supports offline local mode.

## 1) Install
```bash
npm install
```

## 2) Run backend
```bash
npm run server
```
Backend starts on `http://localhost:8787`.

## 3) Run frontend
Open another terminal:
```bash
npm run dev -- --host
```
Frontend starts on `http://localhost:5173`.

## 4) Use app
- Open frontend URL.
- Sign up (first time) or sign in.
- Draw and save notes.
- Notes sync to your own backend storage.

## API base URL override (optional)
Create `.env` in root:
```bash
VITE_API_BASE_URL=http://localhost:8787
```

## Backend data files
- `server/data/users.json`
- `server/data/notes.json`

## Security note
This backend is intended for local/dev use. Before production, migrate to a real database, proper session management, HTTPS, stricter CORS, and hardened auth.
