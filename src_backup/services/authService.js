import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from "firebase/auth";

import { auth } from "../firebase";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);

        return result.user;
    } catch (error) {
        console.error(error);
    }
}

export async function logoutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
    }
}