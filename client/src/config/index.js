/**
 * Centralized Client Configuration
 */

const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  FIREBASE: {
    API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  },
  IS_PROD: import.meta.env.PROD,
  VERSION: '2.0.0-production'
};

// Validation
if (!config.FIREBASE.API_KEY && config.IS_PROD) {
  console.warn("Production Warning: Firebase API Key missing.");
}

export default config;
