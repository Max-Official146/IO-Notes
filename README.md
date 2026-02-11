# SmartNotes AI

SmartNotes AI is a full-stack notes platform with typed notes, handwriting canvas, AI summaries, and video-to-notes workflows.

## Tech Stack
- Frontend: React + Tailwind CSS + Konva
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- AI: OpenAI (summary + Whisper transcription), pluggable OCR + handwriting generation
- Storage: Cloudinary (pluggable)

## Monorepo Structure
- `apps/web` — frontend app
- `apps/api` — backend API
- `docs/smartnotes-architecture.md` — architecture and system design

## Quick Start (recommended)

### 0) Requirements
- Node.js 18+
- npm 9+
- MongoDB running locally (or Atlas URI)

### 1) Install all dependencies from repo root
```bash
npm install
```

### 2) Setup backend env
```bash
cp apps/api/.env.example apps/api/.env
```
Update `apps/api/.env` values (especially `MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY` if needed).

### 3) Setup frontend env
```bash
cp apps/web/.env.example apps/web/.env
```
Set API URL (default works locally):
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4) Start backend
```bash
npm run dev:api
```
Backend URL: `http://localhost:8080`

### 5) Start frontend (new terminal)
```bash
npm run dev:web
```
Frontend URL: `http://localhost:5173`

## Alternative (run inside each app)

Backend:
```bash
cd apps/api
npm install
npm run dev
```

Frontend:
```bash
cd apps/web
npm install
npm run dev
```

## API Endpoints
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/notes`
- `POST /api/notes`
- `PATCH /api/notes/:noteId`
- `POST /api/ai/summarize`
- `POST /api/ai/handwriting`
- `POST /api/ai/ocr`
- `POST /api/media/upload`
- `POST /api/media/video-to-notes`

## Common Issues
- `npm ERR!` during install → dependency install actually failed; rerun after fixing network/proxy/registry.
- `Cannot find module 'express'` → backend dependencies were not installed. Run `npm install` at root or inside `apps/api`.
- Frontend can’t call backend → verify `apps/web/.env` has correct `VITE_API_BASE_URL` and backend is running.

## Deployment Guide (Baseline)
1. Deploy API (`apps/api`) on Render/Railway/Fly.io.
2. Use MongoDB Atlas for `MONGODB_URI`.
3. Configure Cloudinary and OpenAI keys.
4. Deploy web (`apps/web`) on Vercel/Netlify with `VITE_API_BASE_URL`.
5. Enable HTTPS and production CORS restrictions.

## Notes
- Current AI OCR/handwriting modules are provider-ready abstractions with placeholder outputs.
- Replace placeholder adapters in `apps/api/src/services/ai` with production providers.
