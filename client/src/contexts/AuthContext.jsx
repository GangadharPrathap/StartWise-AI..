import React, { createContext, useContext } from 'react';
import { signInWithGoogle, logout } from '../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children, value }) {
  return (
    <AuthContext.Provider value={{ ...value, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a dummy object if used outside provider to prevent crashes during auth transition
    return { user: null, isAuthReady: false, signInWithGoogle, logout };
  }
  return context;
}
