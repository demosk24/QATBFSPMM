
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

/**
 * CRITICAL FIX FOR VERCEL:
 * Bundlers like Vite, Webpack, and Vercel's build engine perform static analysis.
 * They look for the literal string 'process.env.VARIABLE_NAME'. 
 * If variables are accessed dynamically (e.g., process.env[key]), the replacement 
 * often fails, resulting in "undefined" strings and the 'auth/invalid-api-key' error.
 */
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const DATABASE_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

/**
 * Registry Configuration Object
 * We use the statically accessed variables here.
 */
export const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};

/**
 * Integrity Validation:
 * Checks if the core API key is present and is a legitimate string (not "undefined").
 */
const validate = (val: any): boolean => {
  return !!val && val !== "undefined" && val !== "null" && String(val).trim().length > 10;
};

export const isConfigValid = validate(firebaseConfig.apiKey);

let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;
let firebaseDb: Firestore | undefined;

if (isConfigValid) {
  try {
    // Single instance initialization pattern
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = getFirestore(firebaseApp);
  } catch (error) {
    console.error("FIREBASE_CORE_HANDSHAKE_ERROR:", error);
  }
}

// Exported as constants to be consumed safely by the UI
// Casting to avoid null-check fatigue in components while relying on isConfigValid guard in App.tsx
export const auth = firebaseAuth as Auth;
export const db = firebaseDb as Firestore;
