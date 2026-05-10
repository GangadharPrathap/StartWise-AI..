import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/env.js";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || "dummy" });

export const generateCompletion = async (systemPrompt, userPrompt, jsonMode = true) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "dummy") {
    throw new Error("Gemini API key is missing. Set GEMINI_API_KEY in .env");
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: jsonMode ? "application/json" : "text/plain",
      }
    });
    
    return result.text;
  } catch (error) {
    console.error("Gemini SDK Error:", error.message || error);
    // Rethrow to let the controller handle it
    throw error;
  }
};
