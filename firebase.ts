
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

/**
 * DIRECT INJECTION MODE:
 * We are bypassing process.env to ensure the cloud build works immediately.
 * REPLACE THE STRINGS BELOW WITH YOUR ACTUAL FIREBASE KEYS.
 */
export const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY", // <--- PASTE HERE
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if the user has replaced the placeholder
export const isConfigValid = firebaseConfig.apiKey !== "YOUR_ACTUAL_API_KEY" && firebaseConfig.apiKey.length > 5;

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);
