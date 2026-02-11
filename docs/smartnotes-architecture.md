# SmartNotes AI — Project Architecture

## 1) High-Level Architecture

SmartNotes AI is a full-stack monorepo with two primary applications:

- `apps/web` — React + Tailwind + Konva frontend (PWA-capable)
- `apps/api` — Node.js + Express backend

Core services:

- **Auth**: Email/password + Google OAuth (JWT session pattern)
- **Database**: MongoDB (Mongoose models)
- **Storage**: Cloudinary (image/video/audio assets)
- **AI**:
  - OpenAI chat for summarization and structured notes
  - Whisper transcription for speech-to-text
  - OCR service abstraction for scanned/handwritten text extraction
  - Handwriting rendering service abstraction for typed→handwritten export

## 2) Frontend Domains

- `EditorShell` (Notion-style page workspace)
- `SmartCanvas` (pen input, pressure-aware drawing, annotation)
- `TypedToHandwrittenPanel` (font/style conversion)
- `VideoToNotesPanel` (upload/link, transcript, summary)
- `BlockComposer` (typed + handwritten block arrangement)
- `Auth` + `Folders` + cloud sync dashboards

## 3) Backend Domains

- `Auth API`
- `Notes API` (CRUD + block composition)
- `Folders API`
- `AI API` (summary, transcription, OCR, handwriting generation)
- `Media API` (upload and processing hooks)

## 4) Data Model (MongoDB)

- `User`
- `Folder`
- `Note`
- `NoteBlock` (typed block, canvas block, media block)
- `TranscriptJob`

## 5) Performance and Product Constraints

- PWA service worker + cache-first static assets
- IndexedDB/local cache for offline drafts
- Debounced autosave and background sync
- Canvas export as vector JSON + raster PNG preview

## 6) Deployment Targets

- Web: Vercel / Netlify
- API: Render / Railway / Fly.io
- DB: MongoDB Atlas
- Storage: Cloudinary

