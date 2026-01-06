
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

/**
 * CRITICAL: Static access is mandatory for production bundlers.
 * We must use the full string 'process.env.NAME' for the build engine 
 * to find and replace it with the actual value from Vercel.
 */
const rawConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

/**
 * Validation Logic:
 * Ensures we don't pass 'undefined' strings or empty values to Firebase.
 */
const validate = (val: any) => {
  if (!val || val === "undefined" || val === "null" || val.length < 5) return "";
  return val;
};

export const firebaseConfig = {
  apiKey: validate(rawConfig.apiKey),
  authDomain: validate(rawConfig.authDomain),
  databaseURL: validate(rawConfig.databaseURL),
  projectId: validate(rawConfig.projectId),
  storageBucket: validate(rawConfig.storageBucket),
  messagingSenderId: validate(rawConfig.messagingSenderId),
  appId: validate(rawConfig.appId)
};

// The app is only functional if the API Key is present and valid
export const isConfigValid = !!firebaseConfig.apiKey;

let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;
let firebaseDb: Firestore | undefined;

if (isConfigValid) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = getFirestore(firebaseApp);
  } catch (error) {
    console.error("FATAL: Firebase Handshake Failed:", error);
  }
}

// Export as constant instances to be used across the app
export const auth = firebaseAuth as Auth;
export const db = firebaseDb as Firestore;
