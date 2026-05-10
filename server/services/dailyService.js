import { DAILY_API_KEY } from "../config/env.js";

export const generateDailyRoom = async () => {
  if (!DAILY_API_KEY) {
    console.warn("DAILY_API_KEY is missing. Returning a placeholder link.");
    return `https://startwiseai.daily.co/meeting-${Math.random().toString(36).substring(7)}`;
  }

  try {
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          exp: Math.round(Date.now() / 1000) + 3600 * 24, // Expire in 24 hours
          enable_chat: true,
        },
      }),
    });

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Daily.co API Error:", error);
    return `https://startwiseai.daily.co/fallback-${Math.random().toString(36).substring(7)}`;
  }
};
