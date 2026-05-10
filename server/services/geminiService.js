import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/env.js";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || "dummy" });

export const generateCompletion = async (systemPrompt, userPrompt, jsonMode = true) => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing. Set GEMINI_API_KEY in .env");
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      config: { 
        systemInstruction: systemPrompt,
        responseMimeType: jsonMode ? "application/json" : "text/plain",
      }
    });
    
    const response = await chat.sendMessage({ message: userPrompt });
    return response.text;
  } catch (error) {
    console.error("Gemini SDK Error:", error);
    throw error;
  }
};
