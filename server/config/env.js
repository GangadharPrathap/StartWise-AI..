import "dotenv/config";

export const getFirstEnv = (...keys) => {
  for (const key of keys) {
    const raw = process.env[key];
    if (raw && raw.trim()) {
      return raw.trim().replace(/^['"]|['"]$/g, "");
    }
  }
  return "";
};

export const GEMINI_API_KEY = getFirstEnv(
  "GEMINI_API_KEY",
  "GEMINI_KEY",
  "API_KEY",
  "GROQ_API_KEY" // Fallback in case old envs exist
);

export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
export const DAILY_API_KEY = process.env.DAILY_API_KEY;
export const PORT = Number(process.env.PORT) || 3000;
export const APP_HOSTNAME = (process.env.APP_HOSTNAME || "localhost")
  .trim()
  .replace(/\s+/g, "-")
  .toLowerCase();
