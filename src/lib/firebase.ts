import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const envMapping: Record<string, string> = {
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID",
  storageBucket: "VITE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "VITE_FIREBASE_APP_ID",
};

const missingEnvVars = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => envMapping[key]);

if (missingEnvVars.length > 0) {
  console.error(
    `[Firebase] Missing environment variables: ${missingEnvVars.join(", ")}. ` +
    `Check your .env.local file. (Found .env.locals, renamed it to .env.local for you).`
  );
}

function getFirebaseApp(): FirebaseApp {
  const existing = getApps()[0];
  if (existing) return existing;
  
  if (missingEnvVars.length > 0) {
    // Return a dummy app or handle gracefully to prevent white screen crash if possible, 
    // but initializeApp will likely fail if apiKey is missing.
    console.warn("Initializing Firebase with missing config - this may cause errors.");
  }
  
  return initializeApp(firebaseConfig);
}

const app = getFirebaseApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
