# Notes PWA

A starter Progressive Web App for handwritten notes with React + Canvas + Firebase.

## Features in this version
- Sign in / Sign up UI with Firebase Auth.
- Pencil/finger/mouse drawing via Pointer Events.
- Local notes list with saved canvas snapshots.
- Cloud save via Firebase Storage + Firestore metadata.
- PDF export using jsPDF.
- PWA manifest for Add to Home Screen support.
- Fullscreen toggle and sign-out action.

## Run locally
```bash
npm install
npm run dev
```

Set Firebase environment variables in a `.env` file:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
