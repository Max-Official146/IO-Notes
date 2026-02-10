import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadString } from "firebase/storage";
import { firebaseConfig } from "./config";

const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (firebaseReady) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export function isFirebaseEnabled() {
  return firebaseReady;
}

export function watchAuthState(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function signUpWithEmail(email, password) {
  if (!auth) {
    throw new Error("Firebase is not configured");
  }
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithEmail(email, password) {
  if (!auth) {
    throw new Error("Firebase is not configured");
  }
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
  if (!auth) {
    return;
  }
  await signOut(auth);
}

export async function saveNoteToCloud({ userId, note }) {
  if (!storage || !db) {
    throw new Error("Firebase is not configured");
  }

  const imageRef = ref(storage, `notes/${userId}/${note.id}.png`);
  await uploadString(imageRef, note.imageData, "data_url");

  await addDoc(collection(db, "notes"), {
    id: note.id,
    userId,
    title: note.title,
    createdAt: serverTimestamp(),
    imagePath: `notes/${userId}/${note.id}.png`,
    imageData: note.imageData,
  });
}

export async function fetchCloudNotes(userId) {
  if (!db) {
    throw new Error("Firebase is not configured");
  }

  const notesQuery = query(
    collection(db, "notes"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(notesQuery);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: data.id,
      title: data.title,
      imageData: data.imageData,
      createdAt: data.createdAt?.toMillis?.() || Date.now(),
    };
  });
}
