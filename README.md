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

## Quick Start

### 1) API setup
```bash
cd apps/api
npm install
cp .env.example .env
npm run dev
```

### 2) Web setup
```bash
cd apps/web
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

### `apps/api/.env`
```bash
NODE_ENV=development
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/smartnotes
JWT_SECRET=change-me
OPENAI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### `apps/web/.env`
```bash
VITE_API_BASE_URL=http://localhost:8080/api
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

## Deployment Guide (Baseline)
1. Deploy API (`apps/api`) on Render/Railway/Fly.io.
2. Use MongoDB Atlas for `MONGODB_URI`.
3. Configure Cloudinary and OpenAI keys.
4. Deploy web (`apps/web`) on Vercel/Netlify with `VITE_API_BASE_URL`.
5. Enable HTTPS and production CORS restrictions.

## Notes
- Current AI OCR/handwriting modules are provider-ready abstractions with placeholder outputs.
- Replace placeholder adapters in `apps/api/src/services/ai` with production providers.
