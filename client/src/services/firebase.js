import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0N152L7BhKZZX6wNkdp-Xp43DAl1gNVA",
  authDomain: "startwiseai-fb26b.firebaseapp.com",
  projectId: "startwiseai-fb26b",
  storageBucket: "startwiseai-fb26b.firebasestorage.app",
  messagingSenderId: "928939457914",
  appId: "1:928939457914:web:dfffba4a3014baea756ac3"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("MAANG Auth Error - Google Sign-In Failed:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("✅ Logout Success");
  } catch (error) {
    console.error("❌ Logout Error:", error);
    throw error;
  }
};
