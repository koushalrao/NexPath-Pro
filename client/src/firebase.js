import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAaRGKBMJideBEUPAckQDI8MGoyuH25T8U",
  authDomain: "nexpath-pro.firebaseapp.com",
  projectId: "nexpath-pro",
  storageBucket: "nexpath-pro.firebasestorage.app",
  messagingSenderId: "38360802520",
  appId: "1:38360802520:web:8fd6928a8aa4ca470fe3ad"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;