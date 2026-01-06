
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Helper to safely access environment variables
const getSafeEnv = (key: string): string => {
  try {
    // Attempt to access process.env (common in Node/Build steps)
    // @ts-ignore
    const val = process.env[key];
    if (val && val !== `process.env.${key}`) return val;
  } catch (e) {}
  return "";
};

export const firebaseConfig = {
  apiKey: getSafeEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getSafeEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  databaseURL: getSafeEnv('NEXT_PUBLIC_FIREBASE_DATABASE_URL'),
  projectId: getSafeEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getSafeEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getSafeEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getSafeEnv('NEXT_PUBLIC_FIREBASE_APP_ID')
};

// Check if the configuration is functionally valid
export const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (isConfigValid) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
  }
}

// @ts-ignore - Exporting even if undefined to prevent import errors in other files; 
// App.tsx will handle the null state.
export { auth, db };
