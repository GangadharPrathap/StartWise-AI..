import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// ONLY use environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase SDK safely
let app;
let db;
let auth;
let analytics;
const googleProvider = new GoogleAuthProvider();
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'undefined' && 
  firebaseConfig.apiKey !== 'null' && 
  firebaseConfig.apiKey.length > 0
);

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    const databaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID;
    db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    auth = getAuth(app);
    
    // Initialize Analytics conditionally
    isSupported().then(yes => {
      if (yes) analytics = getAnalytics(app);
    });
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase API Key is missing. Running in local auth mode.");
}

export { app, db, auth, analytics, googleProvider, isFirebaseConfigured };

// ─── Local Auth Fallback (works without Firebase) ───
const LOCAL_USERS_KEY = 'startwise_users';
const LOCAL_SESSION_KEY = 'startwise_session';

function getLocalUsers() {
  try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}'); } catch { return {}; }
}
function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

// Creates a user-like object matching Firebase user shape
function makeLocalUser(email, displayName) {
  return {
    uid: btoa(email).replace(/=/g, ''),
    email,
    displayName: displayName || email.split('@')[0],
    photoURL: null,
    emailVerified: true,
  };
}

export function getLocalSession() {
  try { return JSON.parse(localStorage.getItem(LOCAL_SESSION_KEY)); } catch { return null; }
}

function setLocalSession(user) {
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
  // Dispatch event so App.jsx can detect the change
  window.dispatchEvent(new Event('local-auth-change'));
}

function clearLocalSession() {
  localStorage.removeItem(LOCAL_SESSION_KEY);
  window.dispatchEvent(new Event('local-auth-change'));
}

// Pre-register admin account so login works immediately
if (!isFirebaseConfigured) {
  const users = getLocalUsers();
  users['sudheerimmidisetti@gmail.com'] = {
    uid: btoa('sudheerimmidisetti@gmail.com').replace(/=/g, ''),
    email: 'sudheerimmidisetti@gmail.com',
    displayName: 'Sudheer Immidisetti',
    photoURL: null,
    emailVerified: true,
    password: 'jankaya@420',
  };
  saveLocalUsers(users);
}

// ─── Auth helpers (with local fallback) ───
export const signInWithGoogle = async () => {
  if (!auth) {
    // Local fallback: sign in as a demo Google user
    const user = makeLocalUser('sudheerimmidisetti@gmail.com', 'Sudheer Immidisetti');
    const users = getLocalUsers();
    users[user.email] = { ...user, password: '' };
    saveLocalUsers(users);
    setLocalSession(user);
    return user;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = () => {
  if (auth) return signOut(auth);
  clearLocalSession();
};

export const signInWithEmail = async (email, password) => {
  if (!auth) {
    // Local fallback
    const users = getLocalUsers();
    const stored = users[email];
    if (!stored) throw { code: 'auth/user-not-found', message: 'No account found with this email' };
    if (stored.password !== password) throw { code: 'auth/wrong-password', message: 'Incorrect password' };
    const user = makeLocalUser(email, stored.displayName);
    setLocalSession(user);
    return user;
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Error signing in with email', error);
    throw error;
  }
};

export const signUpWithEmail = async (email, password, displayName) => {
  if (!auth) {
    // Local fallback
    const users = getLocalUsers();
    if (users[email]) throw { code: 'auth/email-already-in-use', message: 'Email already registered' };
    if (password.length < 6) throw { code: 'auth/weak-password', message: 'Password must be at least 6 characters' };
    const user = makeLocalUser(email, displayName);
    users[email] = { ...user, password, displayName: displayName || email.split('@')[0] };
    saveLocalUsers(users);
    setLocalSession(user);
    return user;
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    return result.user;
  } catch (error) {
    console.error('Error signing up with email', error);
    throw error;
  }
};

// Firestore error handler
export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection
if (isFirebaseConfigured && db) {
  (async function testConnection() {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.warn("Firebase client is offline or missing config.");
      }
    }
  })();
}
