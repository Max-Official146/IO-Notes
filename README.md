# Notes PWA (Own Backend)

A handwritten notes PWA using React + Canvas with a custom Node.js backend (no Firebase).

## What changed
- Email/password auth is handled by the local backend.
- Notes are saved in backend JSON storage (`server/data`).
- App still supports offline local mode.

## Requirements
- Node.js 18+ recommended (Node 16 may also work).
- npm 9+ recommended.

## 1) Install dependencies
```bash
npm install
```

If you see `vulnerabilities` after install, that is usually a security advisory summary, not an install failure.
The install is successful as long as npm does **not** end with `npm ERR!`.

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

## Troubleshooting
### Server says port already in use
Run on another port:
- macOS/Linux:
```bash
PORT=8788 npm run server
```
- Windows (cmd):
```bat
set PORT=8788&& npm run server
```
- Windows (PowerShell):
```powershell
$env:PORT=8788; npm run server
```

### Frontend can't connect to backend
- Ensure backend terminal shows: `Notes backend running on http://0.0.0.0:8787`.
- Ensure frontend uses correct API URL via `.env` (`VITE_API_BASE_URL=...`).
- If frontend is on another device (e.g. iPad), set `VITE_API_BASE_URL` to your computer LAN IP (not `localhost`).

## Security note
This backend is intended for local/dev use. Before production, migrate to a real database, proper session management, HTTPS, stricter CORS, and hardened auth.
