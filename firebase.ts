
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// CRITICAL: Static access is required for most bundlers (Vite/Webpack/Vercel) 
// to correctly inject environment variables into the client-side code.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

// Initialize Firebase only if the API key is present to avoid the 'invalid-api-key' crash.
// If missing, the app will still boot but Firebase services will return null or log errors.
const app = (getApps().length === 0 && firebaseConfig.apiKey) 
  ? initializeApp(firebaseConfig) 
  : (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig));

export const auth = getAuth(app);
export const db = getFirestore(app);
