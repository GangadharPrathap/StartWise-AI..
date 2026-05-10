import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, getLocalSession, signInWithGoogle, signInWithEmail, signUpWithEmail, logout } from '../services/firebase';
import { useUserStore } from '../store/useUserStore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { setUser: setZustandUser } = useUserStore();

  useEffect(() => {
    if (!auth) {
      const localUser = getLocalSession();
      setUser(localUser);
      setZustandUser(localUser);
      setIsAuthReady(true);

      const handleLocalAuth = () => {
        const u = getLocalSession();
        setUser(u);
        setZustandUser(u);
      };
      window.addEventListener('local-auth-change', handleLocalAuth);
      return () => window.removeEventListener('local-auth-change', handleLocalAuth);
    }

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setZustandUser(u);
      setIsAuthReady(true);
      if (u && db) {
        try {
          const userRef = doc(db, 'users', u.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: u.uid,
              email: u.email,
              displayName: u.displayName,
              photoURL: u.photoURL,
              createdAt: serverTimestamp()
            });
          }
        } catch (error) {
          console.error("Firestore error in auth listener:", error);
        }
      }
    });
    return () => unsubscribe();
  }, [setZustandUser]);

  return (
    <AuthContext.Provider value={{ user, isAuthReady, signInWithGoogle, signInWithEmail, signUpWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
